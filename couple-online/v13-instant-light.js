// v13: stronger local prediction for action games + more light games

// ---------- Low-latency air hockey ----------
let V13_AIR_LAST=0,V13_AIR_HIT_AT=0,V13_AIR_LOCAL_VX=0,V13_AIR_LOCAL_VY=0,V13_AIR_LOCAL_HOLD=0;
function v13AirHit(p,d){
  const dx=p.x-d.x,dy=p.y-d.y,dist=Math.hypot(dx,dy),min=43;
  if(!(dist>0&&dist<min))return false;
  const nx=dx/dist,ny=dy/dist,speed=Math.max(270,Math.hypot(V13_AIR_LOCAL_VX,V13_AIR_LOCAL_VY)||300);
  p.x=d.x+nx*min;p.y=d.y+ny*min;V13_AIR_LOCAL_VX=nx*speed;V13_AIR_LOCAL_VY=ny*speed;return true;
}
v10StartAirSmooth=function(){
  cancelAnimationFrame(V10_AIR_RAF);if(role!=='guest'||state.type!=='air')return;
  V13_AIR_LAST=performance.now();
  const loop=now=>{
    if(role!=='guest'||state.type!=='air')return;
    const dt=Math.min(.033,(now-V13_AIR_LAST)/1000||.016);V13_AIR_LAST=now;
    if(V10_AIR_TARGET){
      if(!V10_AIR_DISPLAY){V10_AIR_DISPLAY=v10CloneAir(V10_AIR_TARGET);V13_AIR_LOCAL_VX=Number(V10_AIR_TARGET.p.vx)||0;V13_AIR_LOCAL_VY=Number(V10_AIR_TARGET.p.vy)||0}
      const d=V10_AIR_DISPLAY,q=V10_AIR_TARGET;
      d.h.x=v10Lerp(d.h.x,q.h.x,.42);d.h.y=v10Lerp(d.h.y,q.h.y,.42);
      d.g.x=v10Lerp(d.g.x,q.g.x,.018);d.g.y=v10Lerp(d.g.y,q.g.y,.018);
      if(now>V13_AIR_LOCAL_HOLD){V13_AIR_LOCAL_VX=v10Lerp(V13_AIR_LOCAL_VX,Number(q.p.vx)||0,.12);V13_AIR_LOCAL_VY=v10Lerp(V13_AIR_LOCAL_VY,Number(q.p.vy)||0,.12)}
      d.p.x+=V13_AIR_LOCAL_VX*dt;d.p.y+=V13_AIR_LOCAL_VY*dt;
      if(d.p.x<15){d.p.x=15;V13_AIR_LOCAL_VX=Math.abs(V13_AIR_LOCAL_VX)}else if(d.p.x>705){d.p.x=705;V13_AIR_LOCAL_VX=-Math.abs(V13_AIR_LOCAL_VX)}
      const goal=d.p.x>270&&d.p.x<450;
      if(d.p.y<15&&!goal){d.p.y=15;V13_AIR_LOCAL_VY=Math.abs(V13_AIR_LOCAL_VY)}else if(d.p.y>465&&!goal){d.p.y=465;V13_AIR_LOCAL_VY=-Math.abs(V13_AIR_LOCAL_VY)}
      v13AirHit(d.p,d.h);
      const guestHit=v13AirHit(d.p,d.g);
      if(guestHit&&now-V13_AIR_HIT_AT>90){V13_AIR_HIT_AT=now;V13_AIR_LOCAL_HOLD=now+180;direct({t:'airGuestHit',p:{x:d.p.x,y:d.p.y,vx:V13_AIR_LOCAL_VX,vy:V13_AIR_LOCAL_VY},g:{x:d.g.x,y:d.g.y},ts:Date.now()})}
      const age=Math.min(.12,(now-V12_AIR_RECV)/1000),tx=q.p.x+(Number(q.p.vx)||0)*age,ty=q.p.y+(Number(q.p.vy)||0)*age,err=Math.hypot(d.p.x-tx,d.p.y-ty);
      const k=err>150?.34:err>70?.16:.055;d.p.x=v10Lerp(d.p.x,tx,k);d.p.y=v10Lerp(d.p.y,ty,k);
      d.sh=q.sh;d.sg=q.sg;d.over=q.over;drawAirSnapshot(d)
    }
    V10_AIR_RAF=requestAnimationFrame(loop)
  };
  V10_AIR_RAF=requestAnimationFrame(loop)
};

