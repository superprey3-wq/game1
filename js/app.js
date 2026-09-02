(async function(){
await YandexBridge.init();I18N.init(YandexBridge.lang());
const $=s=>document.querySelector(s),title=$('#title'),sub=$('#subtitle'),play=$('#play'),lang=$('#lang'),help=$('#help'),menu=$('#menu');
function text(){title.textContent=I18N.t('title');play.textContent=I18N.t('play');lang.textContent=I18N.lang==='ru'?'English':'Русский';const touch=matchMedia('(pointer:coarse)').matches;sub.textContent=touch?I18N.t('hintMobile'):I18N.t('hintPc');help.textContent=touch?I18N.t('hintMobile'):I18N.t('hintPc')}
lang.onclick=()=>I18N.set(I18N.lang==='ru'?'en':'ru');addEventListener('languagechange',text);text();Input.bindTouch();
const c=$('#game'),g=c.getContext('2d');function resize(){const d=devicePixelRatio||1;c.width=Math.round(innerWidth*d);c.height=Math.round(innerHeight*d);c.style.width=innerWidth+'px';c.style.height=innerHeight+'px';g.setTransform(d,0,0,d,0,0)}resize();addEventListener('resize',resize);
play.onclick=()=>{menu.hidden=true;$('#hud').hidden=false;YandexBridge.gameplayStart();NightWorld.start(c)};
document.addEventListener('visibilitychange',()=>{if(document.hidden)Input.clear()});YandexBridge.ready();
})();