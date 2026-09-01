'use strict';

document.title='Skybound Frog — Steel & Souls: Painted Kingdom';
const mt14=document.querySelector('#menu .panel p');
if(mt14)mt14.textContent='Painted Kingdom — герой снова выглядит как рыцарь, а вместо геометрических заглушек у миров теперь рисованные игровые пейзажи.';

// Keep the reliable Pixel Adventure character animation as the body, then build armour,
// helmet, cape and weapon grip around it. This avoids the broken SVG sprite-sheet path.
A.heroV13=null;

function knightPalette14(){
 const skin=meta.skin||'frog';
 if(skin==='pink')return{steel:'#d9c7d8',dark:'#5a3d59',cloth:'#8b3855',eye:'#ffd2d9'};
 if(skin==='virtual')return{steel:'#b8c9d6',dark:'#314653',cloth:'#335d72',eye:'#aef3ff'};
 if(skin==='mask')return{steel:'#d7d0bd',dark:'#49463e',cloth:'#665f55',eye:'#ffe9a6'};
 return{steel:'#bcc7d3',dark:'#384653',cloth:'#486b4d',eye:'#d8ff9a'};
}
function drawKnightHero14(){
 if(!p)return;if(p.inv>0&&Math.floor(p.inv*12)%2)return;
 const pal=knightPalette14(),flip=p.face<0,moving=Math.abs(p.vx)>30;
 const act=!p.on?(p.vy<0?'Jump':'Fall'):moving?'Run':'Idle',skin=meta.skin||'frog',im=A[skin+act];
 const pose=typeof handboundPoseV11==='function'?handboundPoseV11():null;
 const bob=p.on&&!moving&&!p.attack?Math.sin(performance.now()/250)*.7:0;
 ctx.save();ctx.translate(0,bob);
 // cape behind body
 ctx.fillStyle=pal.cloth;ctx.beginPath();const bx=p.x+(flip?27:7);ctx.moveTo(bx,p.y+19);ctx.lineTo(bx+(flip?-9:9),p.y+43);ctx.lineTo(bx+(flip?8:-8),p.y+38);ctx.closePath();ctx.fill();
 // animated base body gives natural legs and jumping
 if(!drawSheet(im,32,32,Math.floor(performance.now()/110),p.x,p.y,48,48,flip)){ctx.fillStyle='#68798a';ctx.fillRect(p.x+8,p.y+12,30,34)}
 // torso plate
 ctx.fillStyle=pal.dark;ctx.fillRect(p.x+10,p.y+21,28,20);ctx.fillStyle=pal.steel;ctx.fillRect(p.x+13,p.y+20,22,16);ctx.fillStyle='#eef3f6';ctx.fillRect(p.x+16,p.y+22,3,11);ctx.fillStyle='#7d8d9d';ctx.fillRect(p.x+29,p.y+22,3,11);
 // helmet, visor and horns/ridge
 ctx.fillStyle=pal.dark;ctx.fillRect(p.x+9,p.y+5,30,18);ctx.fillStyle=pal.steel;ctx.fillRect(p.x+12,p.y+3,24,17);ctx.fillStyle='#758493';ctx.fillRect(p.x+11,p.y+13,26,6);ctx.fillStyle='#111821';ctx.fillRect(p.x+14,p.y+14,20,3);ctx.fillStyle=pal.eye;ctx.fillRect(p.x+(flip?17:29),p.y+14,3,2);
 ctx.fillStyle='#dce5eb';ctx.fillRect(p.x+22,p.y,4,5);ctx.fillRect(p.x+19,p.y+2,10,3);
 // shoulder plates
 ctx.fillStyle=pal.steel;ctx.fillRect(p.x+6,p.y+20,8,8);ctx.fillRect(p.x+34,p.y+20,8,8);
 // weapon is held by the animated hand rig, not floating beside the body
 if(pose&&typeof drawHandboundArmV11==='function'){const cx=p.x+p.w/2;drawHandboundArmV11(cx,p.y,pose.hx,pose.hy,pose.face,false);drawHandboundWeaponV11(meta.equipped,cx,p.y,pose);drawHandboundArmV11(cx,p.y,pose.hx,pose.hy,pose.face,true)}
 ctx.restore();
 if(p.dashT>0){ctx.globalAlpha=.16;ctx.fillStyle='#bfe7ff';for(let i=1;i<4;i++)ctx.fillRect(p.x-p.face*i*17,p.y+9,34,29);ctx.globalAlpha=1}
}
drawPlayer=drawKnightHero14;

