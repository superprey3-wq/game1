'use strict';

document.title='Skybound Frog — Steel & Souls: Bestiary & Blades';
const m18=document.querySelector('#menu .panel p');
if(m18)m18.textContent='Bestiary & Blades — крупный герой с настоящей анимацией меча, сильные мобы, мини-боссы, боссы, шипы, пилы и опасные зоны.';
const h18=document.querySelector('#menu .panel div[style*="font-size:13px"]');
if(h18)h18.textContent='A/D — ходьба · W/Пробел — прыжок · Shift — рывок · F/X — удар мечом · E — взаимодействие · Q/1–6 — оружие';

// CC0 Mini Knight Expansion by Master484 / OpenGameArt.
A.miniKnight18=new Image();A.miniKnight18.crossOrigin='anonymous';A.miniKnight18.src='https://opengameart.org/sites/default/files/MiniKnightV2.png';
A.miniMonsters18=new Image();A.miniMonsters18.crossOrigin='anonymous';A.miniMonsters18.src='https://opengameart.org/sites/default/files/MiniK_NewMonsters.png';

// Extra CC0 Pixel Adventure enemies.
const PF18='https://raw.githubusercontent.com/marpor/PixelAdventure/main/PixelAdventure/Enemies/';
for(const [k,u] of Object.entries({
 pig18:PF18+'AngryPig/Run%20(36x30).png',
 bat18:PF18+'Bat/Flying%20(46x30).png',
 ghost18:PF18+'Ghost/Idle%20(44x30).png',
 mush18:PF18+'Mushroom/Run%20(32x32).png'
})){const im=new Image();im.crossOrigin='anonymous';im.src=u;A[k]=im}

let miniKnightCanvas18=null,miniMonsterCanvas18=null;
function keySheet18(im,done){
 const work=()=>{try{
  const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.drawImage(im,0,0);
  const d=x.getImageData(0,0,c.width,c.height),a=d.data,br=a[0],bg=a[1],bb=a[2];
  for(let i=0;i<a.length;i+=4){const r=a[i],g=a[i+1],b=a[i+2],nearBg=Math.abs(r-br)<16&&Math.abs(g-bg)<16&&Math.abs(b-bb)<16,guide=r>150&&b>120&&g<115;if(nearBg||guide)a[i+3]=0}
  x.putImageData(d,0,0);done(c);
 }catch(e){done(null)}};
 if(im.complete&&im.naturalWidth)work();else im.addEventListener('load',work,{once:true});
}
keySheet18(A.miniKnight18,c=>miniKnightCanvas18=c);
keySheet18(A.miniMonsters18,c=>miniMonsterCanvas18=c);

const HERO18={
 idle:[[18,183,36,34],[54,183,36,34]],
 walk:[[18,103,36,34],[54,103,36,34],[90,103,36,34],[126,103,36,34],[18,137,36,34],[54,137,36,34]],
 attack:[[18,183,36,34],[54,183,36,34],[90,183,36,34],[126,183,36,34]],
 jump:[[18,319,36,34],[54,319,36,34]],
 airAttack:[[18,351,36,34],[54,351,36,34]]
};
function drawFrame18(src,r,x,y,dw,dh,flip){
 if(!src)return false;ctx.save();ctx.imageSmoothingEnabled=false;if(flip){ctx.translate(x+dw,0);ctx.scale(-1,1);ctx.drawImage(src,r[0],r[1],r[2],r[3],0,y,dw,dh)}else ctx.drawImage(src,r[0],r[1],r[2],r[3],x,y,dw,dh);ctx.restore();return true;
}
function drawHero18(){
 if(!p)return;if(p.inv>0&&Math.floor(p.inv*12)%2)return;
 const src=miniKnightCanvas18,t=performance.now(),flip=p.face<0;let frames=HERO18.idle,idx=0;
 if(p.attack){frames=p.on?HERO18.attack:HERO18.airAttack;const q=clamp(p.attack.t/p.attack.dur,0,.999);idx=Math.floor(q*frames.length)}
 else if(!p.on){frames=HERO18.jump;idx=p.vy<0?0:1}
 else if(Math.abs(p.vx)>30){frames=HERO18.walk;idx=Math.floor(t/85)%frames.length}
 else idx=Math.floor(t/450)%frames.length;
 const dw=82,dh=76,x=p.x+p.w/2-dw/2,y=p.y+p.h-dh-2;
 if(!drawFrame18(src,frames[idx],x,y,dw,dh,flip)){
  const im=A.openKnight;if(im?.complete&&im.naturalWidth){const fw=192,fh=256,f=!p.on?5:Math.abs(p.vx)>30?1+Math.floor(t/83)%4:0;ctx.save();ctx.imageSmoothingEnabled=false;if(flip){ctx.translate(x+dw,0);ctx.scale(-1,1);ctx.drawImage(im,(f%10)*fw,Math.floor(f/10)*fh,fw,fh,0,y,dw,dh)}else ctx.drawImage(im,(f%10)*fw,Math.floor(f/10)*fh,fw,fh,x,y,dw,dh);ctx.restore()}
 }
 if(p.dashT>0){ctx.globalAlpha=.18;for(let i=1;i<4;i++){ctx.fillStyle='#d6e8ff';ctx.fillRect(p.x-p.face*i*15,p.y+12,30,26)}ctx.globalAlpha=1}
}
drawPlayer=drawHero18;

