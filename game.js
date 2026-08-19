import {YandexBridge} from './yandex.js';

const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const $=id=>document.getElementById(id); let W=0,H=0,DPR=1;
function resize(){DPR=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;canvas.width=W*DPR;canvas.height=H*DPR;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(DPR,0,0,DPR,0,0)}
addEventListener('resize',resize);resize(); document.addEventListener('contextmenu',e=>e.preventDefault());

const bridge=new YandexBridge(); await bridge.init();
const HEROES=[
 {id:'knight',icon:'🛡️',name:'Рыцарь',desc:'+30% HP',hp:130,speed:180,rate:.75,damage:22,range:360,color:'#75a7ff'},
 {id:'mage',icon:'🔮',name:'Маг',desc:'+урон',hp:85,speed:175,rate:.95,damage:34,range:410,color:'#bd7dff'},
 {id:'ranger',icon:'🏹',name:'Следопыт',desc:'быстрее стреляет',hp:95,speed:195,rate:.48,damage:18,range:450,color:'#68e39a'},
 {id:'berserk',icon:'🪓',name:'Берсерк',desc:'урон вблизи',hp:120,speed:185,rate:.62,damage:28,range:300,color:'#ff6b67'},
 {id:'rogue',icon:'🗡️',name:'Тень',desc:'+скорость',hp:90,speed:230,rate:.56,damage:20,range:330,color:'#ffd15c'}
];
const PETS=[
 {id:'fox',icon:'🦊',name:'Лис',desc:'+10% скорость',apply:p=>p.speed*=1.1},
 {id:'owl',icon:'🦉',name:'Сова',desc:'+12% опыт',apply:p=>p.xpBonus=1.12},
 {id:'slime',icon:'🟢',name:'Слайм',desc:'лечение',apply:p=>p.regen=.8},
 {id:'dragon',icon:'🐉',name:'Дракон',desc:'+15% урон',apply:p=>p.damage*=1.15},
 {id:'wolf',icon:'🐺',name:'Волк',desc:'+12% атака',apply:p=>p.rate*=.88}
];
const UPGRADES=[
 {name:'Сила',desc:'+20% урон',apply:p=>p.damage*=1.2},
 {name:'Скорострельность',desc:'-15% перезарядка',apply:p=>p.rate*=.85},
 {name:'Живучесть',desc:'+25 макс. HP и лечение',apply:p=>{p.maxHp+=25;p.hp=Math.min(p.maxHp,p.hp+25)}},
 {name:'Скорость',desc:'+12% скорость движения',apply:p=>p.speed*=1.12},
 {name:'Магнит',desc:'+45 радиус сбора опыта',apply:p=>p.pickup+=45},
 {name:'Пробивание',desc:'+1 цель для снаряда',apply:p=>p.pierce++},
 {name:'Большой выстрел',desc:'+20% размер снаряда',apply:p=>p.bulletSize*=1.2},
 {name:'Удача',desc:'+8% шанс критического удара',apply:p=>p.crit=Math.min(.6,p.crit+.08)},
 {name:'Восстановление',desc:'+1 HP/сек',apply:p=>p.regen+=1}
];

let save=await bridge.load()||{best:0,runs:0,kills:0};
let state='menu',heroPick=null,petPick=null,player,enemies=[],bullets=[],gems=[],particles=[];
let keys={},joy={active:false,x:0,y:0,dx:0,dy:0,id:null},last=performance.now(),elapsed=0,spawnTimer=0,bossIndex=0,kills=0,level=1,xp=0,xpNeed=18,shotTimer=0,paused=false,shake=0;

