import {YandexBridge} from './yandex.js';
import {createI18n} from './i18n.js';
import {WORLDS,localized} from './content.js';
import {AudioEngine} from './audio.js';
import {normalizeSave,availableWorlds,applyMeta,completeRun} from './progression.js';

const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const $=id=>document.getElementById(id);
let W=innerWidth,H=innerHeight,DPR=1;
function resize(){DPR=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;canvas.width=W*DPR;canvas.height=H*DPR;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(DPR,0,0,DPR,0,0)}
addEventListener('resize',resize);resize();
document.addEventListener('contextmenu',e=>e.preventDefault());

const bridge=new YandexBridge(); await bridge.init();
const i18n=createI18n(localStorage.getItem('arena_lang')||bridge.lang||'en');
const audio=new AudioEngine();
let save=normalizeSave(await bridge.load()||{});
let state='menu',heroPick='knight',petPick='fox',worldPick='emerald',player=null,pet=null;
let enemies=[],bullets=[],gems=[],particles=[];
let keys={},joy={active:false,dx:0,dy:0,id:null};
let last=performance.now(),elapsed=0,spawnTimer=0,bossIndex=0,bossKills=0,kills=0,level=1,xp=0,xpNeed=18,shotTimer=0,petTimer=0,paused=false,shake=0,revived=false;

const HEROES=[
 {id:'knight',icon:'🛡️',ru:'Рыцарь',en:'Knight',descRu:'+30% HP',descEn:'+30% HP',hp:135,speed:178,rate:.72,damage:23,range:350,color:'#75a7ff'},
 {id:'mage',icon:'🔮',ru:'Маг',en:'Mage',descRu:'Высокий урон',descEn:'High damage',hp:88,speed:174,rate:.92,damage:35,range:420,color:'#bd7dff'},
 {id:'ranger',icon:'🏹',ru:'Следопыт',en:'Ranger',descRu:'Быстрая атака',descEn:'Fast attacks',hp:96,speed:196,rate:.48,damage:19,range:455,color:'#68e39a'},
 {id:'berserk',icon:'🪓',ru:'Берсерк',en:'Berserker',descRu:'Сильный вблизи',descEn:'Close-range power',hp:122,speed:184,rate:.60,damage:29,range:300,color:'#ff6b67'},
 {id:'rogue',icon:'🗡️',ru:'Тень',en:'Shade',descRu:'Очень быстрый',descEn:'Very fast',hp:92,speed:232,rate:.55,damage:21,range:335,color:'#ffd15c'}
];
const PETS=[
 {id:'fox',icon:'🦊',ru:'Лис',en:'Fox',descRu:'+10% скорость',descEn:'+10% speed',color:'#ff9f43',apply:p=>p.speed*=1.1,petDamage:.55,petRate:1.0},
 {id:'owl',icon:'🦉',ru:'Сова',en:'Owl',descRu:'+12% опыта',descEn:'+12% XP',color:'#d8c4ff',apply:p=>p.xpBonus=1.12,petDamage:.7,petRate:1.35},
 {id:'slime',icon:'🟢',ru:'Слайм',en:'Slime',descRu:'Регенерация',descEn:'Regeneration',color:'#64e890',apply:p=>p.regen=.9,petDamage:.45,petRate:.8},
 {id:'dragon',icon:'🐉',ru:'Дракон',en:'Dragon',descRu:'+15% урон',descEn:'+15% damage',color:'#ff756e',apply:p=>p.damage*=1.15,petDamage:.9,petRate:1.45},
 {id:'wolf',icon:'🐺',ru:'Волк',en:'Wolf',descRu:'+12% скорость атаки',descEn:'+12% attack speed',color:'#a8b7c8',apply:p=>p.rate*=.88,petDamage:.75,petRate:1.1}
];
const UPGRADES=[
 {ru:'Сила',en:'Power',descRu:'+20% урон',descEn:'+20% damage',apply:p=>p.damage*=1.2},
 {ru:'Скорострельность',en:'Attack Speed',descRu:'-15% перезарядка',descEn:'-15% cooldown',apply:p=>p.rate*=.85},
 {ru:'Живучесть',en:'Vitality',descRu:'+25 HP и лечение',descEn:'+25 HP and heal',apply:p=>{p.maxHp+=25;p.hp=Math.min(p.maxHp,p.hp+25)}},
 {ru:'Скорость',en:'Speed',descRu:'+12% скорость',descEn:'+12% movement speed',apply:p=>p.speed*=1.12},
 {ru:'Магнит',en:'Magnet',descRu:'+45 радиус сбора',descEn:'+45 pickup radius',apply:p=>p.pickup+=45},
 {ru:'Пробивание',en:'Piercing',descRu:'+1 пробитие',descEn:'+1 pierce',apply:p=>p.pierce++},
 {ru:'Большой выстрел',en:'Big Shot',descRu:'+20% размер',descEn:'+20% projectile size',apply:p=>p.bulletSize*=1.2},
 {ru:'Удача',en:'Luck',descRu:'+8% крит',descEn:'+8% crit chance',apply:p=>p.crit=Math.min(.65,p.crit+.08)},
 {ru:'Восстановление',en:'Recovery',descRu:'+1 HP/сек',descEn:'+1 HP/sec',apply:p=>p.regen+=1}
];

