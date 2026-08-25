import {YandexBridge} from './yandex.js';

const $=id=>document.getElementById(id);
const canvas=$('game');
const ctx=canvas.getContext('2d');
const bridge=new YandexBridge();
await bridge.init();

let W=0,H=0,DPR=1;
function resize(){
  DPR=Math.min(devicePixelRatio||1,2);
  W=innerWidth;H=innerHeight;
  canvas.width=W*DPR;canvas.height=H*DPR;
  canvas.style.width=W+'px';canvas.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
addEventListener('resize',resize);resize();
document.addEventListener('contextmenu',e=>e.preventDefault());

const L={
 ru:{play:'ИГРАТЬ',meta:'УЛУЧШЕНИЯ',how:'КАК ИГРАТЬ',hero:'Выбери героя',pet:'Выбери питомца',fight:'В БОЙ',back:'НАЗАД',up:'Новый уровень',pick:'Выбери усиление',pause:'Пауза',resume:'ПРОДОЛЖИТЬ',menu:'В МЕНЮ',revive:'ВОСКРЕСНУТЬ',finish:'ЗАКОНЧИТЬ ЗАБЕГ',retry:'ЕЩЁ РАЗ',metaTitle:'Постоянные улучшения',help:'Как играть',ok:'ПОНЯТНО',best:'Лучшее время',runs:'Забегов',wallet:'Кристаллы',win:'Победа!',lose:'Забег окончен',time:'Время',lvl:'Уровень',kills:'Врагов',earned:'Кристаллов',wave:'ВОЛНА',sound:'🔊 ЗВУК',mute:'🔇 ЗВУК',new:'НОВОЕ',evolve:'ЭВОЛЮЦИЯ',locked:'Откроется после',unavail:'Реклама недоступна',ach:'Достижение'},
 en:{play:'PLAY',meta:'UPGRADES',how:'HOW TO PLAY',hero:'Choose a hero',pet:'Choose a pet',fight:'START RUN',back:'BACK',up:'Level up',pick:'Choose an upgrade',pause:'Paused',resume:'RESUME',menu:'MAIN MENU',revive:'REVIVE',finish:'END RUN',retry:'RUN AGAIN',metaTitle:'Permanent upgrades',help:'How to play',ok:'GOT IT',best:'Best time',runs:'Runs',wallet:'Crystals',win:'Victory!',lose:'Run over',time:'Time',lvl:'Level',kills:'Enemies',earned:'Crystals',wave:'WAVE',sound:'🔊 SOUND',mute:'🔇 SOUND',new:'NEW',evolve:'EVOLVE',locked:'Unlocks after',unavail:'Rewarded ad unavailable',ach:'Achievement'}
};
let lang=(bridge.lang||'ru').startsWith('ru')?'ru':'en';
const t=k=>L[lang][k];

const HEROES=[
 {id:'knight',icon:'🛡️',ru:'Капитан Рейн',en:'Captain Rain',hp:140,speed:180,dmg:1,unlock:0,color:'#58a6ff',accent:'#d7ecff'},
 {id:'mage',icon:'🔮',ru:'Луна',en:'Luna',hp:98,speed:185,dmg:1.2,unlock:0,color:'#b866ff',accent:'#f0d5ff'},
 {id:'ranger',icon:'🏹',ru:'Айс',en:'Ice',hp:106,speed:205,dmg:1.05,unlock:2,color:'#5fe4d4',accent:'#d8fffb'},
 {id:'berserk',icon:'🪓',ru:'Хаос',en:'Chaos',hp:132,speed:192,dmg:1.15,unlock:5,color:'#ff654f',accent:'#ffe0db'},
 {id:'rogue',icon:'🗡️',ru:'Тень',en:'Shade',hp:94,speed:228,dmg:1.08,unlock:8,color:'#7e7cff',accent:'#e4e3ff'}
];
const PETS=[
 {id:'orb',icon:'🤖',ru:'Орб',en:'Orb',unlock:0,apply:p=>p.pick+=35},
 {id:'fox',icon:'🦊',ru:'Лис',en:'Fox',unlock:0,apply:p=>p.speed*=1.1},
 {id:'owl',icon:'🦉',ru:'Сова',en:'Owl',unlock:3,apply:p=>p.xpb*=1.15},
 {id:'dragon',icon:'🐉',ru:'Дракон',en:'Dragon',unlock:6,apply:p=>p.dmg*=1.12},
 {id:'wolf',icon:'🐺',ru:'Волк',en:'Wolf',unlock:9,apply:p=>p.rate*=1.12}
];
const WEAPONS=[
 ['bolt','✦','Звёздный болт','Star Bolt',.58],['spread','➤','Тройной залп','Triple Volley',1.0],['orbit','◉','Орбитальные клинки','Orbit Blades',99],['nova','✹','Солнечная нова','Solar Nova',2.6],['comet','⌁','Комета','Comet',1.35],['beam','━','Луч','Beam',1.7],['mine','⬢','Грави-мина','Grav Mine',2.1],['frost','❄','Морозный осколок','Frost Shard',1.05],['blade','✣','Клинки тени','Shadow Blades',.82],['zap','ϟ','Цепная молния','Chain Lightning',1.4]
].map(x=>({id:x[0],icon:x[1],ru:x[2],en:x[3],cd:x[4]}));
const PASSIVES=[
 ['dmg','Сила','Power',p=>p.dmg*=1.16],['rate','Темп','Tempo',p=>p.rate*=1.12],['hp','Живучесть','Vitality',p=>{p.max+=22;p.hp=Math.min(p.max,p.hp+28)}],['speed','Скорость','Speed',p=>p.speed*=1.1],['mag','Магнит','Magnet',p=>p.pick+=45],['crit','Удача','Luck',p=>p.crit=Math.min(.68,p.crit+.075)],['regen','Восстановление','Recovery',p=>p.regen+=.9],['armor','Броня','Armor',p=>p.armor=Math.min(.55,p.armor+.07)]
];
const META=[['power','⚔️','Сила','Power',8],['health','❤','Здоровье','Health',8],['speed','⚡','Скорость','Speed',6],['fortune','✦','Удача','Fortune',6]];
const DEFAULT_SAVE={best:0,runs:0,kills:0,currency:0,wins:0,meta:{power:0,health:0,speed:0,fortune:0},ach:{},settings:{muted:false}};
let save=Object.assign({},DEFAULT_SAVE,await bridge.load()||{});
save.meta=Object.assign({},DEFAULT_SAVE.meta,save.meta||{});
save.ach=save.ach||{};
save.settings=Object.assign({},DEFAULT_SAVE.settings,save.settings||{});

const WORLD=[
 {nameRu:'Кристальные руины',nameEn:'Crystal Ruins',sky:'#061525',ground:'#0b2030',grid:'#16435d',glow:'#25d8ff',accent:'#8d48ff'},
 {nameRu:'Ксеноджунгли',nameEn:'Xeno Jungle',sky:'#07180f',ground:'#102918',grid:'#245633',glow:'#70ff9d',accent:'#b5ff4d'},
 {nameRu:'Красная кузня',nameEn:'Red Forge',sky:'#1c0907',ground:'#31110d',grid:'#64231b',glow:'#ff6b45',accent:'#ffb43f'}
];

let state='menu',heroId=null,petId=null,player=null;
let enemies=[],bullets=[],gems=[],particles=[],hazards=[],props=[];
let keys={},joy={on:false,id:0,x:0,y:0,dx:0,dy:0};
let last=performance.now(),elapsed=0,spawnTimer=0,bossIndex=0,kills=0,level=1,xp=0,xpNeed=18,coins=0,paused=false,revived=false,shake=0,audio=null,platformPause=false;

const spriteSheet=new Image();
spriteSheet.crossOrigin='anonymous';
spriteSheet.src='https://raw.githubusercontent.com/Gariyuuu/shared-assets/main/sprites/kenney-roguelike-rpg-pack/Spritesheet/roguelikeSheet_transparent.png';
let spriteReady=false;spriteSheet.onload=()=>spriteReady=true;spriteSheet.onerror=()=>spriteReady=false;
const SPR_COLS=57,SPR_STEP=17,SPR_SIZE=16;
function drawKenney(index,x,y,size,alpha=.28){
 if(!spriteReady)return false;
 const col=index%SPR_COLS,row=Math.floor(index/SPR_COLS);
 ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=false;
 ctx.drawImage(spriteSheet,col*SPR_STEP,row*SPR_STEP,SPR_SIZE,SPR_SIZE,x-size/2,y-size/2,size,size);
 ctx.restore();return true;
}

const nm=o=>o[lang]||o.ru;
const fmt=s=>`${String(s/60|0).padStart(2,'0')}:${String(s%60|0).padStart(2,'0')}`;
const persist=()=>bridge.save(save);
function snd(f=440,d=.06,v=.02,type='sine'){
 if(save.settings.muted)return;
 try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),q=audio.createGain();o.type=type;o.frequency.value=f;q.gain.setValueAtTime(v,audio.currentTime);q.gain.exponentialRampToValueAtTime(.001,audio.currentTime+d);o.connect(q);q.connect(audio.destination);o.start();o.stop(audio.currentTime+d)}catch{}
}
function audioOff(){try{audio?.suspend()}catch{}}
function audioOn(){try{if(!save.settings.muted)audio?.resume()}catch{}}
function toast(s){$('toast').textContent=s;$('toast').classList.remove('hidden');clearTimeout(toast.i);toast.i=setTimeout(()=>$('toast').classList.add('hidden'),1800)}
function achievement(id,ru,en){if(save.ach[id])return;save.ach[id]=1;persist();toast(`${t('ach')}: ${lang==='ru'?ru:en}`)}

