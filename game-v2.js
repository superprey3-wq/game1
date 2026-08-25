import {YandexBridge} from './yandex.js';

const $ = id => document.getElementById(id);
const canvas = $('game');
const ctx = canvas.getContext('2d');
const bridge = new YandexBridge();
await bridge.init();

let W=0,H=0,DPR=1;
function resize(){
  DPR=Math.min(devicePixelRatio||1,2); W=innerWidth; H=innerHeight;
  canvas.width=W*DPR; canvas.height=H*DPR;
  canvas.style.width=W+'px'; canvas.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
addEventListener('resize',resize); resize();
document.addEventListener('contextmenu',e=>e.preventDefault());

const A='https://raw.githubusercontent.com/ndorony/test/master/assets/knowledge-defense/';
const T='https://raw.githubusercontent.com/Sonofg0tham/tailgate/main/public/assets/';
const ASSET_URLS={
  terrain:A+'battlefield.png', ground:A+'ground.png', grass:A+'grass-a.png', flowerR:A+'flower-red.png', flowerY:A+'flower-yellow.png', mushroom:A+'mushroom.png', portal:A+'portal.png', keep:A+'keep.png',
  xenoScout:A+'enemy-scout.png', xenoRunner:A+'enemy-runner.png', mech:A+'enemy-guard.png', boss:A+'enemy-captain.png',
  heroRain:T+'characters/player_hold.png', heroLuna:T+'characters/staff_b.png', heroIce:T+'characters/guard.png', heroChaos:T+'characters/player_stand.png', heroShade:T+'characters/staff_a.png',
  chair:T+'environment/chair.png', wall:T+'environment/wall_office.png', drain:T+'environment/drain.png', pallet:T+'environment/pallet_alt.png'
};
const IMG={};
for(const [k,u] of Object.entries(ASSET_URLS)){
  const im=new Image(); im.crossOrigin='anonymous'; im.src=u; IMG[k]=im;
}

const L={
 ru:{play:'ИГРАТЬ',meta:'УЛУЧШЕНИЯ',how:'КАК ИГРАТЬ',hero:'Выбери героя',pet:'Выбери питомца',fight:'В БОЙ',back:'НАЗАД',up:'Новый уровень',pick:'Выбери усиление',pause:'Пауза',resume:'ПРОДОЛЖИТЬ',menu:'В МЕНЮ',revive:'ВОСКРЕСНУТЬ',finish:'ЗАКОНЧИТЬ ЗАБЕГ',retry:'ЕЩЁ РАЗ',metaTitle:'Постоянные улучшения',help:'Как играть',ok:'ПОНЯТНО',best:'Лучшее время',runs:'Забегов',wallet:'Кристаллы',win:'Победа!',lose:'Забег окончен',time:'Время',lvl:'Уровень',kills:'Врагов',earned:'Кристаллов',wave:'ВОЛНА',sound:'🔊 ЗВУК',mute:'🔇 ЗВУК',new:'НОВОЕ',locked:'Откроется после',unavail:'Реклама недоступна',ach:'Достижение'},
 en:{play:'PLAY',meta:'UPGRADES',how:'HOW TO PLAY',hero:'Choose a hero',pet:'Choose a pet',fight:'START RUN',back:'BACK',up:'Level up',pick:'Choose an upgrade',pause:'Paused',resume:'RESUME',menu:'MAIN MENU',revive:'REVIVE',finish:'END RUN',retry:'RUN AGAIN',metaTitle:'Permanent upgrades',help:'How to play',ok:'GOT IT',best:'Best time',runs:'Runs',wallet:'Crystals',win:'Victory!',lose:'Run over',time:'Time',lvl:'Level',kills:'Enemies',earned:'Crystals',wave:'WAVE',sound:'🔊 SOUND',mute:'🔇 SOUND',new:'NEW',locked:'Unlocks after',unavail:'Rewarded ad unavailable',ach:'Achievement'}
};
let lang=(bridge.lang||'ru').startsWith('ru')?'ru':'en'; const t=k=>L[lang][k];

const HEROES=[
 {id:'rain',ru:'Капитан Рейн',en:'Captain Rain',img:'heroRain',hp:150,speed:185,dmg:1,unlock:0},
 {id:'luna',ru:'Луна',en:'Luna',img:'heroLuna',hp:105,speed:192,dmg:1.18,unlock:0},
 {id:'ice',ru:'Айс',en:'Ice',img:'heroIce',hp:118,speed:208,dmg:1.06,unlock:2},
 {id:'chaos',ru:'Хаос',en:'Chaos',img:'heroChaos',hp:140,speed:196,dmg:1.14,unlock:5},
 {id:'shade',ru:'Тень',en:'Shade',img:'heroShade',hp:100,speed:230,dmg:1.08,unlock:8}
];
const PETS=[
 {id:'orb',icon:'🤖',ru:'Орб',en:'Orb',unlock:0,apply:p=>p.pick+=35},
 {id:'fox',icon:'🦊',ru:'Лис',en:'Fox',unlock:0,apply:p=>p.speed*=1.10},
 {id:'owl',icon:'🦉',ru:'Сова',en:'Owl',unlock:3,apply:p=>p.xpb*=1.15},
 {id:'dragon',icon:'🐉',ru:'Дракон',en:'Dragon',unlock:6,apply:p=>p.damage*=1.12},
 {id:'wolf',icon:'🐺',ru:'Волк',en:'Wolf',unlock:9,apply:p=>p.fireRate*=1.12}
];
const nm=o=>o[lang]||o.ru;
const DEFAULT_SAVE={best:0,runs:0,kills:0,currency:0,wins:0,meta:{power:0,health:0,speed:0,fortune:0},ach:{},settings:{muted:false}};
let save=Object.assign({},DEFAULT_SAVE,await bridge.load()||{}); save.meta=Object.assign({},DEFAULT_SAVE.meta,save.meta||{}); save.ach=save.ach||{}; save.settings=Object.assign({},DEFAULT_SAVE.settings,save.settings||{});
const persist=()=>bridge.save(save);
const fmt=s=>`${String(s/60|0).padStart(2,'0')}:${String(s%60|0).padStart(2,'0')}`;

const WORLDS=[
 {ru:'Кристальные руины',en:'Crystal Ruins',overlay:'rgba(35,70,120,.18)',glow:'#4ae4ff'},
 {ru:'Ксеноджунгли',en:'Xeno Jungle',overlay:'rgba(15,105,55,.20)',glow:'#6bff8f'},
 {ru:'Красная кузня',en:'Red Forge',overlay:'rgba(155,35,18,.20)',glow:'#ff794f'}
];

let state='menu', heroPick=null, petPick=null, player=null;
let enemies=[],bullets=[],gems=[],particles=[],props=[];
let elapsed=0,spawnTimer=0,bossIndex=0,kills=0,level=1,xp=0,xpNeed=24,coins=0,shotTimer=0,paused=false,revived=false,last=performance.now(),shake=0;
let keys={},joy={on:false,id:null,x:0,y:0,dx:0,dy:0},audio=null;

function snd(f=440,d=.05,v=.02,type='sine'){ if(save.settings.muted)return; try{ audio??=new(window.AudioContext||window.webkitAudioContext)(); audio.resume(); const o=audio.createOscillator(),g=audio.createGain(); o.type=type;o.frequency.value=f;g.gain.setValueAtTime(v,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+d);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+d);}catch{} }
function audioOff(){try{audio?.suspend()}catch{}} function audioOn(){try{if(!save.settings.muted)audio?.resume()}catch{}}
function toast(s){$('toast').textContent=s;$('toast').classList.remove('hidden');clearTimeout(toast.i);toast.i=setTimeout(()=>$('toast').classList.add('hidden'),1800)}

