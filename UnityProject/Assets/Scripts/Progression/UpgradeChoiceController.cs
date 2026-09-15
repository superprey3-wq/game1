using System;
using System.Collections.Generic;
using ArenaSatellites.Combat;
using UnityEngine;

namespace ArenaSatellites.Progression
{
    public sealed class UpgradeChoiceController : MonoBehaviour
    {
        public static UpgradeChoiceController Instance { get; private set; }
        public event Action<IReadOnlyList<RuntimeWeaponKind>> OnChoicesReady;
        public event Action OnChoiceClosed;

        [SerializeField] private WeaponLoadout loadout;
        private readonly List<RuntimeWeaponKind> choices = new(3);
        private bool waiting;

        public bool IsWaiting => waiting;
        public IReadOnlyList<RuntimeWeaponKind> Choices => choices;

        private void Awake()
        {
            Instance = this;
            if (loadout == null) loadout = FindFirstObjectByType<WeaponLoadout>();
        }

        public void OpenChoice()
        {
            if (waiting || loadout == null) return;
            waiting = true;
            choices.Clear();
            var values = (RuntimeWeaponKind[])Enum.GetValues(typeof(RuntimeWeaponKind));
            var pool = new List<RuntimeWeaponKind>(values);
            for (int i = 0; i < 3 && pool.Count > 0; i++)
            {
                int pick = UnityEngine.Random.Range(0, pool.Count);
                choices.Add(pool[pick]);
                pool.RemoveAt(pick);
            }
            Time.timeScale = 0f;
            OnChoicesReady?.Invoke(choices);
        }

        public void Pick(int index)
        {
            if (!waiting || index < 0 || index >= choices.Count) return;
            loadout.Upgrade(choices[index]);
            waiting = false;
            Time.timeScale = 1f;
            OnChoiceClosed?.Invoke();
        }

        private void OnDestroy()
        {
            if (Instance == this) Instance = null;
            if (waiting) Time.timeScale = 1f;
        }
    }
}
