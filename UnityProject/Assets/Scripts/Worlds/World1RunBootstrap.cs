using ArenaSatellites.Platform;
using ArenaSatellites.Progression;
using ArenaSatellites.UI;
using UnityEngine;

namespace ArenaSatellites.Worlds
{
    public sealed class World1RunBootstrap : MonoBehaviour
    {
        private void Awake()
        {
            var player = FindFirstObjectByType<PlayerController>();
            if (player != null)
            {
                if (player.GetComponent<PlayerHealth>() == null) player.gameObject.AddComponent<PlayerHealth>();
                if (player.GetComponent<PlayerRuntimeStats>() == null) player.gameObject.AddComponent<PlayerRuntimeStats>();
            }

            var inventory = FindFirstObjectByType<EquipmentInventory>();
            if (inventory == null)
            {
                var systems = GameObject.Find("Run Systems") ?? new GameObject("Run Systems");
                inventory = systems.AddComponent<EquipmentInventory>();
            }

            if (player != null)
            {
                var stats = player.GetComponent<PlayerRuntimeStats>();
                inventory.OnChanged += () => stats.Apply(inventory);
                stats.Apply(inventory);
            }

            if (FindFirstObjectByType<RewardedReviveService>() == null)
                new GameObject("Yandex Rewarded Revive").AddComponent<RewardedReviveService>();

            var canvas = FindFirstObjectByType<Canvas>();
            if (canvas != null)
            {
                if (canvas.GetComponent<World1RuntimeHUD>() == null) canvas.gameObject.AddComponent<World1RuntimeHUD>();
                if (canvas.GetComponent<DeathReviveUI>() == null) canvas.gameObject.AddComponent<DeathReviveUI>();
            }
        }
    }
}