// ---------- Low-latency boxing ----------
let V13_BOX_SEND=0;
const V13_OLD_BOX_PRESS=boxPress;
boxPress=function(a){
  if(role==='guest'&&state.type==='boxing'&&box?.g)direct({t:'boxPose',x:box.g.x,dir:boxMyDir,ts:Date.now()});
  V13_OLD_BOX_PRESS(a)
};
v10StartBoxSmooth=function(t=performance.now()){
  cancelAnimationFrame(V10_BOX_RAF);if(role!=='guest'||state.type!=='boxing')return;V10_BOX_LAST=t;
  const loop=now=>{
    if(role!=='guest'||state.type!=='boxing')return;let dt=Math.min(.035,(now-V10_BOX_LAST)/1000||.016);V10_BOX_LAST=now;
    if(V10_BOX_TARGET){
      if(!V10_BOX_DISPLAY)V10_BOX_DISPLAY=v10CloneBox(V10_BOX_TARGET);let d=V10_BOX_DISPLAY,q=V10_BOX_TARGET;
      if(boxMyDir)d.g.x=Math.max(380,Math.min(660,d.g.x+boxMyDir*185*dt));
      d.h.x=v10Lerp(d.h.x,q.h.x,.4);d.g.x=v10Lerp(d.g.x,q.g.x,.045);
      d.h.hp=v10Lerp(Number(d.h.hp)||0,Number(q.h.hp)||0,.5);d.g.hp=v10Lerp(Number(d.g.hp)||0,Number(q.g.hp)||0,.5);
      for(const k of ['attack','attackT','block']){d.h[k]=q.h[k];if(!d.g.attackT||d.g.attackT<.05)d.g[k]=q.g[k]}
      if(d.g.attackT>0)d.g.attackT=Math.max(0,d.g.attackT-dt);d.winner=q.winner;box=d;drawBox();
      if(now-V13_BOX_SEND>45){V13_BOX_SEND=now;direct({t:'boxPose',x:d.g.x,dir:boxMyDir,ts:Date.now()})}
    }
    V10_BOX_RAF=requestAnimationFrame(loop)
  };V10_BOX_RAF=requestAnimationFrame(loop)
};

// ---------- Smoother remote maze motion ----------
mazeLoop=function(t=performance.now()){
  if(state.type!=='maze'||state.winner)return;let dt=Math.min(.035,(t-mazeLast)/1000||.016);mazeLast=t;
  if(V10_MAZE_TARGET&&mazeOther){
    const vx=Number(V10_MAZE_TARGET.vx)||0,vy=Number(V10_MAZE_TARGET.vy)||0;mazeOther.x+=vx*dt;mazeOther.y+=vy*dt;
    const age=Math.min(.14,(performance.now()-V12_MAZE_RECV)/1000),tx=V10_MAZE_TARGET.x+vx*age,ty=V10_MAZE_TARGET.y+vy*age;
    if(mazeCan(tx,ty)){mazeOther.x=v10Lerp(mazeOther.x,tx,.16);mazeOther.y=v10Lerp(mazeOther.y,ty,.16)}else{mazeOther.x=v10Lerp(mazeOther.x,V10_MAZE_TARGET.x,.32);mazeOther.y=v10Lerp(mazeOther.y,V10_MAZE_TARGET.y,.32)}
  }
  if(Date.now()>=(state.startAt||0)&&joy.active&&mazeMine){let speed=185,vx=joy.x*speed,vy=joy.y*speed,nx=mazeMine.x+vx*dt,ny=mazeMine.y+vy*dt;if(mazeCan(nx,mazeMine.y))mazeMine.x=nx;else vx=0;if(mazeCan(mazeMine.x,ny))mazeMine.y=ny;else vy=0;if(t-mazeSend>38){direct({t:'mazePos',x:mazeMine.x,y:mazeMine.y,vx,vy});mazeSend=t}if(Math.hypot(mazeMine.x-V10_MAZE_GOAL.x,mazeMine.y-V10_MAZE_GOAL.y)<27)dispatch('maze_win')}
  drawMaze();mazeFrame=requestAnimationFrame(mazeLoop)
};

