// v25: polished autonomous circle arena — bigger fighters, richer animation, first to 3 wins
let V25_ROUND_TIMER=0;
let V25_PARTICLES=[];
let V25_TRAILS={host:[],guest:[]};
let V25_LAST_FLASH={host:0,guest:0};
let V25_LAST_DRAW_AT=0;

v23Fighter=function(w,x,y,vx,vy){
 return{who:w,name:v23Name(w),x,y,vx,vy,r:46,hp:100,weapon:null,weaponUntil:0,lastHit:0,lastShot:0,lastBump:0,flash:0,kills:0};
};

v23NewState=function(){
 return{screen:'game',type:V23_ID,gameId:Date.now()+Math.floor(Math.random()*9999),winner:null,roundWinner:null,round:1,score:{host:0,guest:0},startedAt:Date.now()};
};

v23NewSim=function(){
 const flip=(Number(state.round||1)%2)===0;
 return{
  gameId:state.gameId,w:720,h:520,time:0,nextSpawn:700,pickups:[],shots:[],winner:null,
  fighters:{
   host:v23Fighter('host',flip?585:135,260,flip?-118:118,74),
   guest:v23Fighter('guest',flip?135:585,260,flip?118:-118,-74)
  }
 };
};

v23Snap=function(s){
 return{gameId:s.gameId,w:s.w,h:s.h,time:s.time,winner:s.winner,fighters:{host:{...s.fighters.host},guest:{...s.fighters.guest}},pickups:s.pickups.map(p=>({...p})),shots:s.shots.map(p=>({...p}))};
};

v23BlendView=function(){
 if(!V23_TARGET)return;
 if(!V23_VIEW||V23_VIEW.gameId!==V23_TARGET.gameId){V23_VIEW=JSON.parse(JSON.stringify(V23_TARGET));return}
 V23_VIEW.time=V23_TARGET.time;
 for(const who of ['host','guest']){
  const a=V23_VIEW.fighters[who],b=V23_TARGET.fighters[who];
  a.x=v23Lerp(a.x,b.x,.38);a.y=v23Lerp(a.y,b.y,.38);a.vx=b.vx;a.vy=b.vy;a.hp=b.hp;a.r=b.r;
  a.weapon=b.weapon;a.weaponUntil=b.weaponUntil;a.flash=b.flash;a.name=b.name;
 }
 V23_VIEW.pickups=V23_TARGET.pickups;V23_VIEW.shots=V23_TARGET.shots;V23_VIEW.winner=V23_TARGET.winner;
};

function v25FinishRound(s,winner){
 if(s.winner)return;
 s.winner=winner;
 state.roundWinner=winner;
 if(!state.score)state.score={host:0,guest:0};
 if(winner!=='draw')state.score[winner]=(state.score[winner]||0)+1;
 if(winner!=='draw'&&state.score[winner]>=3)state.winner=winner;
 try{sync()}catch(e){}
 if(!state.winner){
  clearTimeout(V25_ROUND_TIMER);
  const endedRound=state.round;
  V25_ROUND_TIMER=setTimeout(()=>{
   if(state.type!==V23_ID||state.screen!=='game'||state.winner||state.round!==endedRound||!state.roundWinner)return;
   state.round=endedRound+1;state.roundWinner=null;state.gameId=Date.now()+Math.floor(Math.random()*9999);state.startedAt=Date.now();
   V23_SIM=null;V23_VIEW=null;V23_TARGET=null;V25_PARTICLES=[];V25_TRAILS={host:[],guest:[]};V25_LAST_FLASH={host:0,guest:0};
   try{sync()}catch(e){}renderFromState();
  },2300);
 }
}

