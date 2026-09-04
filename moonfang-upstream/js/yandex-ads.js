// Yandex Games advertising bridge for Moonfang Castle.
// Fullscreen ads are only requested at logical breaks. Rewarded ads are opt-in.
(function(){
'use strict';
let sdk=null, adOpen=false, lastFullscreen=0;
const MIN_FULLSCREEN_GAP=180000;
function stopGame(){
  adOpen=true;
  try{ if(sdk&&sdk.features&&sdk.features.GameplayAPI) sdk.features.GameplayAPI.stop(); }catch(e){}
  try{ if(typeof AudioSys!=='undefined'&&AudioSys.ctx&&AudioSys.ctx.state==='running') AudioSys.ctx.suspend(); }catch(e){}
}
function resumeGame(){
  adOpen=false;
  try{ if(typeof game!=='undefined'&&game&&game.state==='play'&&sdk&&sdk.features&&sdk.features.GameplayAPI) sdk.features.GameplayAPI.start(); }catch(e){}
  try{ if(typeof game!=='undefined'&&game&&game.state==='play'&&typeof AudioSys!=='undefined') AudioSys.resume(); }catch(e){}
}
function setSdk(s){
  if(!s||sdk===s)return;
  sdk=s;
  try{sdk.on('game_api_pause',stopGame);sdk.on('game_api_resume',resumeGame);}catch(e){}
}
function getSdk(){
  if(window.ysdk)setSdk(window.ysdk);
  return sdk;
}
function fullscreen(reason){
  const s=getSdk();
  if(!s||!s.adv||adOpen)return false;
  const now=Date.now();
  if(now-lastFullscreen<MIN_FULLSCREEN_GAP)return false;
  lastFullscreen=now;
  try{
    s.adv.showFullscreenAdv({callbacks:{
      onOpen:stopGame,
      onClose:resumeGame,
      onError:resumeGame
    }});
    return true;
  }catch(e){resumeGame();return false;}
}
function rewarded(onReward){
  const s=getSdk();
  if(!s||!s.adv||adOpen)return false;
  let rewarded=false;
  try{
    s.adv.showRewardedVideo({callbacks:{
      onOpen:stopGame,
      onRewarded:function(){rewarded=true;try{if(onReward)onReward();}catch(e){}},
      onClose:resumeGame,
      onError:resumeGame
    }});
    return true;
  }catch(e){resumeGame();return false;}
}
window.YandexAds={setSdk,fullscreen,rewarded,isOpen:()=>adOpen};
window.addEventListener('yandex-ready',e=>setSdk(e.detail&&e.detail.ysdk));
// Safe logical breaks: game-over / victory. Never interrupt active play.
let prevState=null;
setInterval(function(){
  if(typeof game==='undefined'||!game)return;
  const st=game.state;
  if(st!==prevState){
    if((st==='gameover'||st==='win')&&prevState==='play') fullscreen(st);
    prevState=st;
  }
},500);
})();
