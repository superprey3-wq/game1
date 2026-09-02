'use strict';

document.title='Skybound Frog — Steel & Souls: RPG Asset Reset';
const m20=document.querySelector('#menu .panel p');if(m20)m20.textContent='RPG Asset Reset — герой теперь взят из полноценного CC0 spriteset, где меч является частью кадров анимации. Без отдельного меча поверх персонажа. Подключены новые CC0 наборы подземелий и замков.';

// Complete CC0 side-view knight spriteset. The sword is already drawn in the animation frames.
A.rpgKnight20=new Image();A.rpgKnight20.crossOrigin='anonymous';A.rpgKnight20.src='https://opengameart.org/sites/default/files/spritesheet_29.png';
// CC0 skeleton platformer spriteset with strikes and movement.
A.rpgSkeleton20=new Image();A.rpgSkeleton20.crossOrigin='anonymous';A.rpgSkeleton20.src='https://opengameart.org/sites/default/files/skeletonBase.png';
A.pixelSkeleton20=new Image();A.pixelSkeleton20.crossOrigin='anonymous';A.pixelSkeleton20.src='https://opengameart.org/sites/default/files/pixel_skeleton.png';
// CC0 dungeon / castle art packs for the next world pass and current biome dressing.
A.dungeon20=new Image();A.dungeon20.crossOrigin='anonymous';A.dungeon20.src='https://opengameart.org/sites/default/files/Ground_1.png';
A.castle20a=new Image();A.castle20a.crossOrigin='anonymous';A.castle20a.src='https://opengameart.org/sites/default/files/castle_tileset_part1.png';
A.castle20b=new Image();A.castle20b.crossOrigin='anonymous';A.castle20b.src='https://opengameart.org/sites/default/files/castle_tileset_part2.png';
A.castle20c=new Image();A.castle20c.crossOrigin='anonymous';A.castle20c.src='https://opengameart.org/sites/default/files/castle_tileset_part3.png';

function knightCell20(col,row,x,y,dw,dh,flip=false){
 const im=A.rpgKnight20;if(!(im&&im.complete&&im.naturalWidth))return false;
 // The published sheet is a regular 10x9 action grid.
 const cw=im.naturalWidth/10,ch=im.naturalHeight/9,sx=col*cw,sy=row*ch;
 ctx.save();ctx.imageSmoothingEnabled=false;
 if(flip){ctx.translate(x+dw,0);ctx.scale(-1,1);ctx.drawImage(im,sx,sy,cw,ch,0,y,dw,dh)}else ctx.drawImage(im,sx,sy,cw,ch,x,y,dw,dh);
 ctx.restore();return true;
}

// Important: do NOT call v19 drawPlayer here, because that version deliberately drew a second weapon overlay.
drawPlayer=function(){
 if(!p)return;if(p.inv>0&&Math.floor(p.inv*12)%2)return;
 const t=performance.now(),flip=p.face<0;let col=0,row=0;
 if(p.attack){
  const q=clamp(p.attack.t/p.attack.dur,0,.999),combo=p.attack.combo||1;
  if(combo===1){row=0;col=3+Math.floor(q*5)}
  else if(combo===2){row=3;col=3+Math.floor(q*4)}
  else{row=7;col=5+Math.floor(q*4)}
 }else if(!p.on){row=5;col=p.vy<0?3:5}
 else if(Math.abs(p.vx)>35){row=6;col=3+Math.floor(t/90)%7}
 else{row=6;col=Math.floor(t/420)%3}
 const dw=96,dh=90,x=p.x+p.w/2-dw/2,y=p.y+p.h-dh+6;
 if(!knightCell20(col,row,x,y,dw,dh,flip)){
  // Safe fallback keeps the previous body, but still avoids the fake sword overlay.
  const im=A.openKnight;if(im?.complete&&im.naturalWidth){const fw=192,fh=256,f=!p.on?5:Math.abs(p.vx)>30?1+Math.floor(t/83)%4:0;ctx.save();ctx.imageSmoothingEnabled=false;if(flip){ctx.translate(x+dw,0);ctx.scale(-1,1);ctx.drawImage(im,(f%10)*fw,Math.floor(f/10)*fh,fw,fh,0,y,dw,dh)}else ctx.drawImage(im,(f%10)*fw,Math.floor(f/10)*fh,fw,fh,x,y,dw,dh);ctx.restore()}
 }
 if(p.dashT>0){ctx.globalAlpha=.16;for(let i=1;i<4;i++){ctx.fillStyle='#d6e8ff';ctx.fillRect(p.x-p.face*i*17,p.y+12,30,24)}ctx.globalAlpha=1}
};