function show(id){ ['menu','select','upgrade','pause','revive','result','meta','help'].forEach(x=>$(x).classList.toggle('hidden',x!==id)); $('hud').classList.toggle('hidden',!['play','upgrade','pause','revive'].includes(id)); if(id!=='play')$('joystick').classList.add('hidden'); }
function menu(){state='menu';paused=false;show('menu');bridge.gameplayStop();$('bestText').textContent=`${t('best')}: ${fmt(save.best)} · ${t('runs')}: ${save.runs}`;$('walletText').textContent=`✦ ${t('wallet')}: ${save.currency}`}
function ui(){
 [['playBtn','play'],['metaBtn','meta'],['howBtn','how'],['heroTitle','hero'],['petTitle','pet'],['startBtn','fight'],['backBtn','back'],['upgradeTitle','up'],['upgradeHint','pick'],['pauseTitle','pause'],['resumeBtn','resume'],['quitBtn','menu'],['reviveBtn','revive'],['skipReviveBtn','finish'],['retryBtn','retry'],['resultMenuBtn','menu'],['metaTitle','metaTitle'],['metaBackBtn','back'],['helpTitle','help'],['helpBackBtn','ok']].forEach(([id,k])=>$(id).textContent=t(k));
 $('soundBtn').textContent=$('pauseSoundBtn').textContent=save.settings.muted?t('mute'):t('sound');
 $('helpBody').innerHTML=lang==='ru'?'<p>WASD/стрелки или джойстик слева. Герой стреляет автоматически. Собирай кристаллы, выбирай усиления и переживи три мира. Боссы приходят каждые две минуты.</p>':'<p>Use WASD/arrows or the left joystick. Your hero fires automatically. Collect crystals, pick upgrades and survive all three worlds. Bosses arrive every two minutes.</p>';
 fillSelections(); meta(); if(state==='menu')menu();
}
function cardImage(o,type){ if(type==='hero') return `<img src="${ASSET_URLS[o.img]}" style="width:58px;height:58px;object-fit:contain;filter:drop-shadow(0 6px 10px #0008)">`; return `<div class="icon">${o.icon}</div>`; }
function fillSelections(){
 const card=(o,type)=>`<div class="card ${save.runs>=o.unlock?'':'locked'}" data-${type}="${o.id}">${cardImage(o,type)}<b>${nm(o)}</b><small>${save.runs>=o.unlock?'':`${t('locked')} ${o.unlock} ${t('runs').toLowerCase()}`}</small></div>`;
 $('heroes').innerHTML=HEROES.map(x=>card(x,'hero')).join(''); $('pets').innerHTML=PETS.map(x=>card(x,'pet')).join('');
 document.querySelectorAll('[data-hero]').forEach(el=>el.onclick=()=>{const h=HEROES.find(x=>x.id===el.dataset.hero);if(save.runs<h.unlock)return;heroPick=h.id;document.querySelectorAll('[data-hero]').forEach(x=>x.classList.toggle('selected',x===el));checkStart()});
 document.querySelectorAll('[data-pet]').forEach(el=>el.onclick=()=>{const p=PETS.find(x=>x.id===el.dataset.pet);if(save.runs<p.unlock)return;petPick=p.id;document.querySelectorAll('[data-pet]').forEach(x=>x.classList.toggle('selected',x===el));checkStart()}); checkStart();
}
function checkStart(){$('startBtn').disabled=!(heroPick&&petPick)}
function meta(){ if(!$('metaGrid'))return; $('metaWallet').textContent=`✦ ${t('wallet')}: ${save.currency}`; const M=[['power','⚔️','Сила','Power',8],['health','❤','Здоровье','Health',8],['speed','⚡','Скорость','Speed',6],['fortune','✦','Удача','Fortune',6]]; $('metaGrid').innerHTML=M.map(m=>{const l=save.meta[m[0]]||0,c=30+l*40;return `<div class="metaCard"><b>${m[1]} ${lang==='ru'?m[2]:m[3]} · ${l}/${m[4]}</b><button data-m="${m[0]}" ${l>=m[4]||save.currency<c?'disabled':''}>${l>=m[4]?'MAX':`✦ ${c}`}</button></div>`}).join(''); document.querySelectorAll('[data-m]').forEach(e=>e.onclick=()=>{const id=e.dataset.m,l=save.meta[id]||0,c=30+l*40;if(save.currency<c)return;save.currency-=c;save.meta[id]=l+1;persist();meta();snd(720)}); }