function mountain14(x,y,s,far){ctx.fillStyle=far?'#182333':'#101923';ctx.beginPath();ctx.moveTo(x-s,y);ctx.lineTo(x,y-s*.72);ctx.lineTo(x+s,y);ctx.closePath();ctx.fill();ctx.fillStyle=far?'#25364b':'#1c2937';ctx.beginPath();ctx.moveTo(x,y-s*.72);ctx.lineTo(x+s*.38,y-s*.25);ctx.lineTo(x+s,y);ctx.lineTo(x,y);ctx.closePath();ctx.fill()}
function tower14(x,y,h){ctx.fillStyle='#10151f';ctx.fillRect(x,y-h,54,h);ctx.fillRect(x-8,y-h-14,70,16);for(let i=0;i<4;i++){ctx.fillRect(x-8+i*20,y-h-24,10,12)}ctx.fillStyle='#27303e';ctx.fillRect(x+19,y-h+35,16,30);ctx.fillStyle='#090d14';ctx.beginPath();ctx.arc(x+27,y-h+35,8,Math.PI,0);ctx.fill()}
function pine14(x,y,h){ctx.fillStyle='#101b19';ctx.fillRect(x-4,y-h*.3,8,h*.3);for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(x,y-h+k*h*.2);ctx.lineTo(x-h*.18,y-h*.35+k*h*.2);ctx.lineTo(x+h*.18,y-h*.35+k*h*.2);ctx.closePath();ctx.fill()}}
function paintedBackdrop14(){
 if(!w)return;const t=w.theme||'hills',now=performance.now()/1000;
 // opaque atmospheric sky replaces the old circles/triangles layer
 let g=ctx.createLinearGradient(0,0,0,VH);
 if(t==='hills'){g.addColorStop(0,'#182b3b');g.addColorStop(.58,'#35504d');g.addColorStop(1,'#17251f')}
 else if(t==='cave'){g.addColorStop(0,'#070b13');g.addColorStop(.65,'#142234');g.addColorStop(1,'#080b10')}
 else if(t==='sky'){g.addColorStop(0,'#38556f');g.addColorStop(.58,'#7995a7');g.addColorStop(1,'#c3c6b0')}
 else if(t==='lava'){g.addColorStop(0,'#16080c');g.addColorStop(.55,'#4b1518');g.addColorStop(1,'#1c0b0d')}
 else{g.addColorStop(0,'#0a0b16');g.addColorStop(.6,'#242038');g.addColorStop(1,'#0c0d15')}
 ctx.fillStyle=g;ctx.fillRect(0,0,VW,VH);
 ctx.save();
 if(t==='hills'){
  for(let i=-1;i<7;i++)mountain14(i*220-((cam*.035)%220),390,190,true);
  for(let i=-1;i<9;i++)mountain14(i*170-((cam*.09)%170),455,135,false);
  for(let i=-1;i<14;i++)pine14(i*95-((cam*.18)%95),485,105+(i%3)*22);
  ctx.globalAlpha=.22;ctx.fillStyle='#d6e2c7';ctx.fillRect(0,390+Math.sin(now*.3)*5,VW,38);ctx.globalAlpha=1;
 }else if(t==='cave'){
  ctx.fillStyle='#111a28';for(let i=-1;i<11;i++){const x=i*115-((cam*.05)%115);ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+32,115+(i%3)*35);ctx.lineTo(x+64,0);ctx.fill();ctx.beginPath();ctx.moveTo(x,520);ctx.lineTo(x+44,360-(i%2)*55);ctx.lineTo(x+90,520);ctx.fill()}
  ctx.globalAlpha=.18;ctx.fillStyle='#71c9ff';for(let i=0;i<8;i++){const x=i*150-((cam*.12)%150);ctx.fillRect(x,250+(i%3)*45,5,80)}ctx.globalAlpha=1;
 }else if(t==='sky'){
  for(let i=-1;i<7;i++)mountain14(i*230-((cam*.035)%230),470,175,true);
  ctx.fillStyle='#e8edf0';ctx.globalAlpha=.72;for(let i=-1;i<8;i++){const x=i*180-((cam*.10)%180),y=120+(i%3)*72;ctx.fillRect(x,y,125,18);ctx.fillRect(x+28,y-15,70,18)}ctx.globalAlpha=1;
  for(let i=0;i<5;i++)tower14(i*250-((cam*.15)%250)+60,475,180+(i%2)*65);
 }else if(t==='lava'){
  for(let i=-1;i<8;i++)mountain14(i*190-((cam*.04)%190),445,175,true);
  ctx.fillStyle='#08090d';for(let i=0;i<7;i++){const x=i*180-((cam*.13)%180);ctx.fillRect(x,270,24,220);ctx.fillRect(x-18,315,60,16)}
  ctx.globalAlpha=.55;ctx.fillStyle='#ff6338';ctx.fillRect(0,492,VW,48);for(let i=0;i<12;i++){const x=i*91-((cam*.2)%91);ctx.fillRect(x,470+Math.sin(now*2+i)*8,34,30)}ctx.globalAlpha=1;
 }else{
  ctx.fillStyle='#0c0d15';for(let i=-1;i<7;i++)tower14(i*190-((cam*.06)%190),485,230+(i%3)*45);
  ctx.strokeStyle='#49425e';ctx.lineWidth=5;for(let i=0;i<6;i++){const x=i*210-((cam*.12)%210);ctx.beginPath();ctx.moveTo(x,485);ctx.lineTo(x+80,290);ctx.lineTo(x+160,485);ctx.stroke()}
  ctx.globalAlpha=.16;ctx.fillStyle='#b9a6dd';ctx.fillRect(0,340,VW,95);ctx.globalAlpha=1;
 }
 ctx.restore();
}

// Paint our scenery first, then allow only foreground atmosphere from v12.
drawBackground=function(){paintedBackdrop14()};

// Disable v13's geometric SVG decorations; terrain, fire, traps and particles remain.
worldDecorationsV13=function(){};

const start14=startGame;
startGame=function(from=0){start14(from);toast='PAINTED KINGDOM · РЫЦАРЬ И НОВЫЕ ПЕЙЗАЖИ';toastT=2.5};
refreshMeta();
