#if UNITY_EDITOR
using System.Collections.Generic;
using ArenaSatellites.Data;
using UnityEditor;
using UnityEngine;

public static class StarterContentFactory
{
    private const string Folder = "Assets/Resources/Content";
    private const string AssetPath = Folder + "/GameContentDatabase.asset";

    [MenuItem("Arena Satellites/Content/Create Starter Database")]
    public static void Create()
    {
        if (!AssetDatabase.IsValidFolder("Assets/Resources")) AssetDatabase.CreateFolder("Assets", "Resources");
        if (!AssetDatabase.IsValidFolder(Folder)) AssetDatabase.CreateFolder("Assets/Resources", "Content");

        var db = AssetDatabase.LoadAssetAtPath<GameContentDatabase>(AssetPath);
        if (db == null)
        {
            db = ScriptableObject.CreateInstance<GameContentDatabase>();
            AssetDatabase.CreateAsset(db, AssetPath);
        }

        db.worlds = new List<WorldDef>
        {
            W(WorldId.XenoJungle,"Ксеноджунгли","Xeno Jungle","Живая инопланетная экосистема, руины, биолюминесцентные растения и ульи.","World_XenoJungle",1f,"boss_xeno_queen",new[]{"xeno_runner","xeno_spitter","drone_scout","robot_brute","xeno_summoner"},"neon alien jungle"),
            W(WorldId.CrystalRuins,"Кристальные руины","Crystal Ruins","Древние руины, энергетические кристаллы и нестабильные разломы.","World_CrystalRuins",1.25f,"boss_crystal_colossus",new[]{"crystal_crawler","shard_turret","drone_miner","golem_guard","rift_stalker"},"cyan violet ruins"),
            W(WorldId.RedForge,"Красная кузня","Red Forge","Промышленная планета с лавой, реакторами и военными роботами.","World_RedForge",1.5f,"boss_forge_titan",new[]{"forge_drone","magma_hound","gunner_bot","shield_bot","repair_spider"},"red industrial forge"),
            W(WorldId.IceWastes,"Ледяная пустошь","Ice Wastes","Замёрзшая колония, метели, ледяные твари и потерянные экспедиции.","World_IceWastes",1.75f,"boss_frost_leviathan",new[]{"frostling","ice_spitter","survey_drone","frozen_guard","blizzard_wraith"},"blue frozen sci-fi wasteland"),
            W(WorldId.OrbitalStation,"Орбитальная станция","Orbital Station","Заброшенная станция с аварийным светом, разгерметизацией и ИИ-защитой.","World_OrbitalStation",2f,"boss_core_warden",new[]{"security_drone","infected_crew","laser_sentry","mech_guard","void_hunter"},"dark orbital station"),
        };

        db.heroes = new List<HeroDef>
        {
            H("rain","Капитан Рейн","Captain Rain",HeroRole.Assault,140,5.8f,1f,.08f,"Heroes/Rain","Portraits/Rain","pulse_rifle","steady_aim"),
            H("luna","Луна","Luna",HeroRole.Tech,105,5.6f,1.18f,.06f,"Heroes/Luna","Portraits/Luna","plasma_orb","overcharge"),
            H("ice","Айс","Ice",HeroRole.Marksman,112,6.3f,1.08f,.16f,"Heroes/Ice","Portraits/Ice","rail_rifle","deadeye"),
            H("chaos","Хаос","Chaos",HeroRole.Tank,180,5.0f,1.12f,.04f,"Heroes/Chaos","Portraits/Chaos","heavy_cannon","berserk_armor"),
            H("shade","Тень","Shade",HeroRole.Rogue,98,6.8f,1.10f,.22f,"Heroes/Shade","Portraits/Shade","shadow_blades","phase_step"),
        };

        db.pets = new List<PetDef>
        {
            P("orb","Орб","Orb",PetRole.Magnet,"Pets/Orb","pickup_radius",.30f),
            P("fox","Механолис","Mecha Fox",PetRole.Speed,"Pets/Fox","move_speed",.10f),
            P("owl","Сова-разведчик","Scout Owl",PetRole.Support,"Pets/Owl","xp_gain",.15f),
            P("dragon","Мини-дракон","Mini Dragon",PetRole.Damage,"Pets/Dragon","damage",.12f),
            P("wolf","Боевой волк","Battle Wolf",PetRole.FireRate,"Pets/Wolf","fire_rate",.12f),
        };

        db.weapons = new List<WeaponDef>
        {
            G("pulse_rifle","Импульсная винтовка","Pulse Rifle",WeaponType.Rifle,18,.48f,18),
            G("plasma_orb","Плазменный излучатель","Plasma Caster",WeaponType.Plasma,24,.72f,14),
            G("rocket_pod","Ракетный блок","Rocket Pod",WeaponType.Rockets,58,1.65f,11),
            G("prism_laser","Призматический лазер","Prism Laser",WeaponType.Laser,42,1.25f,22),
            G("chain_lightning","Цепная молния","Chain Lightning",WeaponType.Lightning,34,1.05f,0),
            G("grav_mines","Грави-мины","Grav Mines",WeaponType.Mines,70,2.1f,0),
            G("orbit_blades","Орбитальные клинки","Orbit Blades",WeaponType.OrbitBlades,16,.2f,0),
            G("frost_cannon","Криопушка","Frost Cannon",WeaponType.Frost,28,.9f,13),
            G("attack_drones","Ударные дроны","Attack Drones",WeaponType.Drones,20,.75f,15),
            G("heavy_cannon","Тяжёлая пушка","Heavy Cannon",WeaponType.HeavyCannon,86,1.85f,16),
        };

        db.gear = new List<GearDef>
        {
            E("helmet_scout","Шлем разведчика","Scout Helmet",GearSlot.Helmet,UpgradeKind.CritChance,.05f),
            E("armor_marine","Броня морпеха","Marine Armor",GearSlot.Armor,UpgradeKind.Armor,.08f),
            E("implant_reflex","Рефлекс-имплант","Reflex Implant",GearSlot.Implant,UpgradeKind.FireRate,.08f),
            E("module_overclock","Модуль перегрузки","Overclock Module",GearSlot.WeaponModule,UpgradeKind.Damage,.12f),
            E("boots_phase","Фазовые ботинки","Phase Boots",GearSlot.Boots,UpgradeKind.MoveSpeed,.09f),
            E("artifact_core","Ядро предтеч","Ancient Core",GearSlot.Artifact,UpgradeKind.Cooldown,.10f),
        };

        db.upgrades = new List<UpgradeDef>
        {
            U("up_damage","Огневая мощь","Firepower",UpgradeKind.Damage,.12f), U("up_rate","Темп огня","Fire Rate",UpgradeKind.FireRate,.10f),
            U("up_health","Живучесть","Vitality",UpgradeKind.MaxHealth,20), U("up_speed","Скорость","Speed",UpgradeKind.MoveSpeed,.08f),
            U("up_pickup","Магнит","Magnet",UpgradeKind.PickupRadius,.18f), U("up_crit","Точность","Precision",UpgradeKind.CritChance,.04f),
            U("up_regen","Регенерация","Regeneration",UpgradeKind.Regen,1), U("up_armor","Броня","Armor",UpgradeKind.Armor,.05f),
        };

        EditorUtility.SetDirty(db);
        AssetDatabase.SaveAssets();
        AssetDatabase.Refresh();
        Selection.activeObject = db;
        Debug.Log("Arena Satellites starter content database created: 5 worlds, 5 heroes, 5 pets, 10 weapons, gear and upgrades.");
    }

