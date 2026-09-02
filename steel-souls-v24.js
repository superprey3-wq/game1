'use strict';

document.title='Skybound Frog — Steel & Souls: Forge & Loot';
const m24=document.querySelector('#menu .panel p');
if(m24)m24.textContent='FORGE & LOOT — исправлено движение героя влево, новые враги, больше монет и редкого лута, а в каждом мире появился торговец-кузнец для усиления оружия.';

// ---------- Hero: fix left-facing render bug from v23 ----------
function drawHeroKnight24(){
 if(!p)return;if(p.inv>0&&Math.floor(p.inv*12)%2)return;
 const now=performance.now();let arr=hero23.idle,idx=Math.floor(now/115)%arr.length;
 if(p.attack){const combo=p.attack.combo||1;arr=combo%2===0?hero23.attack2:hero23.attack1;idx=Math.min(arr.length-1,Math.floor(clamp(p.attack.t/p.attack.dur,0,.999)*arr.length));}
 else if(!p.on){arr=p.vy<0?hero23.jump:hero23.fall;idx=Math.min(arr.length-1,Math.floor(Math.abs(p.vy)/240));}
 else if(Math.abs(p.vx)>28){arr=hero23.run;idx=Math.floor(now/82)%arr.length;}
 const im=pick23(arr,idx)||pick23(hero23.idle,0);
 const targetH=108,targetW=targetH*(100/55),x=p.x+p.w/2-targetW/2,y=p.y+p.h-targetH+8;
 if(im){ctx.save();ctx.imageSmoothingEnabled=false;if(p.face<0){ctx.translate(x+targetW,0);ctx.scale(-1,1);ctx.drawImage(im,0,y,targetW,targetH);}else ctx.drawImage(im,x,y,targetW,targetH);ctx.restore();}
 else {const im2=A.openKnight;if(im2?.complete&&im2.naturalWidth){const fw=192,fh=256,dw=88,dh=96,xx=p.x+p.w/2-dw/2,yy=p.y+p.h-dh+5;ctx.save();ctx.imageSmoothingEnabled=false;if(p.face<0){ctx.translate(xx+dw,0);ctx.scale(-1,1);ctx.drawImage(im2,0,0,fw,fh,0,yy,dw,dh);}else ctx.drawImage(im2,0,0,fw,fh,xx,yy,dw,dh);ctx.restore();}}
}
drawPlayer=drawHeroKnight24;

// ---------- New enemy roster from Pixel Adventure CC0 ----------
const PF24='https://raw.githubusercontent.com/marpor/PixelAdventure/main/PixelAdventure/Enemies/';
for(const [k,u] of Object.entries({
 rino24:PF24+'Rino/Run%20(52x34).png',
 cham24:PF24+'Chameleon/Run%20(84x38).png',
 plant24:PF24+'Plant/Idle%20(44x42).png',
 bird24:PF24+'BlueBird/Flying%20(32x32).png',
 bat24:PF24+'Bat/Flying%20(46x30).png',
 ghost24:PF24+'Ghost/Idle%20(44x30).png'
})){const im=new Image();im.crossOrigin='anonymous';im.src=u;A[k]=im;}

function enemySheet24(im,fw,fh,e,scale=1,alpha=1){
 if(!(im&&im.complete&&im.naturalWidth))return false;const cols=Math.max(1,Math.floor(im.naturalWidth/fw)),f=Math.floor(e.t*9)%cols;
 const dh=e.h*scale,dw=Math.max(e.w*scale,dh*(fw/fh)),x=e.x+e.w/2-dw/2,y=e.y+e.h-dh;
 ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=false;if(e.dir>0){ctx.translate(x+dw,0);ctx.scale(-1,1);ctx.drawImage(im,f*fw,0,fw,fh,0,y,dw,dh);}else ctx.drawImage(im,f*fw,0,fw,fh,x,y,dw,dh);ctx.restore();return true;
}
function drawEnemies24(){
 for(const e of w.en){if(e.dead)continue;let ok=false;
  if(e.type==='boss')ok=typeof skeleton20==='function'&&skeleton20(e,true);
  else if(e.variant24==='rino')ok=enemySheet24(A.rino24,52,34,e,1.25);
  else if(e.variant24==='cham')ok=enemySheet24(A.cham24,84,38,e,1.2);
  else if(e.variant24==='plant')ok=enemySheet24(A.plant24,44,42,e,1.18);
  else if(e.variant24==='bird')ok=enemySheet24(A.bird24,32,32,e,1.3);
  else if(e.variant24==='bat')ok=enemySheet24(A.bat24,46,30,e,1.22);
  else if(e.variant24==='ghost')ok=enemySheet24(A.ghost24,44,30,e,1.22,.78);
  if(!ok&&typeof skeleton20==='function')skeleton20(e,false);
  if(e.miniBoss18||e.type==='boss'){const pct=Math.max(0,e.hp/e.maxHp);ctx.fillStyle='#120910d9';ctx.fillRect(e.x-10,e.y-20,e.w+20,9);ctx.fillStyle=e.type==='boss'?'#d84f61':'#d79d47';ctx.fillRect(e.x-8,e.y-18,(e.w+16)*pct,5);ctx.fillStyle='#fff';ctx.font='bold 10px Arial';ctx.fillText(e.type==='boss'?'БОСС':'МИНИ-БОСС',e.x-6,e.y-25);}
 }
}
drawEnemies=drawEnemies24;

