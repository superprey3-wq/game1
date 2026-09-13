// v23: autonomous circle arena — two named fighters, HP bars, random weapon pickups
const V23_ID='circlefight';
const V23_WEAPONS={
 sword:{icon:'🗡️',name:'Меч',kind:'melee',range:54,damage:8,cool:420,speed:1.04},
 spear:{icon:'🔱',name:'Копьё',kind:'melee',range:78,damage:6,cool:520,speed:1.00},
 hammer:{icon:'🔨',name:'Молот',kind:'melee',range:50,damage:13,cool:820,speed:.92},
 bow:{icon:'🏹',name:'Лук',kind:'ranged',range:330,damage:6,cool:850,speed:.98,projectile:300},
 blaster:{icon:'💫',name:'Бластер',kind:'ranged',range:390,damage:5,cool:620,speed:1.00,projectile:380},
 axe:{icon:'🪓',name:'Топор',kind:'melee',range:58,damage:10,cool:650,speed:.95}
};
const V23_KEYS=Object.keys(V23_WEAPONS);
if(!GAMES.some(g=>g[0]===V23_ID))GAMES.push([V23_ID,'⚔️','Битва кружков','Автобой: ваши кружки сами двигаются, подбирают оружие и сражаются до последнего HP.']);
TITLES[V23_ID]='⚔️ Битва кружков';
if(typeof CAT!=='undefined')CAT[V23_ID]='Аркада';
if(typeof v19Badge==='function'){
 const V23_OLD_BADGE=v19Badge;
 v19Badge=function(id,key){if(id===V23_ID)return'автобой · без управления';return V23_OLD_BADGE(id,key)};
}

let V23_SIM=null,V23_VIEW=null,V23_TARGET=null,V23_RAF=0,V23_LAST=0,V23_CANVAS=null,V23_CTX=null,V23_DPR=1,V23_LAST_SNAP=0;
function v23Rand(a,b){return a+Math.random()*(b-a)}
function v23Clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function v23Len(x,y){return Math.hypot(x,y)||1}
function v23Other(w){return w==='host'?'guest':'host'}
function v23Name(w){return w==='host'?hostName():guestName()}
function v23Weapon(){return V23_KEYS[Math.floor(Math.random()*V23_KEYS.length)]}
function v23Fighter(w,x,y,vx,vy){return{who:w,name:v23Name(w),x,y,vx,vy,r:27,hp:100,weapon:null,weaponUntil:0,lastHit:0,lastShot:0,flash:0,kills:0}}
function v23NewState(){return{screen:'game',type:V23_ID,gameId:Date.now()+Math.floor(Math.random()*9999),winner:null,startedAt:Date.now()}}
function v23NewSim(){
 return{gameId:state.gameId,w:700,h:500,time:0,nextSpawn:900,pickups:[],shots:[],fighters:{host:v23Fighter('host',125,250,105,70),guest:v23Fighter('guest',575,250,-105,-70)},winner:null};
}
function v23Snap(s){return{gameId:s.gameId,w:s.w,h:s.h,winner:s.winner,fighters:{host:{...s.fighters.host},guest:{...s.fighters.guest}},pickups:s.pickups.map(p=>({...p})),shots:s.shots.map(p=>({...p}))}}
function v23Spawn(s){
 if(s.pickups.length>=4)return;
 s.pickups.push({id:Math.random().toString(36).slice(2),type:v23Weapon(),x:v23Rand(85,s.w-85),y:v23Rand(85,s.h-85),born:s.time});
}
function v23ChooseTarget(f,s){
 if(!f.weapon||f.weaponUntil-s.time<1800){
   let best=null,bd=1e9;for(const p of s.pickups){const d=Math.hypot(p.x-f.x,p.y-f.y);if(d<bd){bd=d;best=p}}
   if(best)return{x:best.x,y:best.y,kind:'pickup'};
 }
 const o=s.fighters[v23Other(f.who)];return{x:o.x,y:o.y,kind:'enemy'};
}
function v23MoveFighter(f,s,dt){
 const o=s.fighters[v23Other(f.who)],t=v23ChooseTarget(f,s),dx=t.x-f.x,dy=t.y-f.y,d=v23Len(dx,dy),wp=f.weapon?V23_WEAPONS[f.weapon]:null;
 let speed=105*(wp?.speed||1),wantX=dx/d*speed,wantY=dy/d*speed;
 if(t.kind==='enemy'&&wp?.kind==='ranged'&&d<190){wantX=-dx/d*speed*.55;wantY=-dy/d*speed*.55}
 const swirl=(f.who==='host'?1:-1)*Math.sin(s.time/640)*28;wantX+=(-dy/d)*swirl;wantY+=(dx/d)*swirl;
 f.vx+=(wantX-f.vx)*Math.min(1,dt*2.4);f.vy+=(wantY-f.vy)*Math.min(1,dt*2.4);
 f.x+=f.vx*dt;f.y+=f.vy*dt;
 if(f.x<f.r){f.x=f.r;f.vx=Math.abs(f.vx)}if(f.x>s.w-f.r){f.x=s.w-f.r;f.vx=-Math.abs(f.vx)}if(f.y<f.r){f.y=f.r;f.vy=Math.abs(f.vy)}if(f.y>s.h-f.r){f.y=s.h-f.r;f.vy=-Math.abs(f.vy)}
 if(f.weapon&&s.time>f.weaponUntil)f.weapon=null;
 for(let i=s.pickups.length-1;i>=0;i--){const p=s.pickups[i];if(Math.hypot(p.x-f.x,p.y-f.y)<f.r+18){f.weapon=p.type;f.weaponUntil=s.time+8500;s.pickups.splice(i,1);f.flash=140}}
 if(!f.weapon)return;
 const w=V23_WEAPONS[f.weapon],dist=Math.hypot(o.x-f.x,o.y-f.y);
 if(w.kind==='melee'&&dist<w.range+o.r&&s.time-f.lastHit>w.cool){f.lastHit=s.time;o.hp=Math.max(0,o.hp-w.damage);o.flash=180;const nx=(o.x-f.x)/v23Len(o.x-f.x,o.y-f.y),ny=(o.y-f.y)/v23Len(o.x-f.x,o.y-f.y);o.vx+=nx*120;o.vy+=ny*120}
 if(w.kind==='ranged'&&dist<w.range&&s.time-f.lastShot>w.cool){f.lastShot=s.time;const nx=(o.x-f.x)/v23Len(o.x-f.x,o.y-f.y),ny=(o.y-f.y)/v23Len(o.x-f.x,o.y-f.y);s.shots.push({owner:f.who,x:f.x+nx*(f.r+5),y:f.y+ny*(f.r+5),vx:nx*w.projectile,vy:ny*w.projectile,r:7,damage:w.damage,type:f.weapon,life:1500})}
}
function v23CircleCollision(a,b){
 const dx=b.x-a.x,dy=b.y-a.y,d=v23Len(dx,dy),min=a.r+b.r;if(d>=min)return;const nx=dx/d,ny=dy/d,over=min-d;a.x-=nx*over*.5;a.y-=ny*over*.5;b.x+=nx*over*.5;b.y+=ny*over*.5;const rel=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rel<0){const imp=-rel*.78;a.vx-=nx*imp;a.vy-=ny*imp;b.vx+=nx*imp;b.vy+=ny*imp}}
