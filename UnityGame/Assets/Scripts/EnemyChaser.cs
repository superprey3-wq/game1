using UnityEngine;

namespace ArenaSatellites
{
    [RequireComponent(typeof(Rigidbody2D))]
    public sealed class EnemyChaser : MonoBehaviour
    {
        [SerializeField] private float speed = 2.4f;
        [SerializeField] private float maxHealth = 40f;
        [SerializeField] private float contactDamage = 12f;
        [SerializeField] private ParticleSystem hitFx;

        private Rigidbody2D body;
        private Transform target;
        private float health;

        private void Awake()
        {
            body = GetComponent<Rigidbody2D>();
            health = maxHealth;
        }

        public void SetTarget(Transform player) => target = player;

        public void Configure(float hp, float moveSpeed, float damage)
        {
            maxHealth = hp;
            health = hp;
            speed = moveSpeed;
            contactDamage = damage;
        }

        private void FixedUpdate()
        {
            if (target == null) { body.velocity = Vector2.zero; return; }
            Vector2 delta = target.position - transform.position;
            body.velocity = delta.sqrMagnitude > .01f ? delta.normalized * speed : Vector2.zero;
        }

        public void TakeDamage(float amount)
        {
            health -= amount;
            if (hitFx != null) hitFx.Play();
            if (health <= 0f) Die();
        }

        private void Die()
        {
            Destroy(gameObject);
        }
    }
}