// ---------- Loot ----------
const B24='https://raw.githubusercontent.com/marpor/PixelAdventure/main/PixelAdventure/Items/Fruits/';
for(const [k,u] of Object.entries({pine24:B24+'Pineapple.png',straw24:B24+'Strawberry.png',kiwi24:B24+'Kiwi.png',melon24:B24+'Melon.png'})){const im=new Image();im.crossOrigin='anonymous';im.src=u;A[k]=im;}
function surfaceY24(x){let y=500;for(const s of [...(w?.sol||[]),...(w?.plat||[])])if(x>=s.x&&x<=s.x+s.w&&s.y<y)y=s.y;return y;}
function populateExtras24(){
 if(!w)return;
 for(let x=500;x<(w.width||4200)-250;x+=190+((x/190|0)%3)*35){const y=surfaceY24(x)-44;if(!w.coins.some(c=>Math.abs(c.x-x)<55))w.coins.push({x,y,w:28,h:28,t:Math.random()*5,dead:false});}
 w.loot24=[];const kinds=['ore','potion','relic','gem'];let n=0;
 for(let x=760;x<(w.width||4200)-300;x+=520){const y=surfaceY24(x)-48;w.loot24.push({x,y,w:32,h:32,t:Math.random()*5,dead:false,type:kinds[(n++ + li)%kinds.length]});}
 const mx=Math.min(980,(w.width||4200)-500),my=surfaceY24(mx)-58;w.merchant24={x:mx,y:my,w:46,h:58,type:'merchant24'};
 const pool=['rino','cham','plant','bird','bat','ghost'];let i=0;
 for(const e of w.en){if(e.type==='boss')continue;e.variant24=pool[(i++ + li)%pool.length];if(e.variant24==='rino'){e.hp=e.maxHp=Math.max(e.maxHp||1,7+Math.floor(li/2));e.w=Math.max(e.w,56);e.h=Math.max(e.h,42);}else if(e.variant24==='cham'||e.variant24==='plant'){e.hp=e.maxHp=Math.max(e.maxHp||1,5+Math.floor(li/3));}else e.hp=e.maxHp=Math.max(e.maxHp||1,4+Math.floor(li/4));}
}
const makeBase24=makeWorld;makeWorld=function(i){makeBase24(i);populateExtras24();};

const updateItemsBase24=updateItems;updateItems=function(dt){
 updateItemsBase24(dt);if(!w?.loot24)return;
 for(const q of w.loot24){if(q.dead)continue;q.t+=dt;if(hit(p,q)){q.dead=true;snd('coin');if(q.type==='ore'){coins+=6;soulsRun+=3;toast='ЖЕЛЕЗНАЯ РУДА +6 МОНЕТ';}else if(q.type==='potion'){p.hp=Math.min(p.maxHp,p.hp+2);toast='ЛЕЧЕБНОЕ ЗЕЛЬЕ';}else if(q.type==='relic'){soulsRun+=12;coins+=2;toast='ДРЕВНЯЯ РЕЛИКВИЯ +12 ДУШ';}else{coins+=12;toast='РЕДКИЙ САМОЦВЕТ +12 МОНЕТ';}toastT=1.4;}}
};

function drawLootAndMerchant24(){if(!w)return;ctx.save();ctx.translate(-cam,0);for(const q of (w.loot24||[])){if(q.dead)continue;const im=q.type==='ore'?A.pine24:q.type==='potion'?A.straw24:q.type==='relic'?A.kiwi24:A.melon24;drawSheet(im,32,32,Math.floor(q.t*10),q.x,q.y,34,34,false);}
 const m=w.merchant24;if(m){ctx.fillStyle='#211713';ctx.fillRect(m.x+6,m.y+40,36,18);ctx.fillStyle='#d6a85c';ctx.beginPath();ctx.arc(m.x+24,m.y+18,16,0,Math.PI*2);ctx.fill();ctx.fillStyle='#303744';ctx.fillRect(m.x+8,m.y+24,32,26);ctx.fillStyle='#fff';ctx.font='bold 11px Arial';ctx.fillText('КУЗНЕЦ',m.x-2,m.y-10);ctx.fillStyle='#ffd65a';ctx.font='10px Arial';ctx.fillText('усиление оружия',m.x-18,m.y+68);}
 ctx.restore();}
