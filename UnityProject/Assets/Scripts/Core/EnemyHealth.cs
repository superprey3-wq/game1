using System.Collections;
using UnityEngine;

namespace ArenaSatellites
{
    public sealed class EnemyHealth : MonoBehaviour
    {
        [SerializeField] float maxHealth = 60f;
        [SerializeField] SpriteRenderer[] renderers;
        [SerializeField] GameObject deathFxPrefab;
        float health;
        bool dead;

        void Awake() => health = maxHealth;

        public void Configure(float hp) { maxHealth = hp; health = hp; }

        public void TakeDamage(float amount)
        {
            if (dead) return;
            health -= amount;
            StopAllCoroutines();
            StartCoroutine(HitFlash());
            if (health <= 0) Die();
        }

        IEnumerator HitFlash()
        {
            foreach (var r in renderers) if (r != null) r.color = Color.white * 1.8f;
            yield return new WaitForSeconds(.06f);
            foreach (var r in renderers) if (r != null) r.color = Color.white;
        }

        void Die()
        {
            dead = true;
            if (deathFxPrefab != null) Destroy(Instantiate(deathFxPrefab, transform.position, Quaternion.identity), 2f);
            CombatFeedback.Instance?.Kick(.22f, .12f);
            Destroy(gameObject);
        }
    }
}