function makeProps(){ props=[]; const kinds=['grass','flowerR','flowerY','mushroom','portal','keep','chair','pallet','drain']; for(let i=0;i<170;i++)props.push({x:(Math.random()-.5)*6200,y:(Math.random()-.5)*6200,s:28+Math.random()*56,k:kinds[Math.random()*kinds.length|0],r:Math.random()*6.28}); }
function startGame(){
 const h=HEROES.find(x=>x.id===heroPick)||HEROES[0], pet=PETS.find(x=>x.id===petPick)||PETS[0];
 player={x:0,y:0,r:20,max:h.hp+save.meta.health*9,hp:h.hp+save.meta.health*9,speed:h.speed*(1+save.meta.speed*.025),damage:22*h.dmg*(1+save.meta.power*.06),fireRate:1+save.meta.fortune*.02,pick:110,xpb:1,crit:.06+save.meta.fortune*.025,regen:0,armor:0,hero:h,pet:pet.id,face:0}; pet.apply(player);
 enemies=[];bullets=[];gems=[];particles=[];makeProps();elapsed=0;spawnTimer=.1;bossIndex=0;kills=0;level=1;xp=0;xpNeed=24;coins=0;shotTimer=.1;paused=false;revived=false;state='play';show('play');bridge.gameplayStart();audioOn();last=performance.now();updateWeaponStrip();
}
function endRun(win=false,quit=false){ if(!player)return menu(); state='result';paused=true;bridge.gameplayStop();audioOff();save.best=Math.max(save.best,elapsed);save.runs++;save.kills+=kills;save.currency+=coins;save.wins+=win?1:0;persist();bridge.submitScore('arena_survival',elapsed*100+kills*2|0);if(quit)return menu();$('resultTitle').textContent=win?t('win'):t('lose');$('resultStats').innerHTML=`<p>${t('time')}: <b>${fmt(elapsed)}</b></p><p>${t('lvl')}: <b>${level}</b></p><p>${t('kills')}: <b>${kills}</b></p><p>${t('earned')}: <b>✦ ${coins}</b></p>`;show('result');if(save.runs%3===0)bridge.fullscreen(); }
function die(){if(!revived&&bridge.ysdk?.adv?.showRewardedVideo){paused=true;state='revive';bridge.gameplayStop();show('revive')}else endRun()}
async function revive(){ $('reviveBtn').disabled=true;const ok=await bridge.rewarded();$('reviveBtn').disabled=false;if(!ok)return toast(t('unavail'));revived=true;player.hp=player.max*.55;enemies=enemies.filter(e=>Math.hypot(e.x-player.x,e.y-player.y)>250);paused=false;state='play';show('play');bridge.gameplayStart();last=performance.now(); }
function togglePause(){if(!['play','pause'].includes(state))return;paused=!paused;state=paused?'pause':'play';show(state);paused?(bridge.gameplayStop(),audioOff()):(bridge.gameplayStart(),audioOn(),last=performance.now())}

