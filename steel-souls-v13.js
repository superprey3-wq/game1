'use strict';

document.title='Skybound Frog — Steel & Souls: True Sprite';
const menuTextV13=document.querySelector('#menu .panel p');
if(menuTextV13)menuTextV13.textContent='True Sprite — герой теперь отрисовывается готовыми кадрами, где тело, руки и меч уже единый спрайт. Мир получил набор живых декораций.';

A.heroV13=new Image();A.heroV13.crossOrigin='anonymous';A.heroV13.src='./assets/hero-swordsman-v13.svg?v=13';
A.worldDecorV13=new Image();A.worldDecorV13.crossOrigin='anonymous';A.worldDecorV13.src='./assets/world-decor-v13.svg?v=13';

function heroFrameV13(){
 if(!p)return 0;
 if(p.attack){
  const c=p.attack.combo||1,q=clamp(p.attack.t/p.attack.dur,0,1);
  if(c===1)return q<.34?6:q<.72?7:8;
  if(c===2)return q<.35?9:q<.72?10:8;
  return q<.38?11:q<.75?12:13;
 }
 if(!p.on)return p.vy<0?4:5;
 if(Math.abs(p.vx)>35)return 2+Math.floor(performance.now()/110)%2;
 return Math.floor(performance.now()/360)%2;
}

function drawHeroFrameV13(frame,x,y,flip){
 const im=A.heroV13;if(!im?.complete||!im.naturalWidth)return false;
 const fw=64,fh=64,frames=Math.max(1,Math.floor(im.naturalWidth/fw));frame=((frame%frames)+frames)%frames;
 ctx.save();
 if(flip){ctx.translate(x+56,0);ctx.scale(-1,1);x=0}
 ctx.imageSmoothingEnabled=false;ctx.drawImage(im,frame*fw,0,fw,fh,x-4,y-10,56,56);
 ctx.restore();return true;
}

drawPlayer=function(){
 if(!p)return;if(p.inv>0&&Math.floor(p.inv*12)%2)return;
 const flip=p.face<0,frame=heroFrameV13();
 const bob=p.on&&Math.abs(p.vx)<35&&!p.attack?Math.sin(performance.now()/260)*.7:0;
 ctx.save();ctx.translate(0,bob);
 if(!drawHeroFrameV13(frame,p.x,p.y,flip)){
  const skin=meta.skin||'frog',act=!p.on?(p.vy<0?'Jump':'Fall'):Math.abs(p.vx)>30?'Run':'Idle';
  drawSheet(A[skin+act],32,32,Math.floor(performance.now()/110),p.x,p.y,48,48,flip);
 }
 ctx.restore();
 if(p.dashT>0){ctx.globalAlpha=.18;for(let i=1;i<4;i++){ctx.fillStyle='#8bdcff';ctx.fillRect(p.x-p.face*i*18,p.y+8,34,30)}ctx.globalAlpha=1}
};

const DECOR_INDEX={tree:0,bush:1,torch:2,banner:3,crystal:4,bones:5,pillar:6,grass:7};
function drawDecorSpriteV13(name,x,y,scale=1,flip=false){
 const im=A.worldDecorV13,idx=DECOR_INDEX[name]??0;if(!im?.complete||!im.naturalWidth)return false;
 const s=64;ctx.save();if(flip){ctx.translate(x+s*scale,0);ctx.scale(-1,1);x=0}ctx.imageSmoothingEnabled=false;ctx.drawImage(im,idx*s,0,s,s,x,y,s*scale,s*scale);ctx.restore();return true;
}
function hashV13(n){n=Math.sin(n*12.9898+78.233)*43758.5453;return n-Math.floor(n)}
function worldDecorationsV13(){
 if(!w)return;ctx.save();ctx.translate(-cam,0);
 const start=Math.max(0,Math.floor((cam-180)/360)),end=Math.ceil((cam+VW+180)/360),now=performance.now()/1000;
 for(let i=start;i<=end;i++){
  const x=i*360+70+hashV13(i)*140,flip=hashV13(i+1)>.5;
  if(w.theme==='hills'){
   drawDecorSpriteV13(i%3===0?'tree':i%3===1?'bush':'grass',x,456-(i%3===0?64:34),i%3===0?1.15:.72,flip);
   if(i%4===2)drawDecorSpriteV13('banner',x+120,438,.78,flip);
  }else if(w.theme==='cave'){
   drawDecorSpriteV13(i%2?'crystal':'bones',x,466,.78,flip);if(i%3===0)drawDecorSpriteV13('torch',x+120,430,.72,false);
  }else if(w.theme==='sky'){
   drawDecorSpriteV13(i%2?'pillar':'banner',x,420,i%2?.92:.82,flip);if(i%4===0)drawDecorSpriteV13('grass',x+110,470,.62,false);
  }else if(w.theme==='lava'){
   drawDecorSpriteV13(i%2?'torch':'bones',x,452,.84,flip);if(i%3===0)drawDecorSpriteV13('pillar',x+120,424,.90,false);
  }else{
   drawDecorSpriteV13(i%2?'pillar':'banner',x,418,.95,flip);if(i%3===1)drawDecorSpriteV13('torch',x+110,430,.72,false);
  }
 }
 ctx.restore();ctx.save();
 if(w.theme==='hills'){
  for(let i=0;i<12;i++){const x=((i*137+now*24-cam*.12)%(VW+80))-40,y=360+(i*31)%120;ctx.globalAlpha=.25+.22*Math.sin(now*2+i);ctx.fillStyle='#d9ff9c';ctx.fillRect(x,y,2,2)}
 }else if(w.theme==='cave'){
  for(let i=0;i<10;i++){const x=(i*179-cam*.05)%VW,y=120+(i*67)%330;ctx.globalAlpha=.25;ctx.fillStyle='#8ad8ff';ctx.beginPath();ctx.arc(x,y,2+Math.sin(now+i),0,Math.PI*2);ctx.fill()}
 }else if(w.theme==='sky'){
  for(let i=0;i<9;i++){const x=((i*211+now*35)%(VW+120))-60,y=80+(i*43)%300;ctx.globalAlpha=.35;ctx.fillStyle='#fff';ctx.fillRect(x,y,5,1)}
 }else if(w.theme==='lava'){
  for(let i=0;i<16;i++){const x=(i*83+Math.sin(i)*40)%VW,y=520-((now*50+i*47)%380);ctx.globalAlpha=.34;ctx.fillStyle='#ffb35a';ctx.fillRect(x,y,3,4)}
 }else{
  for(let i=0;i<9;i++){const x=((i*173+now*8)%(VW+80))-40,y=130+(i*71)%330;ctx.globalAlpha=.18;ctx.fillStyle='#bda8ff';ctx.fillRect(x,y,2,7)}
 }
 ctx.restore();
}

const drawWorldV13Base=drawWorld;
drawWorld=function(){drawWorldV13Base();worldDecorationsV13()};

const makeWorldV13Base=makeWorld;
makeWorld=function(i){
 makeWorldV13Base(i);
 if(i===0&&!inDungeon){
  w.en=w.en.filter(e=>e.x>=2500);
  w.spikes=w.spikes.filter(s=>s.x>=2050);
  if(w.bonfires?.length){w.bonfires[0].x=920}
 }
};

const startGameV13Base=startGame;
startGame=function(from=0){startGameV13Base(from);if(from===0){p.x=120;p.y=430;cam=0;toast='ТИХОЕ УБЕЖИЩЕ · ОСВОЙ ДВИЖЕНИЕ И МЕЧ';toastT=3.2}};

refreshMeta();
