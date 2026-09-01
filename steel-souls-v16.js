'use strict';

document.title='Skybound Frog — Steel & Souls: Open Sprite World';
const m16=document.querySelector('#menu .panel p');if(m16)m16.textContent='Open Sprite World — герой, окружение, ловушки и фон теперь опираются на настоящие открытые sprite-sheet библиотеки с GitHub, а не на геометрические заглушки.';

// CC0 Sticker Knight Platformer (Ponywolf / CoronaLabs): real animated knight sheet.
A.openKnight=new Image();A.openKnight.crossOrigin='anonymous';A.openKnight.src='https://raw.githubusercontent.com/coronalabs/Sticker-Knight-Platformer/master/scene/game/img/sprites.png';
A.openShield=new Image();A.openShield.crossOrigin='anonymous';A.openShield.src='https://raw.githubusercontent.com/coronalabs/Sticker-Knight-Platformer/master/scene/game/img/shield.png';
A.openGem=new Image();A.openGem.crossOrigin='anonymous';A.openGem.src='https://raw.githubusercontent.com/coronalabs/Sticker-Knight-Platformer/master/scene/game/img/gem.png';

// CC0 Pixel Adventure (Pixel Frog): real background sprites and animated environmental art.
const PF16='https://raw.githubusercontent.com/marpor/PixelAdventure/main/PixelAdventure/';
for(const [k,u] of Object.entries({
 bgBlue:PF16+'Background/Blue.png',bgGreen:PF16+'Background/Green.png',bgBrown:PF16+'Background/Brown.png',bgGray:PF16+'Background/Gray.png',bgPurple:PF16+'Background/Purple.png',bgYellow:PF16+'Background/Yellow.png',
 fire16:PF16+'Traps/Fire/On%20(16x32).png',saw16:PF16+'Traps/Saw/On%20(38x38).png',spike16:PF16+'Traps/Spikes/Idle.png',terrain16:PF16+'Terrain/Terrain%20(16x16).png'
})){const im=new Image();im.crossOrigin='anonymous';im.src=u;A[k]=im}

function knightFrame16(){
 if(!p)return 0;
 if(p.inv>0&&Math.floor(p.inv*12)%2)return 6;
 if(!p.on)return 5;
 if(Math.abs(p.vx)>30)return 1+Math.floor(performance.now()/83)%4;
 return 0;
}
function drawOpenKnight16(){
 if(!p)return;const im=A.openKnight,frame=knightFrame16(),flip=p.face<0;
 if(!(im&&im.complete&&im.naturalWidth)){drawKnightHero14();return}
 const fw=192,fh=256,col=frame%10,row=Math.floor(frame/10),dw=58,dh=78;
 ctx.save();ctx.imageSmoothingEnabled=false;
 if(flip){ctx.translate(p.x+dw-5,0);ctx.scale(-1,1);ctx.drawImage(im,col*fw,row*fh,fw,fh,0,p.y-27,dw,dh)}
 else ctx.drawImage(im,col*fw,row*fh,fw,fh,p.x-5,p.y-27,dw,dh);
 ctx.restore();
 // Use the existing real sword sprite and animation timing for attacks.
 if(typeof handboundPoseV11==='function'&&typeof drawHandboundWeaponV11==='function'){
  const pose=handboundPoseV11();drawHandboundWeaponV11(meta.equipped,p.x+p.w/2,p.y,pose);
 }
}
drawPlayer=drawOpenKnight16;