function show(id){
 ['menu','select','upgrade','pause','revive','result','meta','help'].forEach(x=>$(x).classList.toggle('hidden',x!==id));
 $('hud').classList.toggle('hidden',!['play','upgrade','pause','revive'].includes(id));
 if(id!=='play')$('joystick').classList.add('hidden');
}
function ui(){
 [['playBtn','play'],['metaBtn','meta'],['howBtn','how'],['heroTitle','hero'],['petTitle','pet'],['startBtn','fight'],['backBtn','back'],['upgradeTitle','up'],['upgradeHint','pick'],['pauseTitle','pause'],['resumeBtn','resume'],['quitBtn','menu'],['reviveBtn','revive'],['skipReviveBtn','finish'],['retryBtn','retry'],['resultMenuBtn','menu'],['metaTitle','metaTitle'],['metaBackBtn','back'],['helpTitle','help'],['helpBackBtn','ok']].forEach(([id,k])=>$(id).textContent=t(k));
 $('soundBtn').textContent=$('pauseSoundBtn').textContent=save.settings.muted?t('mute'):t('sound');
 $('helpBody').innerHTML=lang==='ru'?'<p>WASD/стрелки или джойстик слева. Оружие стреляет автоматически. За 10 минут ты пройдёшь три мира: кристальные руины, ксеноджунгли и красную кузню. Боссы появляются каждые 2 минуты.</p>':'<p>Use WASD/arrows or the left-side joystick. Weapons fire automatically. A 10-minute run crosses three worlds: crystal ruins, xeno jungle and the red forge. Bosses arrive every 2 minutes.</p>';
 fillSelections();meta();if(state==='menu')menu();
}
function menu(){state='menu';paused=false;show('menu');bridge.gameplayStop();$('bestText').textContent=`${t('best')}: ${fmt(save.best)} · ${t('runs')}: ${save.runs}`;$('walletText').textContent=`✦ ${t('wallet')}: ${save.currency}`}
function portraitHTML(o,type){
 const grad=type==='hero'?`linear-gradient(145deg,${o.color||'#334'},#0a1020)`:'linear-gradient(145deg,#19344b,#0b1220)';
 return `<div class="icon" style="border-radius:12px;background:${grad};display:grid;place-items:center;min-height:44px">${o.icon}</div>`;
}
function fillSelections(){
 const card=(o,type)=>`<div class="card ${save.runs>=o.unlock?'':'locked'}" data-${type}="${o.id}">${portraitHTML(o,type)}<b>${nm(o)}</b><small>${save.runs>=o.unlock?'':`${t('locked')} ${o.unlock} ${t('runs').toLowerCase()}`}</small></div>`;
 $('heroes').innerHTML=HEROES.map(x=>card(x,'hero')).join('');
 $('pets').innerHTML=PETS.map(x=>card(x,'pet')).join('');
 document.querySelectorAll('[data-hero]').forEach(e=>e.onclick=()=>{const h=HEROES.find(x=>x.id===e.dataset.hero);if(save.runs<h.unlock)return;heroId=h.id;document.querySelectorAll('[data-hero]').forEach(x=>x.classList.toggle('selected',x===e));checkStart()});
 document.querySelectorAll('[data-pet]').forEach(e=>e.onclick=()=>{const p=PETS.find(x=>x.id===e.dataset.pet);if(save.runs<p.unlock)return;petId=p.id;document.querySelectorAll('[data-pet]').forEach(x=>x.classList.toggle('selected',x===e));checkStart()});
 checkStart();
}
function checkStart(){$('startBtn').disabled=!(heroId&&petId)}
function meta(){
 if(!$('metaGrid'))return;
 $('metaWallet').textContent=`✦ ${t('wallet')}: ${save.currency}`;
 $('metaGrid').innerHTML=META.map(m=>{const l=save.meta[m[0]]||0,c=30+l*40;return `<div class="metaCard"><b>${m[1]} ${lang==='ru'?m[2]:m[3]} · ${l}/${m[4]}</b><button data-m="${m[0]}" ${l>=m[4]||save.currency<c?'disabled':''}>${l>=m[4]?'MAX':`✦ ${c}`}</button></div>`}).join('');
 document.querySelectorAll('[data-m]').forEach(e=>e.onclick=()=>{const id=e.dataset.m,l=save.meta[id]||0,c=30+l*40;if(save.currency<c)return;save.currency-=c;save.meta[id]=l+1;persist();meta();snd(720)});
}