v23Step=function(s,dt){
 s.time+=dt*1000;
 if(Array.isArray(s.pickups))s.pickups=s.pickups.filter(p=>s.time-Number(p?.born||0)<6000);
 if(s.time>=s.nextSpawn){v23Spawn(s);s.nextSpawn=s.time+v23Rand(1350,2200)}
 const h=s.fighters.host,g=s.fighters.guest;
 v23MoveFighter(h,s,dt);v23MoveFighter(g,s,dt);
 const beforeDx=g.x-h.x,beforeDy=g.y-h.y,beforeD=v23Len(beforeDx,beforeDy);
 const closing=Math.abs((g.vx-h.vx)*(beforeDx/beforeD)+(g.vy-h.vy)*(beforeDy/beforeD));
 v23CircleCollision(h,g);
 if(beforeD<h.r+g.r+5&&closing>135&&s.time-Math.max(h.lastBump||0,g.lastBump||0)>700){
  h.lastBump=g.lastBump=s.time;h.hp=Math.max(0,h.hp-1);g.hp=Math.max(0,g.hp-1);h.flash=Math.max(h.flash,95);g.flash=Math.max(g.flash,95);
 }
 v23Shots(s,dt);
 for(const f of Object.values(s.fighters))f.flash=Math.max(0,f.flash-dt*1000);
 if(!s.winner&&(h.hp<=0||g.hp<=0))v25FinishRound(s,h.hp<=0&&g.hp<=0?'draw':h.hp<=0?'guest':'host');
};

v23Resize=function(){
 if(!V23_CANVAS)return;const r=V23_CANVAS.getBoundingClientRect();V23_DPR=Math.min(devicePixelRatio||1,2);
 V23_CANVAS.width=Math.max(1,Math.round(r.width*V23_DPR));V23_CANVAS.height=Math.max(1,Math.round(r.width*(520/720)*V23_DPR));
 V23_CANVAS.style.height=(r.width*(520/720))+'px';V23_CTX=V23_CANVAS.getContext('2d');V23_CTX.setTransform(V23_DPR,0,0,V23_DPR,0,0);
};

function v25SpawnHitParticles(f,sx,sy){
 const x=f.x*sx,y=f.y*sy;for(let i=0;i<10;i++){const a=Math.random()*Math.PI*2,sp=35+Math.random()*85;V25_PARTICLES.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:420+Math.random()*220,max:640,who:f.who})}
}
function v25UpdateFx(s,sx,sy){
 const now=performance.now(),dt=Math.min(.05,(now-(V25_LAST_DRAW_AT||now))/1000);V25_LAST_DRAW_AT=now;
 for(const who of ['host','guest']){
  const f=s.fighters[who],prev=V25_LAST_FLASH[who]||0;if(f.flash>125&&prev<=125)v25SpawnHitParticles(f,sx,sy);V25_LAST_FLASH[who]=f.flash;
  const tr=V25_TRAILS[who];tr.push({x:f.x*sx,y:f.y*sy,life:240,r:f.r*Math.min(sx,sy)});while(tr.length>13)tr.shift();for(const p of tr)p.life-=dt*1000;
 }
 for(const p of V25_PARTICLES){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=.96;p.vy*=.96;p.life-=dt*1000}V25_PARTICLES=V25_PARTICLES.filter(p=>p.life>0);
}
function v25RoundPips(n){return [0,1,2].map(i=>`<i class="${i<n?'won':''}"></i>`).join('')}