function worldIndex(){return Math.min(2,Math.floor(elapsed/200))}
function spawnEnemy(boss=false){
 const a=Math.random()*6.283,d=Math.max(W,H)*.74+150,scale=1+elapsed/200,r=Math.random(); let type=r<.42?'scout':r<.72?'runner':r<.92?'mech':'elite';
 let e={x:player.x+Math.cos(a)*d,y:player.y+Math.sin(a)*d,type,boss,r:20,hp:34*scale,max:34*scale,spd:66+Math.random()*25,dmg:10,hit:0,anim:Math.random()*6.28};
 if(type==='runner'){e.r=18;e.hp=e.max=27*scale;e.spd=104;e.dmg=8} if(type==='mech'){e.r=27;e.hp=e.max=90*scale;e.spd=48;e.dmg=15} if(type==='elite'){e.r=31;e.hp=e.max=130*scale;e.spd=54;e.dmg=18}
 if(boss){e.type='boss';e.r=64;e.hp=e.max=1300*(1+bossIndex*.42);e.spd=43;e.dmg=30}
 enemies.push(e);
}
function near(range=570){let best=null,bd=range*range;for(const e of enemies){const dx=e.x-player.x,dy=e.y-player.y,d=dx*dx+dy*dy;if(d<bd){bd=d;best=e}}return best}
function shoot(){const e=near();if(!e)return;const a=Math.atan2(e.y-player.y,e.x-player.x),crit=Math.random()<player.crit;for(let i=0;i<(level>=8?2:1);i++){const aa=a+(i-.5)*.06;bullets.push({x:player.x,y:player.y,vx:Math.cos(aa)*660,vy:Math.sin(aa)*660,r:crit?7:5,damage:player.damage*(crit?2:1),life:1.15,color:crit?'#fff37a':'#68e9ff'})}snd(410,.025,.008,'square')}
function killEnemy(e){const i=enemies.indexOf(e);if(i<0)return;enemies.splice(i,1);kills++;if(Math.random()<.12||e.boss)coins+=e.boss?10:1;gems.push({x:e.x,y:e.y,r:e.boss?11:7,val:e.boss?34:6});burst(e.x,e.y,e.boss?'#ff884d':'#6ee7ff',e.boss?28:10);snd(e.boss?80:160,.06,.018,'sawtooth')}
function burst(x,y,color,n=10){for(let i=0;i<n;i++){const a=Math.random()*6.28,s=60+Math.random()*190;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.38,max:.38,color})}}
function levelUp(){ level++;xp-=xpNeed;xpNeed=Math.floor(xpNeed*1.27+7);paused=true;state='upgrade';bridge.gameplayStop();show('upgrade'); const opts=[['Урон +20%','Damage +20%',()=>player.damage*=1.2],['Скорость атаки +15%','Attack speed +15%',()=>player.fireRate*=1.15],['Здоровье +30','Health +30',()=>{player.max+=30;player.hp=Math.min(player.max,player.hp+30)}],['Скорость +10%','Speed +10%',()=>player.speed*=1.1],['Крит. шанс +8%','Crit chance +8%',()=>player.crit=Math.min(.65,player.crit+.08)],['Регенерация','Regeneration',()=>player.regen+=1.1],['Магнит опыта','XP magnet',()=>player.pick+=50]].sort(()=>Math.random()-.5).slice(0,3); $('upgradeCards').innerHTML=''; for(const o of opts){const b=document.createElement('button');b.className='upgradeCard';b.innerHTML=`<b>${lang==='ru'?o[0]:o[1]}</b><span>${lang==='ru'?'Усиление героя':'Hero upgrade'}</span>`;b.onclick=()=>{o[2]();paused=false;state='play';show('play');bridge.gameplayStart();last=performance.now();updateWeaponStrip();snd(760,.08,.02)};$('upgradeCards').appendChild(b)} }
function updateWeaponStrip(){$('weaponStrip').innerHTML=`<span class="weaponPill">🔫<b>${Math.min(6,1+Math.floor(level/3))}</b></span><span class="weaponPill">⚡<b>${Math.max(1,Math.floor(player?.fireRate||1))}</b></span>`}