function makeProps(){
 props=[];for(let i=0;i<150;i++)props.push({x:(Math.random()-.5)*5200,y:(Math.random()-.5)*5200,s:14+Math.random()*34,k:Math.random(),r:Math.random()*6.28});
}
function startGame(){
 const h=HEROES.find(x=>x.id===heroId)||HEROES[0],pet=PETS.find(x=>x.id===petId)||PETS[0];
 player={x:0,y:0,r:18,max:h.hp+save.meta.health*8,hp:h.hp+save.meta.health*8,speed:h.speed*(1+save.meta.speed*.02),dmg:h.dmg*(1+save.meta.power*.05),rate:1,pick:105,xpb:1,crit:.05+save.meta.fortune*.02,regen:0,armor:0,weapons:{bolt:{lv:1,t:.05}},color:h.color,accent:h.accent,hero:h.id,pet:pet.id,face:0};
 pet.apply(player);if(h.id==='rogue')player.crit+=.08;
 enemies=[];bullets=[];gems=[];particles=[];hazards=[];makeProps();elapsed=0;spawnTimer=.1;bossIndex=0;kills=0;level=1;xp=0;xpNeed=18;coins=0;paused=false;revived=false;state='play';show('play');bridge.gameplayStart();audioOn();last=performance.now();updateWeaponStrip();
}
function togglePause(){if(!['play','pause'].includes(state))return;paused=!paused;state=paused?'pause':'play';show(state);paused?(bridge.gameplayStop(),audioOff()):(bridge.gameplayStart(),audioOn(),last=performance.now())}
function endRun(win=false,quit=false){
 if(!player)return menu();state='result';paused=true;bridge.gameplayStop();audioOff();save.best=Math.max(save.best,elapsed);save.runs++;save.kills+=kills;save.currency+=coins;save.wins+=win?1:0;persist();bridge.submitScore('arena_survival',elapsed*100+kills*2|0);
 if(save.runs===1)achievement('first','Первый полёт','First flight');if(kills>=100)achievement('100','Охотник','Hunter');if(win)achievement('win','Выживший','Survivor');
 if(quit)return menu();$('resultTitle').textContent=win?t('win'):t('lose');$('resultStats').innerHTML=`<p>${t('time')}: <b>${fmt(elapsed)}</b></p><p>${t('lvl')}: <b>${level}</b></p><p>${t('kills')}: <b>${kills}</b></p><p>${t('earned')}: <b>✦ ${coins}</b></p>`;fillSelections();show('result');if(save.runs%3===0)bridge.fullscreen();
}
function die(){if(!revived&&bridge.ysdk?.adv?.showRewardedVideo){paused=true;state='revive';bridge.gameplayStop();audioOff();show('revive')}else endRun()}
async function revive(){
 $('reviveBtn').disabled=true;const ok=await bridge.rewarded();$('reviveBtn').disabled=false;if(!ok)return toast(t('unavail'));
 revived=true;player.hp=player.max*.55;enemies=enemies.filter(e=>Math.hypot(e.x-player.x,e.y-player.y)>220);paused=false;state='play';show('play');bridge.gameplayStart();audioOn();last=performance.now();
}

