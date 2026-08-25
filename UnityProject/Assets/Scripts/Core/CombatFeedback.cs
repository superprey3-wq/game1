using UnityEngine;

namespace ArenaSatellites
{
    public sealed class CombatFeedback : MonoBehaviour
    {
        public static CombatFeedback Instance { get; private set; }
        [SerializeField] Transform cameraRig;
        [SerializeField] float returnSpeed = 18f;
        Vector3 baseLocal;
        float amplitude;
        float until;

        void Awake()
        {
            Instance = this;
            if (cameraRig == null && Camera.main != null) cameraRig = Camera.main.transform;
            if (cameraRig != null) baseLocal = cameraRig.localPosition;
        }

        public void Kick(float strength, float duration)
        {
            amplitude = Mathf.Max(amplitude, strength);
            until = Mathf.Max(until, Time.time + duration);
        }

        void LateUpdate()
        {
            if (cameraRig == null) return;
            if (Time.time < until)
            {
                Vector2 jitter = Random.insideUnitCircle * amplitude;
                cameraRig.localPosition = baseLocal + new Vector3(jitter.x, jitter.y, 0f);
            }
            else
            {
                cameraRig.localPosition = Vector3.Lerp(cameraRig.localPosition, baseLocal, Time.deltaTime * returnSpeed);
                amplitude = Mathf.Lerp(amplitude, 0f, Time.deltaTime * 12f);
            }
        }
    }
}
