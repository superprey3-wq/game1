using UnityEngine;

namespace ArenaSatellites.Progression
{
    public sealed class RunResultService : MonoBehaviour
    {
        public static RunResultService Instance { get; private set; }
        public bool Saved { get; private set; }

        private void Awake() => Instance = this;

        public void SaveCurrentRun()
        {
            if (Saved) return;
            Saved = true;
            var run = RunProgression.Instance;
            if (run == null) return;

            int totalCrystals = PlayerPrefs.GetInt("meta_crystals",0) + run.Crystals;
            int bestLevel = Mathf.Max(PlayerPrefs.GetInt("best_run_level",1), run.Level);
            PlayerPrefs.SetInt("meta_crystals", totalCrystals);
            PlayerPrefs.SetInt("best_run_level", bestLevel);
            PlayerPrefs.Save();
        }

        private void OnDestroy()
        {
            if (Instance == this) Instance = null;
        }
    }
}