function worldIndex(){return Math.min(2,Math.floor(elapsed/200))}
function spawnEnemy(isBoss=false){
 const a=Math.random()*Math.PI*2,d=Math.max(W,H)*.72+130,s=1+elapsed/180;
 let type='alien';const r=Math.random();if(r>.66)type='drone';if(r>.86)type='robot';
 let e={x:player.x+Math.cos(a)*d,y:player.y+Math.sin(a)*d,r:18,hp:30*s,spd:62+Math.random()*22,hit:0,dmg:10,slow:0,boss:isBoss,type,max:0,anim:Math.random()*6.28,seed:Math.random()};
 if(type==='drone'){e.r=15;e.hp=24*s;e.spd=96;e.dmg=8}
 if(type==='robot'){e.r=25;e.hp=82*s;e.spd=45;e.dmg=15}
 if(isBoss){const bi=bossIndex%3;e.type=['behemoth','queen','warden'][bi];e.r=[54,50,58][bi];e.hp=900*(1+bossIndex*.42);e.spd=[46,55,42][bi];e.dmg=[26,22,30][bi]}
 e.max=e.hp;enemies.push(e);
}
function near(range=520,from=player){let best=null,bd=range*range;for(const e of enemies){const dx=e.x-from.x,dy=e.y-from.y,d=dx*dx+dy*dy;if(d<bd){bd=d;best=e}}return best}
function damageEnemy(e,d){if(!e)return;e.hp-=d;e.hit=.09;if(e.hp<=0)killEnemy(e)}
function killEnemy(e){const i=enemies.indexOf(e);if(i<0)return;enemies.splice(i,1);kills++;coins+=e.boss?8:(Math.random()<.08?1:0);gems.push({x:e.x,y:e.y,r:e.boss?11:6,val:e.boss?30:5});burst(e.x,e.y,e.boss?'#ffb43f':e.type==='robot'?'#ff6d52':'#62e6ff',e.boss?18:8);snd(e.boss?90:180,.07,.018,'sawtooth')}
function fireBullet(x,y,vx,vy,damage,r=5,life=1.4,color='#7ee6ff',pierce=0,kind='bullet'){bullets.push({x,y,vx,vy,damage,r,life,color,pierce,kind,hit:new Set()})}
function shootAt(target,count=1,spread=.16,speed=590,damage=18,color='#7ee6ff',r=5,pierce=0){if(!target)return;const base=Math.atan2(target.y-player.y,target.x-player.x);for(let i=0;i<count;i++){const a=base+(i-(count-1)/2)*spread;fireBullet(player.x,player.y,Math.cos(a)*speed,Math.sin(a)*speed,damage,r,1.4,color,pierce)}}
function weaponFire(w){
 const lv=w.lv,evo=lv>=6,mul=player.dmg*(1+lv*.18);
 if(w.id==='bolt')shootAt(near(),evo?2:1,.12,620,22*mul,'#74e8ff',evo?7:5,evo?1:0);
 else if(w.id==='spread')shootAt(near(),evo?7:3,.17,560,14*mul,'#ffc85a',5,0);
 else if(w.id==='nova'){for(let i=0;i<(evo?20:12);i++){const a=i*Math.PI*2/(evo?20:12);fireBullet(player.x,player.y,Math.cos(a)*430,Math.sin(a)*430,13*mul,5,1.2,'#ff7f5c',0)}}
 else if(w.id==='comet'){const q=near();if(q){const dx=q.x-player.x,dy=q.y-player.y,l=Math.hypot(dx,dy)||1;fireBullet(player.x,player.y,dx/l*390,dy/l*390,38*mul,evo?11:8,1.8,'#ffad43',evo?2:1)}}
 else if(w.id==='beam'){const q=near(620);if(q){damageEnemy(q,45*mul);particles.push({x:player.x,y:player.y,tx:q.x,ty:q.y,life:.13,max:.13,color:'#d35cff',beam:true});if(evo){const q2=enemies.find(x=>x!==q&&Math.hypot(x.x-q.x,x.y-q.y)<220);if(q2)damageEnemy(q2,28*mul)}}}
 else if(w.id==='mine')hazards.push({x:player.x+(Math.random()-.5)*180,y:player.y+(Math.random()-.5)*180,r:evo?78:58,life:5,damage:30*mul,kind:'mine',armed:.5,color:'#8f63ff'});
 else if(w.id==='frost')shootAt(near(),evo?4:2,.11,510,18*mul,'#9fe9ff',6,evo?2:0);
 else if(w.id==='blade')shootAt(near(360),evo?5:2,.3,710,20*mul,'#e6e8ff',7,evo?1:0);
 else if(w.id==='zap'){let q=near(500);for(let i=0;i<(evo?6:3)&&q;i++){damageEnemy(q,22*mul);particles.push({x:player.x,y:player.y,tx:q.x,ty:q.y,life:.12,max:.12,color:'#f7f259',beam:true});q=enemies.find(e=>e!==q&&Math.hypot(e.x-player.x,e.y-player.y)<500&&Math.random()<.5)}}
}
function updateWeapons(dt){
 for(const [id,w] of Object.entries(player.weapons)){
  const def=WEAPONS.find(x=>x.id===id);if(id==='orbit')continue;w.t-=dt;if(w.t<=0){weaponFire({...def,...w});w.t=def.cd/(player.rate*(1+(w.lv-1)*.05))}
 }
 const orb=player.weapons.orbit;if(orb){const n=orb.lv>=6?6:Math.min(5,2+Math.floor(orb.lv/2));for(let i=0;i<n;i++){const a=elapsed*(1.6+orb.lv*.08)+i*Math.PI*2/n,x=player.x+Math.cos(a)*(66+orb.lv*5),y=player.y+Math.sin(a)*(66+orb.lv*5);for(const e of enemies)if(Math.hypot(e.x-x,e.y-y)<e.r+11&&(!e.orbHit||elapsed-e.orbHit>.22)){e.orbHit=elapsed;damageEnemy(e,10*player.dmg*(1+orb.lv*.2))}}}
}
function levelUp(){
 level++;xp-=xpNeed;xpNeed=Math.floor(xpNeed*1.27+7);state='upgrade';paused=true;bridge.gameplayStop();show('upgrade');
 const options=[];const owned=Object.keys(player.weapons);const newWeapons=WEAPONS.filter(w=>!owned.includes(w.id));
 if(newWeapons.length&&owned.length<6)options.push({type:'new',w:newWeapons[Math.random()*newWeapons.length|0]});
 const upgradable=owned.map(id=>({id,...player.weapons[id]})).filter(x=>x.lv<6);if(upgradable.length)options.push({type:'weapon',w:WEAPONS.find(z=>z.id===upgradable[0].id),cur:upgradable[0]});
 while(options.length<3){const s=PASSIVES[Math.random()*PASSIVES.length|0];if(!options.some(o=>o.type==='stat'&&o.s===s))options.push({type:'stat',s})}
 options.sort(()=>Math.random()-.5);$('upgradeCards').innerHTML='';
 for(const o of options.slice(0,3)){
  const b=document.createElement('button');b.className='upgradeCard';
  if(o.type==='new'){b.innerHTML=`<b>${t('new')} · ${o.w.icon} ${nm(o.w)}</b><span>${lang==='ru'?'Новое оружие':'New weapon'}</span>`;b.onclick=()=>{player.weapons[o.w.id]={lv:1,t:.1};resumeFromUpgrade()}}
  else if(o.type==='weapon'){const evo=o.cur.lv===5;b.innerHTML=`<b>${evo?t('evolve'):nm(o.w)} · ${o.w.icon}</b><span>${lang==='ru'?`Уровень ${o.cur.lv+1}`:`Level ${o.cur.lv+1}`}</span>`;b.onclick=()=>{player.weapons[o.w.id].lv++;resumeFromUpgrade()}}
  else {b.innerHTML=`<b>${lang==='ru'?o.s[1]:o.s[2]}</b><span>+ ${lang==='ru'?'усиление':'upgrade'}</span>`;b.onclick=()=>{o.s[3](player);resumeFromUpgrade()}}
  $('upgradeCards').appendChild(b);
 }
}
function resumeFromUpgrade(){paused=false;state='play';show('play');bridge.gameplayStart();last=performance.now();updateWeaponStrip();snd(780,.08,.02)}
function updateWeaponStrip(){$('weaponStrip').innerHTML=Object.entries(player?.weapons||{}).map(([id,w])=>{const d=WEAPONS.find(x=>x.id===id);return `<span class="weaponPill ${w.lv>=6?'evolved':''}">${d.icon}<b>${w.lv}</b></span>`}).join('')}