function update(dt){
 if(state!=='play'||paused||!player)return;elapsed+=dt;if(elapsed>=600){endRun(true);return}
 let mx=(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0),my=(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0);if(joy.on){mx=joy.dx;my=joy.dy}const m=Math.hypot(mx,my)||1;if(mx||my){player.face=Math.atan2(my,mx);player.x+=mx/m*player.speed*dt;player.y+=my/m*player.speed*dt}
 if(player.regen)player.hp=Math.min(player.max,player.hp+player.regen*dt);shotTimer-=dt;if(shotTimer<=0){shoot();shotTimer=.55/player.fireRate}
 spawnTimer-=dt;if(spawnTimer<=0){spawnEnemy(false);if(elapsed>90&&Math.random()<.32)spawnEnemy(false);spawnTimer=Math.max(.15,.62-elapsed/1250)} const wb=Math.floor(elapsed/120);if(wb>bossIndex){bossIndex=wb;spawnEnemy(true);shake=14;snd(70,.2,.04,'sawtooth')}
 for(const e of enemies){const dx=player.x-e.x,dy=player.y-e.y,l=Math.hypot(dx,dy)||1;e.anim+=dt*4;e.x+=dx/l*e.spd*dt;e.y+=dy/l*e.spd*dt;e.hit=Math.max(0,e.hit-dt);if(l<player.r+e.r){player.hp-=e.dmg*(1-player.armor)*dt;shake=4;if(player.hp<=0){die();return}}}
 for(let i=bullets.length-1;i>=0;i--){const b=bullets[i];b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;let rem=b.life<=0;for(const e of enemies){if(rem)break;if(Math.hypot(b.x-e.x,b.y-e.y)<b.r+e.r){e.hp-=b.damage;e.hit=.09;rem=true;if(e.hp<=0)killEnemy(e)}}if(rem)bullets.splice(i,1)}
 for(let i=gems.length-1;i>=0;i--){const q=gems[i],dx=player.x-q.x,dy=player.y-q.y,l=Math.hypot(dx,dy);if(l<player.pick){const s=Math.max(180,580*(1-l/player.pick));q.x+=dx/(l||1)*s*dt;q.y+=dy/(l||1)*s*dt}if(l<player.r+14){xp+=q.val*player.xpb;gems.splice(i,1);if(xp>=xpNeed)levelUp()}}
 for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(p.life<=0)particles.splice(i,1)}shake=Math.max(0,shake-20*dt);updateHud();
}
function updateHud(){const wave=1+Math.floor(elapsed/60);$('hpText').textContent=`❤ ${Math.ceil(player.hp)}/${Math.ceil(player.max)}`;$('lvlText').textContent=`${t('lvl').toUpperCase()} ${level} · ${t('wave')} ${wave}`;$('timeText').textContent=fmt(elapsed);$('coinText').textContent=`✦ ${coins}`;$('xpFill').style.width=Math.min(100,xp/xpNeed*100)+'%'}

