using UnityEngine;

namespace ArenaSatellites.Enemies
{
    public enum XenoEnemyKind { Runner, Spitter, ScoutDrone, BruteRobot, Summoner }

    public sealed class XenoEnemyArchetype : MonoBehaviour
    {
        [SerializeField] private XenoEnemyKind kind;
        [SerializeField] private float maxHealth = 40f;
        [SerializeField] private float moveSpeed = 3.2f;
        [SerializeField] private float touchDamage = 8f;
        [SerializeField] private float attackRange = 1.1f;
        [SerializeField] private float attackCooldown = 1f;
        [SerializeField] private Rigidbody2D body;
        [SerializeField] private Transform target;

        private float health;
        private float attackTimer;

        private void Awake()
        {
            ApplyPreset();
            health = maxHealth;
            if (body == null) body = GetComponent<Rigidbody2D>();
        }

        public void SetTarget(Transform value) => target = value;

        private void FixedUpdate()
        {
            if (target == null || body == null) return;
            attackTimer -= Time.fixedDeltaTime;
            var delta = (Vector2)(target.position - transform.position);
            var dist = delta.magnitude;
            if (dist > attackRange)
                body.linearVelocity = delta.normalized * moveSpeed;
            else
                body.linearVelocity = Vector2.zero;
        }

        public void Damage(float amount)
        {
            health -= amount;
            if (health <= 0f) Destroy(gameObject);
        }

        private void ApplyPreset()
        {
            switch (kind)
            {
                case XenoEnemyKind.Runner:
                    maxHealth = 28f; moveSpeed = 5.4f; touchDamage = 7f; attackRange = .8f; break;
                case XenoEnemyKind.Spitter:
                    maxHealth = 42f; moveSpeed = 2.8f; touchDamage = 10f; attackRange = 7f; attackCooldown = 1.7f; break;
                case XenoEnemyKind.ScoutDrone:
                    maxHealth = 34f; moveSpeed = 4.3f; touchDamage = 8f; attackRange = 5.5f; attackCooldown = 1.2f; break;
                case XenoEnemyKind.BruteRobot:
                    maxHealth = 125f; moveSpeed = 1.8f; touchDamage = 22f; attackRange = 1.2f; attackCooldown = 1.4f; break;
                case XenoEnemyKind.Summoner:
                    maxHealth = 78f; moveSpeed = 2.2f; touchDamage = 12f; attackRange = 8f; attackCooldown = 3.2f; break;
            }
        }
    }
}
