#if UNITY_EDITOR
using ArenaSatellites;
using ArenaSatellites.Bosses;
using ArenaSatellites.Enemies;
using ArenaSatellites.Pets;
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

    [MenuItem("Arena Satellites/World 1/Build Xeno Jungle Scene")]
    public static void Build()
    {
        EnsureFolder("Assets/Scenes");
        var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);

        CreateCamera();
        var hero = CreateHero();
        CreateWorld(hero.transform);
        CreateOrb(hero.transform);
        CreateEnemyShowcase(hero.transform);
        CreateQueen(hero.transform);
        CreateHud();
        CreateFeedback();

        EditorSceneManager.SaveScene(scene, ScenePath);
        AssetDatabase.SaveAssets();
        Selection.activeGameObject = hero;
        Debug.Log("World 1 scene built: " + ScenePath);
    }

    static void CreateCamera()
    {
        var go = new GameObject("Main Camera");
        go.tag = "MainCamera";
        var cam = go.AddComponent<Camera>();
        cam.orthographic = true;
        cam.orthographicSize = 7.2f;
        cam.backgroundColor = new Color(.015f,.045f,.035f);
        go.transform.position = new Vector3(0,0,-10);
        go.AddComponent<AudioListener>();
    }

    static GameObject CreateHero()
    {
        var go = SpriteObject("Captain Rain", Art + "Characters/CaptainRain/stand.png", Vector3.zero, 1.15f, 10);
        var rb = go.AddComponent<Rigidbody2D>(); rb.gravityScale = 0; rb.freezeRotation = true;
        go.AddComponent<CapsuleCollider2D>();
        go.AddComponent<PlayerController>();
        var weapon = new GameObject("WeaponPivot"); weapon.transform.SetParent(go.transform,false);
        var muzzle = new GameObject("Muzzle"); muzzle.transform.SetParent(weapon.transform,false); muzzle.transform.localPosition = new Vector3(.65f,0,0);
        return go;
    }

    static void CreateWorld(Transform hero)
    {
        var world = new GameObject("Xeno Jungle Runtime");
        var runtime = world.AddComponent<XenoJungleWorld>();

        var groundRoot = new GameObject("Ground Tiles").transform;
        var groundSprites = new [] { "tile_ground_01.png", "tile_ground_02.png", "tile_ground_03.png", "tile_ground_04.png" };
        for (int y=-12;y<=12;y++) for(int x=-16;x<=16;x++)
        {
            var p = new Vector3(x*1.28f,y*1.28f,0);
            var tile = SpriteObject($"g_{x}_{y}", Art+"Worlds/XenoJungle/"+groundSprites[Mathf.Abs(x*13+y*7)%groundSprites.Length], p, 1.34f, -20);
            tile.transform.SetParent(groundRoot);
            tile.GetComponent<SpriteRenderer>().color = new Color(.30f,.60f,.42f,1f);
        }

        var propRoot = new GameObject("Ruins and Alien Growth").transform;
        string[] props = {"tile_ruin_01.png","tile_ruin_02.png","tile_ruin_03.png","tile_ruin_04.png","tile_cover_01.png","tile_cover_02.png","tile_cover_03.png","tile_cover_04.png"};
        var rng = new System.Random(7731);
        for (int i=0;i<85;i++)
        {
            float x=(float)(rng.NextDouble()*36-18), y=(float)(rng.NextDouble()*26-13);
            if (x*x+y*y<12) continue;
            var obj=SpriteObject("XenoProp", Art+"Worlds/XenoJungle/"+props[rng.Next(props.Length)], new Vector3(x,y,0), .75f+(float)rng.NextDouble()*.75f, -2);
            obj.transform.rotation=Quaternion.Euler(0,0,(float)rng.NextDouble()*360f);
            obj.transform.SetParent(propRoot);
            var sr=obj.GetComponent<SpriteRenderer>(); sr.color = rng.NextDouble()>.5 ? new Color(.45f,.95f,.62f,1) : new Color(.55f,.42f,.95f,1);
        }
    }

    static void CreateOrb(Transform hero)
    {
        var orb = SpriteObject("Orb Pet", Art+"Props/ufo_dome.png", hero.position+new Vector3(-1,1,0), .5f, 11);
        var pet=orb.AddComponent<OrbPet>();
        var so=new SerializedObject(pet); so.FindProperty("owner").objectReferenceValue=hero; so.ApplyModifiedPropertiesWithoutUndo();
    }

    static void CreateEnemyShowcase(Transform hero)
    {
        var root=new GameObject("Enemy Archetypes").transform;
        var kinds=(XenoEnemyKind[])System.Enum.GetValues(typeof(XenoEnemyKind));
        for(int i=0;i<kinds.Length;i++)
        {
            bool robot=kinds[i]==XenoEnemyKind.BruteRobot || kinds[i]==XenoEnemyKind.ScoutDrone;
            var e=SpriteObject(kinds[i].ToString(),Art+(robot?"Enemies/Robot/stand.png":"Enemies/Runner/stand.png"),new Vector3(-6+i*3,5.5f,0),robot?1.15f:.95f,8);
            var rb=e.AddComponent<Rigidbody2D>(); rb.gravityScale=0; rb.freezeRotation=true;
            e.AddComponent<CircleCollider2D>(); e.AddComponent<EnemyHealth>();
            var ai=e.AddComponent<XenoEnemyArchetype>();
            var so=new SerializedObject(ai); so.FindProperty("kind").enumValueIndex=(int)kinds[i]; so.ApplyModifiedPropertiesWithoutUndo(); ai.SetTarget(hero);
            e.transform.SetParent(root);
        }
    }

    static void CreateQueen(Transform hero)
    {
        var queen=SpriteObject("Xeno Queen",Art+"Enemies/Robot/stand.png",new Vector3(0,10,0),3.2f,9);
        var sr=queen.GetComponent<SpriteRenderer>(); sr.color=new Color(.72f,.28f,.95f,1);
        var rb=queen.AddComponent<Rigidbody2D>(); rb.gravityScale=0; rb.freezeRotation=true;
        queen.AddComponent<CircleCollider2D>(); var hp=queen.AddComponent<EnemyHealth>(); hp.Configure(1800);
        var boss=queen.AddComponent<XenoQueenBoss>(); boss.SetTarget(hero);
    }

    static void CreateFeedback()
    {
        var go=new GameObject("Combat Feedback");
        go.AddComponent<CombatFeedback>();
    }

    static void CreateHud()
    {
        var canvasGo=new GameObject("HUD Canvas");
        var canvas=canvasGo.AddComponent<Canvas>(); canvas.renderMode=RenderMode.ScreenSpaceOverlay;
        canvasGo.AddComponent<CanvasScaler>().uiScaleMode=CanvasScaler.ScaleMode.ScaleWithScreenSize;
        canvasGo.AddComponent<GraphicRaycaster>();
        canvasGo.AddComponent<XenoJungleHUD>();

        var title=Text("WorldTitle","КСЕНОДЖУНГЛИ",canvasGo.transform,28,TextAlignmentOptions.Center);
        var rt=title.rectTransform; rt.anchorMin=new Vector2(.5f,1);rt.anchorMax=new Vector2(.5f,1);rt.anchoredPosition=new Vector2(0,-36);rt.sizeDelta=new Vector2(520,60);
        var hint=Text("BuildMark","WORLD 1 · VERTICAL SLICE",canvasGo.transform,15,TextAlignmentOptions.Center);
        hint.rectTransform.anchorMin=new Vector2(.5f,1);hint.rectTransform.anchorMax=new Vector2(.5f,1);hint.rectTransform.anchoredPosition=new Vector2(0,-72);hint.rectTransform.sizeDelta=new Vector2(420,35);
    }

    static TextMeshProUGUI Text(string name,string value,Transform parent,float size,TextAlignmentOptions align)
    {
        var go=new GameObject(name,typeof(RectTransform)); go.transform.SetParent(parent,false);
        var t=go.AddComponent<TextMeshProUGUI>(); t.text=value;t.fontSize=size;t.alignment=align;t.color=Color.white; return t;
    }

    static GameObject SpriteObject(string name,string path,Vector3 pos,float scale,int order)
    {
        var go=new GameObject(name); go.transform.position=pos; go.transform.localScale=Vector3.one*scale;
        var sr=go.AddComponent<SpriteRenderer>(); sr.sprite=AssetDatabase.LoadAssetAtPath<Sprite>(path); sr.sortingOrder=order;
        if(sr.sprite==null) Debug.LogWarning("Missing sprite: "+path+" — run Art/Download CC0 Kenney Starter Set first.");
        return go;
    }

    static void EnsureFolder(string path)
    {
        if(AssetDatabase.IsValidFolder(path)) return;
        var parts=path.Split('/'); string current=parts[0];
        for(int i=1;i<parts.Length;i++){string next=current+"/"+parts[i];if(!AssetDatabase.IsValidFolder(next))AssetDatabase.CreateFolder(current,parts[i]);current=next;}
    }
}
#endif