// ---------- Realtime reconciliation messages ----------
const V13_PREV_HANDLE=handleMessage;
handleMessage=function(m){
  if(m&&m.t==='airGuestHit'&&role==='host'&&air&&state.type==='air'){
    const p=m.p||{},g=m.g||{},px=Number(p.x),py=Number(p.y),vx=Number(p.vx),vy=Number(p.vy),gx=Number(g.x),gy=Number(g.y);
    if([px,py,vx,vy,gx,gy].every(Number.isFinite)&&gy>=20&&gy<=240){
      const dist=Math.hypot(air.puck.x-gx,air.puck.y-gy);if(dist<165){air.guest.x=Math.max(30,Math.min(690,gx));air.guest.y=Math.max(30,Math.min(220,gy));air.puck.x=v10Lerp(air.puck.x,Math.max(15,Math.min(705,px)),.7);air.puck.y=v10Lerp(air.puck.y,Math.max(15,Math.min(465,py)),.7);const sp=Math.min(520,Math.max(220,Math.hypot(vx,vy)||280)),n=Math.hypot(vx,vy)||1;air.puck.vx=vx/n*sp;air.puck.vy=vy/n*sp}
    }
    return
  }
  if(m&&m.t==='boxPose'&&role==='host'&&box&&state.type==='boxing'){
    const x=Number(m.x),dir=Number(m.dir);if(Number.isFinite(x))box.g.x=v10Lerp(box.g.x,Math.max(380,Math.min(660,x)),.72);if(Number.isFinite(dir))boxGuestDir=Math.max(-1,Math.min(1,dir));return
  }
  V13_PREV_HANDLE(m)
};

// ---------- Light games ----------
const V13_GAMES=[
 ['bomb','💣','Не нажми бомбу','По очереди открывайте клетки. Кто найдёт бомбу — проиграл.'],
 ['sticks','🪵','21 палочка','Берите 1–3 палочки по очереди. Кто заберёт последнюю — победил.'],
 ['highlow','🃏','Больше или меньше','Угадайте, следующая карта будет больше или меньше текущей.'],
 ['luckbox','🎁','Коробки удачи','Открывайте подарки с тайными очками. У кого сумма выше — тот победил.'],
 ['coin','🪙','Орёл или решка','Пять быстрых раундов: выберите сторону монетки и набирайте очки.'],
 ['emojiquiz','😎','Угадай по эмодзи','Лёгкие загадки по эмодзи. Отвечаете оба и сравниваете результат.']
];
for(const g of V13_GAMES)if(!GAMES.some(x=>x[0]===g[0])){GAMES.push(g);TITLES[g[0]]=g[2]}
if(typeof CAT!=='undefined')for(const g of V13_GAMES)CAT[g[0]]='Лёгкие игры';
if(typeof V12_CATEGORY_ORDER!=='undefined'&&!V12_CATEGORY_ORDER.includes('Лёгкие игры')){const i=V12_CATEGORY_ORDER.indexOf('Игры словами');V12_CATEGORY_ORDER.splice(i<0?2:i,0,'Лёгкие игры')}
const V13_OLD_BADGE=v12Badge;v12Badge=function(id){if(V13_GAMES.some(g=>g[0]===id))return '⚡ лёгкая';return V13_OLD_BADGE(id)};

function v13Other(w){return w==='host'?'guest':'host'}
function v13Name(w){return w==='host'?hostName():guestName()}
function v13WinnerText(w){return w==='draw'?'Ничья 😄':v13Name(w)+' победил(а)!'}

