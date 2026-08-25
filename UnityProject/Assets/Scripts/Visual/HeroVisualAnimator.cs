using ArenaSatellites.Combat;
using UnityEngine;

namespace ArenaSatellites.Visual
{
    [RequireComponent(typeof(SpriteRenderer))]
    public sealed class HeroVisualAnimator : MonoBehaviour
    {
        [SerializeField] private Sprite idleSprite;
        [SerializeField] private Sprite movingSprite;
        [SerializeField] private Sprite firingSprite;
        [SerializeField] private Rigidbody2D body;
        [SerializeField] private WeaponLoadout loadout;
        [SerializeField] private float firePoseTime = .10f;
        private SpriteRenderer sr;
        private float fireUntil;

        private void Awake()
        {
            sr = GetComponent<SpriteRenderer>();
            if (body == null) body = GetComponent<Rigidbody2D>();
            if (loadout == null) loadout = GetComponent<WeaponLoadout>();
        }

        private void OnEnable()
        {
            if (loadout != null) loadout.OnWeaponFired += OnWeaponFired;
        }

        private void OnDisable()
        {
            if (loadout != null) loadout.OnWeaponFired -= OnWeaponFired;
        }

        private void OnWeaponFired(RuntimeWeaponKind kind) => PulseFirePose();
        public void PulseFirePose() => fireUntil = Time.time + firePoseTime;

        private void LateUpdate()
        {
            if (sr == null) return;
            if (Time.time < fireUntil && firingSprite != null) sr.sprite = firingSprite;
            else if (body != null && body.linearVelocity.sqrMagnitude > .05f && movingSprite != null) sr.sprite = movingSprite;
            else if (idleSprite != null) sr.sprite = idleSprite;

            if (body != null && Mathf.Abs(body.linearVelocity.x) > .05f)
                sr.flipX = body.linearVelocity.x < 0f;
        }
    }
}
