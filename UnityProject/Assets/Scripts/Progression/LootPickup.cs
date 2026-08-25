using ArenaSatellites.Data;
using UnityEngine;

namespace ArenaSatellites.Progression
{
    public enum LootKind { XP, Crystal, Gear }

    [RequireComponent(typeof(Collider2D))]
    public sealed class LootPickup : MonoBehaviour
    {
        [SerializeField] private LootKind kind;
        [SerializeField] private float xp = 6f;
        [SerializeField] private int crystals = 1;
        [SerializeField] private float magnetSpeed = 9f;
        private Transform player;

        public void Configure(LootKind lootKind, float xpValue = 6f, int crystalValue = 1)
        {
            kind = lootKind; xp = xpValue; crystals = crystalValue;
        }

        private void Start()
        {
            var controller = FindFirstObjectByType<ArenaSatellites.PlayerController>();
            if (controller != null) player = controller.transform;
        }

        private void Update()
        {
            if (player == null) return;
            float d = Vector2.Distance(transform.position, player.position);
            if (d < 2.8f)
                transform.position = Vector3.MoveTowards(transform.position, player.position, magnetSpeed * Time.deltaTime);
        }

        private void OnTriggerEnter2D(Collider2D other)
        {
            if (other.GetComponent<ArenaSatellites.PlayerController>() == null) return;
            if (kind == LootKind.XP) RunProgression.Instance?.AddXP(xp);
            else if (kind == LootKind.Crystal) RunProgression.Instance?.AddCrystals(crystals);
            else
            {
                var inventory = FindFirstObjectByType<EquipmentInventory>();
                if (inventory != null)
                {
                    var slots = (GearSlot[])System.Enum.GetValues(typeof(GearSlot));
                    inventory.EquipRandomDrop(slots[Random.Range(0, slots.Length)]);
                }
                RunProgression.Instance?.AddCrystals(2);
            }
            Destroy(gameObject);
        }
    }
}
