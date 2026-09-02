// game1 platform/input patch: reliable combat, controls menu, RU/EN shell, Yandex lifecycle.
(function(){
'use strict';
const cv=document.getElementById('screen');
document.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('selectstart',e=>e.preventDefault());
if(cv) cv.tabIndex=0;

function combatReady(){return typeof game!=='undefined'&&game&&game.state==='play'&&typeof keys!=='undefined'&&typeof pending!=='undefined';}
function attack(){if(!combatReady())return;keys.attack=true;pending.whip=true;try{AudioSys.resume();}catch(e){}}
function attackUp(){if(typeof keys!=='undefined')keys.attack=false;}
function jump(){if(!combatReady())return;pending.jump=true;}
function dash(){if(!combatReady())return;pending.dash=true;}
function heal(){if(!combatReady())return;pending.heal=true;}

addEventListener('keydown',e=>{
 const k=(e.key||'').toLowerCase();
 if(['f','z','j'].includes(k)){attack();e.preventDefault();}
 if(k===' '){jump();e.preventDefault();}
 if(k==='shift'){dash();e.preventDefault();}
});
addEventListener('keyup',e=>{const k=(e.key||'').toLowerCase();if(['f','z','j'].includes(k))attackUp();});
if(cv){
 cv.addEventListener('pointerdown',e=>{cv.focus();if(e.pointerType==='mouse'){e.preventDefault();if(e.button===0)attack();if(e.button===2)dash();}});
 addEventListener('pointerup',e=>{if(e.pointerType==='mouse'&&e.button===0)attackUp();});
}

const dict={
 ru:{controls:'УПРАВЛЕНИЕ',move:'Движение',attack:'Атака',jump:'Прыжок',dash:'Рывок',heal:'Лечение',pause:'Пауза / меню',sub:'Доп. оружие',pc:'ПК',mobile:'ТЕЛЕФОН',close:'Закрыть',language:'Язык',hint:'Нажми ? — управление'},
 en:{controls:'CONTROLS',move:'Movement',attack:'Attack',jump:'Jump',dash:'Dash',heal:'Heal',pause:'Pause / menu',sub:'Sub-weapon',pc:'PC',mobile:'MOBILE',close:'Close',language:'Language',hint:'Press ? for controls'}
};
let lang=(localStorage.getItem('game1-lang')||((navigator.language||'en').toLowerCase().startsWith('ru')?'ru':'en'));
window.GAME_LANG=lang;
const btn=document.createElement('button');btn.textContent='?';btn.setAttribute('aria-label','Controls');btn.style.cssText='position:fixed;right:10px;top:10px;z-index:100;width:38px;height:38px;border:1px solid #8a6d2f;background:#100c1dcc;color:#ffe080;font:bold 20px monospace;cursor:pointer;border-radius:5px';
const panel=document.createElement('div');panel.style.cssText='display:none;position:fixed;inset:0;z-index:99;background:#05040bd9;color:#e8e4d8;font:16px monospace;align-items:center;justify-content:center;line-height:1.65';
function panelHTML(){const t=dict[lang];return '<div style="width:min(620px,88vw);max-height:82vh;overflow:auto;background:#0d0918;border:2px solid #8a6d2f;padding:24px"><div style="font-size:26px;color:#ffe080;margin-bottom:12px">'+t.controls+'</div><b>'+t.pc+'</b><br>'+t.move+': A/D, ←/→<br>'+t.attack+': Z / J / F / ЛКМ<br>'+t.jump+': X / K / SPACE<br>'+t.dash+': C / L / SHIFT / ПКМ<br>'+t.heal+': H<br>'+t.sub+': ↑ + '+t.attack+'<br>'+t.pause+': ENTER / ESC<br><br><b>'+t.mobile+'</b><br>Экранные кнопки / On-screen buttons<br><br>'+t.language+': <button id="g1lang" style="font:inherit;padding:5px 12px">'+(lang==='ru'?'English':'Русский')+'</button> &nbsp; <button id="g1close" style="font:inherit;padding:5px 12px">'+t.close+'</button></div>';}
function renderPanel(){panel.innerHTML=panelHTML();panel.querySelector('#g1lang').onclick=()=>{lang=lang==='ru'?'en':'ru';window.GAME_LANG=lang;localStorage.setItem('game1-lang',lang);renderPanel();};panel.querySelector('#g1close').onclick=()=>{panel.style.display='none';yStop(false);};}
btn.onclick=()=>{renderPanel();panel.style.display='flex';yStop(true);};document.body.append(panel,btn);
addEventListener('keydown',e=>{if(e.key==='?'||e.key==='/'){btn.click();}if(e.key==='Escape'&&panel.style.display==='flex'){panel.style.display='none';yStop(false);}});

let ysdk=null,ready=false;
async function initYandex(){
 if(typeof YaGames==='undefined')return;
 try{ysdk=await YaGames.init();window.ysdk=ysdk;const ylang=ysdk.environment&&ysdk.environment.i18n&&ysdk.environment.i18n.lang;if(!localStorage.getItem('game1-lang')&&ylang){lang=ylang==='ru'?'ru':'en';window.GAME_LANG=lang;}setTimeout(()=>{if(!ready&&ysdk&&ysdk.features&&ysdk.features.LoadingAPI){ysdk.features.LoadingAPI.ready();ready=true;}},0);}catch(e){console.warn('Yandex SDK:',e);}
}
function yStop(stop){try{if(ysdk&&ysdk.features&&ysdk.features.GameplayAPI){stop?ysdk.features.GameplayAPI.stop():ysdk.features.GameplayAPI.start();}}catch(e){}try{if(stop&&typeof AudioSys!=='undefined')AudioSys.stopMusic();else if(!stop&&typeof AudioSys!=='undefined')AudioSys.resume();}catch(e){}}
window.Game1Yandex={init:initYandex,stop:()=>yStop(true),start:()=>yStop(false)};
document.addEventListener('visibilitychange',()=>yStop(document.hidden));addEventListener('blur',()=>yStop(true));addEventListener('focus',()=>{if(!document.hidden)yStop(false);});
initYandex();
})();
