using System.Collections;
using UnityEngine;

namespace ArenaSatellites.Bosses
{
    public sealed class BossTelegraph : MonoBehaviour
    {
        [SerializeField] private SpriteRenderer ring;
        [SerializeField] private float pulseSpeed = 8f;
        [SerializeField] private float minAlpha = .18f;
        [SerializeField] private float maxAlpha = .75f;

        private void Update()
        {
            if (ring == null) return;
            var c = ring.color;
            c.a = Mathf.Lerp(minAlpha,maxAlpha,(Mathf.Sin(Time.time*pulseSpeed)+1f)*.5f);
            ring.color = c;
        }

        public IEnumerator Flash(float duration)
        {
            if (ring == null) yield break;
            float t=0f;
            var start=ring.transform.localScale;
            while(t<duration)
            {
                t+=Time.deltaTime;
                float k=Mathf.Clamp01(t/duration);
                ring.transform.localScale=start* Mathf.Lerp(.7f,1.35f,k);
                yield return null;
            }
            ring.transform.localScale=start;
        }
    }
}