function enemySprite18(e){
 const t=Math.floor(e.t*8),flip=e.dir>0;
 if(e.variant18==='werewolf'&&miniMonsterCanvas18){const rr=[[28,416,37,36],[65,416,37,36],[102,416,37,36],[139,416,37,36]],r=rr[t%rr.length];return drawFrame18(miniMonsterCanvas18,r,e.x-8,e.y-16,e.w+16,e.h+20,flip)}
 if(e.variant18==='skeleton'&&miniMonsterCanvas18){const rr=[[28,127,37,35],[65,127,37,35],[102,127,37,35],[139,127,37,35]],r=rr[t%rr.length];return drawFrame18(miniMonsterCanvas18,r,e.x-5,e.y-12,e.w+10,e.h+14,flip)}
 if(e.variant18==='pig'){sheet17(A.pig18,36,30,t,e.x,e.y,e.w,e.h,flip);return true}
 if(e.variant18==='bat'){sheet17(A.bat18,46,30,t,e.x,e.y,e.w,e.h,flip);return true}
 if(e.variant18==='ghost'){ctx.globalAlpha=.76;sheet17(A.ghost18,44,30,t,e.x,e.y,e.w,e.h,flip);ctx.globalAlpha=1;return true}
 return false;
}
const drawEnemiesBefore18=drawEnemies;
drawEnemies=function(){
 drawEnemiesBefore18();
 for(const e of w.en){if(e.dead||!e.variant18)continue;enemySprite18(e);
  if(e.miniBoss18||e.type==='boss'){const pct=Math.max(0,e.hp/e.maxHp);ctx.fillStyle='#120b12cc';ctx.fillRect(e.x-9,e.y-15,e.w+18,7);ctx.fillStyle=e.type==='boss'?'#d84f61':'#d59b48';ctx.fillRect(e.x-7,e.y-13,(e.w+14)*pct,3);ctx.fillStyle='#fff';ctx.font='bold 10px Arial';ctx.fillText(e.type==='boss'?'БОСС':'МИНИ-БОСС',e.x-7,e.y-21)}
 }
};

function strengthenWorld18(){
 if(!w?.en)return;
 let n=0;for(const e of w.en){
  if(e.type==='mush'){e.variant18=n++%2?'skeleton':'werewolf';e.hp=e.maxHp=Math.max(e.maxHp||1,3+Math.floor(li/3));e.w=Math.max(e.w,44);e.h=Math.max(e.h,44)}
  else if(e.type==='pig'){e.variant18='pig';e.hp=e.maxHp=Math.max(e.maxHp||1,3)}
  else if(e.type==='bat')e.variant18='bat';else if(e.type==='ghost')e.variant18='ghost';
  else if(e.type==='knight'){e.variant18=n++%2?'skeleton':'werewolf';e.hp=e.maxHp=Math.max(e.maxHp||1,5+Math.floor(li/2))}
  else if(e.type==='boss'){e.variant18='werewolf';e.hp=e.maxHp=Math.max(e.maxHp||1,22+li*3);e.w=Math.max(e.w,88);e.h=Math.max(e.h,88)}
 }
 if(!inDungeon&&li>0&&!w.en.some(e=>e.type==='boss'||e.miniBoss18)){
  const src=w.en.find(e=>!e.dead);if(src){const e={...src,id:'mini18-'+li,dead:false,x:Math.max(1650,(w.width||4200)*.68),spawnX:Math.max(1650,(w.width||4200)*.68),y:430,spawnY:430,vx:-85,vy:0,dir:-1,on:false,t:0,cool:.7,slow:0,phase:1,variant18:li%2?'werewolf':'skeleton',miniBoss18:true};e.w=64;e.h=64;e.hp=e.maxHp=9+li*2;w.en.push(e)}
 }
 if(!inDungeon&&Array.isArray(w.spikes)&&li>=1){const xs=[1250+li*90,2380+li*55,3400+li*40];for(const x of xs)if(!w.spikes.some(s=>Math.abs(s.x-x)<90))w.spikes.push({x,n:li>5?4:3})}
 w.saws18=[];if(!inDungeon&&li>=2){for(let k=0;k<2+Math.min(3,Math.floor(li/2));k++)w.saws18.push({x:1550+k*820+li*45,y:472,r:24,phase:k*.9})}
}
const makeWorldBefore18=makeWorld;makeWorld=function(i){makeWorldBefore18(i);strengthenWorld18()};

function drawHazards18(){if(!w?.saws18?.length)return;ctx.save();ctx.translate(-cam,0);for(const s of w.saws18){const y=s.y+Math.sin(performance.now()/500+s.phase)*12;sheet17(A.saw17,38,38,Math.floor(performance.now()/60),s.x-28,y-28,56,56,false)}ctx.restore()}
const drawWorldBefore18=drawWorld;drawWorld=function(){drawWorldBefore18();drawHazards18()};

const updatePlayerBefore18=updatePlayer;updatePlayer=function(dt){updatePlayerBefore18(dt);if(state!=='play'||!p||!w?.saws18)return;for(const s of w.saws18){const y=s.y+Math.sin(performance.now()/500+s.phase)*12,dx=(p.x+p.w/2)-s.x,dy=(p.y+p.h/2)-y;if(dx*dx+dy*dy<34*34){hurt(1);p.vx=Math.sign(dx||1)*360;p.vy=-420;break}}};

const start18=startGame;startGame=function(from=0){start18(from);toast='BESTIARY & BLADES · МЕЧ В СПРАЙТЕ · НОВЫЕ ВРАГИ И ЛОВУШКИ';toastT=3.4};
refreshMeta();
