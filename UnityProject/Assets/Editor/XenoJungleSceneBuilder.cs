#if UNITY_EDITOR
using ArenaSatellites;
using ArenaSatellites.Bosses;
using ArenaSatellites.Combat;
using ArenaSatellites.Enemies;
using ArenaSatellites.Pets;
using ArenaSatellites.Progression;
using ArenaSatellites.UI;
using ArenaSatellites.Worlds;
using TMPro;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.UI;

public static class XenoJungleSceneBuilder
{
    const string ScenePath = "Assets/Scenes/World_XenoJungle.unity";
    const string Art = "Assets/Art/Kenney/";
    const string PrefabFolder = "Assets/Prefabs/World1";

    [MenuItem("Arena Satellites/World 1/Build Xeno Jungle Scene")]
    public static void Build()
    {
        EnsureFolder("Assets/Scenes");
        EnsureFolder("Assets/Prefabs");
        EnsureFolder(PrefabFolder);
        var projectilePrefab = CreateProjectilePrefab();
        var lootPrefab = CreateLootPrefab();
        var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);

        var camera = CreateCamera();
        var hero = CreateHero(projectilePrefab);
        CreateWorld(hero.transform);
        CreateOrb(hero.transform);
        CreateEnemyShowcase(hero.transform, lootPrefab);
        CreateQueen(hero.transform, lootPrefab);
        CreateRunSystems(hero);
        CreateHud();
        CreateFeedback(camera, hero.transform);

