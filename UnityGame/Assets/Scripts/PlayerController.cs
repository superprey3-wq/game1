using UnityEngine;

namespace ArenaSatellites
{
    [RequireComponent(typeof(Rigidbody2D))]
    public sealed class PlayerController : MonoBehaviour
    {
        [SerializeField] private float moveSpeed = 5.5f;
        [SerializeField] private Transform weaponPivot;
        [SerializeField] private Camera worldCamera;

        private Rigidbody2D body;
        private Vector2 input;

        public Vector2 Facing { get; private set; } = Vector2.right;

        private void Awake()
        {
            body = GetComponent<Rigidbody2D>();
            if (worldCamera == null) worldCamera = Camera.main;
        }

        private void Update()
        {
            input = new Vector2(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical")).normalized;
            if (input.sqrMagnitude > 0.01f) Facing = input;

            if (weaponPivot != null && worldCamera != null)
            {
                var mouse = worldCamera.ScreenToWorldPoint(Input.mousePosition);
                var direction = (Vector2)(mouse - transform.position);
                if (direction.sqrMagnitude > 0.01f)
                {
                    Facing = direction.normalized;
                    weaponPivot.right = Facing;
                }
            }
        }

        private void FixedUpdate()
        {
            body.velocity = input * moveSpeed;
        }
    }
}
