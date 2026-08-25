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
        private float previousTimeScale = 1f;
        private bool previousAudioPause;

#if UNITY_WEBGL && !UNITY_EDITOR
        [DllImport("__Internal")]
        private static extern void ArenaShowRewardedRevive(string gameObjectName);
#endif

        private void Awake() => Instance = this;

        public void ShowReviveAd()
        {
            if (waiting) return;
            waiting = true;
            previousTimeScale = Time.timeScale;
            previousAudioPause = AudioListener.pause;
            Time.timeScale = 0f;
            AudioListener.pause = true;
#if UNITY_WEBGL && !UNITY_EDITOR
            ArenaShowRewardedRevive(gameObject.name);
#else
            Invoke(nameof(EditorGrant), .25f);
#endif
        }

        public void RewardedReviveGranted()
        {
            if (!waiting) return;
            waiting = false;
            RestoreAfterAd();
            OnRewardGranted?.Invoke();
        }

        public void RewardedReviveClosedWithoutReward()
        {
            if (!waiting) return;
            waiting = false;
            RestoreAfterAd();
            OnRewardUnavailable?.Invoke();
        }

        public void RewardedReviveError()
        {
            if (!waiting) return;
            waiting = false;
            RestoreAfterAd();
            OnRewardUnavailable?.Invoke();
        }

        private void RestoreAfterAd()
        {
            AudioListener.pause = previousAudioPause;
            Time.timeScale = previousTimeScale;
        }

#if !UNITY_WEBGL || UNITY_EDITOR
        private void EditorGrant() => RewardedReviveGranted();
#endif

        private void OnDestroy()
        {
            if (waiting) RestoreAfterAd();
            if (Instance == this) Instance = null;
        }
    }
}
