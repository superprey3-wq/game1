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
        [SerializeField] private GameObject projectilePrefab;
        [SerializeField] private float projectileSpeed = 7f;

        private float attackTimer;

        private void Awake()
        {
            ApplyPreset();
            if (body == null) body = GetComponent<Rigidbody2D>();
        }

        public void SetTarget(Transform value) => target = value;
        public void SetProjectilePrefab(GameObject value) => projectilePrefab = value;

        private void FixedUpdate()
        {
            if (target == null || body == null) return;
            attackTimer -= Time.fixedDeltaTime;
            var delta = (Vector2)(target.position - transform.position);
            var dist = delta.magnitude;

            bool ranged = kind == XenoEnemyKind.Spitter || kind == XenoEnemyKind.ScoutDrone || kind == XenoEnemyKind.Summoner;
            if (ranged)
            {
                float preferred = attackRange * .72f;
                if (dist > attackRange) body.linearVelocity = delta.normalized * moveSpeed;
                else if (dist < preferred * .6f) body.linearVelocity = -delta.normalized * moveSpeed * .7f;
                else body.linearVelocity = Vector2.zero;

                if (dist <= attackRange && attackTimer <= 0f)
                {
                    attackTimer = attackCooldown;
                    Fire(delta.normalized);
                }
            }
            else
            {
                if (dist > attackRange) body.linearVelocity = delta.normalized * moveSpeed;
                else
                {
                    body.linearVelocity = Vector2.zero;
                    if (attackTimer <= 0f)
                    {
                        attackTimer = attackCooldown;
                        target.GetComponent<PlayerHealth>()?.TakeDamage(touchDamage);
                    }
                }
            }
        }

        private void Fire(Vector2 dir)
        {
            if (projectilePrefab == null) return;
            int shots = kind == XenoEnemyKind.Summoner ? 3 : 1;
            float spread = kind == XenoEnemyKind.Summoner ? 12f : 0f;
            for (int i = 0; i < shots; i++)
            {
                float offset = (i - (shots - 1) * .5f) * spread;
                Vector2 shotDir = Quaternion.Euler(0,0,offset) * dir;
                var go = Instantiate(projectilePrefab, transform.position, Quaternion.FromToRotation(Vector3.right, shotDir));
                go.GetComponent<EnemyProjectile>()?.Launch(shotDir, projectileSpeed, touchDamage);
            }
        }

        private void ApplyPreset()
        {
            switch (kind)
            {
                case XenoEnemyKind.Runner:
                    maxHealth = 28f; moveSpeed = 5.4f; touchDamage = 7f; attackRange = .8f; attackCooldown=.75f; break;
                case XenoEnemyKind.Spitter:
                    maxHealth = 42f; moveSpeed = 2.8f; touchDamage = 10f; attackRange = 7f; attackCooldown = 1.7f; projectileSpeed=6.5f; break;
                case XenoEnemyKind.ScoutDrone:
                    maxHealth = 34f; moveSpeed = 4.3f; touchDamage = 8f; attackRange = 5.5f; attackCooldown = 1.2f; projectileSpeed=9f; break;
                case XenoEnemyKind.BruteRobot:
                    maxHealth = 125f; moveSpeed = 1.8f; touchDamage = 22f; attackRange = 1.2f; attackCooldown = 1.4f; break;
                case XenoEnemyKind.Summoner:
                    maxHealth = 78f; moveSpeed = 2.2f; touchDamage = 12f; attackRange = 8f; attackCooldown = 3.2f; projectileSpeed=5.8f; break;
            }
            GetComponent<EnemyHealth>()?.Configure(maxHealth);
        }
    }
}
