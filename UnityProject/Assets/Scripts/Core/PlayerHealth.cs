using System;
using System.Collections;
using UnityEngine;
using ArenaSatellites.Progression;

namespace ArenaSatellites
{
    public sealed class PlayerHealth : MonoBehaviour
    {
        public static PlayerHealth Instance { get; private set; }

        [SerializeField] private float maxHealth = 100f;
        [SerializeField] private float reviveHealthFraction = .55f;
        [SerializeField] private float reviveInvulnerability = 3f;
        [SerializeField] private SpriteRenderer[] renderers;

        public float Health { get; private set; }
        public float MaxHealth => maxHealth;
        public bool IsDead { get; private set; }
        public bool ReviveUsed { get; private set; }
        public bool IsInvulnerable => Time.unscaledTime < invulnerableUntil;

        public event Action<float,float> OnHealthChanged;
        public event Action OnDied;
        public event Action OnRevived;

        private float invulnerableUntil;

        private void Awake()
        {
            Instance = this;
            Health = maxHealth;
            if (renderers == null || renderers.Length == 0)
                renderers = GetComponentsInChildren<SpriteRenderer>();
        }

        public void TakeDamage(float rawDamage)
        {
            if (IsDead || IsInvulnerable) return;
            float armor = GetComponent<PlayerRuntimeStats>()?.Armor ?? 0f;
            float damage = Mathf.Max(1f, rawDamage * (1f - Mathf.Clamp01(armor)));
            Health = Mathf.Max(0f, Health - damage);
            OnHealthChanged?.Invoke(Health, maxHealth);
            StartCoroutine(HitFlash());
            CombatFeedback.Instance?.Kick(.22f,.12f);
            if (Health <= 0f) Die();
        }

        public bool CanRevive => IsDead && !ReviveUsed;

        public bool Revive()
        {
            if (!CanRevive) return false;
            ReviveUsed = true;
            IsDead = false;
            Health = Mathf.Max(1f, maxHealth * reviveHealthFraction);
            invulnerableUntil = Time.unscaledTime + reviveInvulnerability;
            gameObject.SetActive(true);
            OnHealthChanged?.Invoke(Health, maxHealth);
            OnRevived?.Invoke();
            StartCoroutine(ReviveBlink());
            ClearNearbyDanger(4.5f);
            return true;
        }

        private void Die()
        {
            IsDead = true;
            if (TryGetComponent<Rigidbody2D>(out var body)) body.linearVelocity = Vector2.zero;
            OnDied?.Invoke();
        }

        private void ClearNearbyDanger(float radius)
        {
            foreach (var hit in Physics2D.OverlapCircleAll(transform.position, radius))
            {
                if (hit == null) continue;
                if (hit.GetComponent<EnemyHealth>() != null) continue;
                if (hit.CompareTag("Player")) continue;
                if (hit.GetComponent<PlayerController>() != null) continue;
                if (hit.isTrigger && hit.GetComponent<Projectile>() == null)
                    Destroy(hit.gameObject);
            }
        }

        private IEnumerator HitFlash()
        {
            foreach (var r in renderers) if (r != null) r.color = new Color(1f,.35f,.35f,1f);
            yield return new WaitForSecondsRealtime(.08f);
            foreach (var r in renderers) if (r != null) r.color = Color.white;
        }

        private IEnumerator ReviveBlink()
        {
            while (IsInvulnerable)
            {
                foreach (var r in renderers) if (r != null) r.enabled = !r.enabled;
                yield return new WaitForSecondsRealtime(.10f);
            }
            foreach (var r in renderers) if (r != null) r.enabled = true;
        }

        private void OnDestroy()
        {
            if (Instance == this) Instance = null;
        }
    }
}
