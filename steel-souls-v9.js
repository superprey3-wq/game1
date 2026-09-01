'use strict';

// Steel & Souls v9 — combat animation + real weapon sprite + safer opening.
document.title='Skybound Frog — Steel & Souls: Living Blade';
const menuTextV9=document.querySelector('#menu .panel p');
if(menuTextV9)menuTextV9.textContent='Living Blade — живой пиксельный souls-like: анимированные удары, отдельный спрайт меча, более спокойное начало, тайны и мрачный лор.';

// CC0 pixel sword sprite by Ian Peter / OpenGameArt.
A.swordSprite=new Image();
A.swordSprite.crossOrigin='anonymous';
A.swordSprite.src='https://opengameart.org/sites/default/files/sword_23.png';

function drawSwordSpriteV9(type,x,y,scale=1,angle=0,flip=false,alpha=1){
 const im=A.swordSprite,z=WEAP[type]||WEAP.blaster;
 ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(angle);if(flip)ctx.scale(-1,1);
 const glow=z.kind==='frost'?'#9feeff':z.kind==='void'?'#a97bff':null;
 if(glow){ctx.save();ctx.globalAlpha=.28;ctx.fillStyle=glow;ctx.beginPath();ctx.arc(0,-14,28*scale,0,Math.PI*2);ctx.fill();ctx.restore()}
 if(im?.complete&&im.naturalWidth){
  const base=z.kind==='greatsword'?58:z.kind==='spear'?54:46;
  const ar=im.naturalHeight/im.naturalWidth;
  ctx.imageSmoothingEnabled=false;ctx.drawImage(im,-base*.5*scale,-base*ar*.78*scale,base*scale,base*ar*scale);
 }else{
  ctx.fillStyle='#dfe5ef';ctx.fillRect(-3*scale,-35*scale,6*scale,44*scale);ctx.fillStyle='#b58a46';ctx.fillRect(-10*scale,4*scale,20*scale,5*scale);ctx.fillRect(-4*scale,8*scale,8*scale,14*scale);
 }
 ctx.restore();
}

drawWeaponIconV8=function(type,x,y,scale=1,angle=-.65){drawSwordSpriteV9(type,x,y,scale,angle,false,1)};

const makeWorldV8=makeWorld;
makeWorld=function(i){
 makeWorldV8(i);
 if(i===0&&!inDungeon){
  const early=w.en.filter(e=>e.x<1250);
  w.en=w.en.filter(e=>e.x>=1250);
  if(early.length){
   const e=early[0];e.x=e.spawnX=1480;e.y=e.spawnY=470;e.vx=-70;e.dir=-1;e.hp=e.maxHp=Math.max(2,e.maxHp);w.en.unshift(e);
  }
  w.spikes=w.spikes.filter(s=>s.x>1050);
  w.pick.forEach(q=>{if(q.x<900)q.x+=550});
  toast='ЗАБЫТЫЕ ХОЛМЫ · ТИХАЯ ТРОПА';toastT=2.6;
 }
};

function activeAttack(){return p?.attack&&p.attack.t<p.attack.dur}

fire=function(){
 const z=WEAP[meta.equipped]||WEAP.blaster;
 if(!p||p.fire>0||p.stam<z.cost||activeAttack())return;
 p.fire=z.rate;p.stam-=z.cost;snd('shoot');
 const dur=z.kind==='greatsword'?.46:z.kind==='spear'?.34:.30;
 p.attack={t:0,dur,hit:false,type:meta.equipped,z,face:p.face};
};

function resolveAttackV9(a){
 if(a.hit)return;a.hit=true;
 const z=a.z,reach=z.reach||64,h=z.kind==='greatsword'?82:z.kind==='spear'?42:62;
 const box={x:a.face>0?p.x+p.w-5:p.x-reach+5,y:p.y+(p.h-h)/2,w:reach,h,face:a.face,type:a.type,dmg:z.dmg+(meta.up.damage||0)*.3};
 w.slashes=w.slashes||[];w.slashes.push({...box,life:.13,max:.13});
 for(const e of w.en){
  if(e.dead||!hit(box,e))continue;
  damageEnemy(e,box.dmg,{type:a.type,vx:a.face,pierce:!!z.pierce});
  e.hitT=.15;e.vx+=a.face*(z.kind==='greatsword'?300:z.kind==='spear'?185:225);if(z.kind==='greatsword')e.vy-=135;
 }
 burst(p.x+p.w/2+a.face*reach*.72,p.y+24,z.frost?'#9deaff':z.kind==='void'?'#b785ff':'#f2e0ad',5);
}

