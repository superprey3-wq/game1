using UnityEngine;

namespace ArenaSatellites.Enemies
{
    [RequireComponent(typeof(Rigidbody2D), typeof(Collider2D))]
    public sealed class EnemyProjectile : MonoBehaviour
    {
        [SerializeField] private float speed = 7f;
        [SerializeField] private float damage = 12f;
        [SerializeField] private float life = 5f;
        private Rigidbody2D body;

        private void Awake() => body = GetComponent<Rigidbody2D>();

        public void Launch(Vector2 dir, float projectileSpeed, float hitDamage)
        {
            speed = projectileSpeed;
            damage = hitDamage;
            body.linearVelocity = dir.normalized * speed;
            Destroy(gameObject, life);
        }

        private void OnTriggerEnter2D(Collider2D other)
        {
            var hp = other.GetComponent<PlayerHealth>();
            if (hp == null) return;
            hp.TakeDamage(damage);
            Destroy(gameObject);
        }
    }
}