function v13NewBomb(){return{screen:'game',type:'bomb',turn:Math.random()>.5?'host':'guest',bomb:Math.floor(Math.random()*16),opened:[],boom:null,winner:null}}
function v13BombPick(i,who){if(state.winner||who!==state.turn||!Number.isInteger(i)||i<0||i>15||state.opened.includes(i))return;if(i===state.bomb){state.boom=i;state.winner=v13Other(who)}else{state.opened.push(i);state.turn=v13Other(who)}sync();renderFromState()}
function renderV13Bomb(){let mine=state.turn===actor(),title=state.winner?v13WinnerText(state.winner):(mine?'Твой ход':'Ходит '+v13Name(state.turn));$('roundPill').textContent='16 клеток';$('bar').style.width=((state.opened.length+(state.boom!=null?1:0))/16*100)+'%';$('gameCard').innerHTML=`<div class="bigemoji">💣</div><div class="turnBanner">${esc(title)}</div><div class="v13Bomb">${Array.from({length:16},(_,i)=>{let open=state.opened.includes(i),boom=state.boom===i;return `<button ${state.winner||!mine||open||boom?'disabled':''} class="${open?'safe':''} ${boom?'boom':''}" onclick="dispatch('bomb_pick',${i})">${boom?'💥':open?'✨':'?'}</button>`}).join('')}</div><div class="muted">Бомба одна. Без таймеров и без зависимости от пинга.</div><div class="actions"><button class="btn" onclick="dispatch('game','bomb')">Новая партия</button></div>`}

function v13NewSticks(){return{screen:'game',type:'sticks',turn:Math.random()>.5?'host':'guest',left:21,winner:null}}
function v13Take(n,who){n=Math.round(Number(n));if(state.winner||who!==state.turn||n<1||n>3||n>state.left)return;state.left-=n;if(state.left===0)state.winner=who;else state.turn=v13Other(who);sync();renderFromState()}
function renderV13Sticks(){let mine=state.turn===actor(),title=state.winner?v13WinnerText(state.winner):(mine?'Твой ход':'Ходит '+v13Name(state.turn));$('roundPill').textContent=state.left+' осталось';$('bar').style.width=((21-state.left)/21*100)+'%';$('gameCard').innerHTML=`<div class="bigemoji">🪵</div><div class="turnBanner">${esc(title)}</div><div class="v13Sticks">${'│'.repeat(state.left)}</div><div class="question smallq">Осталось ${state.left}</div>${!state.winner&&mine?`<div class="actions"><button class="btn" onclick="dispatch('sticks_take',1)">Взять 1</button><button class="btn" onclick="dispatch('sticks_take',2)" ${state.left<2?'disabled':''}>Взять 2</button><button class="btn" onclick="dispatch('sticks_take',3)" ${state.left<3?'disabled':''}>Взять 3</button></div>`:''}<div class="actions"><button class="ghost" onclick="dispatch('game','sticks')">Заново</button></div>`}

function v13NewHighLow(){return{screen:'game',type:'highlow',turn:Math.random()>.5?'host':'guest',card:1+Math.floor(Math.random()*13),round:1,score:{host:0,guest:0},last:null,winner:null}}
function v13HighLowGuess(guess,who){if(state.winner||who!==state.turn||!['up','down'].includes(guess))return;let next=1+Math.floor(Math.random()*13),correct=next===state.card?'tie':(guess==='up'?next>state.card:next<state.card);if(correct===true)state.score[who]++;state.last={old:state.card,next,who,guess,correct};state.card=next;if(state.round>=10){state.winner=state.score.host===state.score.guest?'draw':state.score.host>state.score.guest?'host':'guest'}else{state.round++;state.turn=v13Other(who)}sync();renderFromState()}
function renderV13HighLow(){let mine=state.turn===actor(),title=state.winner?v13WinnerText(state.winner):(mine?'Твоя попытка':'Ходит '+v13Name(state.turn));let last=state.last?`<div class="muted">Было ${state.last.old}, выпало ${state.last.next} · ${state.last.correct==='tie'?'одинаково':state.last.correct?'угадано':'не угадано'}</div>`:'';$('roundPill').textContent=`${Math.min(state.round,10)}/10`;$('bar').style.width=(Math.min(state.round,10)/10*100)+'%';$('gameCard').innerHTML=`<div class="turnBanner">${esc(title)}</div><div class="v13Card">${state.card}</div>${last}<div class="v12Score"><b>${state.score.host}</b><span>${esc(hostName())} · ${esc(guestName())}</span><b>${state.score.guest}</b></div>${!state.winner&&mine?`<div class="actions"><button class="btn" onclick="dispatch('hl_guess','down')">⬇ Меньше</button><button class="btn" onclick="dispatch('hl_guess','up')">⬆ Больше</button></div>`:''}<div class="actions"><button class="ghost" onclick="dispatch('game','highlow')">Новая партия</button></div>`}

