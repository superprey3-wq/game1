'use strict';

document.title='Skybound Frog — Steel & Souls: Living Worlds';
const menuTextV12=document.querySelector('#menu .panel p');
if(menuTextV12)menuTextV12.textContent='Living Worlds — миры стали глубже: многослойный параллакс, туман, светлячки, пепел, снег, новые опасности и пружины из CC0 Pixel Adventure.';

// Pixel Adventure by Pixel Frog — CC0.
A.trampolineIdle=new Image();A.trampolineIdle.crossOrigin='anonymous';A.trampolineIdle.src='https://raw.githubusercontent.com/marpor/PixelAdventure/main/PixelAdventure/Traps/Trampoline/Idle.png';
A.trampolineJump=new Image();A.trampolineJump.crossOrigin='anonymous';A.trampolineJump.src='https://raw.githubusercontent.com/marpor/PixelAdventure/main/PixelAdventure/Traps/Trampoline/Jump%20(28x28).png';
A.sawV12=new Image();A.sawV12.crossOrigin='anonymous';A.sawV12.src='https://raw.githubusercontent.com/marpor/PixelAdventure/main/PixelAdventure/Traps/Saw/On%20(38x38).png';

const WORLD_LOOK={
 hills:{fog:'#b9f3c6',glow:'#ffeaa6',particle:'#dfffb2'},
 cave:{fog:'#7385aa',glow:'#9ed9ff',particle:'#9ed9ff'},
 sky:{fog:'#e9f7ff',glow:'#fff1ae',particle:'#ffffff'},
 lava:{fog:'#702630',glow:'#ff944d',particle:'#ffb05a'},
 castle:{fog:'#6a6383',glow:'#c6a7ff',particle:'#b7a4d6'}
};

function worldLookV12(){return WORLD_LOOK[w?.theme]||WORLD_LOOK.hills}
function hillBandV12(y,amp,step,parallax,alpha){
 ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=w?.theme==='lava'?'#170b10':w?.theme==='cave'?'#09101a':w?.theme==='castle'?'#10101a':'#10251f';
 const off=-((cam*parallax)%step)-step;ctx.beginPath();ctx.moveTo(off,VH);for(let x=off;x<VW+step;x+=step){ctx.lineTo(x,y);ctx.quadraticCurveTo(x+step*.5,y-amp,x+step,y)}ctx.lineTo(VW+step,VH);ctx.closePath();ctx.fill();ctx.restore();
}
function atmosphericV12(){
 const look=worldLookV12(),now=performance.now()/1000;
 hillBandV12(420,90,260,.055,.44);hillBandV12(465,55,210,.11,.55);
 ctx.save();
 if(w?.theme==='hills'){
  for(let i=0;i<18;i++){const x=((i*149-cam*.22+now*9)%(VW+180))-90,y=120+(i*47)%300;ctx.globalAlpha=.18+.12*Math.sin(now+i);ctx.fillStyle=look.particle;ctx.beginPath();ctx.arc(x,y,2+(i%3),0,Math.PI*2);ctx.fill()}
 }else if(w?.theme==='cave'){
  for(let i=0;i<22;i++){const x=(i*113-cam*.08)%VW,y=70+(i*83)%430;ctx.globalAlpha=.12+.1*Math.sin(now*1.7+i);ctx.fillStyle=look.glow;ctx.fillRect(x,y,2,10+(i%4)*4)}
 }else if(w?.theme==='sky'){
  for(let i=0;i<15;i++){const x=((i*191-cam*.16+now*18)%(VW+240))-120,y=50+(i*61)%260;ctx.globalAlpha=.42;ctx.fillStyle='#fff';ctx.beginPath();ctx.ellipse(x,y,38+(i%3)*16,12+(i%2)*6,0,0,Math.PI*2);ctx.fill()}
 }else if(w?.theme==='lava'){
  for(let i=0;i<26;i++){const x=((i*97-cam*.18+Math.sin(i)*60)%(VW+100))-50,y=500-((now*(34+i%5)*7+i*67)%430);ctx.globalAlpha=.25+.35*(i%3)/3;ctx.fillStyle=look.particle;ctx.fillRect(x,y,3+(i%2)*2,3+(i%3))}
 }else{
  for(let i=0;i<18;i++){const x=((i*137-cam*.1+now*7)%(VW+120))-60,y=70+(i*71)%410;ctx.globalAlpha=.18;ctx.fillStyle=look.particle;ctx.beginPath();ctx.arc(x,y,1.5+(i%2),0,Math.PI*2);ctx.fill()}
 }
 ctx.restore();
 const grad=ctx.createLinearGradient(0,0,0,VH);grad.addColorStop(0,'transparent');grad.addColorStop(1,look.fog+'22');ctx.fillStyle=grad;ctx.fillRect(0,0,VW,VH);
}

const drawBackgroundV11=drawBackground;
drawBackground=function(){drawBackgroundV11();atmosphericV12()};

const makeWorldV12Base=makeWorld;
makeWorld=function(i){
 makeWorldV12Base(i);w.trampolines=[];w.sawsV12=[];
 if(!inDungeon){
  if(i===0){w.trampolines.push({x:1640,y:492,w:42,h:28,b:0});w.sawsV12.push({x:2860,y:470,w:48,h:48})}
  if(i===1){w.trampolines.push({x:980,y:492,w:42,h:28,b:0},{x:2460,y:492,w:42,h:28,b:0});w.sawsV12.push({x:1880,y:468,w:48,h:48})}
  if(i>=2){w.trampolines.push({x:1350,y:492,w:42,h:28,b:0});w.sawsV12.push({x:2140,y:468,w:48,h:48},{x:3220,y:468,w:48,h:48})}
 }
};

function drawExtraWorldV12(){
 ctx.save();ctx.translate(-cam,0);const now=performance.now();
 for(const q of (w.trampolines||[])){
  const bouncing=q.b>0,im=bouncing?A.trampolineJump:A.trampolineIdle;
  if(im?.complete&&im.naturalWidth){if(bouncing)drawSheet(im,28,28,Math.floor(now/55),q.x,q.y-8,48,48,false);else ctx.drawImage(im,q.x,q.y,48,28)}
 }
 for(const s of (w.sawsV12||[])){
  if(A.sawV12?.complete&&A.sawV12.naturalWidth)drawSheet(A.sawV12,38,38,Math.floor(now/65),s.x,s.y,s.w,s.h,false);
 }
 ctx.restore();
}

const drawWorldV12Base=drawWorld;
drawWorld=function(){drawWorldV12Base();drawExtraWorldV12()};

const updateShotsV12Base=updateShots;
updateShots=function(dt){
 updateShotsV12Base(dt);if(!p||!w)return;
 for(const q of (w.trampolines||[])){
  q.b=Math.max(0,(q.b||0)-dt);const feet=p.y+p.h;
  if(p.vy>0&&p.x+p.w>q.x+4&&p.x<q.x+q.w-4&&feet>=q.y&&feet<=q.y+24){p.y=q.y-p.h+2;p.vy=-1120;p.on=false;q.b=.24;try{snd('jump')}catch(e){};toast='ПРУЖИНА · ВЫСОКИЙ ПРЫЖОК';toastT=.9}
 }
};

const startGameV12Base=startGame;
startGame=function(from=0){startGameV12Base(from);toast='LIVING WORLDS · НОВЫЕ МИРЫ И ОПАСНОСТИ';toastT=2.2};

refreshMeta();
