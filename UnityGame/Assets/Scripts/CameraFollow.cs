using UnityEngine;

namespace ArenaSatellites
{
    public sealed class CameraFollow : MonoBehaviour
    {
        [SerializeField] private Transform target;
        [SerializeField] private float smooth = 8f;
        [SerializeField] private Vector3 offset = new Vector3(0f, 0f, -10f);

        public void SetTarget(Transform value) => target = value;

        private void LateUpdate()
        {
            if (target == null) return;
            Vector3 wanted = target.position + offset;
            transform.position = Vector3.Lerp(transform.position, wanted, 1f - Mathf.Exp(-smooth * Time.deltaTime));
        }
    }
}