function update(dt){
 if(state!=='play'||paused||!player)return;
 elapsed+=dt;if(elapsed>=600){endRun(true);return}
 let mx=(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0),my=(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0);if(joy.on){mx=joy.dx;my=joy.dy}const ml=Math.hypot(mx,my)||1;if(mx||my){player.face=Math.atan2(my,mx);player.x+=mx/ml*player.speed*dt;player.y+=my/ml*player.speed*dt}
 if(player.regen)player.hp=Math.min(player.max,player.hp+player.regen*dt);
 updateWeapons(dt);
 spawnTimer-=dt;if(spawnTimer<=0){spawnEnemy(false);if(elapsed>100&&Math.random()<.3)spawnEnemy(false);if(elapsed>280&&Math.random()<.2)spawnEnemy(false);spawnTimer=Math.max(.16,.62-elapsed/1100)}
 const wantedBoss=Math.floor(elapsed/120);if(wantedBoss>bossIndex){bossIndex=wantedBoss;spawnEnemy(true);shake=12;snd(75,.25,.035,'sawtooth')}
 for(const e of enemies){const dx=player.x-e.x,dy=player.y-e.y,l=Math.hypot(dx,dy)||1;e.anim+=dt*(e.type==='drone'?8:4);e.slow=Math.max(0,e.slow-dt);e.x+=dx/l*e.spd*(e.slow?0.5:1)*dt;e.y+=dy/l*e.spd*(e.slow?0.5:1)*dt;e.hit=Math.max(0,e.hit-dt);if(l<player.r+e.r){player.hp-=e.dmg*(1-player.armor)*dt;e.hit=.1;shake=5;if(player.hp<=0){die();return}}}
 for(let i=bullets.length-1;i>=0;i--){const b=bullets[i];b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;let remove=b.life<=0;for(const e of enemies){if(remove||b.hit.has(e))continue;if(Math.hypot(b.x-e.x,b.y-e.y)<b.r+e.r){b.hit.add(e);damageEnemy(e,b.damage);if(b.color==='#9fe9ff')e.slow=.8;if(b.pierce>0)b.pierce--;else remove=true}}if(remove)bullets.splice(i,1)}
 for(let i=hazards.length-1;i>=0;i--){const h=hazards[i];h.life-=dt;h.armed-=dt;if(h.armed<=0){for(const e of enemies)if(Math.hypot(e.x-h.x,e.y-h.y)<h.r+e.r){damageEnemy(e,h.damage*dt*2.3)}}if(h.life<=0)hazards.splice(i,1)}
 for(let i=gems.length-1;i>=0;i--){const q=gems[i],dx=player.x-q.x,dy=player.y-q.y,l=Math.hypot(dx,dy);if(l<player.pick){const s=Math.max(170,520*(1-l/player.pick));q.x+=dx/(l||1)*s*dt;q.y+=dy/(l||1)*s*dt}if(l<player.r+13){xp+=q.val*player.xpb;gems.splice(i,1);if(xp>=xpNeed)levelUp()}}
 for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;if(!p.beam){p.x+=p.vx*dt;p.y+=p.vy*dt}if(p.life<=0)particles.splice(i,1)}
 shake=Math.max(0,shake-20*dt);updateHud();
}
function burst(x,y,color,n=8){for(let i=0;i<n;i++){const a=Math.random()*6.28,s=55+Math.random()*150;particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.35,max:.35,color,beam:false})}}
function updateHud(){const wave=1+Math.floor(elapsed/60);$('hpText').textContent=`❤ ${Math.ceil(player.hp)}/${Math.ceil(player.max)}`;$('lvlText').textContent=`${t('lvl').toUpperCase()} ${level} · ${t('wave')} ${wave}`;$('timeText').textContent=fmt(elapsed);$('coinText').textContent=`✦ ${coins}`;$('xpFill').style.width=Math.min(100,xp/xpNeed*100)+'%'}

