using System.Collections.Generic;
using UnityEngine;

namespace ArenaSatellites.Data
{
    [CreateAssetMenu(menuName = "Arena Satellites/Content Database", fileName = "GameContentDatabase")]
    public class GameContentDatabase : ScriptableObject
    {
        public List<WorldDef> worlds = new();
        public List<HeroDef> heroes = new();
        public List<PetDef> pets = new();
        public List<WeaponDef> weapons = new();
        public List<GearDef> gear = new();
        public List<UpgradeDef> upgrades = new();

        public WorldDef GetWorld(WorldId id) => worlds.Find(x => x.id == id);
        public HeroDef GetHero(string id) => heroes.Find(x => x.id == id);
        public PetDef GetPet(string id) => pets.Find(x => x.id == id);
        public WeaponDef GetWeapon(string id) => weapons.Find(x => x.id == id);
        public GearDef GetGear(string id) => gear.Find(x => x.id == id);
        public UpgradeDef GetUpgrade(string id) => upgrades.Find(x => x.id == id);
    }
}