function v23Shots(s,dt){
 for(let i=s.shots.length-1;i>=0;i--){const p=s.shots[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt*1000;if(p.life<=0||p.x<0||p.y<0||p.x>s.w||p.y>s.h){s.shots.splice(i,1);continue}const o=s.fighters[v23Other(p.owner)];if(Math.hypot(p.x-o.x,p.y-o.y)<p.r+o.r){o.hp=Math.max(0,o.hp-p.damage);o.flash=180;s.shots.splice(i,1)}}
}
function v23Step(s,dt){
 s.time+=dt*1000;if(s.time>=s.nextSpawn){v23Spawn(s);s.nextSpawn=s.time+v23Rand(1700,2800)}
 v23MoveFighter(s.fighters.host,s,dt);v23MoveFighter(s.fighters.guest,s,dt);v23CircleCollision(s.fighters.host,s.fighters.guest);v23Shots(s,dt);
 for(const f of Object.values(s.fighters))f.flash=Math.max(0,f.flash-dt*1000);
 const h=s.fighters.host,g=s.fighters.guest;if(!s.winner&&(h.hp<=0||g.hp<=0)){s.winner=h.hp<=0&&g.hp<=0?'draw':h.hp<=0?'guest':'host';state.winner=s.winner;try{sync()}catch(e){}}
}
function v23SendSnap(s){const now=performance.now();if(now-V23_LAST_SNAP<65)return;V23_LAST_SNAP=now;direct({t:'circleSnap',s:v23Snap(s)})}
function v23Lerp(a,b,k){return a+(b-a)*k}
function v23BlendView(){
 if(!V23_TARGET)return;if(!V23_VIEW||V23_VIEW.gameId!==V23_TARGET.gameId){V23_VIEW=JSON.parse(JSON.stringify(V23_TARGET));return}
 for(const who of ['host','guest']){const a=V23_VIEW.fighters[who],b=V23_TARGET.fighters[who];a.x=v23Lerp(a.x,b.x,.34);a.y=v23Lerp(a.y,b.y,.34);a.hp=b.hp;a.weapon=b.weapon;a.weaponUntil=b.weaponUntil;a.flash=b.flash;a.name=b.name}
 V23_VIEW.pickups=V23_TARGET.pickups;V23_VIEW.shots=V23_TARGET.shots;V23_VIEW.winner=V23_TARGET.winner;
}
function v23Resize(){if(!V23_CANVAS)return;const r=V23_CANVAS.getBoundingClientRect();V23_DPR=Math.min(devicePixelRatio||1,2);V23_CANVAS.width=Math.max(1,Math.round(r.width*V23_DPR));V23_CANVAS.height=Math.max(1,Math.round(r.width*(500/700)*V23_DPR));V23_CANVAS.style.height=(r.width*(500/700))+'px';V23_CTX=V23_CANVAS.getContext('2d');V23_CTX.setTransform(V23_DPR,0,0,V23_DPR,0,0)}
function v23DrawCircle(ctx,f,sx,sy){
 const x=f.x*sx,y=f.y*sy,r=f.r*Math.min(sx,sy);ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=f.who==='host'?'#4b67ff':'#ffd62e';ctx.shadowBlur=18;ctx.shadowColor=ctx.fillStyle;ctx.fill();ctx.shadowBlur=0;ctx.lineWidth=4;ctx.strokeStyle=f.flash>0?'#fff':'rgba(255,255,255,.75)';ctx.stroke();ctx.fillStyle=f.who==='host'?'#fff':'#1a1620';ctx.font=`800 ${Math.max(10,r*.38)}px system-ui`;ctx.textAlign='center';ctx.textBaseline='middle';let n=(f.name||v23Name(f.who)).slice(0,12);ctx.fillText(n,x,y+1);if(f.weapon){ctx.font=`${Math.max(18,r*.72)}px system-ui`;ctx.fillText(V23_WEAPONS[f.weapon]?.icon||'⚔️',x+r*.72,y-r*.72)}ctx.restore()}
function v23Draw(s){
 if(!V23_CTX||!V23_CANVAS||!s)return;const ctx=V23_CTX,r=V23_CANVAS.getBoundingClientRect(),W=r.width,H=r.height,sx=W/s.w,sy=H/s.h;ctx.clearRect(0,0,W,H);ctx.fillStyle='#0e0b14';ctx.fillRect(0,0,W,H);ctx.strokeStyle='rgba(255,203,132,.9)';ctx.lineWidth=4;ctx.strokeRect(5,5,W-10,H-10);
 const grid=44*sx;ctx.strokeStyle='rgba(255,255,255,.025)';ctx.lineWidth=1;for(let x=grid;x<W;x+=grid){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}for(let y=grid;y<H;y+=grid){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
 for(const p of s.pickups){ctx.font=`${Math.max(22,34*Math.min(sx,sy))}px system-ui`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(V23_WEAPONS[p.type]?.icon||'🎁',p.x*sx,p.y*sy)}
 for(const p of s.shots){ctx.beginPath();ctx.arc(p.x*sx,p.y*sy,Math.max(3,p.r*Math.min(sx,sy)),0,Math.PI*2);ctx.fillStyle=p.type==='blaster'?'#d47cff':'#fff4ae';ctx.fill()}
 v23DrawCircle(ctx,s.fighters.host,sx,sy);v23DrawCircle(ctx,s.fighters.guest,sx,sy);
}
function v23Hud(s){if(!s)return;for(const who of ['host','guest']){const f=s.fighters[who],hp=Math.max(0,Math.round(f.hp));const bar=$('v23hp-'+who),num=$('v23num-'+who),wep=$('v23wep-'+who);if(bar)bar.style.width=hp+'%';if(num)num.textContent=hp;if(wep)wep.textContent=f.weapon?(V23_WEAPONS[f.weapon]?.icon+' '+V23_WEAPONS[f.weapon]?.name):'без оружия'}}
function v23Loop(ts){
 if(state.type!==V23_ID)return;const dt=Math.min(.04,Math.max(.001,(ts-(V23_LAST||ts))/1000));V23_LAST=ts;
 if(role==='host'){if(!V23_SIM||V23_SIM.gameId!==state.gameId)V23_SIM=v23NewSim();if(!V23_SIM.winner)v23Step(V23_SIM,dt);V23_VIEW=v23Snap(V23_SIM);v23SendSnap(V23_SIM)}else v23BlendView();
 v23Draw(V23_VIEW);v23Hud(V23_VIEW);V23_RAF=requestAnimationFrame(v23Loop)
}
function v23Stop(){cancelAnimationFrame(V23_RAF);V23_RAF=0;V23_LAST=0;V23_CANVAS=V23_CTX=null;V23_SIM=null;V23_VIEW=null;V23_TARGET=null}
function renderV23Fight(){
 const winner=state.winner;const winText=winner?(winner==='draw'?'Ничья!':v23Name(winner)+' победил(а)!'):'';$('roundPill').textContent='автобой';$('bar').style.width=winner?'100%':'55%';
 $('gameCard').innerHTML=`<div class="v23Hud"><div class="v23Player host"><div class="v23Name">🔵 ${esc(hostName())}</div><div class="v23Bar"><i id="v23hp-host"></i></div><div><b id="v23num-host">100</b> HP · <span id="v23wep-host">без оружия</span></div></div><div class="v23Vs">VS</div><div class="v23Player guest"><div class="v23Name">🟡 ${esc(guestName())}</div><div class="v23Bar"><i id="v23hp-guest"></i></div><div><b id="v23num-guest">100</b> HP · <span id="v23wep-guest">без оружия</span></div></div></div>${winner?`<div class="result">🏆 ${esc(winText)}</div>`:'<div class="muted v23Auto">Ничего нажимать не нужно — бойцы сами ищут оружие и сражаются.</div>'}<canvas id="v23Arena" class="v23Arena"></canvas><div class="v23Legend">🗡️ меч · 🔱 копьё · 🔨 молот · 🪓 топор · 🏹 лук · 💫 бластер</div>${winner?`<div class="actions"><button class="btn" onclick="dispatch('game','${V23_ID}')">⚔️ Ещё бой</button></div>`:''}`;
 requestAnimationFrame(()=>{v23Stop();V23_CANVAS=$('v23Arena');if(!V23_CANVAS)return;v23Resize();window.addEventListener('resize',v23Resize,{once:true});V23_RAF=requestAnimationFrame(v23Loop)})
}

const V23_PREV_APPLY=applyAction,V23_PREV_RENDER=renderGame,V23_PREV_BACK=backMenu;
applyAction=function(a,v,who){if(a==='game'&&v===V23_ID){v23Stop();state=v23NewState();sync();renderFromState();return}V23_PREV_APPLY(a,v,who)};
renderGame=function(){if(state.type===V23_ID)return renderV23Fight();return V23_PREV_RENDER()};
backMenu=function(){if(state.type===V23_ID)v23Stop();return V23_PREV_BACK()};
const V23_PREV_HANDLE=handleMessage;
handleMessage=function(m){if(m?.t==='circleSnap'&&m.s&&state.type===V23_ID){V23_TARGET=m.s;if(!V23_VIEW)V23_VIEW=JSON.parse(JSON.stringify(m.s));return}return V23_PREV_HANDLE(m)};

(function(){if(document.getElementById('v23Style'))return;const s=document.createElement('style');s.id='v23Style';s.textContent=`
.v23Hud{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:start;margin-bottom:10px}.v23Player{min-width:0}.v23Player.guest{text-align:right}.v23Name{font-weight:900;font-size:.9rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v23Bar{height:16px;border:2px solid rgba(255,255,255,.6);border-radius:8px;overflow:hidden;margin:6px 0;background:rgba(255,255,255,.08)}.v23Bar i{display:block;height:100%;width:100%;transition:width .12s linear}.v23Player.host .v23Bar i{background:linear-gradient(90deg,#2749ff,#5977ff)}.v23Player.guest .v23Bar i{margin-left:auto;background:linear-gradient(90deg,#ffe934,#ffc928)}.v23Player>div:last-child{font-size:.72rem;color:var(--muted)}.v23Vs{font-size:1.25rem;font-weight:950;padding-top:5px}.v23Arena{width:100%;display:block;border-radius:18px;touch-action:none;background:#0e0b14;box-shadow:inset 0 0 0 1px rgba(255,255,255,.07)}.v23Auto{text-align:center;margin:8px 0}.v23Legend{text-align:center;color:var(--muted);font-size:.7rem;margin:8px 0 0;line-height:1.5}@media(max-width:480px){.v23Hud{gap:6px}.v23Name{font-size:.78rem}.v23Player>div:last-child{font-size:.64rem}.v23Vs{font-size:1rem}.v23Bar{height:13px}}
`;document.head.appendChild(s)})();