function bgImageFor16(){if(!w)return A.bgGreen;return w.theme==='cave'?A.bgGray:w.theme==='sky'?A.bgBlue:w.theme==='lava'?A.bgBrown:w.theme==='castle'?A.bgPurple:A.bgGreen}
function tiledBackground16(im,scale,parallax,alpha,yOff=0){
 if(!(im&&im.complete&&im.naturalWidth))return;ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=false;
 const h=VH*scale,wid=h*(im.naturalWidth/im.naturalHeight),off=-((cam*parallax)%wid)-wid;
 for(let x=off;x<VW+wid;x+=wid)ctx.drawImage(im,x,yOff,wid,h);ctx.restore();
}
function liveBackground16(){
 const im=bgImageFor16();ctx.fillStyle='#070a10';ctx.fillRect(0,0,VW,VH);
 tiledBackground16(im,1.05,.035,.50,-5);tiledBackground16(im,.82,.10,.34,95);tiledBackground16(im,.62,.21,.24,205);
 const g=ctx.createLinearGradient(0,0,0,VH);g.addColorStop(0,'#03050a22');g.addColorStop(1,'#03050acc');ctx.fillStyle=g;ctx.fillRect(0,0,VW,VH);
}
drawBackground=liveBackground16;

function drawSpriteSheet16(im,fw,fh,frame,x,y,dw,dh,flip=false){
 if(!(im&&im.complete&&im.naturalWidth))return false;const cols=Math.max(1,Math.floor(im.naturalWidth/fw)),f=frame%(cols*Math.max(1,Math.floor(im.naturalHeight/fh))),sx=(f%cols)*fw,sy=Math.floor(f/cols)*fh;
 ctx.save();ctx.imageSmoothingEnabled=false;if(flip){ctx.translate(x+dw,0);ctx.scale(-1,1);ctx.drawImage(im,sx,sy,fw,fh,0,y,dw,dh)}else ctx.drawImage(im,sx,sy,fw,fh,x,y,dw,dh);ctx.restore();return true;
}

function worldSpriteLife16(){
 if(!w)return;const now=performance.now();ctx.save();ctx.translate(-cam,0);
 const lo=Math.max(0,Math.floor((cam-100)/420)),hi=Math.ceil((cam+VW+100)/420);
 for(let i=lo;i<=hi;i++){
  const x=i*420+130;
  if(w.theme==='hills'){
   // Animated fruit-like glints + terrain outcrops from the real tilesheet.
   if(A.terrain16?.complete)ctx.drawImage(A.terrain16,96,0,16,16,x,456,64,64);
  }else if(w.theme==='cave'){
   if(A.terrain16?.complete)ctx.drawImage(A.terrain16,128,48,16,16,x,456,64,64);
  }else if(w.theme==='sky'){
   if(A.terrain16?.complete)ctx.drawImage(A.terrain16,160,16,16,16,x,446,72,72);
  }else if(w.theme==='lava'){
   drawSpriteSheet16(A.fire16,16,32,Math.floor(now/70),x,438,40,80,false);
   if(i%2===0)drawSpriteSheet16(A.saw16,38,38,Math.floor(now/65),x+100,462,52,52,false);
  }else{
   if(A.terrain16?.complete)ctx.drawImage(A.terrain16,224,32,16,16,x,448,72,72);
   if(i%3===0)drawSpriteSheet16(A.fire16,16,32,Math.floor(now/70),x+100,440,36,72,false);
  }
 }
 ctx.restore();
}
const worldBefore16=drawWorld;drawWorld=function(){worldBefore16();worldSpriteLife16()};

// Replace the cheapest procedural landmarks with real sprite assets where possible.
landmarks15=function(){if(!w?.landmarks15)return;ctx.save();ctx.translate(-cam,0);for(const a of w.landmarks15){if(a.x<cam-180||a.x>cam+VW+180)continue;
 const k=a.kind%4;if(k===0&&A.terrain16?.complete)ctx.drawImage(A.terrain16,192,64,16,16,a.x,440,80,80);
 else if(k===1)drawSpriteSheet16(A.fire16,16,32,Math.floor(performance.now()/70),a.x+18,430,44,88,false);
 else if(k===2&&A.openShield?.complete&&A.openShield.naturalWidth)ctx.drawImage(A.openShield,a.x,444,70,70);
 else if(A.openGem?.complete&&A.openGem.naturalWidth)ctx.drawImage(A.openGem,a.x+8,450,58,58)}ctx.restore()};

const start16=startGame;startGame=function(from=0){start16(from);toast='OPEN SPRITE WORLD · CC0 СПРАЙТЫ ИЗ GITHUB';toastT=2.8};
refreshMeta();