v23DrawCircle=function(ctx,f,sx,sy){
 const t=performance.now(),scale=Math.min(sx,sy),baseR=f.r*scale,speed=Math.hypot(f.vx||0,f.vy||0),phase=f.who==='host'?0:Math.PI;
 const pulse=1+.035*Math.sin(t/150+phase),squash=Math.min(.08,speed/2200),r=baseR*pulse;
 const x=f.x*sx,y=f.y*sy+Math.sin(t/210+phase)*1.8;
 ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(f.vy||0,f.vx||1));ctx.scale(1+squash,1-squash*.65);ctx.rotate(-Math.atan2(f.vy||0,f.vx||1));
 const glow=f.who==='host'?'#5b78ff':'#ff5da8';ctx.shadowBlur=f.flash>0?32:22;ctx.shadowColor=f.flash>0?'#ffffff':glow;
 const grad=ctx.createRadialGradient(-r*.28,-r*.32,r*.08,0,0,r*1.08);
 if(f.who==='host'){grad.addColorStop(0,'#8ea3ff');grad.addColorStop(.48,'#4969ff');grad.addColorStop(1,'#172a94')}
 else{grad.addColorStop(0,'#ffd06f');grad.addColorStop(.45,'#ff738e');grad.addColorStop(1,'#9d2868')}
 ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill();ctx.shadowBlur=0;
 ctx.lineWidth=Math.max(3,4.5*scale);ctx.strokeStyle=f.flash>0?'#fff':'rgba(255,255,255,.86)';ctx.stroke();
 ctx.save();ctx.rotate((t/850)*(f.who==='host'?1:-1));ctx.setLineDash(f.who==='host'?[5*scale,9*scale]:[2*scale,7*scale]);ctx.lineWidth=Math.max(1.5,2.4*scale);ctx.strokeStyle=f.who==='host'?'rgba(123,175,255,.8)':'rgba(255,165,207,.82)';ctx.beginPath();ctx.arc(0,0,r+8*scale,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
 for(let i=0;i<3;i++){const a=i*Math.PI*2/3,ox=Math.cos(a)*(r+8*scale),oy=Math.sin(a)*(r+8*scale);ctx.beginPath();ctx.arc(ox,oy,Math.max(1.8,3.2*scale),0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill()}ctx.restore();
 const n=(f.name||v23Name(f.who)).slice(0,12),fs=Math.max(10,r*(n.length>9?.26:n.length>6?.31:.37));ctx.fillStyle='#fff';ctx.font=`950 ${fs}px system-ui`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=5;ctx.fillText(n,0,1);ctx.shadowBlur=0;
 if(f.weapon){
  const w=V23_WEAPONS[f.weapon],left=Math.max(0,(f.weaponUntil-(V23_VIEW?.time||V23_SIM?.time||0))/4000),ang=t/360+(f.who==='host'?0:Math.PI),wx=Math.cos(ang)*(r+22*scale),wy=Math.sin(ang)*(r+22*scale);
  ctx.beginPath();ctx.arc(wx,wy,Math.max(12,16*scale),0,Math.PI*2);ctx.fillStyle='rgba(16,10,25,.88)';ctx.fill();ctx.lineWidth=2;ctx.strokeStyle='rgba(255,255,255,.7)';ctx.stroke();ctx.font=`${Math.max(18,25*scale)}px system-ui`;ctx.fillText(w?.icon||'⚔️',wx,wy+1);
  ctx.beginPath();ctx.lineWidth=Math.max(2,3*scale);ctx.strokeStyle='#fff';ctx.arc(0,0,r+14*scale,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.min(1,left));ctx.stroke();
 }
 ctx.restore();
};

v23Draw=function(s){
 if(!V23_CTX||!V23_CANVAS||!s)return;const ctx=V23_CTX,r=V23_CANVAS.getBoundingClientRect(),W=r.width,H=r.height,sx=W/s.w,sy=H/s.h,t=performance.now();
 v25UpdateFx(s,sx,sy);ctx.clearRect(0,0,W,H);
 const bg=ctx.createRadialGradient(W*.5,H*.45,20,W*.5,H*.5,Math.max(W,H)*.72);bg.addColorStop(0,'#241333');bg.addColorStop(.58,'#100b18');bg.addColorStop(1,'#07060b');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
 ctx.save();const shake=Math.max(s.fighters.host.flash||0,s.fighters.guest.flash||0)>125?2.2:0;if(shake)ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);
 ctx.strokeStyle='rgba(255,184,221,.34)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(W/2,H/2,Math.min(W,H)*.22,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(W/2,H*.12);ctx.lineTo(W/2,H*.88);ctx.strokeStyle='rgba(255,255,255,.035)';ctx.stroke();
 for(let i=0;i<22;i++){const x=(i*97%719)/719*W,y=(i*173%521)/521*H,a=.11+.08*Math.sin(t/700+i);ctx.fillStyle=`rgba(255,255,255,${Math.max(.02,a)})`;ctx.fillRect(x,y,1.3,1.3)}
 for(const who of ['host','guest']){for(const p of V25_TRAILS[who]){if(p.life<=0)continue;ctx.beginPath();ctx.arc(p.x,p.y,p.r*.72,0,Math.PI*2);ctx.fillStyle=who==='host'?`rgba(65,104,255,${p.life/240*.075})`:`rgba(255,85,155,${p.life/240*.075})`;ctx.fill()}}
 for(const p of s.pickups){const age=s.time-Number(p.born||0),life=Math.max(0,1-age/6000),pulse=1+.14*Math.sin(t/150+p.x);ctx.save();ctx.translate(p.x*sx,p.y*sy);ctx.scale(pulse,pulse);ctx.shadowBlur=20;ctx.shadowColor='rgba(255,215,115,.75)';ctx.beginPath();ctx.arc(0,0,Math.max(17,22*Math.min(sx,sy)),0,Math.PI*2);ctx.fillStyle='rgba(255,205,91,.13)';ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=`rgba(255,232,159,${.35+.5*life})`;ctx.lineWidth=2;ctx.stroke();ctx.font=`${Math.max(24,36*Math.min(sx,sy))}px system-ui`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(V23_WEAPONS[p.type]?.icon||'🎁',0,1);ctx.restore()}
 for(const p of s.shots){const sp=v23Len(p.vx,p.vy),nx=p.vx/sp,ny=p.vy/sp,x=p.x*sx,y=p.y*sy;ctx.beginPath();ctx.moveTo(x-nx*18,y-ny*18);ctx.lineTo(x,y);ctx.lineWidth=4;ctx.lineCap='round';ctx.strokeStyle=p.type==='blaster'?'rgba(214,114,255,.8)':'rgba(255,241,171,.85)';ctx.stroke();ctx.beginPath();ctx.arc(x,y,Math.max(3,p.r*Math.min(sx,sy)),0,Math.PI*2);ctx.fillStyle=p.type==='blaster'?'#dd8bff':'#fff4ae';ctx.fill()}
 v23DrawCircle(ctx,s.fighters.host,sx,sy);v23DrawCircle(ctx,s.fighters.guest,sx,sy);
 for(const p of V25_PARTICLES){ctx.beginPath();ctx.arc(p.x,p.y,2.2,0,Math.PI*2);ctx.fillStyle=p.who==='host'?`rgba(117,158,255,${Math.min(1,p.life/p.max)})`:`rgba(255,121,174,${Math.min(1,p.life/p.max)})`;ctx.fill()}
 ctx.lineWidth=4;ctx.strokeStyle='rgba(255,205,151,.72)';ctx.strokeRect(4,4,W-8,H-8);ctx.restore();
};

