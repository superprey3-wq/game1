using System.Collections;
using UnityEngine;
using ArenaSatellites.Progression;

namespace ArenaSatellites
{
    public sealed class EnemyHealth : MonoBehaviour
    {
        [SerializeField] float maxHealth = 60f;
        [SerializeField] SpriteRenderer[] renderers;
        [SerializeField] GameObject deathFxPrefab;
        [SerializeField] GameObject lootPickupPrefab;
        [SerializeField] float xpDrop = 6f;
        [SerializeField, Range(0f,1f)] float crystalChance = .18f;
        [SerializeField, Range(0f,1f)] float gearChance = .025f;
        float health;
        bool dead;

        void Awake()
        {
            health = maxHealth;
            if (renderers == null || renderers.Length == 0)
                renderers = GetComponentsInChildren<SpriteRenderer>();
        }

        public void Configure(float hp) { maxHealth = hp; health = hp; }

        public void TakeDamage(float amount)
        {
            if (dead) return;
            health -= amount;
            StopAllCoroutines();
            StartCoroutine(HitFlash());
            if (health <= 0) Die();
        }

        IEnumerator HitFlash()
        {
            var original = new Color[renderers.Length];
            for (int i=0;i<renderers.Length;i++)
            {
                var r=renderers[i]; if(r==null) continue;
                original[i]=r.color; r.color=Color.white*1.8f;
            }
            yield return new WaitForSeconds(.06f);
            for (int i=0;i<renderers.Length;i++) if(renderers[i]!=null) renderers[i].color=original[i];
        }

        void Die()
        {
            dead = true;
            if (deathFxPrefab != null) Destroy(Instantiate(deathFxPrefab, transform.position, Quaternion.identity), 2f);
            SpawnLoot();
            CombatFeedback.Instance?.Kick(.22f, .12f);
            Destroy(gameObject);
        }

        void SpawnLoot()
        {
            if (lootPickupPrefab == null)
            {
                RunProgression.Instance?.AddXP(xpDrop);
                if (Random.value < crystalChance) RunProgression.Instance?.AddCrystals(1);
                return;
            }

            Spawn(LootKind.XP, xpDrop, 0, Vector2.zero);
            if (Random.value < crystalChance) Spawn(LootKind.Crystal, 0, 1, Random.insideUnitCircle*.35f);
            if (Random.value < gearChance) Spawn(LootKind.Gear, 0, 0, Random.insideUnitCircle*.45f);
        }

        void Spawn(LootKind kind,float xp,int crystals,Vector2 offset)
        {
            var go=Instantiate(lootPickupPrefab,(Vector2)transform.position+offset,Quaternion.identity);
            go.GetComponent<LootPickup>()?.Configure(kind,xp,crystals);
        }
    }
}
