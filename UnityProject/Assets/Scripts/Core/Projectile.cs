using UnityEngine;

namespace ArenaSatellites
{
    [RequireComponent(typeof(Rigidbody2D), typeof(Collider2D))]
    public sealed class Projectile : MonoBehaviour
    {
        [SerializeField] float life = 2f;
        [SerializeField] GameObject hitFxPrefab;
        Rigidbody2D body;
        float damage;

        void Awake() => body = GetComponent<Rigidbody2D>();

        public void Launch(Vector2 direction, float speed, float hitDamage)
        {
            damage = hitDamage;
            body.velocity = direction.normalized * speed;
            Destroy(gameObject, life);
        }

        void OnTriggerEnter2D(Collider2D other)
        {
            if (!other.TryGetComponent<EnemyHealth>(out var hp)) return;
            hp.TakeDamage(damage);
            if (hitFxPrefab != null) Destroy(Instantiate(hitFxPrefab, transform.position, Quaternion.identity), 2f);
            CombatFeedback.Instance?.Kick(.12f, .05f);
            Destroy(gameObject);
        }
    }
}