v23Hud=function(s){
 if(!s)return;
 for(const who of ['host','guest']){
  const f=s.fighters[who],hp=Math.max(0,Math.round(f.hp)),bar=$('v23hp-'+who),num=$('v23num-'+who),wep=$('v23wep-'+who);
  if(bar)bar.style.width=hp+'%';if(num)num.textContent=hp;
  if(wep){const left=f.weapon?Math.max(0,(f.weaponUntil-(s.time||0))/1000):0;wep.textContent=f.weapon?(V23_WEAPONS[f.weapon]?.icon+' '+V23_WEAPONS[f.weapon]?.name+' · '+left.toFixed(1)+'с'):'ищет оружие'}
 }
 const hs=$('v25score-host'),gs=$('v25score-guest'),round=$('v25round'),hpips=$('v25pips-host'),gpips=$('v25pips-guest');
 if(hs)hs.textContent=state.score?.host||0;if(gs)gs.textContent=state.score?.guest||0;if(round)round.textContent='Раунд '+(state.round||1);if(hpips)hpips.innerHTML=v25RoundPips(state.score?.host||0);if(gpips)gpips.innerHTML=v25RoundPips(state.score?.guest||0);
 const ov=$('v25Overlay'),actions=$('v25FightActions');
 if(ov){if(state.winner){ov.className='v25Overlay show final';ov.innerHTML=`<b>🏆 ${esc(v23Name(state.winner))}</b><span>Победа в матче · ${state.score.host}:${state.score.guest}</span>`}else if(state.roundWinner){ov.className='v25Overlay show';ov.innerHTML=state.roundWinner==='draw'?'<b>🤝 Ничья в раунде</b><span>Следующий бой через секунду…</span>':`<b>⚡ Раунд за ${esc(v23Name(state.roundWinner))}</b><span>Счёт ${state.score.host}:${state.score.guest}</span>`}else{ov.className='v25Overlay';ov.innerHTML=''}}
 if(actions)actions.innerHTML=state.winner?`<button class="btn" onclick="dispatch('game','${V23_ID}')">⚔️ Новый матч</button>`:'';
};

