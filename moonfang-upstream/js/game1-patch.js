// game1 integration patch: RU UI layer + extra PC controls + browser polish.
(function(){
  'use strict';
  // Prevent browser gestures/context menu from stealing combat input.
  document.addEventListener('contextmenu', e => e.preventDefault());

  // Extra intuitive PC controls: left mouse/F = attack, right mouse = dash.
  // Moonfang's native Z/J attack remains unchanged.
  const send = (type, key) => window.dispatchEvent(new KeyboardEvent(type,{key,bubbles:true,cancelable:true}));
  window.addEventListener('keydown', e => {
    if (e.key && e.key.toLowerCase() === 'f' && typeof game !== 'undefined' && game.state === 'play') {
      keys.attack = true; pending.whip = true; try{AudioSys.resume();}catch(_){}
    }
  });
  window.addEventListener('keyup', e => { if (e.key && e.key.toLowerCase() === 'f' && typeof keys !== 'undefined') keys.attack=false; });
  const cv=document.getElementById('screen');
  if(cv){
    cv.tabIndex=0;
    cv.addEventListener('pointerdown',e=>{
      cv.focus();
      if(e.pointerType==='mouse'){
        e.preventDefault();
        try{AudioSys.resume();}catch(_){}
        if(e.button===0){ keys.attack=true; pending.whip=true; }
        if(e.button===2){ pending.dash=true; }
      }
    });
    window.addEventListener('pointerup',e=>{ if(e.pointerType==='mouse'&&e.button===0) keys.attack=false; });
    cv.focus();
  }

  // Small RU/EN switch. Full data translation will be expanded from this layer.
  let lang=(localStorage.getItem('game1-lang')||((navigator.language||'ru').toLowerCase().startsWith('ru')?'ru':'en'));
  const box=document.createElement('div');
  box.id='game1-lang';
  box.style.cssText='position:fixed;left:10px;bottom:8px;z-index:80;font:12px monospace;color:#d8d2ef;background:#08060fcc;border:1px solid #4b3b70;padding:6px 9px;line-height:1.45;pointer-events:auto;border-radius:4px';
  const render=()=>{
    if(lang==='ru') box.innerHTML='<b>RU</b> · Атака: Z / J / F / ЛКМ · Прыжок: X / K / Пробел · Рывок: C / L / ПКМ<br>ENTER — начать/пауза · <span style="color:#ffe080;cursor:pointer">ENGLISH</span>';
    else box.innerHTML='<b>EN</b> · Attack: Z / J / F / LMB · Jump: X / K / Space · Dash: C / L / RMB<br>ENTER — start/pause · <span style="color:#ffe080;cursor:pointer">РУССКИЙ</span>';
  };
  box.addEventListener('click',()=>{lang=lang==='ru'?'en':'ru';localStorage.setItem('game1-lang',lang);render();});
  render(); document.body.appendChild(box);

  // Pause expensive gameplay/audio work while the tab is hidden.
  document.addEventListener('visibilitychange',()=>{ try{ if(document.hidden) AudioSys.stopMusic(); else AudioSys.resume(); }catch(_){} });
})();