function v13Shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function v13NewLuck(){return{screen:'game',type:'luckbox',turn:Math.random()>.5?'host':'guest',values:v13Shuffle([5,4,3,2,1,0,-1,-2]),picked:Array(8).fill(null),score:{host:0,guest:0},winner:null}}
function v13LuckPick(i,who){if(state.winner||who!==state.turn||!Number.isInteger(i)||i<0||i>7||state.picked[i])return;state.picked[i]=who;state.score[who]+=state.values[i];if(state.picked.every(Boolean))state.winner=state.score.host===state.score.guest?'draw':state.score.host>state.score.guest?'host':'guest';else state.turn=v13Other(who);sync();renderFromState()}
function renderV13Luck(){let mine=state.turn===actor(),title=state.winner?v13WinnerText(state.winner):(mine?'Выбирай коробку':'Выбирает '+v13Name(state.turn));$('roundPill').textContent='8 коробок';$('bar').style.width=(state.picked.filter(Boolean).length/8*100)+'%';$('gameCard').innerHTML=`<div class="turnBanner">${esc(title)}</div><div class="v12Score"><b>${state.score.host}</b><span>очки</span><b>${state.score.guest}</b></div><div class="v13Boxes">${state.values.map((v,i)=>`<button ${state.winner||!mine||state.picked[i]?'disabled':''} class="${state.picked[i]||''}" onclick="dispatch('luck_pick',${i})">${state.picked[i]?(v>0?'+':'')+v:'🎁'}</button>`).join('')}</div><div class="muted">В коробках от −2 до +5 очков.</div><div class="actions"><button class="btn" onclick="dispatch('game','luckbox')">Новая партия</button></div>`}

function v13NewCoin(){return{screen:'game',type:'coin',round:1,choices:{host:null,guest:null},result:null,score:{host:0,guest:0},winner:null}}
function v13CoinChoose(v,who){if(state.winner||state.result||state.choices[who]||!['h','t'].includes(v))return;state.choices[who]=v;if(state.choices.host&&state.choices.guest){state.result=Math.random()>.5?'h':'t';if(state.choices.host===state.result)state.score.host++;if(state.choices.guest===state.result)state.score.guest++}sync();renderFromState()}
function v13CoinNext(){if(!state.result||state.winner)return;if(state.round>=5){state.winner=state.score.host===state.score.guest?'draw':state.score.host>state.score.guest?'host':'guest'}else{state.round++;state.choices={host:null,guest:null};state.result=null}sync();renderFromState()}
function renderV13Coin(){let mine=state.choices[actor()],both=!!state.result;$('roundPill').textContent=`${state.round}/5`;$('bar').style.width=(state.round/5*100)+'%';let title=state.winner?v13WinnerText(state.winner):both?(state.result==='h'?'Орёл!':'Решка!'):'Выберите сторону';$('gameCard').innerHTML=`<div class="bigemoji">${both?(state.result==='h'?'🦅':'🪙'):'🪙'}</div><div class="question">${esc(title)}</div><div class="v12Score"><b>${state.score.host}</b><span>${esc(hostName())} · ${esc(guestName())}</span><b>${state.score.guest}</b></div>${!both&&!state.winner&&!mine?`<div class="actions"><button class="btn" onclick="dispatch('coin_choose','h')">🦅 Орёл</button><button class="btn" onclick="dispatch('coin_choose','t')">🪙 Решка</button></div>`:!both&&!state.winner?`<div class="turnBanner">✓ Выбрано. Ждём партнёра…</div>`:''}${both&&!state.winner?`<div class="v13Choices"><span>${esc(hostName())}: ${state.choices.host==='h'?'Орёл':'Решка'}</span><span>${esc(guestName())}: ${state.choices.guest==='h'?'Орёл':'Решка'}</span></div><div class="actions"><button class="btn" onclick="dispatch('coin_next')">${state.round>=5?'Итог':'Следующий раунд'}</button></div>`:''}<div class="actions"><button class="ghost" onclick="dispatch('game','coin')">Заново</button></div>`}

