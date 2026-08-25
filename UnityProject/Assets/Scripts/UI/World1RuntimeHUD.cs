using System.Collections.Generic;
using ArenaSatellites.Combat;
using ArenaSatellites.Data;
using ArenaSatellites.Progression;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace ArenaSatellites.UI
{
    [RequireComponent(typeof(Canvas))]
    public sealed class World1RuntimeHUD : MonoBehaviour
    {
        private UpgradeChoiceController choices;
        private EquipmentInventory inventory;
        private GameObject upgradePanel;
        private readonly List<Button> upgradeButtons = new();
        private TextMeshProUGUI gearText;

        private void Start()
        {
            choices = FindFirstObjectByType<UpgradeChoiceController>();
            inventory = FindFirstObjectByType<EquipmentInventory>();
            BuildUpgradePanel();
            BuildGearPanel();
            BuildMobileControls();
            if (choices != null) { choices.OnChoicesReady += ShowChoices; choices.OnChoiceClosed += HideChoices; }
            if (inventory != null) { inventory.OnChanged += RefreshGear; RefreshGear(); }
            HideChoices();
        }

        private void OnDestroy()
        {
            if (choices != null) { choices.OnChoicesReady -= ShowChoices; choices.OnChoiceClosed -= HideChoices; }
            if (inventory != null) inventory.OnChanged -= RefreshGear;
        }

        private void BuildUpgradePanel()
        {
            upgradePanel = Panel("UpgradePanel", transform, new Vector2(.5f,.5f), new Vector2(760,310));
            var cg = upgradePanel.AddComponent<CanvasGroup>(); cg.alpha = 0; cg.blocksRaycasts = false; cg.interactable = false;
            MakeText("title", "ВЫБЕРИ УЛУЧШЕНИЕ", upgradePanel.transform, 30, new Vector2(0,118), new Vector2(700,50));
            for (int i=0;i<3;i++)
            {
                int index=i;
                var card=Panel("Card"+i,upgradePanel.transform,new Vector2(.5f,.5f),new Vector2(220,180));
                card.GetComponent<RectTransform>().anchoredPosition=new Vector2((i-1)*245,-20);
                var button=card.AddComponent<Button>(); button.onClick.AddListener(()=>choices?.Pick(index));
                upgradeButtons.Add(button);
                MakeText("CardText","Weapon",card.transform,22,Vector2.zero,new Vector2(190,145));
            }
        }

        private void BuildGearPanel()
        {
            var panel=Panel("GearPanel",transform,new Vector2(1,1),new Vector2(320,170));
            panel.GetComponent<RectTransform>().anchoredPosition=new Vector2(-175,-105);
            gearText=MakeText("GearText","Экипировка",panel.transform,16,Vector2.zero,new Vector2(290,145));
            gearText.alignment=TextAlignmentOptions.TopLeft;
        }

        private void BuildMobileControls()
        {
            if (!Application.isMobilePlatform) return;
            var player=FindFirstObjectByType<PlayerController>();
            if (player==null) return;
            CreateStick("MoveStick",new Vector2(.12f,.16f),VirtualStickMode.Move,player);
            CreateStick("AimStick",new Vector2(.88f,.16f),VirtualStickMode.Aim,player);
        }

        private void CreateStick(string name,Vector2 anchor,VirtualStickMode mode,PlayerController player)
        {
            var baseGo=Panel(name,transform,anchor,new Vector2(160,160));
            var image=baseGo.GetComponent<Image>(); image.color=new Color(1,1,1,.12f);
            var knob=Panel("Knob",baseGo.transform,new Vector2(.5f,.5f),new Vector2(68,68));
            knob.GetComponent<Image>().color=new Color(1,1,1,.32f);
            var stick=baseGo.AddComponent<MobileVirtualStick>();
            var so=new UnityEngine.Serialization.FormerlySerializedAsAttribute("unused");
            var serialized=new UnityEditor.SerializedObject(stick);
            serialized.FindProperty("mode").enumValueIndex=(int)mode;
            serialized.FindProperty("knob").objectReferenceValue=knob.GetComponent<RectTransform>();
            serialized.FindProperty("player").objectReferenceValue=player;
            serialized.ApplyModifiedPropertiesWithoutUndo();
        }

        private void ShowChoices(IReadOnlyList<RuntimeWeaponKind> list)
        {
            var cg=upgradePanel.GetComponent<CanvasGroup>(); cg.alpha=1; cg.blocksRaycasts=true; cg.interactable=true;
            for(int i=0;i<upgradeButtons.Count;i++)
            {
                var label=upgradeButtons[i].GetComponentInChildren<TextMeshProUGUI>();
                if(i<list.Count) label.text=WeaponName(list[i])+"\n<size=16>Уровень "+(FindFirstObjectByType<WeaponLoadout>()?.GetLevel(list[i]) ?? 0)+" → выше</size>";
            }
        }

        private void HideChoices()
        {
            if(upgradePanel==null)return;
            var cg=upgradePanel.GetComponent<CanvasGroup>(); cg.alpha=0; cg.blocksRaycasts=false; cg.interactable=false;
        }

        private void RefreshGear()
        {
            if(gearText==null||inventory==null)return;
            var s="ЭКИПИРОВКА\n";
            foreach(GearSlot slot in System.Enum.GetValues(typeof(GearSlot)))
            {
                var g=inventory.Get(slot);
                s += g==null ? $"{slot}: —\n" : $"{slot}: {g.rarity} +{g.value*100:0}%\n";
            }
            gearText.text=s;
        }

        private static string WeaponName(RuntimeWeaponKind kind)=>kind switch
        {
            RuntimeWeaponKind.PulseRifle=>"Импульсная винтовка", RuntimeWeaponKind.PlasmaCaster=>"Плазма", RuntimeWeaponKind.RocketPod=>"Ракетный блок",
            RuntimeWeaponKind.PrismLaser=>"Призматический лазер", RuntimeWeaponKind.ChainLightning=>"Цепная молния", RuntimeWeaponKind.FrostCannon=>"Криопушка", _=>kind.ToString()
        };

        private static GameObject Panel(string name,Transform parent,Vector2 anchor,Vector2 size)
        {
            var go=new GameObject(name,typeof(RectTransform),typeof(Image)); go.transform.SetParent(parent,false);
            var rt=go.GetComponent<RectTransform>(); rt.anchorMin=rt.anchorMax=anchor; rt.sizeDelta=size;
            go.GetComponent<Image>().color=new Color(.025f,.05f,.07f,.88f); return go;
        }

        private static TextMeshProUGUI MakeText(string name,string value,Transform parent,float size,Vector2 pos,Vector2 box)
        {
            var go=new GameObject(name,typeof(RectTransform));go.transform.SetParent(parent,false);var rt=go.GetComponent<RectTransform>();rt.anchorMin=rt.anchorMax=new Vector2(.5f,.5f);rt.anchoredPosition=pos;rt.sizeDelta=box;
            var t=go.AddComponent<TextMeshProUGUI>();t.text=value;t.fontSize=size;t.color=Color.white;t.alignment=TextAlignmentOptions.Center;t.enableWordWrapping=true;return t;
        }
    }
}
