using ArenaSatellites.Combat;
using ArenaSatellites.Progression;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace ArenaSatellites.UI
{
    public sealed class UpgradeChoiceUI : MonoBehaviour
    {
        [SerializeField] private CanvasGroup root;
        [SerializeField] private Button[] buttons;
        [SerializeField] private TextMeshProUGUI[] titles;
        [SerializeField] private TextMeshProUGUI[] descriptions;
        private UpgradeChoiceController controller;

        private void Start()
        {
            controller = FindFirstObjectByType<UpgradeChoiceController>();
            if (controller == null) return;
            controller.OnChoicesReady += Show;
            controller.OnChoiceClosed += Hide;
            Hide();
        }

        private void Show(System.Collections.Generic.IReadOnlyList<RuntimeWeaponKind> choices)
        {
            if (root != null) { root.alpha = 1; root.blocksRaycasts = true; root.interactable = true; }
            for (int i=0;i<buttons.Length;i++)
            {
                int index=i;
                bool active=i<choices.Count;
                buttons[i].gameObject.SetActive(active);
                if (!active) continue;
                var kind=choices[i];
                if (titles!=null && i<titles.Length) titles[i].text=DisplayName(kind);
                if (descriptions!=null && i<descriptions.Length) descriptions[i].text=Description(kind);
                buttons[i].onClick.RemoveAllListeners();
                buttons[i].onClick.AddListener(()=>controller.Pick(index));
            }
        }

        private void Hide()
        {
            if (root != null) { root.alpha = 0; root.blocksRaycasts = false; root.interactable = false; }
        }

        private static string DisplayName(RuntimeWeaponKind kind) => kind switch
        {
            RuntimeWeaponKind.PulseRifle => "Импульсная винтовка",
            RuntimeWeaponKind.PlasmaCaster => "Плазменный излучатель",
            RuntimeWeaponKind.RocketPod => "Ракетный блок",
            RuntimeWeaponKind.PrismLaser => "Призматический лазер",
            RuntimeWeaponKind.ChainLightning => "Цепная молния",
            RuntimeWeaponKind.FrostCannon => "Криопушка",
            _ => kind.ToString()
        };

        private static string Description(RuntimeWeaponKind kind) => kind switch
        {
            RuntimeWeaponKind.PulseRifle => "Быстрее и мощнее одиночные импульсы",
            RuntimeWeaponKind.PlasmaCaster => "Тяжёлые плазменные заряды",
            RuntimeWeaponKind.RocketPod => "Тройные ракеты с высоким уроном",
            RuntimeWeaponKind.PrismLaser => "Пробивающий луч по линии",
            RuntimeWeaponKind.ChainLightning => "Прыгает между несколькими целями",
            RuntimeWeaponKind.FrostCannon => "Медленные тяжёлые криозаряды",
            _ => "Улучшение оружия"
        };
    }
}
