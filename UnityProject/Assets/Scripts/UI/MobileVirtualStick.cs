using UnityEngine;
using UnityEngine.EventSystems;

namespace ArenaSatellites.UI
{
    public enum VirtualStickMode { Move, Aim }

    public sealed class MobileVirtualStick : MonoBehaviour, IPointerDownHandler, IDragHandler, IPointerUpHandler
    {
        [SerializeField] private VirtualStickMode mode;
        [SerializeField] private RectTransform knob;
        [SerializeField] private float radius = 72f;
        [SerializeField] private PlayerController player;

        private RectTransform rect;

        private void Awake()
        {
            rect = transform as RectTransform;
            if (player == null) player = FindFirstObjectByType<PlayerController>();
            if (knob != null) knob.anchoredPosition = Vector2.zero;
        }

        public void OnPointerDown(PointerEventData eventData) => UpdateStick(eventData);
        public void OnDrag(PointerEventData eventData) => UpdateStick(eventData);

        public void OnPointerUp(PointerEventData eventData)
        {
            if (knob != null) knob.anchoredPosition = Vector2.zero;
            Send(Vector2.zero);
        }

        private void UpdateStick(PointerEventData eventData)
        {
            if (rect == null || player == null) return;
            if (!RectTransformUtility.ScreenPointToLocalPointInRectangle(rect, eventData.position, eventData.pressEventCamera, out var local)) return;
            var value = Vector2.ClampMagnitude(local / Mathf.Max(1f, radius), 1f);
            if (knob != null) knob.anchoredPosition = value * radius;
            Send(value);
        }

        private void Send(Vector2 value)
        {
            if (player == null) return;
            if (mode == VirtualStickMode.Move) player.SetMobileMove(value);
            else player.SetMobileAim(value);
        }
    }
}
