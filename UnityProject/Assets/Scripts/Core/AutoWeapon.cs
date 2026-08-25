using UnityEngine;

namespace ArenaSatellites
{
    public sealed class AutoWeapon : MonoBehaviour
    {
        [SerializeField] Transform muzzle;
        [SerializeField] Projectile projectilePrefab;
        [SerializeField] float fireRate = 3.5f;
        [SerializeField] float projectileSpeed = 12f;
        [SerializeField] float damage = 18f;
        [SerializeField] float acquireRadius = 11f;
        [SerializeField] LayerMask enemyMask;
        [SerializeField] ParticleSystem muzzleFx;

        float nextShot;

        void Update()
        {
            if (Time.time < nextShot || projectilePrefab == null || muzzle == null) return;
            Collider2D target = FindNearest();
            if (target == null) return;
            Vector2 dir = (target.transform.position - muzzle.position).normalized;
            Fire(dir);
            nextShot = Time.time + 1f / Mathf.Max(.1f, fireRate);
        }

        Collider2D FindNearest()
        {
            var hits = enemyMask.value == 0
                ? Physics2D.OverlapCircleAll(transform.position, acquireRadius)
                : Physics2D.OverlapCircleAll(transform.position, acquireRadius, enemyMask);
            Collider2D best = null; float bestD = float.MaxValue;
            foreach (var h in hits)
            {
                if (!h.TryGetComponent<EnemyHealth>(out _)) continue;
                float d = (h.transform.position - transform.position).sqrMagnitude;
                if (d < bestD) { bestD = d; best = h; }
            }
            return best;
        }

        void Fire(Vector2 dir)
        {
            var shot = Instantiate(projectilePrefab, muzzle.position, Quaternion.FromToRotation(Vector3.right, dir));
            shot.gameObject.SetActive(true);
            shot.Launch(dir, projectileSpeed, damage);
            if (muzzleFx != null) muzzleFx.Play();
            CombatFeedback.Instance?.Kick(.08f, .08f);
        }
    }
}
