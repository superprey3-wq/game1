using ArenaSatellites.Platform;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace ArenaSatellites.UI
{
    public sealed class DeathReviveUI : MonoBehaviour
    {
        [SerializeField] private CanvasGroup root;
        [SerializeField] private Button reviveButton;
        [SerializeField] private Button finishButton;
        [SerializeField] private TextMeshProUGUI reviveLabel;
        [SerializeField] private TextMeshProUGUI statusLabel;

        private PlayerHealth health;
        private RewardedReviveService ads;

        private void Start()
        {
            health = FindFirstObjectByType<PlayerHealth>();
            ads = FindFirstObjectByType<RewardedReviveService>();
            if (health != null) { health.OnDied += Show; health.OnRevived += Hide; }
            if (ads != null) { ads.OnRewardGranted += OnReward; ads.OnRewardUnavailable += OnAdUnavailable; }
            if (reviveButton != null) reviveButton.onClick.AddListener(WatchAd);
            if (finishButton != null) finishButton.onClick.AddListener(FinishRun);
            Hide();
        }

        private void Show()
        {
            Time.timeScale = 0f;
            if (root != null) { root.alpha = 1f; root.interactable = true; root.blocksRaycasts = true; }
            bool can = health != null && health.CanRevive;
            if (reviveButton != null) reviveButton.interactable = can;
            if (reviveLabel != null) reviveLabel.text = can ? "ВОЗРОДИТЬСЯ ЗА РЕКЛАМУ" : "ВОЗРОЖДЕНИЕ УЖЕ ИСПОЛЬЗОВАНО";
            if (statusLabel != null) statusLabel.text = "ЗАБЕГ ОКОНЧЕН";
        }

        private void WatchAd()
        {
            if (health == null || !health.CanRevive || ads == null) return;
            if (reviveButton != null) reviveButton.interactable = false;
            if (statusLabel != null) statusLabel.text = "РЕКЛАМА...";
            ads.ShowReviveAd();
        }

        private void OnReward()
        {
            if (health != null && health.Revive()) Hide();
        }

        private void OnAdUnavailable()
        {
            if (health != null && health.CanRevive && reviveButton != null) reviveButton.interactable = true;
            if (statusLabel != null) statusLabel.text = "РЕКЛАМА НЕДОСТУПНА — ПОПРОБУЙ ЕЩЁ РАЗ";
        }

        private void FinishRun()
        {
            Time.timeScale = 1f;
            // Run result/meta progression screen will replace this callback later.
            if (statusLabel != null) statusLabel.text = "РЕЗУЛЬТАТ ЗАБЕГА СОХРАНЁН";
        }

        private void Hide()
        {
            Time.timeScale = 1f;
            if (root != null) { root.alpha = 0f; root.interactable = false; root.blocksRaycasts = false; }
        }

        private void OnDestroy()
        {
            if (health != null) { health.OnDied -= Show; health.OnRevived -= Hide; }
            if (ads != null) { ads.OnRewardGranted -= OnReward; ads.OnRewardUnavailable -= OnAdUnavailable; }
        }
    }
}
