using System;
using System.Collections.Generic;
using ArenaSatellites.Bosses;
using ArenaSatellites.Enemies;
using ArenaSatellites.UI;
using UnityEngine;

namespace ArenaSatellites.Worlds
{
    public sealed class XenoJungleRunDirector : MonoBehaviour
    {
        [Serializable]
        public class EnemyTemplate
        {
            public XenoEnemyKind kind;
            public GameObject prefab;
            [Range(0, 10)] public float weight = 1;
            public float unlockAt;
        }

        [SerializeField] Transform player;
        [SerializeField] XenoJungleHUD hud;
        [SerializeField] List<EnemyTemplate> enemies = new();
        [SerializeField] GameObject queenPrefab;
        [SerializeField] float bossAt = 240f;
        [SerializeField] float arenaRadius = 13f;
        [SerializeField] int maxAlive = 85;
        [SerializeField] float startingInterval = 1.25f;
        [SerializeField] float minimumInterval = .22f;

        float elapsed;
        float spawnTimer;
        int wave = 1;
        bool bossSpawned;
        readonly List<GameObject> alive = new();

        public float Elapsed => elapsed;

        void Update()
        {
            if (player == null) return;
            elapsed += Time.deltaTime;
            Cleanup();
            int newWave = 1 + Mathf.FloorToInt(elapsed / 45f);
            if (newWave != wave) { wave = newWave; hud?.SetWave(wave); }

            if (!bossSpawned && elapsed >= bossAt)
            {
                SpawnQueen();
                bossSpawned = true;
            }

            spawnTimer -= Time.deltaTime;
            if (spawnTimer <= 0 && alive.Count < maxAlive && !bossSpawned)
            {
                spawnTimer = Mathf.Lerp(startingInterval, minimumInterval, Mathf.Clamp01(elapsed / bossAt));
                int batch = 1 + Mathf.FloorToInt(elapsed / 75f);
                for (int i=0;i<batch && alive.Count<maxAlive;i++) SpawnEnemy();
            }
        }

        void SpawnEnemy()
        {
            var pool = enemies.FindAll(e => e.prefab != null && elapsed >= e.unlockAt && e.weight > 0);
            if (pool.Count == 0) return;
            float total = 0; foreach (var e in pool) total += e.weight;
            float roll = UnityEngine.Random.value * total;
            EnemyTemplate pick = pool[0];
            foreach (var e in pool) { roll -= e.weight; if (roll <= 0) { pick = e; break; } }

            Vector2 dir = UnityEngine.Random.insideUnitCircle.normalized;
            Vector3 pos = player.position + (Vector3)(dir * arenaRadius);
            var go = Instantiate(pick.prefab, pos, Quaternion.identity);
            go.SetActive(true);
            if (go.TryGetComponent<XenoEnemyArchetype>(out var ai)) ai.SetTarget(player);
            alive.Add(go);
        }

        void SpawnQueen()
        {
            if (queenPrefab == null) return;
            Vector3 pos = player.position + Vector3.up * 10f;
            var queen = Instantiate(queenPrefab, pos, Quaternion.identity);
            queen.SetActive(true);
            if (queen.TryGetComponent<XenoQueenBoss>(out var boss)) boss.SetTarget(player);
            hud?.ShowBoss("КОРОЛЕВА КСЕНО", 1, 1);
            CombatFeedback.Instance?.Kick(.65f, .45f);
        }

        void Cleanup()
        {
            for (int i=alive.Count-1;i>=0;i--) if (alive[i] == null) alive.RemoveAt(i);
        }
    }
}