const V13_EMOJI=[
 ['🐱👢',['Кот в сапогах','Три поросёнка','Красная Шапочка'],0],['🦁👑',['Король Лев','Маугли','Тарзан'],0],['🧊👸',['Холодное сердце','Русалочка','Золушка'],0],['🚢🧊',['Титаник','Пираты','Моана'],0],['🐼🥋',['Кунг-фу Панда','Шрек','Мадагаскар'],0],['👻🚫',['Охотники за привидениями','Каспер','Монстры'],0],['🕷️🧑',['Человек-паук','Бэтмен','Супермен'],0],['🐀👨‍🍳',['Рататуй','Лука','Тачки'],0],['👠🎃',['Золушка','Белоснежка','Мулан'],0],['🤖❤️',['ВАЛЛ·И','Трансформеры','Терминатор'],0],['🐟🔎',['В поисках Немо','Русалочка','Аквамен'],0],['🏠🎈',['Вверх','Душа','Энканто'],0]
];
function v13NewEmoji(){return{screen:'game',type:'emojiquiz',order:v13Shuffle(Array.from({length:V13_EMOJI.length},(_,i)=>i)).slice(0,8),idx:0,answers:{host:null,guest:null},score:{host:0,guest:0},winner:null}}
function v13EmojiAnswer(v,who){if(state.winner||state.answers[who]!=null)return;v=Number(v);if(!Number.isInteger(v)||v<0||v>2)return;state.answers[who]=v;if(state.answers.host!=null&&state.answers.guest!=null){let q=V13_EMOJI[state.order[state.idx]];if(state.answers.host===q[2])state.score.host++;if(state.answers.guest===q[2])state.score.guest++}sync();renderFromState()}
function v13EmojiNext(){if(state.answers.host==null||state.answers.guest==null)return;if(state.idx>=state.order.length-1){state.winner=state.score.host===state.score.guest?'draw':state.score.host>state.score.guest?'host':'guest'}else{state.idx++;state.answers={host:null,guest:null}}sync();renderFromState()}
function renderV13Emoji(){let q=V13_EMOJI[state.order[state.idx]],both=state.answers.host!=null&&state.answers.guest!=null,mine=state.answers[actor()];$('roundPill').textContent=`${state.idx+1}/${state.order.length}`;$('bar').style.width=((state.idx+1)/state.order.length*100)+'%';let title=state.winner?v13WinnerText(state.winner):'Что за фильм/мультфильм?';$('gameCard').innerHTML=`<div class="question">${esc(title)}</div><div class="v13Emoji">${q[0]}</div><div class="v12Score"><b>${state.score.host}</b><span>очки</span><b>${state.score.guest}</b></div>${!state.winner&&!both&&mine==null?`<div class="options three">${q[1].map((x,i)=>`<button onclick="dispatch('emoji_answer',${i})">${esc(x)}</button>`).join('')}</div>`:!state.winner&&!both?`<div class="turnBanner">✓ Ответ принят. Ждём партнёра…</div>`:''}${both&&!state.winner?`<div class="result mini">Ответ: ${esc(q[1][q[2]])}</div><div class="v13Choices"><span>${esc(hostName())}: ${esc(q[1][state.answers.host])}</span><span>${esc(guestName())}: ${esc(q[1][state.answers.guest])}</span></div><div class="actions"><button class="btn" onclick="dispatch('emoji_next')">${state.idx===state.order.length-1?'Итог':'Следующая'}</button></div>`:''}<div class="actions"><button class="ghost" onclick="dispatch('game','emojiquiz')">Заново</button></div>`}