function show(id){['menu','select','upgrade','pause','result','help'].forEach(x=>$(x).classList.toggle('hidden',x!==id));$('hud').classList.toggle('hidden',!['play','upgrade','pause'].includes(id));$('joystick').classList.add('hidden')}
function menu(){state='menu';paused=false;show('menu');bridge.gameplayStop();$('bestText').textContent=`Лучшее время: ${fmt(save.best||0)} · Забегов: ${save.runs||0}`}
function fillSelections(){
 $('heroes').innerHTML=HEROES.map(h=>`<div class="card" data-hero="${h.id}"><div class="icon">${h.icon}</div><b>${h.name}</b><small>${h.desc}</small></div>`).join('');
 $('pets').innerHTML=PETS.map(p=>`<div class="card" data-pet="${p.id}"><div class="icon">${p.icon}</div><b>${p.name}</b><small>${p.desc}</small></div>`).join('');
 document.querySelectorAll('[data-hero]').forEach(el=>el.onclick=()=>{heroPick=el.dataset.hero;document.querySelectorAll('[data-hero]').forEach(x=>x.classList.toggle('selected',x===el));checkStart()});
 document.querySelectorAll('[data-pet]').forEach(el=>el.onclick=()=>{petPick=el.dataset.pet;document.querySelectorAll('[data-pet]').forEach(x=>x.classList.toggle('selected',x===el));checkStart()});
}
function checkStart(){$('startBtn').disabled=!(heroPick&&petPick)} fillSelections(); menu();

$('playBtn').onclick=()=>{show('select');state='select'};$('backBtn').onclick=menu;$('howBtn').onclick=()=>{show('help');state='help'};$('helpBackBtn').onclick=menu;
$('startBtn').onclick=startGame;$('pauseBtn').onclick=togglePause;$('resumeBtn').onclick=togglePause;$('quitBtn').onclick=endToMenu;$('retryBtn').onclick=startGame;$('resultMenuBtn').onclick=menu;

function startGame(){
 const h=HEROES.find(x=>x.id===heroPick)||HEROES[0],pet=PETS.find(x=>x.id===petPick)||PETS[0];
 player={x:W/2,y:H/2,r:18,maxHp:h.hp,hp:h.hp,speed:h.speed,rate:h.rate,damage:h.damage,range:h.range,color:h.color,pickup:90,pierce:0,bulletSize:1,crit:.05,regen:0,xpBonus:1}; pet.apply(player);
 enemies=[];bullets=[];gems=[];particles=[];elapsed=0;spawnTimer=0;bossIndex=0;kills=0;level=1;xp=0;xpNeed=18;shotTimer=0;paused=false;state='play';show('play');bridge.gameplayStart();last=performance.now();
}
function togglePause(){if(state!=='play'&&state!=='pause')return;paused=!paused;if(paused){state='pause';show('pause');bridge.gameplayStop()}else{state='play';show('play');bridge.gameplayStart();last=performance.now()}}
function endToMenu(){save.best=Math.max(save.best||0,elapsed);save.runs=(save.runs||0)+1;save.kills=(save.kills||0)+kills;bridge.save(save);menu()}
function gameOver(win=false){state='result';paused=true;bridge.gameplayStop();save.best=Math.max(save.best||0,elapsed);save.runs=(save.runs||0)+1;save.kills=(save.kills||0)+kills;bridge.save(save);$('resultTitle').textContent=win?'Победа!':'Забег окончен';$('resultStats').innerHTML=`<p>Время: <b>${fmt(elapsed)}</b></p><p>Уровень: <b>${level}</b></p><p>Побеждено врагов: <b>${kills}</b></p>`;show('result')}

