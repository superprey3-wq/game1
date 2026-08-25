using System;
using UnityEngine;
using ArenaSatellites.Combat;

namespace ArenaSatellites.Progression
{
    public sealed class RunProgression : MonoBehaviour
    {
        public static RunProgression Instance { get; private set; }
        public int Level { get; private set; } = 1;
        public int Crystals { get; private set; }
        public float XP { get; private set; }
        public float XPToNext { get; private set; } = 24f;
        public event Action<int> OnLevelUp;
        public event Action OnChanged;

        [SerializeField] private WeaponLoadout loadout;

        private void Awake()
        {
            Instance = this;
            if (loadout == null) loadout = FindFirstObjectByType<WeaponLoadout>();
        }

        public void AddXP(float value)
        {
            XP += Mathf.Max(0,value);
            while (XP >= XPToNext)
            {
                XP -= XPToNext;
                Level++;
                XPToNext = Mathf.Round(XPToNext * 1.22f + 6f);
                AutoPickUpgrade();
                OnLevelUp?.Invoke(Level);
            }
            OnChanged?.Invoke();
        }

        public void AddCrystals(int value)
        {
            Crystals += Mathf.Max(0,value);
            OnChanged?.Invoke();
        }

        private void AutoPickUpgrade()
        {
            if (loadout == null) return;
            var values = (RuntimeWeaponKind[])Enum.GetValues(typeof(RuntimeWeaponKind));
            loadout.Upgrade(values[(Level - 2) % values.Length]);
        }
    }
}
