'use strict';

document.title='Skybound Frog — Steel & Souls: Forged Motion';
const menuTextV10=document.querySelector('#menu .panel p');
if(menuTextV10)menuTextV10.textContent='Forged Motion — меч привязан к руке персонажа, есть комбо и живые боевые позы. Начало уровня стало спокойнее.';
const hintV10=document.querySelector('#menu .panel div[style*="font-size:13px"]');
if(hintV10)hintV10.textContent='A/D — ходьба · W/Пробел — прыжок · Shift — рывок · F/X — удар (серия до 3) · E — взаимодействие · Q/1–6 — оружие';

function weaponPoseV10(){
 if(!p)return null;
 const a=p.attack,face=p.face||1;
 if(!a){
  const walk=Math.abs(p.vx)>35&&p.on;
  const bob=Math.sin(performance.now()*(walk?.017:.005))*(walk?2.1:1.0);
  return{face,ang:(face>0?.58:-.58),handX:face*10,handY:28+bob,bodyLean:walk?face*1.5:0};
 }
 const q=clamp(a.t/a.dur,0,1),c=a.combo||1;
 let ang,handX,handY,bodyLean;
 if(c===1){
  if(q<.28){const t=q/.28;ang=(-1.65+.38*t)*face;handX=face*(8+5*t);handY=27-4*t;bodyLean=-face*2*t}
  else if(q<.68){const t=(q-.28)/.40;ang=(-1.27+2.35*t)*face;handX=face*(13+10*Math.sin(Math.PI*t));handY=23+6*t;bodyLean=face*4*Math.sin(Math.PI*t)}
  else{const t=(q-.68)/.32;ang=(1.08-.50*t)*face;handX=face*(13-3*t);handY=29;bodyLean=face*(3-3*t)}
 }else if(c===2){
  if(q<.25){const t=q/.25;ang=(1.35-.20*t)*face;handX=face*(10+4*t);handY=24;bodyLean=face*2}
  else if(q<.70){const t=(q-.25)/.45;ang=(1.15-2.45*t)*face;handX=face*(14+11*Math.sin(Math.PI*t));handY=24+5*t;bodyLean=face*5*Math.sin(Math.PI*t)}
  else{const t=(q-.70)/.30;ang=(-1.30+.45*t)*face;handX=face*(14-4*t);handY=29;bodyLean=face*(4-4*t)}
 }else{
  if(q<.32){const t=q/.32;ang=(-2.55+.25*t)*face;handX=face*(7+3*t);handY=19-4*t;bodyLean=-face*3*t}
  else if(q<.70){const t=(q-.32)/.38;ang=(-2.30+3.75*t)*face;handX=face*(10+16*Math.sin(Math.PI*t));handY=15+15*t;bodyLean=face*7*Math.sin(Math.PI*t)}
  else{const t=(q-.70)/.30;ang=(1.45-.72*t)*face;handX=face*(15-5*t);handY=30;bodyLean=face*(5-5*t)}
 }
 return{face,ang,handX,handY,bodyLean,q,combo:c};
}

function drawArmGripV10(px,py,pose,front=true){
 const face=pose.face;ctx.save();ctx.translate(px,py);ctx.scale(face,1);
 const sx=front?7:3,sy=25,hx=Math.abs(pose.handX),hy=pose.handY;
 ctx.strokeStyle=front?'#7fd36f':'#4a8e52';ctx.lineWidth=7;ctx.lineCap='round';
 ctx.beginPath();ctx.moveTo(sx,sy);ctx.quadraticCurveTo((sx+hx)*.55,sy-3,hx,hy);ctx.stroke();
 ctx.fillStyle=front?'#98e982':'#5eaa64';ctx.beginPath();ctx.arc(hx,hy,4.7,0,Math.PI*2);ctx.fill();ctx.restore();
}

function drawHeldWeaponV10(type,px,py,pose){
 const z=WEAP[type]||WEAP.blaster,hx=px+pose.handX,hy=py+pose.handY;
 drawSwordSpriteV9(type,hx,hy,z.kind==='greatsword'?.90:z.kind==='spear'?.84:.70,pose.ang,pose.face<0,1);
 ctx.save();ctx.translate(hx,hy);ctx.fillStyle='#93df7e';ctx.beginPath();ctx.arc(0,0,4.7,0,Math.PI*2);ctx.fill();ctx.restore();
}

function attackDurationV10(z,c){const k=c===3?1.20:c===2?.92:1;return(z.kind==='greatsword'?.52:z.kind==='spear'?.37:.31)*k}

fire=function(){
 const z=WEAP[meta.equipped]||WEAP.blaster;if(!p)return;
 if(p.attack){const q=p.attack.t/p.attack.dur;if(q>.55&&q<.96&&!p.attack.queued&&p.attack.combo<3&&p.stam>=z.cost)p.attack.queued=true;return}
 if(p.fire>0||p.stam<z.cost)return;
 const combo=p.comboWindow>0?((p.lastCombo||0)%3)+1:1;
 p.stam-=z.cost;snd('shoot');p.fire=Math.min(.12,z.rate*.45);p.attack={t:0,dur:attackDurationV10(z,combo),hit:false,type:meta.equipped,z,face:p.face,combo,queued:false};p.lastCombo=combo;p.comboWindow=.48;
};