function roundedRect(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function drawWorld(){
 const wi=worldIndex(),w=WORLD[wi];
 const grad=ctx.createRadialGradient(W*.5,H*.42,0,W*.5,H*.42,Math.max(W,H)*.75);grad.addColorStop(0,w.ground);grad.addColorStop(1,w.sky);ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
 if(!player)return;
 const ox=W/2-player.x,oy=H/2-player.y,step=96,px=((player.x%step)+step)%step,py=((player.y%step)+step)%step;
 ctx.strokeStyle=w.grid;ctx.globalAlpha=.28;ctx.lineWidth=1;for(let x=-px;x<W;x+=step){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}for(let y=-py;y<H;y+=step){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}ctx.globalAlpha=1;
 ctx.save();ctx.translate(ox,oy);
 for(const p of props){if(Math.abs(p.x-player.x)>W*.75||Math.abs(p.y-player.y)>H*.75)continue;drawProp(p,wi,w)}
 ctx.restore();
 ctx.fillStyle='rgba(255,255,255,.72)';ctx.font='700 12px Arial';ctx.textAlign='left';ctx.fillText(lang==='ru'?w.nameRu:w.nameEn,14,H-18);
}
function drawProp(p,wi,w){
 ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);const s=p.s;
 if(wi===0){if(p.k<.45){ctx.fillStyle='rgba(44,219,255,.17)';ctx.beginPath();ctx.moveTo(0,-s);ctx.lineTo(s*.6,s*.7);ctx.lineTo(-s*.5,s*.55);ctx.closePath();ctx.fill();ctx.strokeStyle=w.glow;ctx.globalAlpha=.35;ctx.stroke()}else{ctx.fillStyle='rgba(68,84,109,.28)';roundedRect(-s*.7,-s*.45,s*1.4,s*.9,4);ctx.fill()}}
 else if(wi===1){ctx.fillStyle=p.k<.5?'rgba(96,255,129,.16)':'rgba(154,255,72,.11)';for(let i=0;i<5;i++){const a=i*1.25;ctx.beginPath();ctx.ellipse(Math.cos(a)*s*.25,Math.sin(a)*s*.25,s*.2,s*.55,a,0,6.28);ctx.fill()}}
 else {ctx.fillStyle='rgba(255,95,55,.15)';roundedRect(-s,-s*.35,s*2,s*.7,3);ctx.fill();ctx.strokeStyle='rgba(255,184,64,.22)';ctx.stroke();ctx.beginPath();ctx.arc(0,0,s*.25,0,6.28);ctx.stroke()}
 ctx.restore();
}
function shadow(x,y,rx,ry,a=.28){ctx.fillStyle=`rgba(0,0,0,${a})`;ctx.beginPath();ctx.ellipse(x,y+ry*.7,rx,ry,0,0,6.28);ctx.fill()}
function drawHero(p){
 const bob=Math.sin(elapsed*8)*1.5;ctx.save();ctx.translate(p.x,p.y+bob);ctx.rotate(p.face||0);shadow(0,0,17,7,.35);
 ctx.fillStyle=p.color;roundedRect(-11,-12,24,27,7);ctx.fill();ctx.fillStyle='#0b1220';roundedRect(-8,-9,17,10,4);ctx.fill();ctx.fillStyle=p.accent;ctx.beginPath();ctx.arc(2,-4,3,0,6.28);ctx.fill();
 ctx.fillStyle='#1f2b39';roundedRect(-16,4,8,16,4);ctx.fill();roundedRect(8,4,8,16,4);ctx.fill();ctx.fillStyle='#a9b6c6';roundedRect(11,-2,16,5,2);ctx.fill();ctx.fillStyle='#66e7ff';ctx.fillRect(24,-1,5,3);
 ctx.restore();drawPet(p);
}
function drawPet(p){const a=elapsed*1.8,r=30,x=p.x+Math.cos(a)*r,y=p.y+Math.sin(a)*r*.65;shadow(x,y,9,4,.25);ctx.save();ctx.translate(x,y);ctx.fillStyle=p.pet==='dragon'?'#56c878':p.pet==='wolf'?'#b9c1ce':p.pet==='fox'?'#f09a43':'#6bbcff';ctx.beginPath();ctx.moveTo(-8,6);ctx.lineTo(-10,-5);ctx.lineTo(-3,-10);ctx.lineTo(7,-7);ctx.lineTo(10,5);ctx.closePath();ctx.fill();ctx.fillStyle='#10131a';ctx.fillRect(-4,-3,3,3);ctx.fillRect(3,-3,3,3);ctx.restore()}
function drawEnemy(e){
 shadow(e.x,e.y,e.r*.8,e.r*.28,.35);ctx.save();ctx.translate(e.x,e.y);const hit=e.hit>0;if(hit)ctx.filter='brightness(2.4)';
 if(e.type==='alien')drawAlien(e);else if(e.type==='drone')drawDrone(e);else if(e.type==='robot')drawRobot(e);else drawBoss(e);
 ctx.filter='none';if(e.boss){ctx.fillStyle='rgba(10,10,15,.8)';roundedRect(-e.r,-e.r-18,e.r*2,8,4);ctx.fill();ctx.fillStyle='#ffb13d';roundedRect(-e.r,-e.r-18,e.r*2*Math.max(0,e.hp/e.max),8,4);ctx.fill()}ctx.restore();
}
function drawAlien(e){const s=e.r;ctx.fillStyle='#7d3bd6';ctx.beginPath();ctx.ellipse(0,0,s*.8,s,0,0,6.28);ctx.fill();ctx.strokeStyle='#8b47ef';ctx.lineWidth=4;for(let i=0;i<4;i++){const a=i*1.57+e.anim*.1;ctx.beginPath();ctx.moveTo(Math.cos(a)*s*.4,Math.sin(a)*s*.4);ctx.quadraticCurveTo(Math.cos(a+.3)*s*1.05,Math.sin(a+.3)*s*1.05,Math.cos(a+.7)*s*.65,Math.sin(a+.7)*s*.65);ctx.stroke()}ctx.fillStyle='#bffff8';ctx.beginPath();ctx.ellipse(-s*.25,-s*.15,s*.16,s*.25,-.2,0,6.28);ctx.ellipse(s*.25,-s*.15,s*.16,s*.25,.2,0,6.28);ctx.fill()}
function drawDrone(e){const s=e.r;ctx.fillStyle='#29394b';ctx.beginPath();ctx.arc(0,0,s,0,6.28);ctx.fill();ctx.strokeStyle='#64e6ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,s*.65,0,6.28);ctx.stroke();ctx.fillStyle='#9ff4ff';ctx.fillRect(-3,-4,6,8);ctx.strokeStyle='#536b83';for(let i=0;i<4;i++){const a=i*1.57+e.anim*.35;ctx.beginPath();ctx.moveTo(Math.cos(a)*s*.75,Math.sin(a)*s*.75);ctx.lineTo(Math.cos(a)*s*1.35,Math.sin(a)*s*1.35);ctx.stroke()}}
function drawRobot(e){const s=e.r;ctx.fillStyle='#3b4652';roundedRect(-s*.65,-s*.6,s*1.3,s*1.25,6);ctx.fill();ctx.fillStyle='#202731';roundedRect(-s*.45,-s*.35,s*.9,s*.38,4);ctx.fill();ctx.fillStyle='#ff5e49';ctx.fillRect(-s*.25,-s*.28,s*.5,s*.18);ctx.fillStyle='#5b6876';roundedRect(-s*.95,-s*.25,s*.3,s*.75,4);ctx.fill();roundedRect(s*.65,-s*.25,s*.3,s*.75,4);ctx.fill();ctx.strokeStyle='#222';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-s*.35,s*.55);ctx.lineTo(-s*.45,s);ctx.moveTo(s*.35,s*.55);ctx.lineTo(s*.45,s);ctx.stroke()}
function drawBoss(e){const s=e.r;if(e.type==='behemoth'){ctx.fillStyle='#3a414a';roundedRect(-s*.78,-s*.65,s*1.56,s*1.35,12);ctx.fill();ctx.fillStyle='#161c24';roundedRect(-s*.48,-s*.38,s*.96,s*.48,7);ctx.fill();ctx.fillStyle='#ff472f';ctx.beginPath();ctx.arc(0,-s*.12,s*.16,0,6.28);ctx.fill();ctx.strokeStyle='#ff6c3f';ctx.lineWidth=6;for(const k of [-1,1]){ctx.beginPath();ctx.moveTo(k*s*.72,-s*.2);ctx.lineTo(k*s*1.12,s*.3);ctx.stroke()}}else if(e.type==='queen'){ctx.fillStyle='#6c2ba9';ctx.beginPath();ctx.ellipse(0,0,s*.72,s,0,0,6.28);ctx.fill();ctx.strokeStyle='#bf5fff';ctx.lineWidth=7;for(let i=0;i<6;i++){const a=i*1.047;ctx.beginPath();ctx.moveTo(Math.cos(a)*s*.5,Math.sin(a)*s*.5);ctx.quadraticCurveTo(Math.cos(a+.3)*s*1.4,Math.sin(a+.3)*s*1.4,Math.cos(a+.6)*s*.9,Math.sin(a+.6)*s*.9);ctx.stroke()}ctx.fillStyle='#e9fff6';ctx.beginPath();ctx.arc(-s*.2,-s*.18,s*.12,0,6.28);ctx.arc(s*.2,-s*.18,s*.12,0,6.28);ctx.fill()}else{ctx.fillStyle='#54231d';roundedRect(-s*.75,-s*.72,s*1.5,s*1.45,10);ctx.fill();ctx.fillStyle='#1a0e0c';roundedRect(-s*.48,-s*.4,s*.96,s*.5,6);ctx.fill();ctx.fillStyle='#ffb33f';ctx.fillRect(-s*.3,-s*.26,s*.6,s*.16);ctx.strokeStyle='#ff613b';ctx.lineWidth=8;for(const k of [-1,1]){ctx.beginPath();ctx.moveTo(k*s*.75,-s*.35);ctx.lineTo(k*s*1.2,-s*.8);ctx.stroke()}}}
function drawCombat(){
 if(!player)return;const ox=W/2-player.x,oy=H/2-player.y;ctx.save();if(shake)ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);ctx.translate(ox,oy);
 for(const h of hazards){ctx.globalAlpha=.35+.15*Math.sin(elapsed*8);ctx.fillStyle=h.color;ctx.beginPath();ctx.arc(h.x,h.y,h.r,0,6.28);ctx.fill();ctx.globalAlpha=1}
 for(const q of gems){ctx.fillStyle='#57e7ff';ctx.shadowColor='#57e7ff';ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(q.x,q.y-q.r);ctx.lineTo(q.x+q.r*.7,q.y);ctx.lineTo(q.x,q.y+q.r);ctx.lineTo(q.x-q.r*.7,q.y);ctx.closePath();ctx.fill();ctx.shadowBlur=0}
 for(const b of bullets){ctx.fillStyle=b.color;ctx.shadowColor=b.color;ctx.shadowBlur=12;ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,6.28);ctx.fill();ctx.shadowBlur=0}
 for(const e of enemies)drawEnemy(e);
 for(const p of particles){ctx.globalAlpha=Math.max(0,p.life/(p.max||.35));if(p.beam){ctx.strokeStyle=p.color;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.tx,p.ty);ctx.stroke()}else{ctx.fillStyle=p.color;ctx.fillRect(p.x-2,p.y-2,4,4)}ctx.globalAlpha=1}
 drawHero(player);ctx.restore();
}
function draw(){ctx.clearRect(0,0,W,H);drawWorld();if(player&&['play','upgrade','pause','revive','result'].includes(state))drawCombat()}
function loop(now){const dt=Math.min(.033,(now-last)/1000||0);last=now;update(dt);draw();requestAnimationFrame(loop)}requestAnimationFrame(loop);

