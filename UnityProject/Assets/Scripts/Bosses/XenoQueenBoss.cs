using System.Collections;
using UnityEngine;

namespace ArenaSatellites.Bosses
{
    public sealed class XenoQueenBoss : MonoBehaviour
    {
        [SerializeField] private float maxHealth = 1800f;
        [SerializeField] private float moveSpeedPhase1 = 1.6f;
        [SerializeField] private float moveSpeedPhase2 = 2.4f;
        [SerializeField] private float enrageThreshold = .5f;
        [SerializeField] private Rigidbody2D body;
        [SerializeField] private Transform target;
        [SerializeField] private GameObject projectilePrefab;
        [SerializeField] private Transform muzzle;
        [SerializeField] private float volleyCooldown = 2.2f;
        [SerializeField] private float telegraphTime = .48f;
        [SerializeField] private BossTelegraph telegraph;

        private float health;
        private float volleyTimer;
        private bool phase2;
        private bool windingUp;

        private void Awake()
        {
            health = maxHealth;
            if (body == null) body = GetComponent<Rigidbody2D>();
            if (telegraph == null) telegraph = GetComponentInChildren<BossTelegraph>();
            volleyTimer = 1.1f;
        }

        public void SetTarget(Transform value) => target = value;

        private void FixedUpdate()
        {
            if (target == null || body == null) return;
            if (windingUp) { body.linearVelocity = Vector2.zero; return; }
            var dir = ((Vector2)target.position - body.position).normalized;
            body.linearVelocity = dir * (phase2 ? moveSpeedPhase2 : moveSpeedPhase1);
        }

        private void Update()
        {
            if (target == null || windingUp) return;
            volleyTimer -= Time.deltaTime;
            if (volleyTimer <= 0f) StartCoroutine(TelegraphedVolley());
        }

        private IEnumerator TelegraphedVolley()
        {
            windingUp = true;
            if (telegraph != null) yield return telegraph.Flash(telegraphTime);
            else yield return new WaitForSeconds(telegraphTime);
            FireVolley(phase2 ? 7 : 3);
            CombatFeedback.Instance?.Kick(phase2 ? .28f : .18f, .12f);
            volleyTimer = phase2 ? volleyCooldown * .55f : volleyCooldown;
            windingUp = false;
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
            if (telegraph != null) StartCoroutine(telegraph.Flash(.85f));
            CombatFeedback.Instance?.Kick(.45f,.22f);
        }

        private void FireVolley(int count)
        {
            if (projectilePrefab == null || muzzle == null || target == null) return;
            var baseAngle = Mathf.Atan2(target.position.y - muzzle.position.y, target.position.x - muzzle.position.x) * Mathf.Rad2Deg;
            var spread = phase2 ? 18f : 12f;
            for (int i = 0; i < count; i++)
            {
                var offset = (i - (count - 1) * .5f) * spread;
                Instantiate(projectilePrefab, muzzle.position, Quaternion.Euler(0, 0, baseAngle + offset));
            }
        }
    }
}
