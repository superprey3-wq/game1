using System;
using UnityEngine;

namespace ArenaSatellites.Data
{
    public enum WorldId { XenoJungle, CrystalRuins, RedForge, IceWastes, OrbitalStation }
    public enum HeroRole { Assault, Tech, Marksman, Tank, Rogue }
    public enum PetRole { Magnet, Speed, Support, Damage, FireRate }
    public enum WeaponType { Rifle, Plasma, Rockets, Laser, Lightning, Mines, OrbitBlades, Frost, Drones, HeavyCannon }
    public enum GearSlot { Helmet, Armor, Implant, WeaponModule, Boots, Artifact }
    public enum Rarity { Common, Uncommon, Rare, Epic, Legendary }
    public enum UpgradeKind { Damage, FireRate, MaxHealth, MoveSpeed, PickupRadius, CritChance, Regen, Armor, Cooldown, ProjectileCount }

    [Serializable]
    public class WorldDef
    {
        public WorldId id;
        public string displayNameRu;
        public string displayNameEn;
        [TextArea] public string fantasy;
        public string sceneName;
        public float difficulty = 1f;
        public string bossId;
        public string[] enemyIds;
        public string artTheme;
    }

    [Serializable]
    public class HeroDef
    {
        public string id;
        public string displayNameRu;
        public string displayNameEn;
        public HeroRole role;
        public float maxHealth;
        public float moveSpeed;
        public float damageMultiplier = 1f;
        public float critChance;
        public string prefabAddress;
        public string portraitAddress;
        public string startingWeaponId;
        public string passiveId;
    }

    [Serializable]
    public class PetDef
    {
        public string id;
        public string displayNameRu;
        public string displayNameEn;
        public PetRole role;
        public string prefabAddress;
        public string passiveId;
        public float passiveValue;
    }

    [Serializable]
    public class WeaponDef
    {
        public string id;
        public string displayNameRu;
        public string displayNameEn;
        public WeaponType type;
        public Rarity rarity;
        public float damage;
        public float cooldown;
        public float projectileSpeed;
        public int projectileCount = 1;
        public int maxLevel = 6;
        public string prefabAddress;
        public string evolvedWeaponId;
    }

    [Serializable]
    public class GearDef
    {
        public string id;
        public string displayNameRu;
        public string displayNameEn;
        public GearSlot slot;
        public Rarity rarity;
        public UpgradeKind primaryStat;
        public float primaryValue;
        public string iconAddress;
    }

    [Serializable]
    public class UpgradeDef
    {
        public string id;
        public string displayNameRu;
        public string displayNameEn;
        public UpgradeKind kind;
        public float valuePerLevel;
        public int maxLevel = 5;
    }
}
