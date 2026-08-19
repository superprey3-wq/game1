const layer=document.createElement('div');layer.id='screenFx';document.body.appendChild(layer);
function pulse(color='#fff',kind='ring',text=''){
 const el=document.createElement('div');el.className=`screenPulse ${kind}`;el.style.setProperty('--fx',color);if(text){const t=document.createElement('div');t.className='screenFxText';t.textContent=text;el.appendChild(t)}layer.appendChild(el);setTimeout(()=>el.remove(),900)
}
addEventListener('arena:bossSkill',e=>{const d=e.detail||{};pulse(d.color||'#fff',d.pattern==='charge'?'slash':'ring','')});
addEventListener('arena:weaponUpgrade',e=>{const d=e.detail||{};if(d.evolved)pulse('#ffd75e','evolution','EVOLUTION!');else{const el=document.createElement('div');el.className='cornerSpark';el.textContent=`▲ ${d.level||''}`;layer.appendChild(el);setTimeout(()=>el.remove(),500)}});