const V13_PREV_APPLY=applyAction,V13_PREV_RENDER=renderGame,V13_PREV_BACK=backMenu;
applyAction=function(a,v,who){
  if(a==='game'&&v==='bomb'){state=v13NewBomb();sync();renderFromState();return}
  if(a==='game'&&v==='sticks'){state=v13NewSticks();sync();renderFromState();return}
  if(a==='game'&&v==='highlow'){state=v13NewHighLow();sync();renderFromState();return}
  if(a==='game'&&v==='luckbox'){state=v13NewLuck();sync();renderFromState();return}
  if(a==='game'&&v==='coin'){state=v13NewCoin();sync();renderFromState();return}
  if(a==='game'&&v==='emojiquiz'){state=v13NewEmoji();sync();renderFromState();return}
  if(state.type==='bomb'&&a==='bomb_pick'){v13BombPick(Number(v),who);return}
  if(state.type==='sticks'&&a==='sticks_take'){v13Take(v,who);return}
  if(state.type==='highlow'&&a==='hl_guess'){v13HighLowGuess(String(v),who);return}
  if(state.type==='luckbox'&&a==='luck_pick'){v13LuckPick(Number(v),who);return}
  if(state.type==='coin'&&a==='coin_choose'){v13CoinChoose(String(v),who);return}
  if(state.type==='coin'&&a==='coin_next'){v13CoinNext();return}
  if(state.type==='emojiquiz'&&a==='emoji_answer'){v13EmojiAnswer(v,who);return}
  if(state.type==='emojiquiz'&&a==='emoji_next'){v13EmojiNext();return}
  V13_PREV_APPLY(a,v,who)
};
renderGame=function(){if(state.type==='bomb')return renderV13Bomb();if(state.type==='sticks')return renderV13Sticks();if(state.type==='highlow')return renderV13HighLow();if(state.type==='luckbox')return renderV13Luck();if(state.type==='coin')return renderV13Coin();if(state.type==='emojiquiz')return renderV13Emoji();return V13_PREV_RENDER()};
backMenu=function(){cancelAnimationFrame(V10_AIR_RAF);cancelAnimationFrame(V10_BOX_RAF);V13_PREV_BACK()};

(function v13Style(){if(document.getElementById('v13Style'))return;let s=document.createElement('style');s.id='v13Style';s.textContent=`
.v13Bomb{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;max-width:420px;margin:16px auto}.v13Bomb button{aspect-ratio:1;border-radius:16px;border:1px solid #ffffff20;background:#ffffff0b;color:#fff;font-size:1.6rem;font-weight:900}.v13Bomb .safe{background:#54dc9320}.v13Bomb .boom{background:#ff596d35}.v13Sticks{max-width:560px;margin:20px auto;font-size:2rem;line-height:1.45;letter-spacing:5px;word-break:break-all;color:#ffd35a}.v13Card{width:118px;height:154px;margin:14px auto;display:grid;place-items:center;border-radius:20px;background:linear-gradient(145deg,#fff,#e9e7f1);color:#21172a;font-size:3.4rem;font-weight:950;box-shadow:0 14px 30px #0005}.v13Boxes{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:520px;margin:16px auto}.v13Boxes button{min-height:78px;border-radius:18px;border:1px solid #ffffff1c;background:#ffffff0c;color:#fff;font-size:1.55rem;font-weight:900}.v13Boxes .host{background:#ff6fae25}.v13Boxes .guest{background:#9879ff25}.v13Choices{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}.v13Choices span{padding:12px;border-radius:14px;background:#ffffff0b}.v13Emoji{font-size:4.2rem;letter-spacing:.12em;margin:18px 0}.options.three{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.options.three button{padding:14px 10px;border-radius:14px;border:1px solid #ffffff1c;background:#ffffff0c;color:#fff;font-weight:800}.v12Score{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;max-width:520px;margin:12px auto}.v12Score b{font-size:1.55rem}.v12Score span{text-align:center;color:var(--muted)}@media(max-width:520px){.v13Boxes{grid-template-columns:repeat(2,1fr)}.options.three{grid-template-columns:1fr}.v13Choices{grid-template-columns:1fr}}
`;document.head.appendChild(s)})();
