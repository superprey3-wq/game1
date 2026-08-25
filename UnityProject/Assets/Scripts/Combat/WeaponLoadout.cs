using System.Collections.Generic;
using UnityEngine;

namespace ArenaSatellites.Combat
{
    public enum RuntimeWeaponKind { PulseRifle, PlasmaCaster, RocketPod, PrismLaser, ChainLightning, FrostCannon }

    [System.Serializable]
    public sealed class RuntimeWeaponState
    {
        public RuntimeWeaponKind kind;
        public int level = 1;
        public float cooldown;
        public float damage;
        public float range;
        public float projectileSpeed;
    }

    public sealed class WeaponLoadout : MonoBehaviour
    {
        [SerializeField] private Transform muzzle;
        [SerializeField] private LayerMask enemyMask;
        [SerializeField] private List<RuntimeWeaponState> weapons = new();
        [SerializeField] private GameObject projectilePrefab;
        [SerializeField] private Sprite[] projectileSprites;

        private readonly Dictionary<RuntimeWeaponKind, float> timers = new();

        private void Awake()
        {
            if (weapons.Count == 0)
            {
                weapons.Add(W(RuntimeWeaponKind.PulseRifle, .42f, 18f, 12f, 18f));
                weapons.Add(W(RuntimeWeaponKind.PlasmaCaster, .82f, 28f, 10f, 12f));
                weapons.Add(W(RuntimeWeaponKind.RocketPod, 1.8f, 64f, 13f, 9f));
                weapons.Add(W(RuntimeWeaponKind.PrismLaser, 1.25f, 44f, 11f, 0f));
                weapons.Add(W(RuntimeWeaponKind.ChainLightning, 1.05f, 36f, 9f, 0f));
                weapons.Add(W(RuntimeWeaponKind.FrostCannon, .95f, 31f, 10f, 11f));
            }
        }

        private void Update()
        {
            foreach (var weapon in weapons)
            {
                timers.TryGetValue(weapon.kind, out var timer);
                timer -= Time.deltaTime;
                if (timer <= 0f)
                {
                    Fire(weapon);
                    timer = Mathf.Max(.08f, weapon.cooldown * Mathf.Pow(.94f, weapon.level - 1));
                }
                timers[weapon.kind] = timer;
            }
        }

        public void Upgrade(RuntimeWeaponKind kind)
        {
            var weapon = weapons.Find(w => w.kind == kind);
            if (weapon != null) weapon.level = Mathf.Min(6, weapon.level + 1);
        }

        private void Fire(RuntimeWeaponState weapon)
        {
            var target = FindNearest(weapon.range);
            if (target == null) return;
            var dir = ((Vector2)target.transform.position - (Vector2)transform.position).normalized;
            float damage = weapon.damage * (1f + .18f * (weapon.level - 1));

            switch (weapon.kind)
            {
                case RuntimeWeaponKind.PulseRifle:
                    SpawnProjectile(dir, weapon.projectileSpeed, damage, 0); break;
                case RuntimeWeaponKind.PlasmaCaster:
                    SpawnProjectile(dir, weapon.projectileSpeed, damage, 1); break;
                case RuntimeWeaponKind.RocketPod:
                    for (int i=-1;i<=1;i++) SpawnProjectile(Quaternion.Euler(0,0,i*8f)*dir, weapon.projectileSpeed, damage*.65f, 2);
                    break;
                case RuntimeWeaponKind.PrismLaser:
                    DamageLine(dir, weapon.range, damage, 1); break;
                case RuntimeWeaponKind.ChainLightning:
                    DamageChain(target.transform, damage, 3); break;
                case RuntimeWeaponKind.FrostCannon:
                    SpawnProjectile(dir, weapon.projectileSpeed, damage, 1, 1.35f); break;
            }
        }

        private Collider2D FindNearest(float range)
        {
            var hits = Physics2D.OverlapCircleAll(transform.position, range, enemyMask);
            Collider2D best = null; float bestDist = float.MaxValue;
            foreach (var hit in hits)
            {
                float d = ((Vector2)hit.transform.position-(Vector2)transform.position).sqrMagnitude;
                if (d < bestDist) { bestDist = d; best = hit; }
            }
            return best;
        }

        private void SpawnProjectile(Vector2 dir, float speed, float damage, int spriteIndex, float scale = 1f)
        {
            if (projectilePrefab == null || muzzle == null) return;
            var go = Instantiate(projectilePrefab, muzzle.position, Quaternion.FromToRotation(Vector3.right, dir));
            go.transform.localScale *= scale;
            var projectile = go.GetComponent<ArenaSatellites.Projectile>();
            if (projectile != null) projectile.Launch(dir, speed, damage);
            var sr = go.GetComponent<SpriteRenderer>();
            if (sr != null && projectileSprites != null && spriteIndex < projectileSprites.Length) sr.sprite = projectileSprites[spriteIndex];
        }

        private void DamageLine(Vector2 dir, float range, float damage, int pierce)
        {
            var hits = Physics2D.RaycastAll(transform.position, dir, range, enemyMask);
            int count = 0;
            foreach (var hit in hits)
            {
                var hp = hit.collider.GetComponent<ArenaSatellites.EnemyHealth>();
                if (hp != null) hp.Damage(damage);
                if (++count > pierce) break;
            }
            ArenaSatellites.CombatFeedback.Instance?.Kick(.12f,.09f);
        }

        private void DamageChain(Transform start, float damage, int jumps)
        {
            Transform current = start;
            var visited = new HashSet<Transform>();
            for(int i=0;i<jumps && current!=null;i++)
            {
                visited.Add(current);
                current.GetComponent<ArenaSatellites.EnemyHealth>()?.Damage(damage * Mathf.Pow(.82f,i));
                Collider2D next = null; float best = 16f;
                foreach(var h in Physics2D.OverlapCircleAll(current.position,4f,enemyMask))
                {
                    if(visited.Contains(h.transform)) continue;
                    float d=((Vector2)h.transform.position-(Vector2)current.position).sqrMagnitude;
                    if(d<best){best=d;next=h;}
                }
                current = next != null ? next.transform : null;
            }
        }

        private static RuntimeWeaponState W(RuntimeWeaponKind kind,float cooldown,float damage,float range,float speed)
            => new(){kind=kind,cooldown=cooldown,damage=damage,range=range,projectileSpeed=speed};
    }
}
