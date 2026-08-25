using ArenaSatellites.Platform;
using ArenaSatellites.Progression;
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

        private void Awake()
        {
            if (root == null) BuildRuntimeUI();
        }

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

        private void BuildRuntimeUI()
        {
            var panel = new GameObject("DeathPanel", typeof(RectTransform), typeof(Image), typeof(CanvasGroup));
            panel.transform.SetParent(transform, false);
            var rt = panel.GetComponent<RectTransform>();
            rt.anchorMin = Vector2.zero; rt.anchorMax = Vector2.one; rt.offsetMin = rt.offsetMax = Vector2.zero;
            panel.GetComponent<Image>().color = new Color(.015f,.02f,.03f,.94f);
            root = panel.GetComponent<CanvasGroup>();

            statusLabel = MakeText("Status", "ЗАБЕГ ОКОНЧЕН", panel.transform, 38, new Vector2(0,110), new Vector2(700,70));
            reviveButton = MakeButton("Revive", panel.transform, new Vector2(0,10), new Vector2(430,82), out reviveLabel);
            reviveLabel.text = "ВОЗРОДИТЬСЯ ЗА РЕКЛАМУ";
            finishButton = MakeButton("Finish", panel.transform, new Vector2(0,-95), new Vector2(330,64), out var finishText);
            finishText.text = "ЗАКОНЧИТЬ ЗАБЕГ";
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
            RunResultService.Instance?.SaveCurrentRun();
            Time.timeScale = 1f;
            if (reviveButton != null) reviveButton.interactable = false;
            if (finishButton != null) finishButton.interactable = false;
            if (statusLabel != null) statusLabel.text = "НАГРАДЫ ЗАБЕГА СОХРАНЕНЫ";
        }

        private void Hide()
        {
            Time.timeScale = 1f;
            if (root != null) { root.alpha = 0f; root.interactable = false; root.blocksRaycasts = false; }
        }

        private static Button MakeButton(string name, Transform parent, Vector2 pos, Vector2 size, out TextMeshProUGUI label)
        {
            var go = new GameObject(name, typeof(RectTransform), typeof(Image), typeof(Button));
            go.transform.SetParent(parent, false);
            var rt = go.GetComponent<RectTransform>(); rt.anchorMin = rt.anchorMax = new Vector2(.5f,.5f); rt.anchoredPosition = pos; rt.sizeDelta = size;
            go.GetComponent<Image>().color = new Color(.10f,.38f,.50f,.96f);
            var btn = go.GetComponent<Button>();
            label = MakeText("Label", name, go.transform, 23, Vector2.zero, size - new Vector2(24,16));
            return btn;
        }

        private static TextMeshProUGUI MakeText(string name, string value, Transform parent, float size, Vector2 pos, Vector2 box)
        {
            var go = new GameObject(name, typeof(RectTransform)); go.transform.SetParent(parent,false);
            var rt = go.GetComponent<RectTransform>(); rt.anchorMin = rt.anchorMax = new Vector2(.5f,.5f); rt.anchoredPosition = pos; rt.sizeDelta = box;
            var text = go.AddComponent<TextMeshProUGUI>(); text.text = value; text.fontSize = size; text.color = Color.white; text.alignment = TextAlignmentOptions.Center;
            return text;
        }

        private void OnDestroy()
        {
            if (health != null) { health.OnDied -= Show; health.OnRevived -= Hide; }
            if (ads != null) { ads.OnRewardGranted -= OnReward; ads.OnRewardUnavailable -= OnAdUnavailable; }
        }
    }
}
