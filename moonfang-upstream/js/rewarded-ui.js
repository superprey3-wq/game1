// Optional rewarded-ad bonus UI. Reward is explicit and never required to continue.
(function(){
'use strict';
const ru=()=>String(window.GAME_LANG||navigator.language||'en').toLowerCase().startsWith('ru');
const b=document.createElement('button');
b.id='reward-ad';
b.type='button';
b.textContent=ru()?'СМОТРЕТЬ РЕКЛАМУ — +25 САМОЦВЕТОВ':'WATCH AD — +25 GEMS';
b.setAttribute('aria-label',b.textContent);
Object.assign(b.style,{position:'fixed',left:'50%',bottom:'18px',transform:'translateX(-50%)',zIndex:'70',padding:'10px 14px',border:'1px solid #8b73d8',borderRadius:'8px',background:'rgba(20,14,38,.92)',color:'#f1eaff',font:'bold 13px monospace',cursor:'pointer',display:'none'});
document.body.appendChild(b);
function eligible(){
  if(typeof game==='undefined'||!game)return false;
  return game.state==='gameover'||game.state==='win'||game.state==='title';
}
function addReward(){
  try{
    if(typeof meta!=='undefined'&&meta){
      if(typeof meta.gems==='number') meta.gems+=25;
      else if(typeof meta.currency==='number') meta.currency+=25;
      else return;
      if(typeof saveMeta==='function')saveMeta();
      window.dispatchEvent(new Event('game1-save-now'));
      b.textContent=ru()?'+25 САМОЦВЕТОВ ПОЛУЧЕНО':'+25 GEMS RECEIVED';
      b.disabled=true;
      setTimeout(()=>{b.disabled=false;b.textContent=ru()?'СМОТРЕТЬ РЕКЛАМУ — +25 САМОЦВЕТОВ':'WATCH AD — +25 GEMS';},30000);
    }
  }catch(e){}
}
b.addEventListener('click',function(){
  if(b.disabled||!eligible()||!window.YandexAds)return;
  const started=window.YandexAds.rewarded(addReward);
  if(!started){b.textContent=ru()?'РЕКЛАМА СЕЙЧАС НЕДОСТУПНА':'AD NOT AVAILABLE';setTimeout(()=>b.textContent=ru()?'СМОТРЕТЬ РЕКЛАМУ — +25 САМОЦВЕТОВ':'WATCH AD — +25 GEMS',1800);}
});
setInterval(()=>{b.style.display=eligible()?'block':'none';},300);
window.addEventListener('game1-language',()=>{b.textContent=ru()?'СМОТРЕТЬ РЕКЛАМУ — +25 САМОЦВЕТОВ':'WATCH AD — +25 GEMS';});
})();
