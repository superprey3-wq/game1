using System;
using System.Runtime.InteropServices;
using UnityEngine;

namespace ArenaSatellites.Platform
{
    public sealed class RewardedReviveService : MonoBehaviour
    {
        public static RewardedReviveService Instance { get; private set; }

        public event Action OnRewardGranted;
        public event Action OnRewardUnavailable;

        private bool waiting;

#if UNITY_WEBGL && !UNITY_EDITOR
        [DllImport("__Internal")]
        private static extern void ArenaShowRewardedRevive(string gameObjectName);
#endif

        private void Awake()
        {
            Instance = this;
        }

        public void ShowReviveAd()
        {
            if (waiting) return;
            waiting = true;
#if UNITY_WEBGL && !UNITY_EDITOR
            ArenaShowRewardedRevive(gameObject.name);
#else
            // Editor/dev fallback: emulate a completed rewarded ad so the revive loop can be tested.
            Invoke(nameof(EditorGrant), .25f);
#endif
        }

        public void RewardedReviveGranted()
        {
            if (!waiting) return;
            waiting = false;
            OnRewardGranted?.Invoke();
        }

        public void RewardedReviveClosedWithoutReward()
        {
            if (!waiting) return;
            waiting = false;
            OnRewardUnavailable?.Invoke();
        }

        public void RewardedReviveError()
        {
            if (!waiting) return;
            waiting = false;
            OnRewardUnavailable?.Invoke();
        }

#if !UNITY_WEBGL || UNITY_EDITOR
        private void EditorGrant() => RewardedReviveGranted();
#endif

        private void OnDestroy()
        {
            if (Instance == this) Instance = null;
        }
    }
}
