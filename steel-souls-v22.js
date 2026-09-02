'use strict';

document.title='Skybound Frog — Steel & Souls: True Sword Hero';
const m22=document.querySelector('#menu .panel p');if(m22)m22.textContent='TRUE SWORD HERO — старый рыцарь отключён. Новый герой берётся из цельного CC0 спрайта: тело, руки и меч находятся в одном изображении и двигаются вместе.';

// CC0 Classic Knight: one integrated character sprite (body + sword), not a weapon overlay.
A.trueKnight22=new Image();A.trueKnight22.crossOrigin='anonymous';A.trueKnight22.src='https://opengameart.org/sites/default/files/Ye_Oldy_Knight_Guy.png';

function trueKnight22(){
 if(!p)return;if(p.inv>0&&Math.floor(p.inv*12)%2)return;
 const im=A.trueKnight22;if(!(im&&im.complete&&im.naturalWidth))return;
 // Published sprite is a compact integrated knight sheet. Crop frames from a horizontal sequence when available.
 const fh=im.naturalHeight,fw=Math.min(fh,Math.floor(im.naturalWidth/Math.max(1,Math.round(im.naturalWidth/fh))));
 const cols=Math.max(1,Math.floor(im.naturalWidth/fw));let frame=0;
 if(p.attack)frame=Math.min(cols-1,Math.floor(clamp(p.attack.t/p.attack.dur,0,.999)*cols));
 else if(Math.abs(p.vx)>30)frame=Math.floor(performance.now()/105)%cols;
 else frame=Math.floor(performance.now()/360)%Math.min(cols,2);
 const dw=82,dh=82,x=p.x+p.w/2-dw/2,y=p.y+p.h-dh+4;
 ctx.save();ctx.imageSmoothingEnabled=false;
 if(p.face<0){ctx.translate(x+dw,0);ctx.scale(-1,1);ctx.drawImage(im,frame*fw,0,fw,fh,0,y,dw,dh)}
 else ctx.drawImage(im,frame*fw,0,fw,fh,x,y,dw,dh);
 ctx.restore();
}

// Hard override: never call v16-v21 hero renderers, therefore no old body and no separately painted sword.
drawPlayer=trueKnight22;

const start22=startGame;startGame=function(from=0){start22(from);toast='TRUE SWORD HERO · СТАРЫЙ ГЕРОЙ ОТКЛЮЧЁН';toastT=3.5};
refreshMeta();
