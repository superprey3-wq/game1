using UnityEngine;

namespace ArenaSatellites
{
    [RequireComponent(typeof(Rigidbody2D))]
    public sealed class PlayerController : MonoBehaviour
    {
        [SerializeField] float moveSpeed = 5.8f;
        [SerializeField] Transform weaponPivot;
        [SerializeField] Camera worldCamera;
        [SerializeField] Animator animator;

        Rigidbody2D body;
        Vector2 input;
        public Vector2 Facing { get; private set; } = Vector2.right;
        public float SpeedNormalized => input.magnitude;

        void Awake()
        {
            body = GetComponent<Rigidbody2D>();
            if (worldCamera == null) worldCamera = Camera.main;
        }

        void Update()
        {
            input = new Vector2(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical")).normalized;
            if (worldCamera != null)
            {
                Vector3 mouse = worldCamera.ScreenToWorldPoint(Input.mousePosition);
                Vector2 aim = mouse - transform.position;
                if (aim.sqrMagnitude > .01f) Facing = aim.normalized;
            }
            else if (input.sqrMagnitude > .01f) Facing = input;

            if (weaponPivot != null) weaponPivot.right = Facing;
            if (animator != null)
            {
                animator.SetFloat("Speed", input.magnitude);
                animator.SetFloat("AimX", Facing.x);
                animator.SetFloat("AimY", Facing.y);
            }
        }

        void FixedUpdate() => body.velocity = input * moveSpeed;
    }
}
