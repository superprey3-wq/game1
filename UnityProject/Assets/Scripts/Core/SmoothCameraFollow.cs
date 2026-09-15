using UnityEngine;

namespace ArenaSatellites
{
    public sealed class SmoothCameraFollow : MonoBehaviour
    {
        [SerializeField] Transform target;
        [SerializeField] float smoothTime = .16f;
        [SerializeField] Vector3 offset = new(0, 0, -10);
        Vector3 velocity;

        public void SetTarget(Transform value) => target = value;

        void LateUpdate()
        {
            if (target == null) return;
            Vector3 desired = target.position + offset;
            transform.position = Vector3.SmoothDamp(transform.position, desired, ref velocity, smoothTime);
        }
    }
}
