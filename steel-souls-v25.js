'use strict';

document.title='Skybound Frog — Steel & Souls: Beast Hero & Gates';
const m25=document.querySelector('#menu .panel p');
if(m25)m25.textContent='BEAST HERO & GATES — герой теперь зверёк, кузнец стал настоящим персонажем, а каждый уровень заканчивается видимыми воротами вместо скрытой границы.';

// --- Animal hero: use the ready CC0 Ninja Frog character already loaded by the base game. ---
function drawBeastHero25(){
 if(!p)return;if(p.inv>0&&Math.floor(p.inv*12)%2)return;
 const now=performance.now();let im=A.frogIdle,frame=Math.floor(now/140),fw=32,fh=32;
 if(!p.on){im=p.vy<0?A.frogJump:A.frogFall;frame=0;}
 else if(Math.abs(p.vx)>24){im=A.frogRun;frame=Math.floor(now/85);}
 if(!(im&&im.complete&&im.naturalWidth))return drawHeroKnight24();
 const cols=Math.max(1,Math.floor(im.naturalWidth/fw)),sx=(frame%cols)*fw;
 const dh=74,dw=74,x=p.x+p.w/2-dw/2,y=p.y+p.h-dh+7;
 ctx.save();ctx.imageSmoothingEnabled=false;
 if(p.face<0){ctx.translate(x+dw,0);ctx.scale(-1,1);ctx.drawImage(im,sx,0,fw,fh,0,y,dw,dh);}else ctx.drawImage(im,sx,0,fw,fh,x,y,dw,dh);
 ctx.restore();
 // Attack cue without attaching a fake sword to the body: short slash arc only during the attack.
 if(p.attack){const q=clamp(p.attack.t/p.attack.dur,0,1),cx=p.x+p.w/2+p.face*28,cy=p.y+28;ctx.save();ctx.strokeStyle='#fff7c7';ctx.lineWidth=4;ctx.beginPath();const a0=p.face>0?-1.15:Math.PI+1.15,a1=p.face>0?(.7*q-.4):Math.PI-(.7*q-.4);ctx.arc(cx,cy,24,a0,a1,p.face<0);ctx.stroke();ctx.restore();}
}
drawPlayer=drawBeastHero25;

// --- Real blacksmith character sprite instead of procedural squares. ---
function drawLootAndMerchant24(){
 if(!w)return;ctx.save();ctx.translate(-cam,0);
 for(const q of (w.loot24||[])){if(q.dead)continue;const im=q.type==='ore'?A.pine24:q.type==='potion'?A.straw24:q.type==='relic'?A.kiwi24:A.melon24;drawSheet(im,32,32,Math.floor(q.t*10),q.x,q.y,34,34,false);}
 const m=w.merchant24;if(m){
  const im=A.virtualIdle;if(im?.complete&&im.naturalWidth){drawSheet(im,32,32,Math.floor(performance.now()/150),m.x-5,m.y-8,60,68,false);}else if(A.maskIdle?.complete&&A.maskIdle.naturalWidth){drawSheet(A.maskIdle,32,32,0,m.x-5,m.y-8,60,68,false);}
  ctx.fillStyle='#fff';ctx.font='bold 11px Arial';ctx.fillText('КУЗНЕЦ БОРАН',m.x-14,m.y-13);ctx.fillStyle='#ffd65a';ctx.font='10px Arial';ctx.fillText('[E] улучшить оружие',m.x-17,m.y+66);
 }
 ctx.restore();
}

// --- Explicit end-of-level gate/checkpoint asset. ---
A.exitGate25=new Image();A.exitGate25.crossOrigin='anonymous';A.exitGate25.src='https://raw.githubusercontent.com/marpor/PixelAdventure/main/PixelAdventure/Items/Checkpoints/End/End%20(Idle).png';
A.exitGatePressed25=new Image();A.exitGatePressed25.crossOrigin='anonymous';A.exitGatePressed25.src='https://raw.githubusercontent.com/marpor/PixelAdventure/main/PixelAdventure/Items/Checkpoints/End/End%20(Pressed)%20(64x64).png';

function setupGate25(){
 if(!w||inDungeon)return;
 const original=w.goal||((w.width||w.len||4200)-150),gx=Math.max(700,original-70),gy=surfaceY24(gx)-82;
 w.exit25={x:gx,y:gy,w:72,h:82,locked:w.en.some(e=>e.type==='boss'&&!e.dead),originalGoal:original};
 // Remove the invisible auto-finish boundary. Door interaction will finish the stage instead.
 w.goal=original+100000;
 // Keep the final approach readable: no regular mob pile directly in front of the gate.
 w.en=w.en.filter(e=>e.type==='boss'||e.miniBoss18||e.x<gx-760);
 // A small reward trail leading to the exit.
 for(let i=0;i<6;i++){const x=gx-560+i*78,y=surfaceY24(x)-58-i%2*18;if(!w.coins.some(c=>Math.abs(c.x-x)<35))w.coins.push({x,y,w:28,h:28,t:Math.random()*4,dead:false});}
}
const makeBase25=makeWorld;makeWorld=function(i){makeBase25(i);setupGate25();};

function drawGate25(){const g=w?.exit25;if(!g)return;ctx.save();ctx.translate(-cam,0);const locked=w.en.some(e=>e.type==='boss'&&!e.dead);g.locked=locked;const im=locked?A.exitGate25:A.exitGatePressed25;if(im?.complete&&im.naturalWidth){ctx.imageSmoothingEnabled=false;ctx.drawImage(im,g.x,g.y,80,80);}ctx.fillStyle=locked?'#ffd0d0':'#d8ffd6';ctx.font='bold 12px Arial';ctx.textAlign='center';ctx.fillText(locked?'ВОРОТА ЗАПЕЧАТАНЫ':'ВЫХОД · [E]',g.x+40,g.y-8);ctx.textAlign='left';ctx.restore();}
const worldBase25=drawWorld;drawWorld=function(){worldBase25();drawGate25();};

const nearBase25=nearestInteractive;nearestInteractive=function(){
 const base=nearBase25(),g=w?.exit25;if(g&&p&&dist(p,g)<115)return{type:'exit25',o:g};return base;
};
const labelBase25=interactLabel;interactLabel=function(n){if(n?.type==='exit25')return n.o.locked?'[E] ВОРОТА ЗАПЕЧАТАНЫ · УБЕЙ БОССА':'[E] ЗАВЕРШИТЬ УРОВЕНЬ';return labelBase25(n);};
const interactBase25=interact;interact=function(){
 if(state!=='play')return;const g=w?.exit25;
 if(g&&p&&dist(p,g)<115){
  const alive=w.en.some(e=>e.type==='boss'&&!e.dead);if(alive){toast='ВОРОТА ЗАКРЫТЫ · ХРАНИТЕЛЬ ЕЩЁ ЖИВ';toastT=1.6;return;}
  w.goal=g.originalGoal;completeLevel();return;
 }
 interactBase25();
};

const startBase25=startGame;startGame=function(from=0){startBase25(from);toast='BEAST HERO · ЖИВОЙ КУЗНЕЦ · ВОРОТА В КОНЦЕ УРОВНЯ';toastT=3.7;};
refreshMeta();