    static WorldDef W(WorldId id,string ru,string en,string fantasy,string scene,float diff,string boss,string[] enemies,string art)=>new(){id=id,displayNameRu=ru,displayNameEn=en,fantasy=fantasy,sceneName=scene,difficulty=diff,bossId=boss,enemyIds=enemies,artTheme=art};
    static HeroDef H(string id,string ru,string en,HeroRole role,float hp,float speed,float dmg,float crit,string prefab,string portrait,string weapon,string passive)=>new(){id=id,displayNameRu=ru,displayNameEn=en,role=role,maxHealth=hp,moveSpeed=speed,damageMultiplier=dmg,critChance=crit,prefabAddress=prefab,portraitAddress=portrait,startingWeaponId=weapon,passiveId=passive};
    static PetDef P(string id,string ru,string en,PetRole role,string prefab,string passive,float value)=>new(){id=id,displayNameRu=ru,displayNameEn=en,role=role,prefabAddress=prefab,passiveId=passive,passiveValue=value};
    static WeaponDef G(string id,string ru,string en,WeaponType type,float damage,float cd,float speed)=>new(){id=id,displayNameRu=ru,displayNameEn=en,type=type,rarity=Rarity.Common,damage=damage,cooldown=cd,projectileSpeed=speed,projectileCount=1,maxLevel=6,prefabAddress="Weapons/"+id,evolvedWeaponId=id+"_evolved"};
    static GearDef E(string id,string ru,string en,GearSlot slot,UpgradeKind stat,float value)=>new(){id=id,displayNameRu=ru,displayNameEn=en,slot=slot,rarity=Rarity.Rare,primaryStat=stat,primaryValue=value,iconAddress="Gear/"+id};
    static UpgradeDef U(string id,string ru,string en,UpgradeKind kind,float value)=>new(){id=id,displayNameRu=ru,displayNameEn=en,kind=kind,valuePerLevel=value,maxLevel=5};
}
#endif
