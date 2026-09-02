'use strict';

document.title='Skybound Frog — Steel & Souls: Hero Knight Fixed';
const m23=document.querySelector('#menu .panel p');if(m23)m23.textContent='HERO KNIGHT FIXED — герой загружается из отдельных PNG-кадров Hero Knight. Меч встроен прямо в Attack1/Attack2, поэтому отдельного нарисованного оружия больше нет.';

const HK23='https://raw.githubusercontent.com/LukePasax/hero-game/3b0c94d1386f428a9978f891ab77e02f798a6d65/Hero%20Knight/Sprites/HeroKnight/';
function frames23(folder,prefix,count){return Array.from({length:count},(_,i)=>{const im=new Image();im.crossOrigin='anonymous';im.src=HK23+folder+'/'+prefix+i+'.png';return im})}
const hero23={
 idle:frames23('Idle','HeroKnight_Idle_',11),
 run:frames23('Run','HeroKnight_Run_',8),
 jump:frames23('Jump','HeroKnight_Jump_',3),
 fall:frames23('Fall','HeroKnight_Fall_',3),
 attack1:frames23('Attack1','HeroKnight_Attack1_',7),
 attack2:frames23('Attack2','HeroKnight_Attack2_',7)
};

function ready23(im){return !!(im&&im.complete&&im.naturalWidth>0)}
function pick23(arr,i){if(!arr?.length)return null;const k=((i%arr.length)+arr.length)%arr.length;if(ready23(arr[k]))return arr[k];for(const im of arr)if(ready23(im))return im;return null}

function drawHeroKnight23(){
 if(!p)return;if(p.inv>0&&Math.floor(p.inv*12)%2)return;
 const now=performance.now();let arr=hero23.idle,idx=Math.floor(now/115)%arr.length;
 if(p.attack){
  const combo=(p.attack.combo||1);arr=combo%2===0?hero23.attack2:hero23.attack1;
  idx=Math.min(arr.length-1,Math.floor(clamp(p.attack.t/p.attack.dur,0,.999)*arr.length));
 }else if(!p.on){
  arr=p.vy<0?hero23.jump:hero23.fall;idx=Math.min(arr.length-1,Math.floor(Math.abs(p.vy)/240));
 }else if(Math.abs(p.vx)>28){arr=hero23.run;idx=Math.floor(now/82)%arr.length}
 const im=pick23(arr,idx)||pick23(hero23.idle,0);
 const targetH=118,targetW=targetH*(100/55),x=p.x+p.w/2-targetW/2,y=p.y+p.h-targetH+9;
 if(im){
  ctx.save();ctx.imageSmoothingEnabled=false;
  if(p.face<0){ctx.translate(x+targetW,0);ctx.scale(-1,1);ctx.drawImage(im,0,0,targetW,targetH)}else ctx.drawImage(im,x,y,targetW,targetH);
  ctx.restore();
 }else{
  // Never disappear again: keep a visible fallback while frames are still loading.
  const im2=A.openKnight;if(im2?.complete&&im2.naturalWidth){const fw=192,fh=256;ctx.save();ctx.imageSmoothingEnabled=false;if(p.face<0){ctx.translate(x+92,0);ctx.scale(-1,1);ctx.drawImage(im2,0,0,fw,fh,0,y+20,92,98)}else ctx.drawImage(im2,0,0,fw,fh,x,y+20,92,98);ctx.restore()}
 }
}

drawPlayer=drawHeroKnight23;

// Make the equipped weapon HUD match the character: attacks come from the sprite frames, not a second world weapon.
const start23=startGame;startGame=function(from=0){start23(from);toast='HERO KNIGHT FIXED · МЕЧ В КАДРАХ АТАКИ';toastT=3.6};
refreshMeta();