$('playBtn').onclick=()=>{show('select');state='select'};$('backBtn').onclick=menu;$('howBtn').onclick=()=>{show('help');state='help'};$('helpBackBtn').onclick=menu;$('startBtn').onclick=startGame;$('pauseBtn').onclick=togglePause;$('resumeBtn').onclick=togglePause;$('quitBtn').onclick=()=>endRun(false,true);$('retryBtn').onclick=startGame;$('resultMenuBtn').onclick=menu;$('reviveBtn').onclick=revive;$('skipReviveBtn').onclick=()=>endRun();$('metaBtn').onclick=()=>{state='meta';meta();show('meta')};$('metaBackBtn').onclick=menu;
function toggleSound(){save.settings.muted=!save.settings.muted;persist();if(save.settings.muted)audioOff();else audioOn();ui()}
$('soundBtn').onclick=toggleSound;$('pauseSoundBtn').onclick=toggleSound;$('langBtn').onclick=()=>{lang=lang==='ru'?'en':'ru';ui()};
addEventListener('keydown',e=>{keys[e.key]=1;if((e.key==='Escape'||e.key.toLowerCase()==='p')&&['play','pause'].includes(state))togglePause()});addEventListener('keyup',e=>keys[e.key]=0);
canvas.addEventListener('touchstart',e=>{if(state!=='play'||paused)return;e.preventDefault();const q=e.changedTouches[0];if(q.clientX<W*.62){joy={on:true,id:q.identifier,x:q.clientX,y:q.clientY,dx:0,dy:0};$('joystick').style.left=q.clientX-54+'px';$('joystick').style.top=q.clientY-54+'px';$('joystick').classList.remove('hidden')}},{passive:false});
canvas.addEventListener('touchmove',e=>{if(!joy.on)return;e.preventDefault();for(const q of e.changedTouches)if(q.identifier===joy.id){let x=q.clientX-joy.x,y=q.clientY-joy.y,l=Math.hypot(x,y),m=40;if(l>m){x*=m/l;y*=m/l}joy.dx=x/m;joy.dy=y/m;$('stick').style.transform=`translate(${x}px,${y}px)`}},{passive:false});
function touchEnd(e){for(const q of e.changedTouches)if(q.identifier===joy.id){joy.on=false;joy.dx=joy.dy=0;$('stick').style.transform='';$('joystick').classList.add('hidden')}}canvas.addEventListener('touchend',touchEnd);canvas.addEventListener('touchcancel',touchEnd);
function sysPause(){platformPause=state==='play'?true:platformPause;if(state==='play'){paused=true;state='pause';show('pause');bridge.gameplayStop()}audioOff()}
document.addEventListener('visibilitychange',()=>{if(document.hidden)sysPause()});addEventListener('blur',sysPause);try{bridge.ysdk?.on?.('game_api_pause',sysPause);bridge.ysdk?.on?.('game_api_resume',()=>{if(platformPause&&state==='pause'){platformPause=false;paused=false;state='play';show('play');bridge.gameplayStart();last=performance.now()}audioOn()})}catch{}
ui();