        EditorSceneManager.SaveScene(scene, ScenePath);
        AssetDatabase.SaveAssets();
        Selection.activeGameObject = hero;
        Debug.Log("World 1 scene built with weapons, loot, progression and distinct enemies: " + ScenePath);
    }

    static Camera CreateCamera()
    {
        var go = new GameObject("Main Camera"); go.tag = "MainCamera";
        var cam = go.AddComponent<Camera>(); cam.orthographic = true; cam.orthographicSize = 7.2f;
        cam.backgroundColor = new Color(.015f,.045f,.035f); go.transform.position = new Vector3(0,0,-10);
        go.AddComponent<AudioListener>();
        go.AddComponent<SmoothCameraFollow>();
        return cam;
    }

    static GameObject CreateHero(GameObject projectilePrefab)
    {
        var go = SpriteObject("Captain Rain", Art + "Characters/CaptainRain/stand.png", Vector3.zero, 1.15f, 10);
        var rb = go.AddComponent<Rigidbody2D>(); rb.gravityScale = 0; rb.freezeRotation = true;
        go.AddComponent<CapsuleCollider2D>(); go.AddComponent<PlayerController>();
        var weapon = new GameObject("WeaponPivot"); weapon.transform.SetParent(go.transform,false);
        var muzzle = new GameObject("Muzzle"); muzzle.transform.SetParent(weapon.transform,false); muzzle.transform.localPosition = new Vector3(.65f,0,0);

        var loadout = go.AddComponent<WeaponLoadout>();
        var so = new SerializedObject(loadout);
        so.FindProperty("muzzle").objectReferenceValue = muzzle.transform;
        so.FindProperty("projectilePrefab").objectReferenceValue = projectilePrefab;
        var sprites = so.FindProperty("projectileSprites"); sprites.arraySize = 3;
        sprites.GetArrayElementAtIndex(0).objectReferenceValue = AssetDatabase.LoadAssetAtPath<Sprite>(Art+"VFX/laser_blue.png");
        sprites.GetArrayElementAtIndex(1).objectReferenceValue = AssetDatabase.LoadAssetAtPath<Sprite>(Art+"VFX/laser_green.png");
        sprites.GetArrayElementAtIndex(2).objectReferenceValue = AssetDatabase.LoadAssetAtPath<Sprite>(Art+"VFX/laser_beige.png");
        so.ApplyModifiedPropertiesWithoutUndo();
        return go;
    }

    static void CreateWorld(Transform hero)
    {
        var world = new GameObject("Xeno Jungle Runtime"); world.AddComponent<XenoJungleWorld>();
        var groundRoot = new GameObject("Ground Tiles").transform;
        var groundSprites = new [] { "tile_ground_01.png", "tile_ground_02.png", "tile_ground_03.png", "tile_ground_04.png" };
        for (int y=-12;y<=12;y++) for(int x=-16;x<=16;x++)
        {
            var p = new Vector3(x*1.28f,y*1.28f,0);
            var tile = SpriteObject($"g_{x}_{y}", Art+"Worlds/XenoJungle/"+groundSprites[Mathf.Abs(x*13+y*7)%groundSprites.Length], p, 1.34f, -20);
            tile.transform.SetParent(groundRoot); tile.GetComponent<SpriteRenderer>().color = new Color(.30f,.60f,.42f,1f);
        }
        var propRoot = new GameObject("Ruins and Alien Growth").transform;
        string[] props = {"tile_ruin_01.png","tile_ruin_02.png","tile_ruin_03.png","tile_ruin_04.png","tile_cover_01.png","tile_cover_02.png","tile_cover_03.png","tile_cover_04.png"};
        var rng = new System.Random(7731);
        for (int i=0;i<110;i++)
        {
            float x=(float)(rng.NextDouble()*40-20), y=(float)(rng.NextDouble()*30-15); if (x*x+y*y<12) continue;
            var obj=SpriteObject("XenoProp",Art+"Worlds/XenoJungle/"+props[rng.Next(props.Length)],new Vector3(x,y,0),.7f+(float)rng.NextDouble()*.9f,-2);
            obj.transform.rotation=Quaternion.Euler(0,0,(float)rng.NextDouble()*360f); obj.transform.SetParent(propRoot);
            obj.GetComponent<SpriteRenderer>().color = rng.NextDouble()>.5 ? new Color(.40f,.95f,.60f,1) : new Color(.60f,.38f,.95f,1);
        }
    }

    static void CreateOrb(Transform hero)
    {
        var orb = SpriteObject("Orb Pet", Art+"Props/ufo_dome.png", hero.position+new Vector3(-1,1,0), .5f, 11);
        var pet=orb.AddComponent<OrbPet>(); var so=new SerializedObject(pet); so.FindProperty("owner").objectReferenceValue=hero; so.ApplyModifiedPropertiesWithoutUndo();
    }

    static void CreateEnemyShowcase(Transform hero, GameObject lootPrefab)
    {
        var root=new GameObject("Enemy Archetypes").transform;
        var kinds=(XenoEnemyKind[])System.Enum.GetValues(typeof(XenoEnemyKind));
        for(int i=0;i<kinds.Length;i++)
        {
            string path = EnemySprite(kinds[i]);
            float scale = kinds[i] == XenoEnemyKind.BruteRobot ? 1.4f : kinds[i] == XenoEnemyKind.ScoutDrone ? .8f : 1f;
            var e=SpriteObject(kinds[i].ToString(),path,new Vector3(-6+i*3,5.5f,0),scale,8);
            var rb=e.AddComponent<Rigidbody2D>(); rb.gravityScale=0; rb.freezeRotation=true;
            e.AddComponent<CircleCollider2D>(); var hp=e.AddComponent<EnemyHealth>();
            ConfigureLoot(hp, lootPrefab, kinds[i] == XenoEnemyKind.BruteRobot ? 14f : 7f);
            var ai=e.AddComponent<XenoEnemyArchetype>(); var so=new SerializedObject(ai); so.FindProperty("kind").enumValueIndex=(int)kinds[i]; so.ApplyModifiedPropertiesWithoutUndo(); ai.SetTarget(hero);
            e.transform.SetParent(root);
        }
    }

    static string EnemySprite(XenoEnemyKind kind) => kind switch
    {
        XenoEnemyKind.Runner => Art+"Enemies/Runner/stand.png",
        XenoEnemyKind.Spitter => Art+"Enemies/Spitter/stand.png",
        XenoEnemyKind.Summoner => Art+"Enemies/Summoner/stand.png",
        XenoEnemyKind.ScoutDrone => Art+"Enemies/Robot/hold.png",
        _ => Art+"Enemies/Robot/stand.png"
    };

    static void CreateQueen(Transform hero, GameObject lootPrefab)
    {
        var queen=SpriteObject("Xeno Queen",Art+"Enemies/Summoner/stand.png",new Vector3(0,10,0),3.8f,9);
        queen.GetComponent<SpriteRenderer>().color=new Color(.76f,.28f,.95f,1);
        var rb=queen.AddComponent<Rigidbody2D>(); rb.gravityScale=0; rb.freezeRotation=true;
        queen.AddComponent<CircleCollider2D>(); var hp=queen.AddComponent<EnemyHealth>(); hp.Configure(1800); ConfigureLoot(hp,lootPrefab,80f,.95f,.75f);
        var boss=queen.AddComponent<XenoQueenBoss>(); boss.SetTarget(hero);
    }

    static void ConfigureLoot(EnemyHealth hp,GameObject loot,float xp,float crystal=.18f,float gear=.025f)
    {
        var so=new SerializedObject(hp); so.FindProperty("lootPickupPrefab").objectReferenceValue=loot; so.FindProperty("xpDrop").floatValue=xp;
        so.FindProperty("crystalChance").floatValue=crystal; so.FindProperty("gearChance").floatValue=gear; so.ApplyModifiedPropertiesWithoutUndo();
    }

    static void CreateRunSystems(GameObject hero)
    {
        var systems = new GameObject("Run Systems");
        var progression = systems.AddComponent<RunProgression>();
        var so=new SerializedObject(progression); so.FindProperty("loadout").objectReferenceValue=hero.GetComponent<WeaponLoadout>(); so.ApplyModifiedPropertiesWithoutUndo();
    }

    static void CreateFeedback(Camera camera, Transform hero)
    {
        var go=new GameObject("Combat Feedback"); go.AddComponent<CombatFeedback>();
        var follow=camera.GetComponent<SmoothCameraFollow>();
        if(follow!=null) follow.SetTarget(hero);
    }

    static void CreateHud()
    {
        var canvasGo=new GameObject("HUD Canvas"); var canvas=canvasGo.AddComponent<Canvas>(); canvas.renderMode=RenderMode.ScreenSpaceOverlay;
        canvasGo.AddComponent<CanvasScaler>().uiScaleMode=CanvasScaler.ScaleMode.ScaleWithScreenSize; canvasGo.AddComponent<GraphicRaycaster>(); canvasGo.AddComponent<XenoJungleHUD>();
        var title=Text("WorldTitle","КСЕНОДЖУНГЛИ",canvasGo.transform,28,TextAlignmentOptions.Center);
        var rt=title.rectTransform; rt.anchorMin=new Vector2(.5f,1);rt.anchorMax=new Vector2(.5f,1);rt.anchoredPosition=new Vector2(0,-36);rt.sizeDelta=new Vector2(520,60);
        var hint=Text("BuildMark","WORLD 1 · VERTICAL SLICE",canvasGo.transform,15,TextAlignmentOptions.Center);
        hint.rectTransform.anchorMin=new Vector2(.5f,1);hint.rectTransform.anchorMax=new Vector2(.5f,1);hint.rectTransform.anchoredPosition=new Vector2(0,-72);hint.rectTransform.sizeDelta=new Vector2(420,35);
    }

    static GameObject CreateProjectilePrefab()
    {
        string path=PrefabFolder+"/PlayerProjectile.prefab"; var existing=AssetDatabase.LoadAssetAtPath<GameObject>(path); if(existing!=null)return existing;
        var go=new GameObject("PlayerProjectile"); var sr=go.AddComponent<SpriteRenderer>(); sr.sprite=AssetDatabase.LoadAssetAtPath<Sprite>(Art+"VFX/laser_blue.png"); sr.sortingOrder=20;
        var rb=go.AddComponent<Rigidbody2D>(); rb.gravityScale=0; rb.collisionDetectionMode=CollisionDetectionMode2D.Continuous;
        var col=go.AddComponent<CircleCollider2D>(); col.isTrigger=true; col.radius=.18f; go.AddComponent<Projectile>();
        var prefab=PrefabUtility.SaveAsPrefabAsset(go,path); Object.DestroyImmediate(go); return prefab;
    }

    static GameObject CreateLootPrefab()
    {
        string path=PrefabFolder+"/LootPickup.prefab"; var existing=AssetDatabase.LoadAssetAtPath<GameObject>(path); if(existing!=null)return existing;
        var go=SpriteObject("LootPickup",Art+"VFX/burst_green.png",Vector3.zero,.3f,15); var col=go.AddComponent<CircleCollider2D>(); col.isTrigger=true; go.AddComponent<LootPickup>();
        var prefab=PrefabUtility.SaveAsPrefabAsset(go,path); Object.DestroyImmediate(go); return prefab;
    }

    static TextMeshProUGUI Text(string name,string value,Transform parent,float size,TextAlignmentOptions align)
    { var go=new GameObject(name,typeof(RectTransform)); go.transform.SetParent(parent,false); var t=go.AddComponent<TextMeshProUGUI>(); t.text=value;t.fontSize=size;t.alignment=align;t.color=Color.white; return t; }

    static GameObject SpriteObject(string name,string path,Vector3 pos,float scale,int order)
    { var go=new GameObject(name); go.transform.position=pos; go.transform.localScale=Vector3.one*scale; var sr=go.AddComponent<SpriteRenderer>(); sr.sprite=AssetDatabase.LoadAssetAtPath<Sprite>(path); sr.sortingOrder=order; if(sr.sprite==null)Debug.LogWarning("Missing sprite: "+path); return go; }

    static void EnsureFolder(string path)
    { if(AssetDatabase.IsValidFolder(path))return; var parts=path.Split('/'); string current=parts[0]; for(int i=1;i<parts.Length;i++){string next=current+"/"+parts[i];if(!AssetDatabase.IsValidFolder(next))AssetDatabase.CreateFolder(current,parts[i]);current=next;} }
}
#endif
