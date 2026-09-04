// Yandex Games advertising bridge for Moonfang Castle.
// Fullscreen ads are only requested at logical breaks. Rewarded ads are opt-in.
(function(){
'use strict';
let sdk=null,adOpen=false,lastFullscreen=0;
const MIN_FULLSCREEN_GAP=180000;
function saveNow(){try{if(typeof saveMeta==='function')saveMeta();}catch(e){} try{if(typeof saveRun==='function'&&typeof game!=='undefined')saveRun(game);}catch(e){} try{window.Game1CloudSave?.save();}catch(e){} window.dispatchEvent(new Event('game1-save-now'));}
function stopGame(){
  adOpen=true;
  try{sdk?.features?.GameplayAPI?.stop();}catch(e){}
  try{if(typeof AudioSys!=='undefined'&&AudioSys.ctx&&AudioSys.ctx.state==='running')AudioSys.ctx.suspend();}catch(e){}
}
function resumeGame(){
  adOpen=false;
  const playing=typeof game!=='undefined'&&game&&game.state==='play'&&!document.hidden&&document.hasFocus();
  try{if(playing)sdk?.features?.GameplayAPI?.start();else sdk?.features?.GameplayAPI?.stop();}catch(e){}
  try{if(playing&&typeof AudioSys!=='undefined')AudioSys.resume();}catch(e){}
}
function setSdk(s){if(!s||sdk===s)return;sdk=s;try{sdk.on('game_api_pause',stopGame);sdk.on('game_api_resume',resumeGame);}catch(e){}}
function getSdk(){if(window.ysdk)setSdk(window.ysdk);return sdk;}
function fullscreen(reason){
  const s=getSdk();if(!s||!s.adv||adOpen)return false;
  const now=Date.now();if(now-lastFullscreen<MIN_FULLSCREEN_GAP)return false;
  saveNow();lastFullscreen=now;
  try{s.adv.showFullscreenAdv({callbacks:{onOpen:stopGame,onClose:resumeGame,onError:resumeGame}});return true;}catch(e){resumeGame();return false;}
}
function rewarded(onReward){
  const s=getSdk();if(!s||!s.adv||adOpen)return false;
  saveNow();
  try{s.adv.showRewardedVideo({callbacks:{onOpen:stopGame,onRewarded:function(){try{if(onReward)onReward();}catch(e){}},onClose:resumeGame,onError:resumeGame}});return true;}catch(e){resumeGame();return false;}
}
window.YandexAds={setSdk,fullscreen,rewarded,isOpen:()=>adOpen};
window.addEventListener('yandex-ready',e=>setSdk(e.detail&&e.detail.ysdk));
let prevState=null;
setInterval(function(){
  if(typeof game==='undefined'||!game)return;
  const st=game.state;
  if(st!==prevState){if((st==='gameover'||st==='win')&&prevState==='play')fullscreen(st);prevState=st;}
},500);
})();