function spawnEnemy(boss=false){
 const a=Math.random()*Math.PI*2,d=Math.max(W,H)*.65+80,x=player.x+Math.cos(a)*d,y=player.y+Math.sin(a)*d;
 const scale=1+elapsed/220;let r=12+Math.random()*8,hp=24*scale,spd=55+Math.random()*25,damage=9;
 if(boss){r=38;hp=650*(1+bossIndex*.35);spd=48;damage=22}
 enemies.push({x,y,r,hp,maxHp:hp,spd,damage,boss,hit:0,color:boss?'#ffb347':'#ff6577'});
}
function nearestEnemy(){let best=null,bd=player.range*player.range;for(const e of enemies){const dx=e.x-player.x,dy=e.y-player.y,d=dx*dx+dy*dy;if(d<bd){bd=d;best=e}}return best}
function shoot(){const e=nearestEnemy();if(!e)return;const dx=e.x-player.x,dy=e.y-player.y,l=Math.hypot(dx,dy)||1;bullets.push({x:player.x,y:player.y,vx:dx/l*560,vy:dy/l*560,r:5*player.bulletSize,damage:player.damage*(Math.random()<player.crit?2:1),life:1.2,pierce:player.pierce})}
function levelUp(){level++;xp-=xpNeed;xpNeed=Math.floor(xpNeed*1.28+6);state='upgrade';paused=true;bridge.gameplayStop();show('upgrade');const choices=[...UPGRADES].sort(()=>Math.random()-.5).slice(0,3);$('upgradeCards').innerHTML='';for(const u of choices){const b=document.createElement('button');b.className='upgradeCard';b.innerHTML=`<b>${u.name}</b><span>${u.desc}</span>`;b.onclick=()=>{u.apply(player);paused=false;state='play';show('play');bridge.gameplayStart();last=performance.now()};$('upgradeCards').appendChild(b)}}

