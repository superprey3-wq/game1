'use strict';

document.title='Skybound Frog — Steel & Souls: RPG Worlds';
const m21=document.querySelector('#menu .panel p');
if(m21)m21.textContent='RPG Worlds — цельные миры: руины, подземелья, крепость, ловушки и бестиарий. Герой использует готовые боевые кадры с мечом внутри анимации.';

// Extra CC0 world art. These complement the complete knight/skeleton sets from v20.
for(const [k,u] of Object.entries({
 dungeonWall21:'https://opengameart.org/sites/default/files/Ground.png',
 castle21:'https://opengameart.org/sites/default/files/Kingdom%20Castle%20-%20By%20VicPlay.PNG',
 fire21:'https://raw.githubusercontent.com/marpor/PixelAdventure/main/PixelAdventure/Traps/Fire/On%20(16x32).png',
 spike21:'https://raw.githubusercontent.com/marpor/PixelAdventure/main/PixelAdventure/Traps/Spikes/Idle.png',
 saw21:'https://raw.githubusercontent.com/marpor/PixelAdventure/main/PixelAdventure/Traps/Saw/On%20(38x38).png'
})){const im=new Image();im.crossOrigin='anonymous';im.src=u;A[k]=im}

// Keep the v20 knight renderer as the final player renderer. Never add a separate sword overlay.
const drawKnightRPG21=drawPlayer;
drawPlayer=function(){drawKnightRPG21()};

function imgReady21(im){return !!(im&&im.complete&&im.naturalWidth)}
function repeatStrip21(im,x0,y,w,h,parallax=.0,alpha=1){
 if(!imgReady21(im))return;ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=false;
 const tileW=Math.max(96,h*(im.naturalWidth/im.naturalHeight)),off=-((cam*parallax)%tileW)-tileW;
 for(let x=off+x0;x<VW+tileW;x+=tileW)ctx.drawImage(im,x,y,tileW,h);ctx.restore();
}

function rpgBackdrop21(){
 const theme=w?.theme||'hills';
 if(theme==='cave'){
  ctx.fillStyle='#080a0e';ctx.fillRect(0,0,VW,VH);
  repeatStrip21(A.bg17gray,0,-30,VW,620,.035,.38);
  if(imgReady21(A.dungeon20))repeatStrip21(A.dungeon20,0,310,VW,250,.10,.28);
  ctx.fillStyle='#0008';ctx.fillRect(0,0,VW,VH);
 }else if(theme==='castle'){
  ctx.fillStyle='#090812';ctx.fillRect(0,0,VW,VH);
  repeatStrip21(A.bg17purple,0,-25,VW,600,.03,.42);
  if(imgReady21(A.castle21))repeatStrip21(A.castle21,0,280,VW,300,.08,.34);
  ctx.fillStyle='#08070b66';ctx.fillRect(0,0,VW,VH);
 }else if(theme==='lava'){
  ctx.fillStyle='#120609';ctx.fillRect(0,0,VW,VH);
  repeatStrip21(A.bg17brown,0,-20,VW,610,.035,.48);
  ctx.fillStyle='#2d090c77';ctx.fillRect(0,355,VW,185);
 }else if(theme==='sky'){
  ctx.fillStyle='#0a1424';ctx.fillRect(0,0,VW,VH);
  repeatStrip21(A.bg17blue,0,-30,VW,600,.025,.58);
 }else{
  ctx.fillStyle='#09130f';ctx.fillRect(0,0,VW,VH);
  repeatStrip21(A.bg17green,0,-25,VW,600,.025,.55);
 }
}
drawBackground=rpgBackdrop21;