const updateShotsV8=updateShots;
updateShots=function(dt){
 updateShotsV8(dt);
 if(p?.attack){
  p.attack.t+=dt;
  const q=p.attack.t/p.attack.dur;
  if(q>=.30&&!p.attack.hit)resolveAttackV9(p.attack);
  if(q>=1)p.attack=null;
 }
 for(const e of w.en)if(e.hitT>0)e.hitT=Math.max(0,e.hitT-dt);
};

function attackPoseV9(){
 const a=p?.attack;if(!a)return null;
 const q=clamp(a.t/a.dur,0,1),face=a.face;
 let ang,reach;
 if(q<.28){const t=q/.28;ang=(-1.65+0.42*t)*face;reach=16+5*t}
 else if(q<.68){const t=(q-.28)/.40;ang=(-1.23+2.25*t)*face;reach=21+17*Math.sin(Math.PI*t)}
 else{const t=(q-.68)/.32;ang=(1.02-.32*t)*face;reach=23-5*t}
 return{q,ang,reach,face,type:a.type,z:a.z};
}

drawPlayer=function(){
 if(!p)return;const skin=meta.skin||'frog',moving=Math.abs(p.vx)>30,a=attackPoseV9();
 let act=!p.on?(p.vy<0?'Jump':'Fall'):moving?'Run':'Idle';
 const im=A[skin+act],flip=p.face<0;if(p.inv>0&&Math.floor(p.inv*12)%2)return;
 const recoil=a?(a.q<.28?-3:a.q<.68?3:1)*a.face:0;
 ctx.save();ctx.translate(recoil,0);
 if(!drawSheet(im,32,32,Math.floor(performance.now()/(a?145:110)),p.x,p.y,48,48,flip)){ctx.fillStyle='#63d66b';ctx.fillRect(p.x,p.y,p.w,p.h)}
 const hx=p.x+p.w/2+p.face*(a?12:14),hy=p.y+30;
 if(a)drawSwordSpriteV9(a.type,hx+a.face*a.reach,hy,WEAP[a.type].kind==='greatsword'?.86:.72,a.ang,p.face<0,1);
 else drawSwordSpriteV9(meta.equipped,hx+p.face*5,hy,.56,p.face>0?.72:-.72,p.face<0,.95);
 ctx.restore();
 if(p.dashT>0){ctx.globalAlpha=.24;for(let i=1;i<4;i++){ctx.fillStyle='#8bdcff';ctx.fillRect(p.x-p.face*i*18,p.y+8,34,30)}ctx.globalAlpha=1}
};

const drawEnemiesV8=drawEnemies;
drawEnemies=function(){
 drawEnemiesV8();
 for(const e of w.en){if(e.dead||!e.hitT)continue;ctx.save();ctx.globalAlpha=clamp(e.hitT/.15,0,1)*.55;ctx.fillStyle='#fff';ctx.fillRect(e.x-2,e.y-2,e.w+4,e.h+4);ctx.restore()}
};

drawProjectiles=function(){
 for(const a of (w.slashes||[])){const t=1-a.life/a.max,alpha=Math.sin(Math.PI*clamp(t,0,1));ctx.save();ctx.globalAlpha=.36*alpha;ctx.strokeStyle=a.type==='frost'?'#bff5ff':a.type==='void'?'#c69bff':'#f7e6c1';ctx.lineWidth=a.type==='spread'?10:6;ctx.beginPath();const cx=a.face>0?a.x:a.x+a.w,cy=a.y+a.h/2,r=a.w*.72;ctx.arc(cx,cy,r,a.face>0?-.85:Math.PI-.85,a.face>0?.75:Math.PI+.75,a.face<0);ctx.stroke();ctx.restore()}
 for(const s of w.enemyShots){ctx.fillStyle='#c95462';ctx.beginPath();ctx.arc(s.x+5,s.y+5,6,0,Math.PI*2);ctx.fill()}
};

const originalStartGameV9=startGame;
startGame=function(from=0){originalStartGameV9(from);if(from===0){p.x=120;p.y=430;cam=0;toast='ТИХАЯ ТРОПА · ВПЕРЕДИ СТАРЕЙШИНА';toastT=2.8}};

refreshMeta();