function update(dt){
 if(state!=='play'||paused)return;elapsed+=dt;if(elapsed>=600){gameOver(true);return}
 let mx=(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0),my=(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0);if(joy.active){mx=joy.dx;my=joy.dy}const ml=Math.hypot(mx,my)||1;player.x+=mx/ml*player.speed*dt;player.y+=my/ml*player.speed*dt;
 if(player.regen)player.hp=Math.min(player.maxHp,player.hp+player.regen*dt);
 shotTimer-=dt;if(shotTimer<=0){shoot();shotTimer=player.rate}
 const wave=1+Math.floor(elapsed/60);spawnTimer-=dt;if(spawnTimer<=0){spawnEnemy(false);if(elapsed>90&&Math.random()<.22)spawnEnemy(false);spawnTimer=Math.max(.18,.72-elapsed/900)}
 const wantedBoss=Math.floor(elapsed/120);if(wantedBoss>bossIndex){bossIndex=wantedBoss;spawnEnemy(true)}
 for(let i=enemies.length-1;i>=0;i--){const e=enemies[i],dx=player.x-e.x,dy=player.y-e.y,l=Math.hypot(dx,dy)||1;e.x+=dx/l*e.spd*dt;e.y+=dy/l*e.spd*dt;e.hit=Math.max(0,e.hit-dt);if(l<player.r+e.r){player.hp-=e.damage*dt;e.hit=.1;shake=6;if(player.hp<=0){gameOver(false);return}}}
 for(let i=bullets.length-1;i>=0;i--){const b=bullets[i];b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;let remove=b.life<=0;for(let j=enemies.length-1;j>=0&&!remove;j--){const e=enemies[j];if(Math.hypot(b.x-e.x,b.y-e.y)<b.r+e.r){e.hp-=b.damage;e.hit=.08;if(b.pierce>0)b.pierce--;else remove=true;if(e.hp<=0){kills++;gems.push({x:e.x,y:e.y,r:e.boss?9:6,val:e.boss?25:5});burst(e.x,e.y,e.color);enemies.splice(j,1)}}}if(remove)bullets.splice(i,1)}
 for(let i=gems.length-1;i>=0;i--){const g=gems[i],dx=player.x-g.x,dy=player.y-g.y,l=Math.hypot(dx,dy);if(l<player.pickup){const s=Math.max(160,500*(1-l/player.pickup));g.x+=dx/(l||1)*s*dt;g.y+=dy/(l||1)*s*dt}if(l<player.r+12){xp+=g.val*player.xpBonus;gems.splice(i,1);if(xp>=xpNeed)levelUp()}}
 for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(p.life<=0)particles.splice(i,1)}shake=Math.max(0,shake-20*dt);updateHud(wave)
}
function burst(x,y,color){for(let i=0;i<8;i++){const a=Math.random()*Math.PI*2,s=50+Math.random()*120;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.35,color})}}
function updateHud(wave){$('hpText').textContent=`❤ ${Math.ceil(player.hp)}/${Math.ceil(player.maxHp)}`;$('lvlText').textContent=`УР. ${level} · ВОЛНА ${wave}`;$('timeText').textContent=fmt(elapsed);$('xpFill').style.width=Math.min(100,xp/xpNeed*100)+'%'}
function fmt(s){const m=Math.floor(s/60),ss=Math.floor(s%60);return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`}

function draw(){ctx.clearRect(0,0,W,H);drawGrid();if(!player||!['play','upgrade','pause','result'].includes(state))return;ctx.save();if(shake)ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);const ox=W/2-player.x,oy=H/2-player.y;ctx.translate(ox,oy);
 for(const g of gems){ctx.fillStyle='#64e8ff';ctx.beginPath();ctx.arc(g.x,g.y,g.r,0,Math.PI*2);ctx.fill()}
 for(const b of bullets){ctx.fillStyle='#ffe273';ctx.shadowColor='#ffd05b';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}
 for(const e of enemies){ctx.fillStyle=e.hit?'#fff':e.color;ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);ctx.fill();if(e.boss){ctx.fillStyle='#27141a';ctx.fillRect(e.x-e.r,e.y-e.r-12,e.r*2,6);ctx.fillStyle='#ffce5b';ctx.fillRect(e.x-e.r,e.y-e.r-12,e.r*2*(e.hp/e.maxHp),6)}}
 for(const p of particles){ctx.globalAlpha=Math.max(0,p.life/.35);ctx.fillStyle=p.color;ctx.fillRect(p.x-2,p.y-2,4,4)}ctx.globalAlpha=1;
 ctx.fillStyle=player.color;ctx.shadowColor=player.color;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(player.x,player.y,player.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(player.x+5,player.y-4,3,0,Math.PI*2);ctx.fill();
 ctx.restore()}
function drawGrid(){ctx.save();ctx.strokeStyle='rgba(255,255,255,.035)';ctx.lineWidth=1;const step=64,ox=player?(-player.x%step):0,oy=player?(-player.y%step):0;for(let x=ox;x<W;x+=step){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}for(let y=oy;y<H;y+=step){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}ctx.restore()}
function loop(now){const dt=Math.min(.033,(now-last)/1000||0);last=now;update(dt);draw();requestAnimationFrame(loop)}requestAnimationFrame(loop);

addEventListener('keydown',e=>{keys[e.key]=true;if((e.key==='Escape'||e.key==='p'||e.key==='P')&&(state==='play'||state==='pause'))togglePause()});addEventListener('keyup',e=>keys[e.key]=false);
function touchStart(e){if(state!=='play'||paused)return;for(const t of e.changedTouches){if(t.clientX<W*.62&&!joy.active){joy.active=true;joy.id=t.identifier;joy.x=t.clientX;joy.y=t.clientY;joy.dx=joy.dy=0;$('joystick').style.left=(joy.x-54)+'px';$('joystick').style.top=(joy.y-54)+'px';$('joystick').classList.remove('hidden')}}}
function touchMove(e){if(!joy.active)return;for(const t of e.changedTouches)if(t.identifier===joy.id){let dx=t.clientX-joy.x,dy=t.clientY-joy.y,l=Math.hypot(dx,dy),m=40;if(l>m){dx*=m/l;dy*=m/l}joy.dx=dx/m;joy.dy=dy/m;$('stick').style.transform=`translate(${dx}px,${dy}px)`}}
function touchEnd(e){for(const t of e.changedTouches)if(t.identifier===joy.id){joy.active=false;joy.dx=joy.dy=0;joy.id=null;$('stick').style.transform='';$('joystick').classList.add('hidden')}}
canvas.addEventListener('touchstart',touchStart,{passive:false});canvas.addEventListener('touchmove',touchMove,{passive:false});canvas.addEventListener('touchend',touchEnd,{passive:false});canvas.addEventListener('touchcancel',touchEnd,{passive:false});

document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play'){paused=true;state='pause';show('pause');bridge.gameplayStop()}});
window.addEventListener('blur',()=>{if(state==='play'){paused=true;state='pause';show('pause');bridge.gameplayStop()}});
