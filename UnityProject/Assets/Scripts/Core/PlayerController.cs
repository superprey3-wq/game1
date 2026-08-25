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
        Vector2 mobileMove;
        Vector2 mobileAim;
        bool mobileAimActive;

        public Vector2 Facing { get; private set; } = Vector2.right;
        public float SpeedNormalized => input.magnitude;
        public float MoveSpeedMultiplier { get; set; } = 1f;

        void Awake()
        {
            body = GetComponent<Rigidbody2D>();
            if (worldCamera == null) worldCamera = Camera.main;
        }

        public void SetMobileMove(Vector2 value) => mobileMove = Vector2.ClampMagnitude(value, 1f);
        public void SetMobileAim(Vector2 value)
        {
            mobileAim = Vector2.ClampMagnitude(value, 1f);
            mobileAimActive = mobileAim.sqrMagnitude > .04f;
        }

        void Update()
        {
            var keyboard = new Vector2(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical"));
            input = (keyboard.sqrMagnitude > .01f ? keyboard : mobileMove).normalized;

            if (mobileAimActive)
            {
                Facing = mobileAim.normalized;
            }
            else if (worldCamera != null && Input.mousePresent)
            {
                Vector3 mouse = worldCamera.ScreenToWorldPoint(Input.mousePosition);
                Vector2 aim = mouse - transform.position;
                if (aim.sqrMagnitude > .01f) Facing = aim.normalized;
            }
            else if (input.sqrMagnitude > .01f)
            {
                Facing = input;
            }

            if (weaponPivot != null) weaponPivot.right = Facing;
            if (animator != null)
            {
                animator.SetFloat("Speed", input.magnitude);
                animator.SetFloat("AimX", Facing.x);
                animator.SetFloat("AimY", Facing.y);
            }
        }

        void FixedUpdate() => body.velocity = input * moveSpeed * Mathf.Max(.1f, MoveSpeedMultiplier);
    }
}
