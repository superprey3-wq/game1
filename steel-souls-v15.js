'use strict';

document.title='Skybound Frog — Steel & Souls: Ashen Realms';

// Premium dark-fantasy menu treatment.
const css15=document.createElement('style');css15.textContent=`
#menu{background:radial-gradient(circle at 52% 34%,#26324899 0,#0b1019ee 42%,#03050af8 100%)!important;overflow:hidden}
#menu:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,#000b,#0002 42%,#0008),repeating-linear-gradient(0deg,#ffffff08 0 1px,transparent 1px 4px);pointer-events:none}
#menu .panel{position:relative;width:min(980px,96vw);min-height:min(560px,92vh);display:grid;grid-template-columns:minmax(300px,1.15fr) minmax(280px,.85fr);grid-template-rows:auto auto 1fr auto;gap:14px 34px;align-items:start;text-align:left;padding:46px 48px;border:1px solid #77839788;border-radius:3px;background:linear-gradient(135deg,#0a0f17f2,#101725e8 62%,#080b12f2);box-shadow:0 0 0 1px #000 inset,0 35px 90px #000e,0 0 80px #52627a22;overflow:hidden}
#menu .panel:before{content:"";position:absolute;left:-40px;bottom:-40px;width:410px;height:410px;border:1px solid #95a2b322;border-radius:50%;box-shadow:0 0 0 24px #0000,0 0 0 25px #95a2b314,0 0 0 78px #0000,0 0 0 79px #95a2b30d;pointer-events:none}
#menu h1{grid-column:1;font-family:Georgia,serif;font-size:clamp(42px,7vw,76px)!important;letter-spacing:.08em;line-height:.85!important;text-shadow:0 3px 0 #000,0 0 24px #b7c2d044;margin-top:4px!important;color:#e6e2d6}
#menu h1:after{content:"STEEL & SOULS";display:block;margin-top:18px;font:600 12px Arial;letter-spacing:.42em;color:#9ba8b8}
#menu p{grid-column:1;max-width:620px;margin:0!important;color:#aeb8c5!important;font-family:Georgia,serif;font-weight:400!important;font-size:15px;line-height:1.65!important}
#menu .stats{grid-column:2;grid-row:1/3;align-self:start;display:grid!important;grid-template-columns:1fr 1fr;gap:8px!important;margin:0!important;padding:16px;border-left:1px solid #71809855;background:#060a10a8}
#menu .stat{border-radius:1px!important;border:1px solid #67758a55;background:#111925c7!important;padding:11px 12px!important;font-size:12px;letter-spacing:.04em;color:#d3dbe4;box-shadow:none!important}
#menu .btn{grid-column:2;width:100%;margin:0 0 8px!important;border:1px solid #8d98a766!important;border-radius:1px!important;padding:13px 18px!important;text-align:left;font-family:Georgia,serif;font-size:15px!important;letter-spacing:.08em;color:#dce3ea!important;background:linear-gradient(90deg,#1b2634,#111821)!important;box-shadow:none!important;transition:.16s transform,.16s background,.16s border-color}
#menu .btn:hover{transform:translateX(5px);background:linear-gradient(90deg,#36485e,#17202b)!important;border-color:#c2ccd8aa!important}
#menu #playBtn{margin-top:2px!important;border-left:3px solid #d7c38a!important;background:linear-gradient(90deg,#4b4430,#1b1c1b)!important;color:#fff0c8!important}
#menu .panel>div[style*="font-size:13px"]{grid-column:1/3;margin-top:8px!important;padding-top:14px;border-top:1px solid #69748744;color:#8793a4;letter-spacing:.05em}
@media(max-width:760px){#menu .panel{display:block;min-height:0;padding:26px 20px}#menu .stats{margin:18px 0!important}#menu .btn{width:100%}#menu h1{font-size:48px!important}}
`;
document.head.appendChild(css15);
const p15=document.querySelector('#menu .panel p');if(p15)p15.textContent='Пепельное королевство помнит каждого, кто пытался дойти до Трона. Исследуй руины, находи костры, говори с выжившими и сражайся клинком.';
const h15=document.querySelector('#menu h1');if(h15)h15.innerHTML='HOLLOW<br>CROWN';
const play15=document.getElementById('playBtn');if(play15)play15.textContent='НАЧАТЬ ПУТЬ';
const cont15=document.getElementById('continueBtn');if(cont15)cont15.textContent='ПРОДОЛЖИТЬ ПУТЬ';
const shop15=document.getElementById('shopBtn');if(shop15)shop15.textContent='АЛТАРЬ ДУШ';
const skin15=document.getElementById('skinsBtn');if(skin15)skin15.textContent='ДОСПЕХИ И ОБЛИКИ';
const lore15=document.getElementById('journalBtn');if(lore15)lore15.textContent='ЛЕТОПИСЬ КОРОЛЕВСТВА';