function skeleton20(e,boss=false){
 const im=A.rpgSkeleton20;if(!(im&&im.complete&&im.naturalWidth))return false;
 // Sheet is organized as 10 columns; choose walking/strike rows depending on distance.
 const cols=10,cw=im.naturalWidth/cols,ch=im.naturalHeight/7;
 const near=p&&Math.abs((p.x+p.w/2)-(e.x+e.w/2))<95;
 const row=near?3:1,col=near?Math.floor(e.t*9)%4:Math.floor(e.t*7)%6;
 const dh=boss?108:72,dw=dh*.72,x=e.x+e.w/2-dw/2,y=e.y+e.h-dh;
 ctx.save();ctx.imageSmoothingEnabled=false;if(e.dir>0){ctx.translate(x+dw,0);ctx.scale(-1,1);ctx.drawImage(im,col*cw,row*ch,cw,ch,0,y,dw,dh)}else ctx.drawImage(im,col*cw,row*ch,cw,ch,x,y,dw,dh);ctx.restore();return true;
}

function paEnemy20(e,type){const t=Math.floor(e.t*8),flip=e.dir>0;if(type==='pig')return sprite19(A.pig19,36,30,e,1.12);if(type==='bat')return sprite19(A.bat19,46,30,e,1.18);if(type==='ghost'){ctx.globalAlpha=.78;const z=sprite19(A.ghost19,44,30,e,1.18);ctx.globalAlpha=1;return z}if(type==='bee')return sprite19(A.bee19,36,34,e,1.12);return false}

drawEnemies=function(){
 for(const e of w.en){if(e.dead)continue;let ok=false;
  if(e.variant20==='skeleton')ok=skeleton20(e,e.type==='boss'||e.miniBoss18);
  else ok=paEnemy20(e,e.variant20);
  if(!ok)ok=skeleton20(e,e.type==='boss');
  if(e.miniBoss18||e.type==='boss'){
   const pct=Math.max(0,e.hp/e.maxHp);ctx.fillStyle='#120910d9';ctx.fillRect(e.x-10,e.y-20,e.w+20,9);ctx.fillStyle=e.type==='boss'?'#d84f61':'#d79d47';ctx.fillRect(e.x-8,e.y-18,(e.w+16)*pct,5);ctx.fillStyle='#fff';ctx.font='bold 10px Arial';ctx.fillText(e.type==='boss'?'БОСС':'МИНИ-БОСС',e.x-6,e.y-25)
  }
 }
};

function resetBestiary20(){if(!w?.en)return;const kinds=['skeleton','pig','bat','ghost','bee','skeleton'];let n=0;for(const e of w.en){if(e.type==='boss'){e.variant20='skeleton';e.hp=e.maxHp=Math.max(e.maxHp||1,30+li*4);e.w=Math.max(e.w,82);e.h=Math.max(e.h,88);continue}e.variant20=kinds[(n++ + li)%kinds.length];const base=e.variant20==='skeleton'?5:e.variant20==='pig'?4:3;e.hp=e.maxHp=Math.max(e.maxHp||1,base+Math.floor(li/3));}}
const make20=makeWorld;makeWorld=function(i){make20(i);resetBestiary20()};

// Add restrained real-RPG dressing to cave/castle areas without covering gameplay.
function rpgWorldDressing20(){if(!w||!(w.theme==='cave'||w.theme==='castle'))return;ctx.save();ctx.translate(-cam,0);ctx.globalAlpha=.72;ctx.imageSmoothingEnabled=false;
 const im=w.theme==='castle'?A.castle20a:A.dungeon20;
 if(im?.complete&&im.naturalWidth){const sw=Math.min(im.naturalWidth,128),sh=Math.min(im.naturalHeight,96);for(let x=Math.floor((cam-200)/420)*420;x<cam+VW+420;x+=420){ctx.drawImage(im,0,0,sw,sh,x,410,150,112)}}
 ctx.restore()}
const world20=drawWorld;drawWorld=function(){world20();rpgWorldDressing20()};

const start20=startGame;startGame=function(from=0){start20(from);toast='RPG ASSET RESET · МЕЧ ВНУТРИ АНИМАЦИИ ГЕРОЯ';toastT=3.4};
refreshMeta();