renderV23Fight=function(){
 const frozen=V23_VIEW?JSON.parse(JSON.stringify(V23_VIEW)):(V23_TARGET?JSON.parse(JSON.stringify(V23_TARGET)):null);
 $('roundPill').textContent=`до 3 побед · раунд ${state.round||1}`;$('bar').style.width=((Math.max(state.score?.host||0,state.score?.guest||0))/3*100)+'%';
 $('gameCard').innerHTML=`<div class="v25MatchHead"><div class="v25FighterCard host"><div class="v25TopLine"><b>🔵 ${esc(hostName())}</b><strong id="v25score-host">${state.score?.host||0}</strong></div><div class="v25Pips" id="v25pips-host">${v25RoundPips(state.score?.host||0)}</div><div class="v23Bar"><i id="v23hp-host"></i></div><div class="v25Hp"><b id="v23num-host">100</b> HP <span id="v23wep-host">ищет оружие</span></div></div><div class="v25Center"><span id="v25round">Раунд ${state.round||1}</span><b>VS</b><small>первый до 3</small></div><div class="v25FighterCard guest"><div class="v25TopLine"><b>🟣 ${esc(guestName())}</b><strong id="v25score-guest">${state.score?.guest||0}</strong></div><div class="v25Pips" id="v25pips-guest">${v25RoundPips(state.score?.guest||0)}</div><div class="v23Bar"><i id="v23hp-guest"></i></div><div class="v25Hp"><b id="v23num-guest">100</b> HP <span id="v23wep-guest">ищет оружие</span></div></div></div><div class="v25ArenaWrap"><canvas id="v23Arena" class="v23Arena v25Arena"></canvas><div id="v25Overlay" class="v25Overlay"></div></div><div class="v25Legend"><span>🗡️ меч</span><span>🔱 копьё</span><span>🔨 молот</span><span>🪓 топор</span><span>🏹 лук</span><span>💫 бластер</span></div><div class="muted v23Auto">Ничего нажимать не нужно. Оружие действует около 4 секунд и исчезает.</div><div id="v25FightActions" class="actions"></div>`;
 requestAnimationFrame(()=>{
  v23Stop();V23_CANVAS=$('v23Arena');if(!V23_CANVAS)return;v23Resize();window.addEventListener('resize',v23Resize,{once:true});
  if(frozen){V23_VIEW=frozen;v23Draw(frozen);v23Hud(frozen)}
  if(!state.roundWinner&&!state.winner)V23_RAF=requestAnimationFrame(v23Loop);
 });
};

