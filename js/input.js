(function(){
const held={left:false,right:false,up:false,down:false,jump:false,attack:false,dash:false,interact:false};
const pressed={};
const map={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',Space:'jump',KeyJ:'attack',KeyZ:'attack',KeyK:'dash',KeyX:'dash',KeyE:'interact',Escape:'pause',KeyP:'pause'};
function set(k,v){if(!k)return;if(v&&!held[k])pressed[k]=true;held[k]=v}
addEventListener('keydown',e=>{const k=map[e.code];if(k){e.preventDefault();set(k,true)}} ,{passive:false});
addEventListener('keyup',e=>{const k=map[e.code];if(k){e.preventDefault();set(k,false)}} ,{passive:false});
function bindTouch(){document.querySelectorAll('[data-key]').forEach(el=>{const k=el.dataset.key;const on=e=>{e.preventDefault();set(k,true);el.classList.add('on')};const off=e=>{e.preventDefault();set(k,false);el.classList.remove('on')};el.addEventListener('pointerdown',on,{passive:false});el.addEventListener('pointerup',off,{passive:false});el.addEventListener('pointercancel',off,{passive:false});el.addEventListener('pointerleave',off,{passive:false})})}
window.Input={held,pressed,bindTouch,consume(k){const v=!!pressed[k];delete pressed[k];return v},clear(){for(const k in held)held[k]=false;for(const k in pressed)delete pressed[k]}};
addEventListener('blur',()=>Input.clear());
})();
