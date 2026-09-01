'use strict';

document.title='Skybound Frog — Steel & Souls: Living Worlds';
const m17=document.querySelector('#menu .panel p');if(m17)m17.textContent='Living Worlds — платформы и земля теперь собираются из настоящих пиксельных тайлов, а биомы получили многослойные спрайтовые декорации вместо простых прямоугольников.';

const PF17='https://raw.githubusercontent.com/marpor/PixelAdventure/main/PixelAdventure/';
for(const [k,u] of Object.entries({
 terrain17:PF17+'Terrain/Terrain%20(16x16).png',
 bg17green:PF17+'Background/Green.png',bg17blue:PF17+'Background/Blue.png',bg17gray:PF17+'Background/Gray.png',bg17brown:PF17+'Background/Brown.png',bg17purple:PF17+'Background/Purple.png',
 fire17:PF17+'Traps/Fire/On%20(16x32).png',saw17:PF17+'Traps/Saw/On%20(38x38).png',spike17:PF17+'Traps/Spikes/Idle.png',
 orange17:PF17+'Items/Fruits/Orange.png',cherry17:PF17+'Items/Fruits/Cherries.png',kiwi17:PF17+'Items/Fruits/Kiwi.png',melon17:PF17+'Items/Fruits/Melon.png'
})){const im=new Image();im.crossOrigin='anonymous';im.src=u;A[k]=im}

const TILESET17={
 hills:[[96,0],[112,0],[128,0],[96,16],[112,16],[128,16]],
 cave:[[128,48],[144,48],[160,48],[128,64],[144,64],[160,64]],
 sky:[[160,16],[176,16],[192,16],[160,32],[176,32],[192,32]],
 lava:[[192,64],[208,64],[224,64],[192,80],[208,80],[224,80]],
 castle:[[224,32],[240,32],[256,32],[224,48],[240,48],[256,48]]
};
function tile17(sx,sy,x,y,w=32,h=32){const im=A.terrain17;if(!(im&&im.complete&&im.naturalWidth))return false;ctx.imageSmoothingEnabled=false;ctx.drawImage(im,sx,sy,16,16,x,y,w,h);return true}
function drawTerrainLiving17(s){
 const set=TILESET17[w?.theme]||TILESET17.hills,cols=Math.ceil(s.w/32),rows=Math.ceil(s.h/32);
 for(let ry=0;ry<rows;ry++)for(let rx=0;rx<cols;rx++){
  const edge=ry===0?(rx===0?0:rx===cols-1?2:1):3+((rx+ry)%3),src=set[edge%set.length];
  tile17(src[0],src[1],s.x+rx*32,s.y+ry*32,Math.min(32,s.x+s.w-(s.x+rx*32)),Math.min(32,s.y+s.h-(s.y+ry*32)));
 }
}
drawTerrainBlockV8=function(s){drawTerrainLiving17(s)};

function bgFor17(){return w?.theme==='cave'?A.bg17gray:w?.theme==='sky'?A.bg17blue:w?.theme==='lava'?A.bg17brown:w?.theme==='castle'?A.bg17purple:A.bg17green}
function layer17(im,scale,parallax,alpha,y){if(!(im&&im.complete&&im.naturalWidth))return;ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=false;const hh=VH*scale,ww=hh*(im.naturalWidth/im.naturalHeight),off=-((cam*parallax)%ww)-ww;for(let x=off;x<VW+ww;x+=ww)ctx.drawImage(im,x,y,ww,hh);ctx.restore()}
drawBackground=function(){ctx.fillStyle='#05070d';ctx.fillRect(0,0,VW,VH);const im=bgFor17();layer17(im,1.15,.025,.62,-30);layer17(im,.92,.075,.46,70);layer17(im,.72,.16,.32,165);layer17(im,.55,.29,.22,250)};

function sheet17(im,fw,fh,frame,x,y,dw,dh,flip=false){if(!(im&&im.complete&&im.naturalWidth))return;const cols=Math.max(1,Math.floor(im.naturalWidth/fw)),rows=Math.max(1,Math.floor(im.naturalHeight/fh)),f=frame%(cols*rows),sx=(f%cols)*fw,sy=Math.floor(f/cols)*fh;ctx.save();ctx.imageSmoothingEnabled=false;if(flip){ctx.translate(x+dw,0);ctx.scale(-1,1);ctx.drawImage(im,sx,sy,fw,fh,0,y,dw,dh)}else ctx.drawImage(im,sx,sy,fw,fh,x,y,dw,dh);ctx.restore()}
function biomeDecor17(){if(!w)return;const t=performance.now(),lo=Math.floor((cam-300)/520),hi=Math.ceil((cam+VW+300)/520);ctx.save();ctx.translate(-cam,0);for(let i=lo;i<=hi;i++){
 const x=i*520+180+(i%2)*70;
 if(w.theme==='hills'){tile17(96,0,x,452,96,96);sheet17(A.orange17,32,32,Math.floor(t/120)+i,x+28,418,38,38);if(i%2===0)sheet17(A.cherry17,32,32,Math.floor(t/125),x+82,438,34,34)}
 else if(w.theme==='cave'){tile17(128,48,x,448,104,104);if(i%2===0&&A.openGem?.complete)ctx.drawImage(A.openGem,x+22,400,54,54);sheet17(A.kiwi17,32,32,Math.floor(t/130)+i,x+86,438,32,32)}
 else if(w.theme==='sky'){tile17(160,16,x,438,112,112);if(A.openShield?.complete)ctx.drawImage(A.openShield,x+24,396,58,58);sheet17(A.melon17,32,32,Math.floor(t/130),x+96,426,34,34)}
 else if(w.theme==='lava'){sheet17(A.fire17,16,32,Math.floor(t/70)+i,x,420,46,92);if(i%2===0)sheet17(A.saw17,38,38,Math.floor(t/65),x+82,452,58,58)}
 else {tile17(224,32,x,438,112,112);if(i%2===0)sheet17(A.fire17,16,32,Math.floor(t/70),x+35,406,40,80);if(A.openShield?.complete)ctx.drawImage(A.openShield,x+90,440,48,48)}
 }ctx.restore()}
const dw17=drawWorld;drawWorld=function(){dw17();biomeDecor17()};

const start17=startGame;startGame=function(from=0){start17(from);toast='LIVING WORLDS · СПРАЙТОВЫЕ БИОМЫ';toastT=3};
refreshMeta();