function L(ru,en){return i18n.lang==='ru'?ru:en}
function fmt(s){const m=Math.floor(s/60),ss=Math.floor(s%60);return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`}
function currentWorld(){return WORLDS.find(w=>w.id===worldPick)||WORLDS[0]}
function show(id){['menu','select','upgrade','pause','result','help'].forEach(x=>$(x)?.classList.toggle('hidden',x!==id));$('hud')?.classList.toggle('hidden',!['play','upgrade','pause'].includes(id));$('joystick')?.classList.add('hidden')}
function persist(){bridge.save(save)}

function renderMenu(){
  $('bestText').textContent=`${L('Рекорд','Best')}: ${fmt(save.best)} · ${L('Победы','Wins')}: ${save.victories} · ✦ ${save.coins}`;
  if($('langBtn')) $('langBtn').textContent=i18n.lang==='ru'?'EN':'RU';
}
function menu(){state='menu';paused=false;show('menu');bridge.gameplayStop();bridge.showSticky?.();renderMenu()}

function fillSelections(){
 const heroes=$('heroes'),pets=$('pets'),worlds=$('worlds');
 heroes.innerHTML=HEROES.map(h=>`<button class="card ${heroPick===h.id?'selected':''}" data-hero="${h.id}"><div class="icon">${h.icon}</div><b>${L(h.ru,h.en)}</b><small>${L(h.descRu,h.descEn)}</small></button>`).join('');
 pets.innerHTML=PETS.map(p=>`<button class="card ${petPick===p.id?'selected':''}" data-pet="${p.id}"><div class="icon">${p.icon}</div><b>${L(p.ru,p.en)}</b><small>${L(p.descRu,p.descEn)}</small></button>`).join('');
 if(worlds){worlds.innerHTML=WORLDS.map(w=>{const open=availableWorlds(save).some(x=>x.id===w.id);return `<button class="worldCard ${worldPick===w.id?'selected':''} ${open?'':'locked'}" data-world="${w.id}" ${open?'':'disabled'}><b>${localized(w.name,i18n.lang)}</b><small>${open?L('Доступен','Unlocked'):L(`Нужно побед: ${w.unlock}`,`Requires ${w.unlock} wins`)}</small></button>`}).join('')}
 document.querySelectorAll('[data-hero]').forEach(el=>el.onclick=()=>{heroPick=el.dataset.hero;fillSelections()});
 document.querySelectorAll('[data-pet]').forEach(el=>el.onclick=()=>{petPick=el.dataset.pet;fillSelections()});
 document.querySelectorAll('[data-world]').forEach(el=>el.onclick=()=>{worldPick=el.dataset.world;fillSelections()});
}

function buildPlayer(){
 const h=HEROES.find(x=>x.id===heroPick)||HEROES[0],pd=PETS.find(x=>x.id===petPick)||PETS[0];
 player={x:0,y:0,r:18,maxHp:h.hp,hp:h.hp,speed:h.speed,rate:h.rate,damage:h.damage,range:h.range,color:h.color,pickup:95,pierce:0,bulletSize:1,crit:.05,regen:0,xpBonus:1};
 pd.apply(player);applyMeta(player,save);
 pet={x:-45,y:15,r:12,color:pd.color,icon:pd.icon,damage:player.damage*pd.petDamage,rate:pd.petRate};
}
function startGame(){
 bridge.hideSticky?.();audio.unlock();buildPlayer();
 enemies=[];bullets=[];gems=[];particles=[];elapsed=0;spawnTimer=.4;bossIndex=0;bossKills=0;kills=0;level=1;xp=0;xpNeed=18;shotTimer=.15;petTimer=.5;paused=false;revived=false;state='play';show('play');bridge.gameplayStart();last=performance.now();
}
function togglePause(){if(!['play','pause'].includes(state))return;paused=!paused;if(paused){state='pause';show('pause');bridge.gameplayStop();audio.suspend()}else{state='play';show('play');bridge.gameplayStart();audio.resume();last=performance.now()}}
function endToMenu(){finalizeRun(false);menu()}

async function tryRevive(){
 if(revived)return false;revived=true;
 const ok=await bridge.rewarded();
 if(ok){player.hp=player.maxHp*.55;enemies=enemies.filter(e=>Math.hypot(e.x-player.x,e.y-player.y)>180);paused=false;state='play';show('play');audio.resume();bridge.gameplayStart();last=performance.now();return true}
 return false;
}
function finalizeRun(win){
 const reward=completeRun(save,{elapsed,kills,bosses:bossKills,win,worldId:worldPick});persist();return reward;
}
async function gameOver(win=false){
 if(!win&&!revived){paused=true;state='pause';bridge.gameplayStop();audio.suspend();const ok=await tryRevive();if(ok)return}
 state='result';paused=true;bridge.gameplayStop();audio.suspend();const reward=finalizeRun(win);
 $('resultTitle').textContent=win?L('Победа!','Victory!'):L('Забег окончен','Run Over');
 $('resultStats').innerHTML=`<p>${L('Время','Time')}: <b>${fmt(elapsed)}</b></p><p>${L('Уровень','Level')}: <b>${level}</b></p><p>${L('Враги','Enemies')}: <b>${kills}</b></p><p>✦ <b>+${reward.coins+reward.achievementCoins}</b></p>`;
 show('result');bridge.showSticky?.();
 if(win) setTimeout(()=>bridge.fullscreen?.(),400);
}

function enemyArchetype(){const w=currentWorld(),ids=w.enemies;return ids[Math.floor(Math.random()*ids.length)]}
function spawnEnemy(boss=false){
 const a=Math.random()*Math.PI*2,d=Math.max(W,H)*.62+100,x=player.x+Math.cos(a)*d,y=player.y+Math.sin(a)*d;
 const scale=1+elapsed/210;let r=13+Math.random()*7,hp=25*scale,spd=56+Math.random()*24,damage=9,type=enemyArchetype();
 if(boss){r=40;hp=720*(1+bossIndex*.32);spd=46;damage=23;type=currentWorld().boss;audio.boss()}
 const palette={emerald:'#ff6680',dunes:'#ffb347',frost:'#65c7ff',abyss:'#b877ff'};
 enemies.push({x,y,r,hp,maxHp:hp,spd,damage,boss,type,hit:0,color:boss?'#ffe066':palette[worldPick]||'#ff6577'});
}
function nearest(x,y,range=9999){let best=null,bd=range*range;for(const e of enemies){const dx=e.x-x,dy=e.y-y,d=dx*dx+dy*dy;if(d<bd){bd=d;best=e}}return best}
function shootFrom(x,y,target,damage,speed=570,size=5,pierce=0,color='#ffe273'){if(!target)return;const dx=target.x-x,dy=target.y-y,l=Math.hypot(dx,dy)||1;bullets.push({x,y,vx:dx/l*speed,vy:dy/l*speed,r:size,damage,life:1.35,pierce,color});audio.shot()}
function shoot(){shootFrom(player.x,player.y,nearest(player.x,player.y,player.range),player.damage*(Math.random()<player.crit?2:1),570,5*player.bulletSize,player.pierce)}
function petAttack(){if(!pet)return;shootFrom(pet.x,pet.y,nearest(pet.x,pet.y,420),pet.damage,500,4,0,pet.color)}

function levelUp(){
 level++;xp-=xpNeed;xpNeed=Math.floor(xpNeed*1.27+6);state='upgrade';paused=true;bridge.gameplayStop();audio.level();show('upgrade');
 const choices=[...UPGRADES].sort(()=>Math.random()-.5).slice(0,3);$('upgradeCards').innerHTML='';
 for(const u of choices){const b=document.createElement('button');b.className='upgradeCard';b.innerHTML=`<b>${L(u.ru,u.en)}</b><span>${L(u.descRu,u.descEn)}</span>`;b.onclick=()=>{u.apply(player);pet.damage=Math.max(pet.damage,player.damage*.5);paused=false;state='play';show('play');bridge.gameplayStart();audio.resume();last=performance.now()};$('upgradeCards').appendChild(b)}
}

function update(dt){
 if(state!=='play'||paused)return;elapsed+=dt;const world=currentWorld();if(elapsed>=world.duration){gameOver(true);return}
 let mx=(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0),my=(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0);if(joy.active){mx=joy.dx;my=joy.dy}const ml=Math.hypot(mx,my)||1;player.x+=mx/ml*player.speed*dt;player.y+=my/ml*player.speed*dt;
 if(player.regen)player.hp=Math.min(player.maxHp,player.hp+player.regen*dt);
 const targetPetX=player.x-38,targetPetY=player.y+24;pet.x+=(targetPetX-pet.x)*Math.min(1,dt*6);pet.y+=(targetPetY-pet.y)*Math.min(1,dt*6);
 shotTimer-=dt;if(shotTimer<=0){shoot();shotTimer=player.rate}
 petTimer-=dt;if(petTimer<=0){petAttack();petTimer=pet.rate}
 spawnTimer-=dt;if(spawnTimer<=0){spawnEnemy(false);if(elapsed>100&&Math.random()<.24)spawnEnemy(false);spawnTimer=Math.max(.16,.70-elapsed/1000)}
 const wantedBoss=Math.floor(elapsed/120);if(wantedBoss>bossIndex){bossIndex=wantedBoss;spawnEnemy(true)}
 for(let i=enemies.length-1;i>=0;i--){const e=enemies[i],dx=player.x-e.x,dy=player.y-e.y,l=Math.hypot(dx,dy)||1;e.x+=dx/l*e.spd*dt;e.y+=dy/l*e.spd*dt;e.hit=Math.max(0,e.hit-dt);if(l<player.r+e.r){player.hp-=e.damage*dt;e.hit=.08;shake=5;audio.hit();if(player.hp<=0){gameOver(false);return}}}
 for(let i=bullets.length-1;i>=0;i--){const b=bullets[i];b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;let remove=b.life<=0;for(let j=enemies.length-1;j>=0&&!remove;j--){const e=enemies[j];if(Math.hypot(b.x-e.x,b.y-e.y)<b.r+e.r){e.hp-=b.damage;e.hit=.07;if(b.pierce>0)b.pierce--;else remove=true;if(e.hp<=0){kills++;if(e.boss)bossKills++;gems.push({x:e.x,y:e.y,r:e.boss?10:6,val:e.boss?28:5});burst(e.x,e.y,e.color);enemies.splice(j,1)}}}if(remove)bullets.splice(i,1)}
 for(let i=gems.length-1;i>=0;i--){const g=gems[i],dx=player.x-g.x,dy=player.y-g.y,l=Math.hypot(dx,dy);if(l<player.pickup){const s=Math.max(170,520*(1-l/player.pickup));g.x+=dx/(l||1)*s*dt;g.y+=dy/(l||1)*s*dt}if(l<player.r+12){xp+=g.val*player.xpBonus;gems.splice(i,1);audio.pickup();if(xp>=xpNeed)levelUp()}}
 for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(p.life<=0)particles.splice(i,1)}shake=Math.max(0,shake-20*dt);updateHud()
}
function burst(x,y,color){for(let i=0;i<8;i++){const a=Math.random()*Math.PI*2,s=50+Math.random()*120;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.35,color})}}
function updateHud(){$('hpText').textContent=`❤ ${Math.ceil(player.hp)}/${Math.ceil(player.maxHp)}`;$('lvlText').textContent=`${L('УР.','LV.')} ${level} · ${localized(currentWorld().name,i18n.lang)}`;$('timeText').textContent=fmt(elapsed);$('xpFill').style.width=Math.min(100,xp/xpNeed*100)+'%'}

function draw(){
 const theme=currentWorld().theme;ctx.fillStyle=theme.ground;ctx.fillRect(0,0,W,H);drawGrid(theme.grid);if(!player||!['play','upgrade','pause','result'].includes(state))return;
 ctx.save();if(shake)ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);const ox=W/2-player.x,oy=H/2-player.y;ctx.translate(ox,oy);
 for(const g of gems){ctx.fillStyle='#64e8ff';ctx.shadowColor='#64e8ff';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(g.x,g.y,g.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}
 for(const b of bullets){ctx.fillStyle=b.color;ctx.shadowColor=b.color;ctx.shadowBlur=10;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0}
 for(const e of enemies){ctx.fillStyle=e.hit?'#fff':e.color;ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);ctx.fill();ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.arc(e.x+e.r*.18,e.y-e.r*.08,Math.max(2,e.r*.12),0,Math.PI*2);ctx.fill();if(e.boss){ctx.fillStyle='#24161e';ctx.fillRect(e.x-e.r,e.y-e.r-13,e.r*2,6);ctx.fillStyle='#ffe066';ctx.fillRect(e.x-e.r,e.y-e.r-13,e.r*2*(e.hp/e.maxHp),6)}}
 for(const p of particles){ctx.globalAlpha=Math.max(0,p.life/.35);ctx.fillStyle=p.color;ctx.fillRect(p.x-2,p.y-2,4,4)}ctx.globalAlpha=1;
 ctx.fillStyle=pet.color;ctx.shadowColor=pet.color;ctx.shadowBlur=12;ctx.beginPath();ctx.arc(pet.x,pet.y,pet.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
 ctx.fillStyle=player.color;ctx.shadowColor=player.color;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(player.x,player.y,player.r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(player.x+5,player.y-4,3,0,Math.PI*2);ctx.fill();ctx.restore()
}
function drawGrid(color){ctx.save();ctx.strokeStyle=color+'66';ctx.lineWidth=1;const step=64,ox=player?(-player.x%step):0,oy=player?(-player.y%step):0;for(let x=ox;x<W;x+=step){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}for(let y=oy;y<H;y+=step){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}ctx.restore()}
function loop(now){const dt=Math.min(.033,(now-last)/1000||0);last=now;update(dt);draw();requestAnimationFrame(loop)}requestAnimationFrame(loop);

$('playBtn').onclick=()=>{fillSelections();show('select');state='select'};
$('backBtn').onclick=menu;$('howBtn').onclick=()=>{show('help');state='help'};$('helpBackBtn').onclick=menu;
$('startBtn').onclick=startGame;$('pauseBtn').onclick=togglePause;$('resumeBtn').onclick=togglePause;$('quitBtn').onclick=endToMenu;$('retryBtn').onclick=startGame;$('resultMenuBtn').onclick=menu;
if($('langBtn'))$('langBtn').onclick=()=>{i18n.set(i18n.lang==='ru'?'en':'ru');i18n.apply();renderMenu();fillSelections()};

addEventListener('keydown',e=>{audio.unlock();keys[e.key]=true;if((e.key==='Escape'||e.key==='p'||e.key==='P')&&['play','pause'].includes(state))togglePause()});
addEventListener('keyup',e=>keys[e.key]=false);
canvas.addEventListener('pointerdown',e=>{audio.unlock();if(state!=='play')return;joy.active=true;joy.id=e.pointerId;joy.sx=e.clientX;joy.sy=e.clientY;joy.dx=joy.dy=0;$('joystick').classList.remove('hidden');$('joystick').style.left=(e.clientX-55)+'px';$('joystick').style.top=(e.clientY-55)+'px'});
canvas.addEventListener('pointermove',e=>{if(!joy.active||e.pointerId!==joy.id)return;let dx=e.clientX-joy.sx,dy=e.clientY-joy.sy,l=Math.hypot(dx,dy),m=45;if(l>m){dx=dx/l*m;dy=dy/l*m}joy.dx=dx/m;joy.dy=dy/m;$('stick').style.transform=`translate(${dx}px,${dy}px)`});
function endJoy(e){if(!joy.active||(e.pointerId!=null&&e.pointerId!==joy.id))return;joy.active=false;joy.dx=joy.dy=0;$('stick').style.transform='translate(0,0)';$('joystick').classList.add('hidden')}
canvas.addEventListener('pointerup',endJoy);canvas.addEventListener('pointercancel',endJoy);

document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='play'&&!paused)togglePause()});
addEventListener('blur',()=>{if(state==='play'&&!paused)togglePause()});
addEventListener('arena:adopen',()=>{audio.suspend()});
addEventListener('arena:adclose',()=>{if(state==='play'&&!paused)audio.resume()});

i18n.apply();menu();
