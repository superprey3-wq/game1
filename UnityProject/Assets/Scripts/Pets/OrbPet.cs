using UnityEngine;

namespace ArenaSatellites.Pets
{
    public sealed class OrbPet : MonoBehaviour
    {
        [SerializeField] private Transform owner;
        [SerializeField] private float orbitRadius = 1.7f;
        [SerializeField] private float orbitSpeed = 1.8f;
        [SerializeField] private float pickupRadius = 3.5f;
        [SerializeField] private LayerMask pickupMask;

        private float angle;

        public void SetOwner(Transform value) => owner = value;

        private void Update()
        {
            if (owner == null) return;
            angle += orbitSpeed * Time.deltaTime;
            var offset = new Vector3(Mathf.Cos(angle), Mathf.Sin(angle) * .55f, 0f) * orbitRadius;
            transform.position = Vector3.Lerp(transform.position, owner.position + offset, 10f * Time.deltaTime);

            var hits = Physics2D.OverlapCircleAll(transform.position, pickupRadius, pickupMask);
            foreach (var hit in hits)
            {
                if (hit == null) continue;
                hit.transform.position = Vector3.MoveTowards(hit.transform.position, owner.position, 8f * Time.deltaTime);
            }
        }
    }
}
