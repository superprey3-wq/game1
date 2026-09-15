using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace ArenaSatellites.UI
{
    public sealed class XenoJungleHUD : MonoBehaviour
    {
        [SerializeField] Slider healthBar;
        [SerializeField] Slider xpBar;
        [SerializeField] TMP_Text healthText;
        [SerializeField] TMP_Text levelText;
        [SerializeField] TMP_Text timerText;
        [SerializeField] TMP_Text waveText;
        [SerializeField] TMP_Text worldText;
        [SerializeField] GameObject bossPanel;
        [SerializeField] Slider bossBar;
        [SerializeField] TMP_Text bossName;

        float elapsed;
        int level = 1;
        int wave = 1;

        void Start()
        {
            if (worldText != null) worldText.text = "КСЕНОДЖУНГЛИ";
            SetHealth(140, 140);
            SetXp(0, 100);
            HideBoss();
        }

        void Update()
        {
            elapsed += Time.deltaTime;
            if (timerText != null) timerText.text = $"{(int)elapsed / 60:00}:{(int)elapsed % 60:00}";
        }

        public void SetHealth(float current, float max)
        {
            if (healthBar != null) healthBar.value = max <= 0 ? 0 : current / max;
            if (healthText != null) healthText.text = $"❤ {Mathf.CeilToInt(current)} / {Mathf.CeilToInt(max)}";
        }

        public void SetXp(float current, float max)
        {
            if (xpBar != null) xpBar.value = max <= 0 ? 0 : current / max;
        }

        public void SetLevel(int value)
        {
            level = value;
            if (levelText != null) levelText.text = $"УР. {level}";
        }

        public void SetWave(int value)
        {
            wave = value;
            if (waveText != null) waveText.text = $"ВОЛНА {wave}";
        }

        public void ShowBoss(string title, float current, float max)
        {
            if (bossPanel != null) bossPanel.SetActive(true);
            if (bossName != null) bossName.text = title;
            if (bossBar != null) bossBar.value = max <= 0 ? 0 : current / max;
        }

        public void HideBoss()
        {
            if (bossPanel != null) bossPanel.SetActive(false);
        }
    }
}