function terrainRPG21(s){
 const theme=w?.theme||'hills';
 if((theme==='cave'||theme==='castle')&&imgReady21(theme==='castle'?A.castle20a:A.dungeon20)){
  const im=theme==='castle'?A.castle20a:A.dungeon20,tw=32,th=32,cols=Math.ceil(s.w/tw),rows=Math.ceil(Math.min(s.h,96)/th);
  ctx.save();ctx.imageSmoothingEnabled=false;
  for(let yy=0;yy<rows;yy++)for(let xx=0;xx<cols;xx++){
   const dw=Math.min(tw,s.w-xx*tw),dh=Math.min(th,s.h-yy*th);
   ctx.drawImage(im,0,0,Math.min(32,im.naturalWidth),Math.min(32,im.naturalHeight),s.x+xx*tw,s.y+yy*th,dw,dh);
  }
  ctx.restore();return;
 }
 // Outdoor/lava/sky use the real Pixel Adventure terrain tiles, but only the visible crust.
 const set=TILESET17[theme]||TILESET17.hills,cols=Math.ceil(s.w/32);
 for(let rx=0;rx<cols;rx++){
  const src=set[rx===0?0:rx===cols-1?2:1],dw=Math.min(32,s.x+s.w-(s.x+rx*32));
  tile17(src[0],src[1],s.x+rx*32,s.y,dw,32);
  if(s.h>34){const body=set[3+(rx%3)];tile17(body[0],body[1],s.x+rx*32,s.y+31,dw,Math.min(34,s.h-31))}
 }
}
drawTerrainBlockV8=function(s){terrainRPG21(s)};

function worldProps21(){
 if(!w)return;const theme=w.theme,t=performance.now();ctx.save();ctx.translate(-cam,0);
 const start=Math.floor((cam-300)/520)*520,end=cam+VW+520;
 for(let x=start;x<end;x+=520){
  if(theme==='cave'||theme==='castle'){
   if(imgReady21(A.fire21))sheet17(A.fire21,16,32,Math.floor(t/75),x+150,438,32,64,false);
   if(theme==='castle'&&imgReady21(A.castle20b))ctx.drawImage(A.castle20b,0,0,Math.min(64,A.castle20b.naturalWidth),Math.min(80,A.castle20b.naturalHeight),x+285,398,72,94);
  }else if(theme==='lava'){
   sheet17(A.fire21,16,32,Math.floor(t/65),x+130,430,38,76,false);
   if(((x/520)|0)%2===0)sheet17(A.saw21,38,38,Math.floor(t/60),x+300,454,52,52,false);
  }
 }
 // Draw actual spikes from the real trap sheet instead of triangles.
 for(const sp of (w.spikes||[]))for(let i=0;i<sp.n;i++)sheet17(A.spike21,16,16,0,sp.x+i*28,488,28,32,false);
 ctx.restore();
}

const worldBase21=drawWorld;
drawWorld=function(){worldBase21();worldProps21()};

function RPGEnemyKind21(i,e){
 if(e.type==='boss')return 'skeleton';
 const pools={hills:['pig','bee','skeleton','bat'],cave:['skeleton','ghost','bat','skeleton'],sky:['bee','bat','ghost','skeleton'],lava:['skeleton','pig','ghost','skeleton'],castle:['skeleton','skeleton','ghost','bat']};
 const pool=pools[w?.theme]||pools.hills;return pool[(i+li)%pool.length];
}
function tuneWorld21(){
 if(!w?.en)return;let i=0;
 for(const e of w.en){e.variant20=RPGEnemyKind21(i++,e);if(e.type==='boss'){e.hp=e.maxHp=Math.max(e.maxHp||1,34+li*5);e.w=Math.max(e.w,88);e.h=Math.max(e.h,94)}else{const hp=e.variant20==='skeleton'?6:e.variant20==='pig'?5:4;e.hp=e.maxHp=Math.max(e.maxHp||1,hp+Math.floor(li/3))}}
 // More hazards after the introductory world; keep the first stretch readable.
 if(!inDungeon&&li>=1){const add=[1450+li*70,2650+li*45];for(const x of add)if(!w.spikes.some(s=>Math.abs(s.x-x)<80))w.spikes.push({x,n:li>=5?4:3})}
}
const makeBase21=makeWorld;
makeWorld=function(i){makeBase21(i);tuneWorld21()};

const startBase21=startGame;
startGame=function(from=0){startBase21(from);toast='RPG WORLDS · ЦЕЛЬНЫЕ АССЕТЫ · МЕЧ В АНИМАЦИИ';toastT=3.6};
refreshMeta();
