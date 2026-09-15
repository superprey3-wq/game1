using UnityEngine;

namespace ArenaSatellites
{
    public sealed class EnemySpawner : MonoBehaviour
    {
        [SerializeField] private EnemyChaser[] enemyPrefabs;
        [SerializeField] private EnemyChaser bossPrefab;
        [SerializeField] private Transform player;
        [SerializeField] private float spawnRadius = 12f;
        [SerializeField] private float startInterval = .7f;
        [SerializeField] private float minInterval = .18f;
        [SerializeField] private float bossEverySeconds = 120f;

        private float elapsed;
        private float spawnTimer;
        private float nextBoss;

        private void Start()
        {
            spawnTimer = .2f;
            nextBoss = bossEverySeconds;
        }

        private void Update()
        {
            if (player == null || enemyPrefabs == null || enemyPrefabs.Length == 0) return;
            elapsed += Time.deltaTime;
            spawnTimer -= Time.deltaTime;

            if (spawnTimer <= 0f)
            {
                Spawn(enemyPrefabs[Random.Range(0, enemyPrefabs.Length)], false);
                float t = Mathf.Clamp01(elapsed / 600f);
                spawnTimer = Mathf.Lerp(startInterval, minInterval, t);
            }

            if (bossPrefab != null && elapsed >= nextBoss)
            {
                Spawn(bossPrefab, true);
                nextBoss += bossEverySeconds;
            }
        }

        private void Spawn(EnemyChaser prefab, bool boss)
        {
            float a = Random.value * Mathf.PI * 2f;
            Vector3 pos = player.position + new Vector3(Mathf.Cos(a), Mathf.Sin(a)) * spawnRadius;
            var enemy = Instantiate(prefab, pos, Quaternion.identity);
            enemy.SetTarget(player);
            if (boss) enemy.transform.localScale *= 2.2f;
        }
    }
}
