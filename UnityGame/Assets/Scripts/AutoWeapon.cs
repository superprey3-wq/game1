using UnityEngine;

namespace ArenaSatellites
{
    public sealed class AutoWeapon : MonoBehaviour
    {
        [SerializeField] private Transform muzzle;
        [SerializeField] private Projectile projectilePrefab;
        [SerializeField] private float fireRate = 5f;
        [SerializeField] private float range = 9f;
        [SerializeField] private float damage = 18f;
        [SerializeField] private LayerMask enemyMask;

        private float cooldown;

        private void Update()
        {
            cooldown -= Time.deltaTime;
            if (cooldown > 0f || projectilePrefab == null || muzzle == null) return;

            var hit = Physics2D.OverlapCircle(transform.position, range, enemyMask);
            if (hit == null) return;

            Vector2 direction = (hit.transform.position - muzzle.position).normalized;
            var projectile = Instantiate(projectilePrefab, muzzle.position, Quaternion.identity);
            projectile.Launch(direction, damage);
            cooldown = 1f / Mathf.Max(.1f, fireRate);
        }
    }
}
