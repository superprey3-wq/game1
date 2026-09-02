(async function(){
await YandexBridge.init();
I18N.init(YandexBridge.lang());
const $=s=>document.querySelector(s), title=$('#title'),sub=$('#subtitle'),play=$('#play'),lang=$('#lang'),help=$('#help'),menu=$('#menu');
function text(){title.textContent=I18N.t('title');play.textContent=I18N.t('play');lang.textContent=I18N.lang==='ru'?'English':'Русский';const touch=matchMedia('(pointer:coarse)').matches;sub.textContent=touch?I18N.t('hintMobile'):I18N.t('hintPc');help.textContent=touch?I18N.t('hintMobile'):I18N.t('hintPc');}
lang.onclick=()=>I18N.set(I18N.lang==='ru'?'en':'ru');addEventListener('languagechange',text);text();Input.bindTouch();
play.onclick=()=>{menu.hidden=true;$('#hud').hidden=false;YandexBridge.gameplayStart();window.dispatchEvent(new Event('night-hunt-start'))};
addEventListener('night-hunt-start',()=>{const c=$('#game'),g=c.getContext('2d');function resize(){const d=devicePixelRatio||1;c.width=Math.round(innerWidth*d);c.height=Math.round(innerHeight*d);c.style.width=innerWidth+'px';c.style.height=innerHeight+'px';g.setTransform(d,0,0,d,0,0)}resize();addEventListener('resize',resize);let x=innerWidth*.5,y=innerHeight*.55,v=0;function frame(){g.clearRect(0,0,innerWidth,innerHeight);const grad=g.createLinearGradient(0,0,0,innerHeight);grad.addColorStop(0,'#100d20');grad.addColorStop(1,'#05050a');g.fillStyle=grad;g.fillRect(0,0,innerWidth,innerHeight);if(Input.held.left)x-=3;if(Input.held.right)x+=3;if(Input.consume('jump')&&y>=innerHeight*.7)v=-9;v+=.45;y+=v;if(y>innerHeight*.7){y=innerHeight*.7;v=0}g.fillStyle='#bfc8dc';g.fillRect(x-10,y-28,20,28);g.fillStyle='#77718f';g.fillRect(x-16,y,32,6);requestAnimationFrame(frame)}frame();YandexBridge.ready()});
YandexBridge.ready();
})();
