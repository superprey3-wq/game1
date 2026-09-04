// Yandex Games bootstrap: initialize the official SDK once, use SDK language, and report Game Ready.
(function(){
'use strict';
let readySent=false;
function normalizeLang(code){return String(code||'').toLowerCase().startsWith('ru')?'ru':'en';}
function applyLanguage(sdk){
  try{
    // Requirement 2.14: language must come from the Yandex Games SDK environment at launch.
    const sdkLang=sdk&&sdk.environment&&sdk.environment.i18n&&sdk.environment.i18n.lang;
    if(sdkLang){
      const lang=normalizeLang(sdkLang);
      window.GAME_LANG=lang;
      try{localStorage.setItem('game1-lang',lang);}catch(e){}
      document.documentElement.lang=lang;
      window.dispatchEvent(new CustomEvent('game1-language-ready',{detail:{lang:lang,source:'yandex-sdk'}}));
    }
  }catch(e){console.warn('Yandex language detection unavailable',e);}
}
function gameReady(sdk){
  if(readySent||!sdk)return;
  const send=function(){
    if(readySent)return;
    try{
      const api=sdk.features&&sdk.features.LoadingAPI;
      if(api&&typeof api.ready==='function'){api.ready();readySent=true;}
    }catch(e){console.warn('Yandex Game Ready failed',e);}
  };
  if(document.readyState==='complete')requestAnimationFrame(send);
  else addEventListener('load',function(){requestAnimationFrame(send);},{once:true});
}
async function init(){
  if(window.ysdk){applyLanguage(window.ysdk);gameReady(window.ysdk);return window.ysdk;}
  if(!window.YaGames||typeof window.YaGames.init!=='function')return null;
  try{
    const sdk=await window.YaGames.init();
    window.ysdk=sdk;
    applyLanguage(sdk);
    window.dispatchEvent(new CustomEvent('yandex-ready',{detail:{ysdk:sdk}}));
    gameReady(sdk);
    return sdk;
  }catch(e){console.warn('Yandex SDK init failed',e);return null;}
}
window.__YANDEX_INIT_PROMISE=init();
})();