const worldBase24=drawWorld;drawWorld=function(){worldBase24();drawLootAndMerchant24();};

meta.forge24=Object.assign({},meta.forge24||{});
let forgePrev24='play';
const forge=document.createElement('div');forge.id='forge24';forge.className='overlay hidden';forge.innerHTML='<div class="panel" style="max-width:760px"><h1 style="font-size:38px">КУЗНЕЦ БОРАН</h1><p id="forgeInfo24"></p><div id="forgeGrid24" class="grid"></div><button id="forgeClose24" class="btn dark">ВЕРНУТЬСЯ</button></div>';document.body.appendChild(forge);
function forgeLevel24(){return meta.forge24[meta.equipped]||0;}
function renderForge24(){const lv=forgeLevel24(),cost=8+lv*7;E('forgeInfo24').textContent=`МОНЕТЫ: ${coins} · ${WEAP[meta.equipped]?.name||'ОРУЖИЕ'} +${lv}`;E('forgeGrid24').innerHTML=`<div class="card"><b>ЗАТОЧКА ОРУЖИЯ +${lv+1}</b><small>Повышает общий урон оружия. Цена: ${cost} монет.</small><button class="btn" data-forge="weapon" style="margin-top:10px">УЛУЧШИТЬ</button></div><div class="card"><b>ЗАКАЛКА БРОНИ</b><small>+1 к максимальному HP. Цена: 18 монет.</small><button class="btn alt" data-forge="hp" style="margin-top:10px">КУПИТЬ</button></div><div class="card"><b>РЕМЕНЬ ВЫНОСЛИВОСТИ</b><small>+15 к максимуму выносливости. Цена: 14 монет.</small><button class="btn alt" data-forge="stam" style="margin-top:10px">КУПИТЬ</button></div>`;}
function openForge24(){forgePrev24=state;state='forge24';forge.classList.remove('hidden');renderForge24();}
function closeForge24(){forge.classList.add('hidden');state=forgePrev24==='play'?'play':forgePrev24;}
E('forgeClose24').onclick=closeForge24;
E('forgeGrid24').onclick=e=>{const b=e.target.closest('[data-forge]');if(!b)return;const kind=b.dataset.forge,lv=forgeLevel24();if(kind==='weapon'){const cost=8+lv*7;if(coins<cost){toast='НЕ ХВАТАЕТ МОНЕТ';toastT=1.5;return;}coins-=cost;meta.forge24[meta.equipped]=lv+1;meta.up.damage=(meta.up.damage||0)+1;save();snd('secret');}
 else if(kind==='hp'){if(coins<18)return;coins-=18;meta.up.heart=(meta.up.heart||0)+1;if(p){p.maxHp+=1;p.hp=p.maxHp;}save();}
 else if(kind==='stam'){if(coins<14)return;coins-=14;meta.up.stamina=(meta.up.stamina||0)+1;if(p){p.maxSt+=15;p.stam=p.maxSt;}save();}renderForge24();};

const nearBase24=nearestInteractive;nearestInteractive=function(){const base=nearBase24(),m=w?.merchant24;if(m&&p&&dist(p,m)<105)return{type:'merchant24',o:m};return base;};
const interactBase24=interact;interact=function(){if(state!=='play')return;if(w?.merchant24&&p&&dist(p,w.merchant24)<105){openForge24();return;}interactBase24();};
const labelBase24=interactLabel;interactLabel=function(n){if(n?.type==='merchant24')return'[E] КУЗНЕЦ · УЛУЧШИТЬ ОРУЖИЕ';return labelBase24(n);};

const hudBase24=drawHUD;drawHUD=function(){hudBase24();if(state!=='play'||!p)return;ctx.fillStyle='#050914cc';ctx.fillRect(705,72,235,28);ctx.fillStyle='#ffd65a';ctx.font='bold 12px Arial';ctx.fillText(`МОНЕТЫ ${coins} · КУЗНЯ +${forgeLevel24()}`,718,91);};

const startBase24=startGame;startGame=function(from=0){startBase24(from);toast='FORGE & LOOT · ДВИЖЕНИЕ ИСПРАВЛЕНО · КУЗНЕЦ ДОБАВЛЕН';toastT=3.7;};
refreshMeta();
