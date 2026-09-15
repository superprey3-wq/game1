using System.Collections;
using ArenaSatellites.Enemies;
using UnityEngine;

namespace ArenaSatellites.Bosses
{
    public sealed class XenoQueenBoss : MonoBehaviour
    {
        [SerializeField] private float maxHealth = 1800f;
        [SerializeField] private float moveSpeedPhase1 = 1.6f;
        [SerializeField] private float moveSpeedPhase2 = 2.4f;
        [SerializeField] private float enrageThreshold = .5f;
        [SerializeField] private float contactDamage = 30f;
        [SerializeField] private Rigidbody2D body;
        [SerializeField] private Transform target;
        [SerializeField] private GameObject projectilePrefab;
        [SerializeField] private Transform muzzle;
        [SerializeField] private float volleyCooldown = 2.2f;
        [SerializeField] private float projectileSpeed = 7f;
        [SerializeField] private BossTelegraph telegraph;

        private float health;
        private float volleyTimer;
        private bool phase2;
        private bool firing;

        private void Awake()
        {
            health = maxHealth;
            if (body == null) body = GetComponent<Rigidbody2D>();
            if (telegraph == null) telegraph = GetComponentInChildren<BossTelegraph>();
        }

        public void SetTarget(Transform value) => target = value;

        private void FixedUpdate()
        {
            if (target == null || body == null) return;
            var dir = ((Vector2)target.position - body.position).normalized;
            body.linearVelocity = dir * (phase2 ? moveSpeedPhase2 : moveSpeedPhase1);
        }

        private void Update()
        {
            if (target == null || firing) return;
            volleyTimer -= Time.deltaTime;
            if (volleyTimer <= 0f) StartCoroutine(TelegraphAndFire());
        }

        private IEnumerator TelegraphAndFire()
        {
            firing = true;
            if (body != null) body.linearVelocity = Vector2.zero;
            if (telegraph != null) yield return telegraph.Flash(phase2 ? .45f : .65f);
            else yield return new WaitForSeconds(phase2 ? .35f : .55f);
            FireVolley(phase2 ? 7 : 3);
            volleyTimer = phase2 ? volleyCooldown * .55f : volleyCooldown;
            firing = false;
        }

        public void Damage(float amount)
        {
            health -= amount;
            if (!phase2 && health <= maxHealth * enrageThreshold) EnterPhase2();
            if (health <= 0f) Destroy(gameObject);
        }

        private void EnterPhase2()
        {
            phase2 = true;
            transform.localScale *= 1.12f;
            CombatFeedback.Instance?.Kick(.45f,.22f);
        }

        private void FireVolley(int count)
        {
            if (projectilePrefab == null || muzzle == null || target == null) return;
            var dir = ((Vector2)target.position - (Vector2)muzzle.position).normalized;
            float spread = phase2 ? 18f : 12f;
            for (int i=0;i<count;i++)
            {
                float offset = (i - (count - 1) * .5f) * spread;
                Vector2 shotDir = Quaternion.Euler(0,0,offset) * dir;
                var go = Instantiate(projectilePrefab, muzzle.position, Quaternion.FromToRotation(Vector3.right, shotDir));
                go.GetComponent<EnemyProjectile>()?.Launch(shotDir, phase2 ? projectileSpeed*1.15f : projectileSpeed, phase2 ? contactDamage*.75f : contactDamage*.55f);
            }
            CombatFeedback.Instance?.Kick(phase2 ? .28f : .18f,.10f);
        }
    }
}
