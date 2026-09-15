using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace ArenaSatellites.UI
{
    [RequireComponent(typeof(Canvas))]
    public sealed class PlayerHealthHUD : MonoBehaviour
    {
        private PlayerHealth health;
        private Image fill;
        private TextMeshProUGUI label;

        private void Start()
        {
            health = FindFirstObjectByType<PlayerHealth>();
            Build();
            if (health != null)
            {
                health.OnHealthChanged += Refresh;
                Refresh(health.Health, health.MaxHealth);
            }
        }

        private void Build()
        {
            var root = new GameObject("PlayerHP", typeof(RectTransform), typeof(Image));
            root.transform.SetParent(transform,false);
            var rt = root.GetComponent<RectTransform>();
            rt.anchorMin = rt.anchorMax = new Vector2(.5f,1f);
            rt.anchoredPosition = new Vector2(0,-112);
            rt.sizeDelta = new Vector2(420,30);
            root.GetComponent<Image>().color = new Color(.02f,.03f,.035f,.9f);

            var bar = new GameObject("Fill", typeof(RectTransform), typeof(Image));
            bar.transform.SetParent(root.transform,false);
            var brt = bar.GetComponent<RectTransform>();
            brt.anchorMin = new Vector2(0,0); brt.anchorMax = new Vector2(1,1); brt.offsetMin = new Vector2(3,3); brt.offsetMax = new Vector2(-3,-3);
            fill = bar.GetComponent<Image>();
            fill.type = Image.Type.Filled; fill.fillMethod = Image.FillMethod.Horizontal; fill.color = new Color(.2f,.9f,.38f,1f);

            var text = new GameObject("HPText", typeof(RectTransform));
            text.transform.SetParent(root.transform,false);
            var trt = text.GetComponent<RectTransform>(); trt.anchorMin=Vector2.zero; trt.anchorMax=Vector2.one; trt.offsetMin=trt.offsetMax=Vector2.zero;
            label = text.AddComponent<TextMeshProUGUI>(); label.alignment=TextAlignmentOptions.Center; label.fontSize=18; label.color=Color.white;
        }

        private void Refresh(float hp,float max)
        {
            if(fill!=null) fill.fillAmount = max <= 0 ? 0 : hp/max;
            if(label!=null) label.text = $"HP {Mathf.CeilToInt(hp)} / {Mathf.CeilToInt(max)}";
        }

        private void OnDestroy()
        {
            if (health != null) health.OnHealthChanged -= Refresh;
        }
    }
}