function moon15(x,y,r){ctx.save();ctx.globalAlpha=.68;ctx.fillStyle='#e5e1d0';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(x+r*.34,y-r*.12,r*.92,0,Math.PI*2);ctx.fill();ctx.restore()}
function ruins15(x,ground,s){ctx.fillStyle='#151b24';ctx.fillRect(x,ground-110*s,72*s,110*s);ctx.fillRect(x+84*s,ground-155*s,46*s,155*s);ctx.fillRect(x+142*s,ground-82*s,58*s,82*s);ctx.fillStyle='#222c38';for(let i=0;i<5;i++)ctx.fillRect(x+8*s+i*35*s,ground-(72+(i%2)*34)*s,13*s,20*s)}
function waterfall15(x,y,h){ctx.save();const g=ctx.createLinearGradient(x,0,x+36,0);g.addColorStop(0,'#9ed9e822');g.addColorStop(.5,'#d8f4ff99');g.addColorStop(1,'#75b9cf22');ctx.fillStyle=g;ctx.fillRect(x,y,36,h);ctx.globalAlpha=.35;ctx.fillStyle='#e9fbff';for(let i=0;i<5;i++)ctx.fillRect(x+4+i*7,y+((performance.now()/9+i*31)%h),2,18);ctx.restore()}
function foregroundLife15(){if(!w)return;const t=w.theme||'hills',now=performance.now()/1000;ctx.save();
 if(t==='hills'){
  for(let i=0;i<7;i++){const x=((i*173-cam*.38)%(VW+220))-110;ctx.strokeStyle='#1d3328';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,520);ctx.quadraticCurveTo(x-10,482,x+8,455);ctx.stroke();ctx.fillStyle='#294b37';ctx.beginPath();ctx.ellipse(x+5,466,15,6,-.4,0,Math.PI*2);ctx.fill()}
  for(let i=0;i<5;i++){const x=((i*244+now*26-cam*.12)%(VW+160))-80,y=150+(i*71)%210;ctx.strokeStyle='#c9d6c1aa';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(x-5,y);ctx.quadraticCurveTo(x,y-5,x+5,y);ctx.quadraticCurveTo(x+10,y-5,x+15,y);ctx.stroke()}
 }else if(t==='cave'){
  for(let i=0;i<6;i++){const x=i*190-((cam*.3)%190);ctx.fillStyle='#17304a';ctx.beginPath();ctx.ellipse(x,505,44,12,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=.3;ctx.fillStyle='#70d7ff';ctx.beginPath();ctx.ellipse(x,501,28,5,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}
  if((Math.floor(cam/900)%2)===0)waterfall15(790-(cam*.08%900),145,340);
 }else if(t==='sky'){
  ctx.strokeStyle='#29313b99';ctx.lineWidth=3;for(let i=0;i<4;i++){const x=i*290-((cam*.2)%290)+80;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+Math.sin(now+i)*10,250);ctx.stroke()}
  for(let i=0;i<4;i++){const x=i*270-((cam*.3)%270)+40,y=410+(i%2)*30;ctx.fillStyle='#c5d1b9';ctx.beginPath();ctx.ellipse(x,y,32,10,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#6e8d72';ctx.fillRect(x-2,y-42,4,40);ctx.beginPath();ctx.arc(x,y-44,18,0,Math.PI*2);ctx.fill()}
 }else if(t==='lava'){
  for(let i=0;i<8;i++){const x=i*145-((cam*.35)%145);ctx.globalAlpha=.8;ctx.fillStyle='#ff5b2d';const h=15+10*Math.sin(now*3+i);ctx.beginPath();ctx.moveTo(x,520);ctx.quadraticCurveTo(x+8,500-h,x+16,520);ctx.fill()}ctx.globalAlpha=1;
 }else{
  for(let i=0;i<5;i++){const x=i*230-((cam*.25)%230)+60;ctx.fillStyle='#090b10';ctx.fillRect(x,410,9,110);ctx.fillStyle='#322744';ctx.fillRect(x-22,420,53,58);ctx.fillStyle='#564267';ctx.fillRect(x-18,424,45,5);}
 }
 ctx.restore()}

const bg14=drawBackground;
drawBackground=function(){bg14();if(!w)return;const t=w.theme||'hills';ctx.save();
 if(t==='hills'){moon15(790,95,52);ruins15(520-((cam*.045)%700),470,.75)}
 else if(t==='cave'){ctx.globalAlpha=.18;ctx.fillStyle='#6bd5ff';ctx.beginPath();ctx.arc(780,170,90,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;ruins15(440-((cam*.04)%620),485,.7)}
 else if(t==='sky'){ruins15(610-((cam*.05)%760),475,.9)}
 else if(t==='lava'){ctx.globalAlpha=.45;ctx.fillStyle='#ff4f2e';ctx.beginPath();ctx.arc(810,150,78,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;ruins15(500-((cam*.05)%720),485,.95)}
 else{moon15(790,110,64);ruins15(470-((cam*.04)%680),490,1.08)}ctx.restore();};

const world14=drawWorld;
drawWorld=function(){world14();foregroundLife15()};

// Add authored landmarks to make stretches feel like places rather than obstacle strips.
const make15=makeWorld;
makeWorld=function(i){make15(i);w.landmarks15=[];
 const len=w.len||8000;for(let x=900;x<len-600;x+=1500)w.landmarks15.push({x:x+((i*197+x)%340),kind:(Math.floor(x/1500)+i)%4});};
function landmarks15(){if(!w?.landmarks15)return;ctx.save();ctx.translate(-cam,0);for(const a of w.landmarks15){if(a.x<cam-200||a.x>cam+VW+200)continue;
 if(a.kind===0){ctx.fillStyle='#202a32';ctx.fillRect(a.x,432,18,88);ctx.fillStyle='#47505a';ctx.fillRect(a.x-8,426,34,10);ctx.fillStyle='#9e8b65';ctx.fillRect(a.x+5,444,8,18)}
 else if(a.kind===1){ctx.fillStyle='#332c28';ctx.fillRect(a.x+12,465,8,55);ctx.fillStyle='#59483b';ctx.beginPath();ctx.moveTo(a.x-18,468);ctx.lineTo(a.x+50,468);ctx.lineTo(a.x+30,438);ctx.lineTo(a.x,438);ctx.closePath();ctx.fill()}
 else if(a.kind===2){ctx.fillStyle='#1a2027';ctx.fillRect(a.x,455,76,65);ctx.clearRect(a.x+23,476,30,44);ctx.strokeStyle='#596674';ctx.lineWidth=3;ctx.strokeRect(a.x,455,76,65)}
 else{ctx.fillStyle='#161a1e';ctx.fillRect(a.x+26,420,16,100);ctx.fillStyle='#514235';ctx.beginPath();ctx.arc(a.x+34,419,27,0,Math.PI*2);ctx.fill();ctx.fillStyle='#d57c40';ctx.beginPath();ctx.arc(a.x+34,419,8+Math.sin(performance.now()/100)*2,0,Math.PI*2);ctx.fill()}}
 ctx.restore()}
const dw15=drawWorld;drawWorld=function(){dw15();landmarks15()};

const st15=startGame;startGame=function(from=0){st15(from);toast='ASHEN REALMS · МИРЫ СТАЛИ ЖИВЕЕ';toastT=2.4};
refreshMeta();
