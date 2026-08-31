// Five-world atmospheric compositor for Arena Satellites v8.
const game=document.getElementById('game');
const app=document.getElementById('app');
const hud=document.getElementById('hud');
const layer=document.createElement('canvas');
layer.id='worldArtV8';
layer.setAttribute('aria-hidden','true');
layer.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1';
app.insertBefore(layer,hud);
const g=layer.getContext('2d');
let W=0,H=0,D=1,last=performance.now(),t=0;
function resize(){D=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;layer.width=W*D;layer.height=H*D;layer.style.width=W+'px';layer.style.height=H+'px';g.setTransform(D,0,0,D,0,0)}
addEventListener('resize',resize);resize();
const worlds=[
 {ru:'КРИСТАЛЬНЫЕ РУИНЫ',en:'CRYSTAL RUINS',tint:'rgba(35,180,220,.08)',glow:'#64edff'},
 {ru:'КСЕНОДЖУНГЛИ',en:'XENO JUNGLE',tint:'rgba(45,180,85,.10)',glow:'#79ff93'},
 {ru:'КРАСНАЯ КУЗНЯ',en:'RED FORGE',tint:'rgba(210,55,20,.12)',glow:'#ff815a'},
 {ru:'ЛЕДЯНАЯ ПУСТОШЬ',en:'FROZEN WASTE',tint:'rgba(90,190,255,.13)',glow:'#bdefff'},
 {ru:'НЕКРОПОЛЬ ПУСТОТЫ',en:'VOID NECROPOLIS',tint:'rgba(115,55,190,.14)',glow:'#cf8cff'}
];
function getSeconds(){const el=document.getElementById('timeText');if(!el)return 0;const m=(el.textContent||'').match(/(\d+):(\d+)/);return m?(+m[1])*60+(+m[2]):0}
function idx(){return Math.min(4,Math.floor(getSeconds()/120))}
function rr(x,y,w,h,r){g.beginPath();g.roundRect(x,y,w,h,r)}
function poly(points){g.beginPath();points.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath()}
function crystal(x,y,s,c){g.save();g.translate(x,y);g.shadowBlur=18;g.shadowColor=c;g.fillStyle=c;g.globalAlpha=.55;poly([[0,-s],[s*.42,-s*.18],[s*.25,s],[-s*.3,s*.45],[-s*.5,-s*.1]]);g.fill();g.globalAlpha=.18;g.fillStyle='#fff';poly([[0,-s],[s*.42,-s*.18],[0,s*.1],[-s*.15,-s*.15]]);g.fill();g.restore()}
function vine(x,y,len){g.save();g.strokeStyle='rgba(92,255,126,.32)';g.lineWidth=4;g.beginPath();g.moveTo(x,y);for(let i=1;i<=5;i++)g.quadraticCurveTo(x+Math.sin(t+i)*18,y+i*len/5-12,x+Math.cos(t*.8+i)*10,y+i*len/5);g.stroke();for(let i=1;i<5;i++){g.fillStyle='rgba(144,255,123,.34)';g.beginPath();g.ellipse(x+Math.sin(t+i)*18,y+i*len/5,10,4,i,0,Math.PI*2);g.fill()}g.restore()}
function forgePipe(x,y){g.save();g.translate(x,y);g.fillStyle='rgba(55,25,20,.75)';rr(-18,-45,36,90,9);g.fill();g.strokeStyle='rgba(255,125,70,.55)';g.lineWidth=3;for(let q=-28;q<=28;q+=28){g.beginPath();g.arc(0,q,16,0,Math.PI*2);g.stroke()}g.fillStyle='rgba(255,115,55,.2)';g.fillRect(-8,-40,16,80);g.restore()}
function iceShard(x,y,s){g.save();g.translate(x,y);g.fillStyle='rgba(190,240,255,.34)';g.strokeStyle='rgba(220,250,255,.65)';g.lineWidth=2;poly([[0,-s],[s*.36,-s*.1],[s*.2,s],[-s*.25,s*.65],[-s*.4,-s*.05]]);g.fill();g.stroke();g.restore()}
function obelisk(x,y,s){g.save();g.translate(x,y);g.fillStyle='rgba(26,15,44,.72)';g.strokeStyle='rgba(205,130,255,.45)';g.lineWidth=2;poly([[0,-s],[s*.35,-s*.45],[s*.28,s*.6],[0,s],[-s*.28,s*.6],[-s*.35,-s*.45]]);g.fill();g.stroke();g.fillStyle='rgba(214,150,255,.42)';g.beginPath();g.arc(0,-s*.15,4,0,Math.PI*2);g.fill();g.restore()}
function particles(kind){for(let i=0;i<22;i++){const seed=i*71.37;let x=(seed*19+t*(kind===2?18:kind===4?5:9))%(W+80)-40;let y=(seed*31+t*(kind===3?7:kind===1?13:5))%(H+80)-40;g.globalAlpha=.12+(i%4)*.035;if(kind===0){g.fillStyle='#7cf2ff';g.beginPath();g.arc(x,y,1.5+(i%3),0,Math.PI*2);g.fill()}else if(kind===1){g.fillStyle='#9dff7a';g.beginPath();g.ellipse(x,y,3,1.5,t+i,0,Math.PI*2);g.fill()}else if(kind===2){g.fillStyle='#ff8b56';g.fillRect(x,y,2+(i%2),5+(i%4))}else if(kind===3){g.fillStyle='#ddf8ff';g.beginPath();g.arc(x,y,1+(i%2),0,Math.PI*2);g.fill()}else{g.fillStyle='#d49bff';g.beginPath();g.arc(x,y,1.5+(i%2),0,Math.PI*2);g.fill()}}g.globalAlpha=1}
function drawWorld(i){const w=worlds[i];g.fillStyle=w.tint;g.fillRect(0,0,W,H);particles(i);
 if(i===0){for(let k=0;k<6;k++){crystal(28+(k%2)*26,110+k*96,18+(k%3)*6,w.glow);crystal(W-30-(k%2)*24,80+k*104,16+(k%2)*8,w.glow)}}
 if(i===1){for(let k=0;k<5;k++){vine(28+k%2*18,35+k*125,95);vine(W-26-k%2*18,10+k*132,110)}g.fillStyle='rgba(75,150,75,.12)';for(let k=0;k<8;k++){g.beginPath();g.arc((k*137+t*5)%W,70+(k*83)%Math.max(100,H-120),18+(k%3)*8,0,Math.PI*2);g.fill()}}
 if(i===2){for(let k=0;k<5;k++){forgePipe(38,120+k*130);forgePipe(W-38,70+k*140)}g.fillStyle='rgba(255,75,35,.08)';for(let k=0;k<4;k++)g.fillRect(0,H-35-k*18,W,7)}
 if(i===3){for(let k=0;k<7;k++){iceShard(28+(k%2)*20,80+k*90,19+(k%3)*5);iceShard(W-30-(k%2)*18,60+k*96,20+(k%2)*7)}g.strokeStyle='rgba(210,248,255,.13)';g.lineWidth=2;for(let k=0;k<7;k++){g.beginPath();g.moveTo(0,120+k*83);g.lineTo(W,70+k*86);g.stroke()}}
 if(i===4){for(let k=0;k<6;k++){obelisk(33+(k%2)*15,95+k*105,28+(k%2)*7);obelisk(W-34-(k%2)*14,60+k*112,30+(k%3)*5)}g.strokeStyle='rgba(190,110,255,.13)';g.lineWidth=2;for(let r=90;r<Math.min(W,H);r+=90){g.beginPath();g.arc(W/2,H/2,r,0,Math.PI*2);g.stroke()}}
 const vg=g.createRadialGradient(W/2,H/2,Math.min(W,H)*.18,W/2,H/2,Math.max(W,H)*.72);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,i===4?'rgba(15,2,28,.5)':'rgba(0,0,0,.33)');g.fillStyle=vg;g.fillRect(0,0,W,H);
 g.fillStyle='rgba(4,8,15,.72)';rr(W/2-104,H-94,208,26,13);g.fill();g.fillStyle=w.glow;g.font='800 12px system-ui';g.textAlign='center';g.fillText(w.ru,W/2,H-76)}
function frame(now){const dt=Math.min(.05,(now-last)/1000||0);last=now;t+=dt;g.clearRect(0,0,W,H);if(hud&&!hud.classList.contains('hidden'))drawWorld(idx());requestAnimationFrame(frame)}requestAnimationFrame(frame);