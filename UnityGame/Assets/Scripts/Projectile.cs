using UnityEngine;

namespace ArenaSatellites
{
    [RequireComponent(typeof(Rigidbody2D))]
    public sealed class Projectile : MonoBehaviour
    {
        [SerializeField] private float speed = 12f;
        [SerializeField] private float lifetime = 2f;
        private Rigidbody2D body;
        private float damage;

        private void Awake() => body = GetComponent<Rigidbody2D>();

        public void Launch(Vector2 direction, float amount)
        {
            damage = amount;
            body.velocity = direction.normalized * speed;
            transform.right = direction;
            Destroy(gameObject, lifetime);
        }

        private void OnTriggerEnter2D(Collider2D other)
        {
            if (other.TryGetComponent<EnemyChaser>(out var enemy))
            {
                enemy.TakeDamage(damage);
                Destroy(gameObject);
            }
        }
    }
}