function ready(im){return im&&im.complete&&im.naturalWidth>0}
function drawImageWorld(im,x,y,s,rot=0,alpha=1){if(!ready(im))return false;ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=true;ctx.drawImage(im,-s/2,-s/2,s,s);ctx.restore();return true}
function drawWorld(){
 const wi=worldIndex(),w=WORLDS[wi];ctx.fillStyle=wi===0?'#071827':wi===1?'#07180e':'#200b08';ctx.fillRect(0,0,W,H);
 if(!player)return;
 const ox=W/2-player.x,oy=H/2-player.y;
 if(ready(IMG.terrain)){
   const tile=720, sx=(((-player.x)%tile)+tile)%tile-tile, sy=(((-player.y)%tile)+tile)%tile-tile;
   ctx.save();ctx.globalAlpha=.92;for(let x=sx;x<W+tile;x+=tile)for(let y=sy;y<H+tile;y+=tile)ctx.drawImage(IMG.terrain,x,y,tile,tile);ctx.restore();
 }
 ctx.fillStyle=w.overlay;ctx.fillRect(0,0,W,H);
 const vign=ctx.createRadialGradient(W*.5,H*.48,100,W*.5,H*.48,Math.max(W,H)*.72);vign.addColorStop(0,'rgba(0,0,0,0)');vign.addColorStop(1,'rgba(0,0,0,.52)');ctx.fillStyle=vign;ctx.fillRect(0,0,W,H);
 ctx.save();ctx.translate(ox,oy);for(const p of props){if(Math.abs(p.x-player.x)>W*.7||Math.abs(p.y-player.y)>H*.7)continue;const im=IMG[p.k];if(!drawImageWorld(im,p.x,p.y,p.s,p.r,.78)){ctx.fillStyle=w.glow+'33';ctx.beginPath();ctx.arc(p.x,p.y,p.s*.25,0,6.28);ctx.fill()}}ctx.restore();
 ctx.fillStyle='#fff';ctx.font='800 12px Arial';ctx.fillText(lang==='ru'?w.ru:w.en,14,H-18);
}
function shadow(x,y,rx,ry,a=.35){ctx.fillStyle=`rgba(0,0,0,${a})`;ctx.beginPath();ctx.ellipse(x,y+ry*.8,rx,ry,0,0,6.28);ctx.fill()}
function drawHero(){const p=player;shadow(p.x,p.y,24,10,.42);ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.face||0);const im=IMG[p.hero.img];if(ready(im)){ctx.shadowColor='#65eaff';ctx.shadowBlur=16;ctx.drawImage(im,-38,-38,76,76);ctx.shadowBlur=0}else{ctx.fillStyle='#4fa8ff';ctx.fillRect(-14,-14,28,28)}ctx.restore();ctx.strokeStyle='rgba(80,220,255,.55)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,25+Math.sin(elapsed*3)*2,0,6.28);ctx.stroke();drawPet()}
function drawPet(){const a=elapsed*1.7,x=player.x+Math.cos(a)*34,y=player.y+Math.sin(a)*22;shadow(x,y,10,4,.25);ctx.fillStyle='#6ed9ff';ctx.shadowColor='#6ed9ff';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(x,y,9,0,6.28);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#081422';ctx.fillRect(x-4,y-2,8,4)}
function enemyImage(e){return e.type==='scout'?IMG.xenoScout:e.type==='runner'?IMG.xenoRunner:e.type==='mech'?IMG.mech:e.type==='elite'?IMG.boss:IMG.boss}
function drawEnemy(e){shadow(e.x,e.y,e.r*.85,e.r*.3,.38);ctx.save();ctx.translate(e.x,e.y);ctx.rotate(Math.atan2(player.y-e.y,player.x-e.x));if(e.hit)ctx.filter='brightness(2.2) saturate(1.4)';const im=enemyImage(e),size=e.boss?142:e.type==='mech'?68:e.type==='elite'?78:56;if(ready(im)){ctx.shadowColor=e.boss?'#b14cff':'#000';ctx.shadowBlur=e.boss?28:7;ctx.drawImage(im,-size/2,-size/2,size,size);ctx.shadowBlur=0}else{ctx.fillStyle=e.boss?'#9c35d9':'#ff6158';ctx.beginPath();ctx.arc(0,0,e.r,0,6.28);ctx.fill()}ctx.filter='none';if(e.boss){ctx.strokeStyle='#d861ff';ctx.lineWidth=5;for(let i=0;i<6;i++){const a=i*1.047+Math.sin(elapsed)*.08;ctx.beginPath();ctx.moveTo(Math.cos(a)*48,Math.sin(a)*48);ctx.lineTo(Math.cos(a)*82,Math.sin(a)*82);ctx.stroke()}ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(-64,-84,128,8);ctx.fillStyle='#ff5b78';ctx.fillRect(-64,-84,128*Math.max(0,e.hp/e.max),8)}ctx.restore()}
function drawCombat(){if(!player)return;const ox=W/2-player.x,oy=H/2-player.y;ctx.save();if(shake)ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);ctx.translate(ox,oy);
 for(const q of gems){ctx.fillStyle='#55e8ff';ctx.shadowColor='#55e8ff';ctx.shadowBlur=13;ctx.beginPath();ctx.moveTo(q.x,q.y-q.r);ctx.lineTo(q.x+q.r,q.y);ctx.lineTo(q.x,q.y+q.r);ctx.lineTo(q.x-q.r,q.y);ctx.closePath();ctx.fill();ctx.shadowBlur=0}
 for(const b of bullets){ctx.fillStyle=b.color;ctx.shadowColor=b.color;ctx.shadowBlur=18;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,6.28);ctx.fill();ctx.shadowBlur=0}
 for(const e of enemies)drawEnemy(e);for(const p of particles){ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=9;ctx.fillRect(p.x-3,p.y-3,6,6);ctx.shadowBlur=0;ctx.globalAlpha=1}drawHero();ctx.restore()}
