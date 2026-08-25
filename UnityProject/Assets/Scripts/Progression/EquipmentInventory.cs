using System;
using System.Collections.Generic;
using ArenaSatellites.Data;
using UnityEngine;

namespace ArenaSatellites.Progression
{
    [Serializable]
    public sealed class RuntimeGear
    {
        public string id;
        public GearSlot slot;
        public Rarity rarity;
        public UpgradeKind stat;
        public float value;
    }

    public sealed class EquipmentInventory : MonoBehaviour
    {
        public event Action OnChanged;
        private readonly Dictionary<GearSlot, RuntimeGear> equipped = new();
        [SerializeField] private PlayerRuntimeStats statTarget;

        public IReadOnlyDictionary<GearSlot, RuntimeGear> Equipped => equipped;

        private void Awake()
        {
            if (statTarget == null) statTarget = FindFirstObjectByType<PlayerRuntimeStats>();
        }

        public RuntimeGear EquipRandomDrop(GearSlot slot)
        {
            var rarity = RollRarity();
            var stat = slot switch
            {
                GearSlot.Helmet => UpgradeKind.CritChance,
                GearSlot.Armor => UpgradeKind.Armor,
                GearSlot.Implant => UpgradeKind.FireRate,
                GearSlot.WeaponModule => UpgradeKind.Damage,
                GearSlot.Boots => UpgradeKind.MoveSpeed,
                _ => UpgradeKind.Cooldown
            };
            float value = rarity switch
            {
                Rarity.Common => .04f,
                Rarity.Rare => .07f,
                Rarity.Epic => .11f,
                Rarity.Legendary => .16f,
                _ => .04f
            };
            var gear = new RuntimeGear
            {
                id = $"{slot}_{rarity}_{UnityEngine.Random.Range(1000,9999)}",
                slot = slot,
                rarity = rarity,
                stat = stat,
                value = value
            };
            equipped[slot] = gear;
            statTarget?.Apply(this);
            OnChanged?.Invoke();
            return gear;
        }

        public RuntimeGear Get(GearSlot slot) => equipped.TryGetValue(slot, out var gear) ? gear : null;

        private static Rarity RollRarity()
        {
            float r = UnityEngine.Random.value;
            if (r < .03f) return Rarity.Legendary;
            if (r < .14f) return Rarity.Epic;
            if (r < .42f) return Rarity.Rare;
            return Rarity.Common;
        }
    }
}
