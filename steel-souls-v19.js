'use strict';

document.title='Skybound Frog — Steel & Souls: Clean Frontline';
const m19=document.querySelector('#menu .panel p');if(m19)m19.textContent='Clean Frontline — передний план очищен от огромных квадратных блоков, меч снова виден в руке, а враги теперь реально разные: скелеты, свиньи, летучие мыши, призраки и пчёлы.';

const PF19='https://raw.githubusercontent.com/marpor/PixelAdventure/main/PixelAdventure/Enemies/';
for(const [k,u] of Object.entries({
 bee19:PF19+'Bee/Idle%20(36x34).png',pig19:PF19+'AngryPig/Run%20(36x30).png',bat19:PF19+'Bat/Flying%20(46x30).png',ghost19:PF19+'Ghost/Idle%20(44x30).png'
})){const im=new Image();im.crossOrigin='anonymous';im.src=u;A[k]=im}
A.skeleton19=new Image();A.skeleton19.crossOrigin='anonymous';A.skeleton19.src='https://opengameart.org/sites/default/files/styles/medium/public/kv%20pv.png';

try{biomeDecor17=function(){}}catch(e){}
try{worldSpriteLife16=function(){}}catch(e){}
try{landmarks15=function(){}}catch(e){}

drawTerrainBlockV8=function(s){
 const set=TILESET17[w?.theme]||TILESET17.hills,cols=Math.ceil(s.w/32),topY=s.y;
 for(let rx=0;rx<cols;rx++){
  const src=set[rx===0?0:rx===cols-1?2:1];tile17(src[0],src[1],s.x+rx*32,topY,Math.min(32,s.x+s.w-(s.x+rx*32)),32);
  if(s.h>34){const hang=18+((rx*17)%22),body=set[3+(rx%3)];tile17(body[0],body[1],s.x+rx*32,topY+31,Math.min(32,s.x+s.w-(s.x+rx*32)),hang)}
 }
};

const heroBody19=drawPlayer;
drawPlayer=function(){
 heroBody19();if(!p)return;
 if(typeof handboundPoseV11==='function'&&typeof drawHandboundWeaponV11==='function'){
  const pose=handboundPoseV11();pose.hx=p.face*13;pose.hy=p.attack?28:31;drawHandboundWeaponV11(meta.equipped,p.x+p.w/2,p.y-3,pose);
 }
};

function sprite19(im,fw,fh,e,scale=1){if(!(im&&im.complete&&im.naturalWidth))return false;const f=Math.floor(e.t*8),cols=Math.max(1,Math.floor(im.naturalWidth/fw)),sx=(f%cols)*fw,dw=e.w*scale,dh=e.h*scale,x=e.x+(e.w-dw)/2,y=e.y+e.h-dh;ctx.save();ctx.imageSmoothingEnabled=false;if(e.dir>0){ctx.translate(x+dw,0);ctx.scale(-1,1);ctx.drawImage(im,sx,0,fw,fh,0,y,dw,dh)}else ctx.drawImage(im,sx,0,fw,fh,x,y,dw,dh);ctx.restore();return true}
function drawSkeleton19(e){const im=A.skeleton19;if(!(im&&im.complete&&im.naturalWidth))return false;const dh=e.type==='boss'||e.miniBoss18?92:62,dw=dh*(im.naturalWidth/im.naturalHeight),x=e.x+e.w/2-dw/2,y=e.y+e.h-dh;ctx.save();ctx.imageSmoothingEnabled=false;if(e.dir>0){ctx.translate(x+dw,0);ctx.scale(-1,1);ctx.drawImage(im,0,y,dw,dh)}else ctx.drawImage(im,x,y,dw,dh);ctx.restore();return true}

drawEnemies=function(){
 for(const e of w.en){if(e.dead)continue;let ok=false;
  if(e.variant19==='skeleton')ok=drawSkeleton19(e);else if(e.variant19==='pig')ok=sprite19(A.pig19,36,30,e,1.12);else if(e.variant19==='bat')ok=sprite19(A.bat19,46,30,e,1.15);else if(e.variant19==='ghost'){ctx.globalAlpha=.78;ok=sprite19(A.ghost19,44,30,e,1.18);ctx.globalAlpha=1}else if(e.variant19==='bee')ok=sprite19(A.bee19,36,34,e,1.12);
  if(!ok)ok=drawSkeleton19(e);
  if(e.miniBoss18||e.type==='boss'){const pct=Math.max(0,e.hp/e.maxHp);ctx.fillStyle='#140c12cc';ctx.fillRect(e.x-8,e.y-18,e.w+16,8);ctx.fillStyle=e.type==='boss'?'#d84f61':'#d49b48';ctx.fillRect(e.x-6,e.y-16,(e.w+12)*pct,4);ctx.fillStyle='#fff';ctx.font='bold 10px Arial';ctx.fillText(e.type==='boss'?'БОСС':'МИНИ-БОСС',e.x-5,e.y-23)}
 }
};

function diversify19(){if(!w?.en)return;const kinds=['skeleton','pig','bat','ghost','bee'];let i=0;for(const e of w.en){if(e.type==='boss'){e.variant19='skeleton';e.hp=e.maxHp=Math.max(e.maxHp||1,28+li*4);continue}e.variant19=kinds[(i++ + li)%kinds.length];if(e.variant19==='skeleton')e.hp=e.maxHp=Math.max(e.maxHp||1,5+Math.floor(li/2));else if(e.variant19==='pig')e.hp=e.maxHp=Math.max(e.maxHp||1,4+Math.floor(li/3));else e.hp=e.maxHp=Math.max(e.maxHp||1,3+Math.floor(li/4));}}
const make19=makeWorld;makeWorld=function(i){make19(i);diversify19()};

const start19=startGame;startGame=function(from=0){start19(from);toast='CLEAN FRONTLINE · БЕЗ КВАДРАТОВ · НОВЫЙ БЕСТИАРИЙ';toastT=3.2};
refreshMeta();