function draw(){ctx.clearRect(0,0,W,H);drawWorld();if(player&&['play','upgrade','pause','revive','result'].includes(state))drawCombat()}
function loop(now){const dt=Math.min(.033,(now-last)/1000||0);last=now;update(dt);draw();requestAnimationFrame(loop)}requestAnimationFrame(loop);

$('playBtn').onclick=()=>{state='select';show('select')};$('backBtn').onclick=menu;$('howBtn').onclick=()=>{state='help';show('help')};$('helpBackBtn').onclick=menu;$('startBtn').onclick=startGame;$('pauseBtn').onclick=togglePause;$('resumeBtn').onclick=togglePause;$('quitBtn').onclick=()=>endRun(false,true);$('retryBtn').onclick=startGame;$('resultMenuBtn').onclick=menu;$('reviveBtn').onclick=revive;$('skipReviveBtn').onclick=()=>endRun();$('metaBtn').onclick=()=>{state='meta';meta();show('meta')};$('metaBackBtn').onclick=menu;
function toggleSound(){save.settings.muted=!save.settings.muted;persist();if(save.settings.muted)audioOff();else audioOn();ui()}$('soundBtn').onclick=toggleSound;$('pauseSoundBtn').onclick=toggleSound;$('langBtn').onclick=()=>{lang=lang==='ru'?'en':'ru';ui()};
addEventListener('keydown',e=>{keys[e.key]=1;if((e.key==='Escape'||e.key.toLowerCase()==='p')&&['play','pause'].includes(state))togglePause()});addEventListener('keyup',e=>keys[e.key]=0);
canvas.addEventListener('touchstart',e=>{if(state!=='play'||paused)return;e.preventDefault();const q=e.changedTouches[0];if(q.clientX<W*.62){joy={on:true,id:q.identifier,x:q.clientX,y:q.clientY,dx:0,dy:0};$('joystick').style.left=q.clientX-54+'px';$('joystick').style.top=q.clientY-54+'px';$('joystick').classList.remove('hidden')}},{passive:false});
canvas.addEventListener('touchmove',e=>{if(!joy.on)return;e.preventDefault();for(const q of e.changedTouches)if(q.identifier===joy.id){let x=q.clientX-joy.x,y=q.clientY-joy.y,l=Math.hypot(x,y),m=40;if(l>m){x*=m/l;y*=m/l}joy.dx=x/m;joy.dy=y/m;$('stick').style.transform=`translate(${x}px,${y}px)`}},{passive:false});
function touchEnd(e){for(const q of e.changedTouches)if(q.identifier===joy.id){joy.on=false;joy.dx=joy.dy=0;$('stick').style.transform='';$('joystick').classList.add('hidden')}}canvas.addEventListener('touchend',touchEnd);canvas.addEventListener('touchcancel',touchEnd);
function sysPause(){if(state==='play'){paused=true;state='pause';show('pause');bridge.gameplayStop()}audioOff()}document.addEventListener('visibilitychange',()=>{if(document.hidden)sysPause()});addEventListener('blur',sysPause);
ui();menu();