function resolveAttackV10(a){
 if(a.hit)return;a.hit=true;const z=a.z,c=a.combo||1,reach=(z.reach||64)*(c===3?1.16:c===2?1.05:1),h=z.kind==='greatsword'?88:z.kind==='spear'?46:66;
 const box={x:a.face>0?p.x+p.w-6:p.x-reach+6,y:p.y+(p.h-h)/2,w:reach,h,face:a.face,type:a.type,dmg:(z.dmg+(meta.up.damage||0)*.3)*(c===3?1.45:c===2?1.15:1)};
 w.slashes=w.slashes||[];w.slashes.push({...box,life:.14,max:.14,combo:c});
 for(const e of w.en){if(e.dead||!hit(box,e))continue;damageEnemy(e,box.dmg,{type:a.type,vx:a.face,pierce:!!z.pierce});e.hitT=.18;e.vx+=a.face*(c===3?330:z.kind==='greatsword'?300:225);if(c===3||z.kind==='greatsword')e.vy-=145}
 burst(p.x+p.w/2+a.face*reach*.72,p.y+24,z.frost?'#9deaff':z.kind==='void'?'#b785ff':'#f2e0ad',c===3?9:6);
}

const updateShotsV9b=updateShots;
updateShots=function(dt){
 const own=p?.attack||null;if(p)p.attack=null;updateShotsV9b(dt);if(p)p.attack=own;if(!p)return;
 p.comboWindow=Math.max(0,(p.comboWindow||0)-dt);
 if(p.attack){const a=p.attack;a.t+=dt;const q=a.t/a.dur;if(q>=(a.combo===3?.42:.31)&&!a.hit)resolveAttackV10(a);if(q>=1){const queued=a.queued,combo=a.combo,z=a.z,type=a.type,face=a.face;p.attack=null;if(queued&&combo<3&&p.stam>=z.cost){p.stam-=z.cost;p.attack={t:0,dur:attackDurationV10(z,combo+1),hit:false,type,z,face,combo:combo+1,queued:false};p.lastCombo=combo+1;p.comboWindow=.50}}}
};

drawPlayer=function(){
 if(!p)return;const skin=meta.skin||'frog',moving=Math.abs(p.vx)>30,pose=weaponPoseV10(),a=p.attack;let act=!p.on?(p.vy<0?'Jump':'Fall'):moving?'Run':'Idle';const im=A[skin+act],flip=p.face<0;
 if(p.inv>0&&Math.floor(p.inv*12)%2)return;
 const breath=!moving&&p.on&&!a?Math.sin(performance.now()/260)*.8:0,runBob=moving&&p.on?Math.sin(performance.now()/70)*1.4:0;
 ctx.save();ctx.translate(pose?.bodyLean||0,breath+runBob);drawArmGripV10(p.x+p.w/2,p.y,pose,false);
 if(!drawSheet(im,32,32,Math.floor(performance.now()/(a?125:110)),p.x,p.y,48,48,flip)){ctx.fillStyle='#63d66b';ctx.fillRect(p.x,p.y,p.w,p.h)}
 drawHeldWeaponV10(meta.equipped,p.x+p.w/2,p.y,pose);drawArmGripV10(p.x+p.w/2,p.y,pose,true);ctx.restore();
 if(p.dashT>0){ctx.globalAlpha=.20;for(let i=1;i<4;i++){ctx.fillStyle='#8bdcff';ctx.fillRect(p.x-p.face*i*18,p.y+8,34,30)}ctx.globalAlpha=1}
};

const drawEnemiesV9b=drawEnemies;
drawEnemies=function(){
 drawEnemiesV9b();const now=performance.now()/1000;
 for(const e of w.en){if(e.dead||!(e.type==='knight'||e.type==='boss'))continue;const dist=Math.abs((e.x+e.w/2)-(p.x+p.w/2));if(dist>360)continue;
  const dir=p.x>e.x?1:-1,phase=(now+e.x*.003)%2.1;let ang=dir>0?.65:-.65;if(phase<.55)ang=(dir>0?-1.15:1.15)+phase*(dir>0?.5:-.5);else if(phase<.92){const t=(phase-.55)/.37;ang=(dir>0?-0.88:0.88)+(dir>0?2.0:-2.0)*t}
  const hx=e.x+e.w/2+dir*(e.type==='boss'?26:15),hy=e.y+(e.type==='boss'?50:29);drawSwordSpriteV9(e.type==='boss'?'spread':'rapid',hx,hy,e.type==='boss'?1.05:.60,ang,dir<0,.92);
  if(phase<.55){ctx.globalAlpha=.25;ctx.strokeStyle='#e85d69';ctx.lineWidth=2;ctx.beginPath();ctx.arc(e.x+e.w/2,e.y+e.h/2,e.type==='boss'?65:42,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1}
 }
};

const makeWorldV9b=makeWorld;
makeWorld=function(i){makeWorldV9b(i);if(i===0&&!inDungeon){w.en=w.en.filter(e=>e.x>=2150);if(w.en.length){w.en[0].x=w.en[0].spawnX=Math.max(2300,w.en[0].x);w.en[0].hp=w.en[0].maxHp=Math.max(2,w.en[0].maxHp)}w.spikes=w.spikes.filter(s=>s.x>=1800);for(const b of w.bonfires)if(b.x<1700)b.x=Math.max(b.x,1120);toast='ЗАБЫТЫЕ ХОЛМЫ · УБЕЖИЩЕ ПУТНИКА';toastT=3}};

const startGameV10b=startGame;
startGame=function(from=0){startGameV10b(from);if(from===0){p.x=120;p.y=430;cam=0;p.attack=null;p.comboWindow=0;toast='УБЕЖИЩЕ ПУТНИКА · ВРАГОВ ВПЕРЕДИ НЕТ';toastT=3.1}};
refreshMeta();