if(typeof v19Badge==='function'){
 const V25_OLD_BADGE=v19Badge;v19Badge=function(id,key){if(id===V23_ID)return'автобой · первый до 3 побед';return V25_OLD_BADGE(id,key)};
}

(function(){if(document.getElementById('v25CircleStyle'))return;const s=document.createElement('style');s.id='v25CircleStyle';s.textContent=`
.v25MatchHead{display:grid;grid-template-columns:minmax(0,1fr) 78px minmax(0,1fr);gap:10px;align-items:stretch;margin-bottom:12px}.v25FighterCard{padding:11px;border-radius:18px;background:linear-gradient(145deg,rgba(74,104,255,.13),rgba(255,255,255,.035));border:1px solid rgba(115,146,255,.2);min-width:0}.v25FighterCard.guest{background:linear-gradient(145deg,rgba(255,88,158,.13),rgba(255,201,88,.035));border-color:rgba(255,117,176,.2)}.v25TopLine{display:flex;justify-content:space-between;gap:7px;align-items:center}.v25TopLine>b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:.84rem}.v25TopLine strong{font-size:1.55rem;line-height:1}.v25Pips{display:flex;gap:4px;margin:7px 0 1px}.v25FighterCard.guest .v25Pips{justify-content:flex-end}.v25Pips i{display:block;width:18px;height:5px;border-radius:99px;background:rgba(255,255,255,.12)}.v25Pips i.won{background:#fff;box-shadow:0 0 9px rgba(255,255,255,.45)}.v25FighterCard .v23Bar{height:18px;margin:7px 0 5px}.v25FighterCard.host .v23Bar i{background:linear-gradient(90deg,#3157ff,#8aa0ff)}.v25FighterCard.guest .v23Bar i{margin-left:auto;background:linear-gradient(90deg,#ffca58,#ff5d9e)}.v25Hp{font-size:.7rem;color:var(--muted);display:flex;gap:5px;flex-wrap:wrap}.v25FighterCard.guest .v25Hp{justify-content:flex-end}.v25Hp b{color:var(--text);font-size:.82rem}.v25Center{text-align:center;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:2px}.v25Center span{font-size:.68rem;color:var(--muted)}.v25Center>b{font-size:1.35rem}.v25Center small{font-size:.62rem;color:var(--muted)}.v25ArenaWrap{position:relative;border-radius:22px;overflow:hidden;box-shadow:0 16px 45px rgba(0,0,0,.28),0 0 0 1px rgba(255,255,255,.06)}.v25Arena{border-radius:22px!important}.v25Overlay{position:absolute;inset:0;display:flex;opacity:0;pointer-events:none;align-items:center;justify-content:center;flex-direction:column;text-align:center;background:radial-gradient(circle,rgba(24,10,32,.25),rgba(7,5,12,.72));transition:opacity .18s}.v25Overlay.show{opacity:1}.v25Overlay b{font-size:1.35rem;text-shadow:0 3px 20px #000}.v25Overlay span{margin-top:6px;color:#e5dbe9;font-size:.82rem}.v25Overlay.final b{font-size:1.65rem}.v25Legend{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding:9px 1px 3px}.v25Legend::-webkit-scrollbar{display:none}.v25Legend span{white-space:nowrap;padding:6px 8px;border-radius:999px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.07);font-size:.68rem}.v23Auto{margin-top:7px}@media(max-width:520px){.v25MatchHead{grid-template-columns:minmax(0,1fr) 52px minmax(0,1fr);gap:6px}.v25FighterCard{padding:8px}.v25TopLine>b{font-size:.7rem}.v25TopLine strong{font-size:1.3rem}.v25Center>b{font-size:1rem}.v25Center small{display:none}.v25FighterCard .v23Bar{height:15px}.v25Hp{font-size:.6rem}.v25Pips i{width:14px}}
`;document.head.appendChild(s)})();
