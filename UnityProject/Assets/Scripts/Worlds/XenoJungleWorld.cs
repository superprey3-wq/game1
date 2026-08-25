using UnityEngine;

namespace ArenaSatellites.Worlds
{
    public sealed class XenoJungleWorld : MonoBehaviour
    {
        [Header("Arena")]
        [SerializeField] private Vector2 arenaSize = new(70f, 50f);
        [SerializeField] private int foliageCount = 140;
        [SerializeField] private int crystalCount = 34;
        [SerializeField] private int ruinCount = 28;
        [SerializeField] private int seed = 7319;

        [Header("Prefabs")]
        [SerializeField] private GameObject[] foliagePrefabs;
        [SerializeField] private GameObject[] crystalPrefabs;
        [SerializeField] private GameObject[] ruinPrefabs;
        [SerializeField] private GameObject groundPrefab;
        [SerializeField] private Transform decorationRoot;

        private void Awake()
        {
            if (GetComponent<World1RunBootstrap>() == null)
                gameObject.AddComponent<World1RunBootstrap>();
            Build();
        }

        [ContextMenu("Rebuild Xeno Jungle")]
        public void Build()
        {
            if (decorationRoot == null)
            {
                var root = new GameObject("XenoJungle_Decor");
                root.transform.SetParent(transform, false);
                decorationRoot = root.transform;
            }

            for (int i = decorationRoot.childCount - 1; i >= 0; i--)
            {
                var child = decorationRoot.GetChild(i).gameObject;
                if (Application.isPlaying) Destroy(child); else DestroyImmediate(child);
            }

            Random.InitState(seed);
            if (groundPrefab != null)
            {
                var ground = Instantiate(groundPrefab, transform.position, Quaternion.identity, decorationRoot);
                ground.name = "XenoJungle_Ground";
                ground.transform.localScale = new Vector3(arenaSize.x, arenaSize.y, 1f);
            }

            Scatter(foliagePrefabs, foliageCount, 0.85f, 1.35f);
            Scatter(crystalPrefabs, crystalCount, 0.8f, 1.55f);
            Scatter(ruinPrefabs, ruinCount, 0.9f, 1.7f);
        }

        private void Scatter(GameObject[] prefabs, int count, float minScale, float maxScale)
        {
            if (prefabs == null || prefabs.Length == 0) return;
            for (int i = 0; i < count; i++)
            {
                var prefab = prefabs[Random.Range(0, prefabs.Length)];
                if (prefab == null) continue;
                var p = new Vector3(
                    Random.Range(-arenaSize.x * .5f, arenaSize.x * .5f),
                    Random.Range(-arenaSize.y * .5f, arenaSize.y * .5f),
                    0f);
                var obj = Instantiate(prefab, p, Quaternion.Euler(0, 0, Random.Range(0, 360f)), decorationRoot);
                var s = Random.Range(minScale, maxScale);
                obj.transform.localScale *= s;
            }
        }
    }
}
