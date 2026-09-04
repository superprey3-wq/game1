// Yandex Games preflight: delay Game Ready until the page is actually interactive.
(function(){
'use strict';
window.__G1_BASE_TEXT={drawText:window.drawText,drawTextShadow:window.drawTextShadow,drawTextCentered:window.drawTextCentered};
let pageReady=document.readyState==='complete';
addEventListener('load',()=>{pageReady=true;},{once:true});
function wrapSdk(sdk){
  if(!sdk||sdk.__g1Preflight)return sdk;
  try{
    const api=sdk.features&&sdk.features.LoadingAPI;
    if(api&&typeof api.ready==='function'){
      const real=api.ready.bind(api); let sent=false,requested=false;
      api.ready=function(){requested=true; if(pageReady&&!sent){sent=true;requestAnimationFrame(()=>real());}};
      addEventListener('load',()=>{if(requested&&!sent){sent=true;requestAnimationFrame(()=>real());}},{once:true});
    }
    Object.defineProperty(sdk,'__g1Preflight',{value:true});
  }catch(e){}
  return sdk;
}
function hook(){
  if(!window.YaGames||typeof YaGames.init!=='function'||YaGames.init.__g1)return false;
  const real=YaGames.init.bind(YaGames);
  const fn=function(){return real.apply(null,arguments).then(wrapSdk);}; fn.__g1=true; YaGames.init=fn; return true;
}
if(!hook()){let n=0;const t=setInterval(()=>{if(hook()||++n>200)clearInterval(t);},25);}
})();
