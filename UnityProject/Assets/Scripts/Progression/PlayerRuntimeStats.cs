using ArenaSatellites.Combat;
using UnityEngine;

namespace ArenaSatellites.Progression
{
    public sealed class PlayerRuntimeStats : MonoBehaviour
    {
        [SerializeField] private PlayerController player;
        [SerializeField] private WeaponLoadout loadout;

        public float Armor { get; private set; }
        public float CooldownReduction { get; private set; }

        private void Awake()
        {
            if (player == null) player = GetComponent<PlayerController>();
            if (loadout == null) loadout = GetComponent<WeaponLoadout>();
        }

        public void Apply(EquipmentInventory inventory)
        {
            float damage = 0f, fireRate = 0f, crit = 0f, move = 0f, armor = 0f, cooldown = 0f;
            foreach (var pair in inventory.Equipped)
            {
                var gear = pair.Value;
                if (gear == null) continue;
                switch (gear.stat)
                {
                    case Data.UpgradeKind.Damage: damage += gear.value; break;
                    case Data.UpgradeKind.FireRate: fireRate += gear.value; break;
                    case Data.UpgradeKind.CritChance: crit += gear.value; break;
                    case Data.UpgradeKind.MoveSpeed: move += gear.value; break;
                    case Data.UpgradeKind.Armor: armor += gear.value; break;
                    case Data.UpgradeKind.Cooldown: cooldown += gear.value; break;
                }
            }

            if (loadout != null)
            {
                loadout.DamageMultiplier = 1f + damage;
                loadout.FireRateMultiplier = 1f + fireRate + cooldown;
                loadout.CritChance = crit;
            }
            if (player != null) player.MoveSpeedMultiplier = 1f + move;
            Armor = Mathf.Clamp01(armor);
            CooldownReduction = Mathf.Clamp(cooldown, 0f, .55f);
        }
    }
}
