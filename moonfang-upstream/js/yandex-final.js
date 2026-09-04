// Final Yandex Games lifecycle coordinator.
(function(){
'use strict';
let sdk=null,lastPlay=null;
function syncGameplay(){
  if(!sdk)return;
  const play=typeof game!=='undefined'&&game&&game.state==='play'&&!document.hidden&&document.hasFocus()&&!(window.YandexAds&&window.YandexAds.isOpen());
  if(play===lastPlay)return;lastPlay=play;
  try{const api=sdk.features&&sdk.features.GameplayAPI;if(api)(play?api.start():api.stop());}catch(e){}
  if(!play){try{if(typeof AudioSys!=='undefined'&&AudioSys.ctx&&AudioSys.ctx.state==='running')AudioSys.ctx.suspend();}catch(e){}}
}
function attach(s){
  if(!s||sdk===s)return;sdk=s;window.ysdk=s;
  window.dispatchEvent(new CustomEvent('yandex-ready',{detail:{ysdk:s}}));
  syncGameplay();
}
function detect(){if(window.ysdk)attach(window.ysdk);}
document.addEventListener('visibilitychange',syncGameplay);
addEventListener('blur',syncGameplay);addEventListener('focus',syncGameplay);
setInterval(()=>{detect();syncGameplay();},250);
// Keep right click / long press from opening browser UI over the game.
document.addEventListener('contextmenu',e=>e.preventDefault(),{capture:true});
})();
