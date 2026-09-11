// v12: force all games visible + latency-friendly games + stronger prediction

// ---------- Always show every category/game ----------
const V12_CATEGORY_ORDER=['Аркада','Настолки','Игры словами','Тесты для пары','😂 Смешное','Поговорить и посмеяться','Флирт','🌶️ Пошлое 18+'];
function v12Badge(id){
  if(id==='air'||id==='boxing'||id==='maze')return '⚡ сглаживание';
  if(id==='taprush')return 'без задержки счёта';
  if(id==='crocodile')return 'рисование';
  if(id==='flirt'||id==='spicy')return '18+ по согласию';
  if(['fleet','bulls','memory','dots','dice','near100','reversi'].includes(id))return 'настольная';
  if(['couplevibe','homechaos','datestyle','futuremini','humorcompat','compat','values','distance'].includes(id))return 'тест для двоих';
  return 'для двоих';
}
renderMenu=function(){
  $('menuPlayers').textContent=hostName()+' + '+guestName();$('menuCode').textContent=roomCode;
  const cats=[...V12_CATEGORY_ORDER];
  for(const g of GAMES){const c=(typeof CAT!=='undefined'&&CAT[g[0]])||'Поговорить и посмеяться';if(!cats.includes(c))cats.push(c)}
  let html='';
  for(const c of cats){const gs=GAMES.filter(g=>(((typeof CAT!=='undefined'&&CAT[g[0]])||'Поговорить и посмеяться')===c));if(!gs.length)continue;
    html+=`<div class="sectionTitle">${esc(c)} <small class="v12Count">${gs.length}</small></div>`;
    html+=gs.map(g=>`<button class="tile" onclick="chooseGame('${g[0]}')"><div class="ico">${g[1]}</div><b>${esc(g[2])}</b><span>${esc(g[3])}</span><em class="badge">${v12Badge(g[0])}</em></button>`).join('');
  }
  $('gamesGrid').innerHTML=html;if(typeof updateChatVisibility==='function')updateChatVisibility();
};

// ---------- Register more latency-friendly games ----------
const V12_GAMES=[
 ['memory','🧠','Пары · Memory','Открывайте карточки по очереди и собирайте больше совпавших пар.'],
 ['dots','🔲','Точки и квадраты','Проводите линии и закрывайте квадраты. За квадрат получаете ещё ход.'],
 ['dice','🎲','Кости · 5 раундов','Оба бросают кубик. Побеждает тот, кто возьмёт больше раундов.'],
 ['near100','🎯','Кто ближе?','Оба тайно выбирают число от 1 до 100 и стараются попасть ближе к цели.'],
 ['wordchain','🔤','Цепочка слов','Слова по очереди: новое должно начинаться на последнюю букву предыдущего.'],
 ['reversi','⚫','Реверси mini','Классическая дуэль на поле 6×6: окружайте фишки партнёра.']
];
for(const g of V12_GAMES)if(!GAMES.some(x=>x[0]===g[0])){GAMES.push(g);TITLES[g[0]]=g[2]}
if(typeof CAT!=='undefined')Object.assign(CAT,{memory:'Настолки',dots:'Настолки',dice:'Настолки',near100:'Настолки',wordchain:'Игры словами',reversi:'Настолки',fleet:'Настолки',bulls:'Настолки',taprush:'Аркада'});

function v12Other(w){return w==='host'?'guest':'host'}
function v12Name(w){return w==='host'?hostName():guestName()}

// ---------- Memory ----------
const V12_MEM_EMOJI=['🍓','🌙','🐸','🚀','🎸','🍕','🦊','💎'];
function v12Shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function v12NewMemory(){return{screen:'game',type:'memory',deck:v12Shuffle([...V12_MEM_EMOJI,...V12_MEM_EMOJI]),matched:Array(16).fill(null),open:[],pending:false,turn:'host',score:{host:0,guest:0},winner:null}}
function v12MemoryPick(i,who){
 if(state.winner||who!==state.turn||!Number.isInteger(i)||i<0||i>=16||state.matched[i])return;
 if(state.pending){state.open=[];state.pending=false}
 if(state.open.includes(i))return;
 if(state.open.length===0){state.open=[i];sync();renderFromState();return}
 const a=state.open[0];state.open=[a,i];
 if(state.deck[a]===state.deck[i]){state.matched[a]=who;state.matched[i]=who;state.score[who]++;state.open=[];if(state.matched.every(Boolean)){state.winner=state.score.host===state.score.guest?'draw':state.score.host>state.score.guest?'host':'guest'}}
 else{state.pending=true;state.turn=v12Other(who)}
 sync();renderFromState();
}
function renderV12Memory(){
 $('roundPill').textContent='8 пар';$('bar').style.width=((state.matched.filter(Boolean).length/16)*100)+'%';let mine=state.turn===actor();
 let title=state.winner?(state.winner==='draw'?'Ничья 😄':v12Name(state.winner)+' победил(а)!'):(mine?'Твой ход':'Ходит '+v12Name(state.turn));
 $('gameCard').innerHTML=`<div class="turnBanner">${esc(title)}</div><div class="v12Score"><b>${state.score.host}</b><span>${esc(hostName())} · ${esc(guestName())}</span><b>${state.score.guest}</b></div><div class="v12Memory">${state.deck.map((x,i)=>{let show=state.matched[i]||state.open.includes(i);return `<button ${state.winner||!mine||state.matched[i]?'disabled':''} class="${state.matched[i]?'got '+state.matched[i]:''}" onclick="dispatch('mem',${i})">${show?x:'?'}</button>`}).join('')}</div><div class="actions"><button class="ghost" onclick="openChat()">💬 Чат</button><button class="btn" onclick="dispatch('game','memory')">Новая партия</button></div>`;
}

// ---------- Dots & boxes 3x3 ----------
function v12NewDots(){return{screen:'game',type:'dots',turn:'host',edges:{},boxes:{},score:{host:0,guest:0},winner:null}}
function v12BoxClosed(r,c,e){return e[`h-${r}-${c}`]&&e[`h-${r+1}-${c}`]&&e[`v-${r}-${c}`]&&e[`v-${r}-${c+1}`]}
function v12DotsMove(id,who){
 if(state.winner||who!==state.turn||typeof id!=='string'||state.edges[id])return;let m=id.match(/^([hv])-(\d)-(\d)$/);if(!m)return;
 state.edges[id]=who;let gained=0;
 for(let r=0;r<3;r++)for(let c=0;c<3;c++){let k=`${r}-${c}`;if(!state.boxes[k]&&v12BoxClosed(r,c,state.edges)){state.boxes[k]=who;state.score[who]++;gained++}}
 if(Object.keys(state.boxes).length===9)state.winner=state.score.host===state.score.guest?'draw':state.score.host>state.score.guest?'host':'guest';else if(!gained)state.turn=v12Other(who);
 sync();renderFromState();
}
function renderV12Dots(){
 $('roundPill').textContent='9 квадратов';$('bar').style.width=(Object.keys(state.boxes).length/9*100)+'%';let mine=state.turn===actor();let cells='';
 for(let rr=0;rr<7;rr++)for(let cc=0;cc<7;cc++){
   if(rr%2===0&&cc%2===0)cells+='<i class="v12Dot"></i>';
   else if(rr%2===0&&cc%2===1){let id=`h-${rr/2}-${(cc-1)/2}`,o=state.edges[id]||'';cells+=`<button class="v12Edge h ${o}" ${!mine||o||state.winner?'disabled':''} onclick="dispatch('dot','${id}')"></button>`}
   else if(rr%2===1&&cc%2===0){let id=`v-${(rr-1)/2}-${cc/2}`,o=state.edges[id]||'';cells+=`<button class="v12Edge v ${o}" ${!mine||o||state.winner?'disabled':''} onclick="dispatch('dot','${id}')"></button>`}
   else{let k=`${(rr-1)/2}-${(cc-1)/2}`,o=state.boxes[k]||'';cells+=`<div class="v12Box ${o}">${o==='host'?'♥':o==='guest'?'★':''}</div>`}
 }
 let title=state.winner?(state.winner==='draw'?'Ничья':v12Name(state.winner)+' победил(а)!'):(mine?'Твой ход':'Ходит '+v12Name(state.turn));
 $('gameCard').innerHTML=`<div class="turnBanner">${esc(title)}</div><div class="v12Score"><b>${state.score.host}</b><span>${esc(hostName())} · ${esc(guestName())}</span><b>${state.score.guest}</b></div><div class="v12Dots">${cells}</div><div class="muted">Закрыл(а) квадрат — получаешь ещё один ход.</div><div class="actions"><button class="btn" onclick="dispatch('game','dots')">Новая партия</button></div>`;
}

// ---------- Dice ----------
function v12NewDice(){return{screen:'game',type:'dice',round:1,rolls:{host:null,guest:null},score:{host:0,guest:0},winner:null}}
function v12DiceRoll(who){if(state.winner||state.rolls[who]!=null)return;state.rolls[who]=1+Math.floor(Math.random()*6);if(state.rolls.host!=null&&state.rolls.guest!=null){if(state.rolls.host>state.rolls.guest)state.score.host++;else if(state.rolls.guest>state.rolls.host)state.score.guest++}sync();renderFromState()}
function v12DiceNext(){if(state.rolls.host==null||state.rolls.guest==null||state.winner)return;if(state.round>=5){state.winner=state.score.host===state.score.guest?'draw':state.score.host>state.score.guest?'host':'guest'}else{state.round++;state.rolls={host:null,guest:null}}sync();renderFromState()}
function renderV12Dice(){let both=state.rolls.host!=null&&state.rolls.guest!=null,mine=state.rolls[actor()];$('roundPill').textContent=`Раунд ${state.round}/5`;$('bar').style.width=(state.round/5*100)+'%';let face=n=>n==null?'❔':['','⚀','⚁','⚂','⚃','⚄','⚅'][n];let result=state.winner?(state.winner==='draw'?'Ничья!':v12Name(state.winner)+' победил(а)!'):both?(state.rolls.host===state.rolls.guest?'Одинаково!':(state.rolls.host>state.rolls.guest?hostName():guestName())+' берёт раунд'):'Бросайте кубики';$('gameCard').innerHTML=`<div class="question smallq">${esc(result)}</div><div class="v12Dice"><div><small>${esc(hostName())}</small><b>${face(state.rolls.host)}</b></div><div><small>${esc(guestName())}</small><b>${face(state.rolls.guest)}</b></div></div><div class="v12Score"><b>${state.score.host}</b><span>победы</span><b>${state.score.guest}</b></div><div class="actions">${!state.winner&&mine==null?`<button class="btn" onclick="dispatch('dice_roll')">🎲 Бросить</button>`:''}${both&&!state.winner?`<button class="ghost" onclick="dispatch('dice_next')">${state.round>=5?'Итог':'Следующий раунд'}</button>`:''}<button class="ghost" onclick="dispatch('game','dice')">Заново</button></div>`}

// ---------- Closest to target ----------
function v12NewNear(){return{screen:'game',type:'near100',round:1,target:1+Math.floor(Math.random()*100),answers:{host:null,guest:null},score:{host:0,guest:0},winner:null}}
function v12NearAnswer(v,who){if(state.winner||state.answers[who]!=null)return;v=Math.max(1,Math.min(100,Math.round(Number(v)||0)));if(!v)return;state.answers[who]=v;if(state.answers.host!=null&&state.answers.guest!=null){let dh=Math.abs(state.answers.host-state.target),dg=Math.abs(state.answers.guest-state.target);if(dh<dg)state.score.host++;else if(dg<dh)state.score.guest++}sync();renderFromState()}
function v12NearNext(){if(state.answers.host==null||state.answers.guest==null)return;if(state.round>=5){state.winner=state.score.host===state.score.guest?'draw':state.score.host>state.score.guest?'host':'guest'}else{state.round++;state.target=1+Math.floor(Math.random()*100);state.answers={host:null,guest:null}}sync();renderFromState()}
function renderV12Near(){let both=state.answers.host!=null&&state.answers.guest!=null,mine=state.answers[actor()];$('roundPill').textContent=`Раунд ${state.round}/5`;$('bar').style.width=(state.round/5*100)+'%';let res=state.winner?(state.winner==='draw'?'Ничья!':v12Name(state.winner)+' победил(а)!'):both?`Цель была ${state.target}`:'Выберите число от 1 до 100';$('gameCard').innerHTML=`<div class="bigemoji">🎯</div><div class="question">${esc(res)}</div>${both?`<div class="v12Reveal"><div><small>${esc(hostName())}</small><b>${state.answers.host}</b></div><div><small>${esc(guestName())}</small><b>${state.answers.guest}</b></div></div><div class="v12Score"><b>${state.score.host}</b><span>очки</span><b>${state.score.guest}</b></div>`:mine!=null?`<div class="turnBanner">✓ Выбрано. Ждём партнёра…</div>`:`<div class="guessrow"><input id="nearInput" type="number" min="1" max="100" placeholder="1–100"><button class="btn" onclick="dispatch('near',Number($('nearInput').value))">Выбрать</button></div>`}<div class="actions">${both&&!state.winner?`<button class="btn" onclick="dispatch('near_next')">${state.round>=5?'Итог':'Следующая цель'}</button>`:''}<button class="ghost" onclick="dispatch('game','near100')">Заново</button></div>`}

// ---------- Word chain ----------
function v12LastLetter(w){let a=String(w||'').toLowerCase().replace(/[^а-яё]/g,'');while(a&&'ьъы'.includes(a.at(-1)))a=a.slice(0,-1);return a.at(-1)||''}
function v12WordMove(v,who){if(state.winner||who!==state.turn)return;let w=String(v||'').trim().toLowerCase().replace(/[^а-яё-]/g,'').slice(0,32);if(w.length<2){state.notice='Слишком короткое слово';sync();renderFromState();return}if(state.words.includes(w)){state.notice='Это слово уже было';sync();renderFromState();return}let need=state.words.length?v12LastLetter(state.words.at(-1)):'';if(need&&w[0]!==need){state.notice=`Нужно слово на «${need.toUpperCase()}»`;sync();renderFromState();return}state.words.push(w);state.notice='';state.turn=v12Other(who);sync();renderFromState()}
function renderV12Word(){let mine=state.turn===actor(),need=state.words.length?v12LastLetter(state.words.at(-1)):'';$('roundPill').textContent=`${state.words.length} слов`;$('bar').style.width=Math.min(100,state.words.length*4)+'%';$('gameCard').innerHTML=`<div class="bigemoji">🔤</div><div class="question">${state.words.length?`Следующее слово на «${esc(need.toUpperCase())}»`:'Начните цепочку с любого слова'}</div><div class="v12Words">${state.words.slice(-18).map(w=>`<span>${esc(w)}</span>`).join('')}</div>${state.notice?`<div class="status show bad">${esc(state.notice)}</div>`:''}<div class="turnBanner">${mine?'Твой ход':'Ходит '+esc(v12Name(state.turn))}</div>${mine?`<div class="guessrow"><input id="wordInput" maxlength="32" placeholder="Напиши слово"><button class="btn" onclick="dispatch('word_move',$('wordInput').value)">Отправить</button></div>`:''}<div class="actions"><button class="ghost" onclick="openChat()">💬 Чат</button><button class="btn" onclick="dispatch('game','wordchain')">Новая цепочка</button></div>`}

// ---------- Reversi 6x6 ----------
const V12_DIR=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
function v12RevNew(){let b=Array(36).fill(null);b[2*6+2]='host';b[3*6+3]='host';b[2*6+3]='guest';b[3*6+2]='guest';return{screen:'game',type:'reversi',board:b,turn:'host',winner:null}}
function v12RevFlips(b,i,who){if(b[i])return[];let r=Math.floor(i/6),c=i%6,out=[],opp=v12Other(who);for(const[dR,dC]of V12_DIR){let rr=r+dR,cc=c+dC,tmp=[];while(rr>=0&&rr<6&&cc>=0&&cc<6&&b[rr*6+cc]===opp){tmp.push(rr*6+cc);rr+=dR;cc+=dC}if(tmp.length&&rr>=0&&rr<6&&cc>=0&&cc<6&&b[rr*6+cc]===who)out.push(...tmp)}return out}
function v12RevMoves(b,who){let a=[];for(let i=0;i<36;i++)if(v12RevFlips(b,i,who).length)a.push(i);return a}
function v12RevMove(i,who){if(state.winner||who!==state.turn||!Number.isInteger(i))return;let f=v12RevFlips(state.board,i,who);if(!f.length)return;state.board[i]=who;for(const j of f)state.board[j]=who;let opp=v12Other(who),om=v12RevMoves(state.board,opp),wm=v12RevMoves(state.board,who);if(om.length)state.turn=opp;else if(wm.length)state.turn=who;else{let h=state.board.filter(x=>x==='host').length,g=state.board.filter(x=>x==='guest').length;state.winner=h===g?'draw':h>g?'host':'guest'}sync();renderFromState()}
function renderV12Reversi(){let mine=state.turn===actor(),moves=new Set(v12RevMoves(state.board,state.turn)),h=state.board.filter(x=>x==='host').length,g=state.board.filter(x=>x==='guest').length;$('roundPill').textContent='6×6';$('bar').style.width=((h+g)/36*100)+'%';let title=state.winner?(state.winner==='draw'?'Ничья':v12Name(state.winner)+' победил(а)!'):(mine?'Твой ход':'Ходит '+v12Name(state.turn));$('gameCard').innerHTML=`<div class="turnBanner">${esc(title)}</div><div class="v12Score"><b>${h}</b><span>${esc(hostName())} · ${esc(guestName())}</span><b>${g}</b></div><div class="v12Reversi">${state.board.map((x,i)=>`<button class="${x||''} ${moves.has(i)?'move':''}" ${!mine||state.winner||!moves.has(i)?'disabled':''} onclick="dispatch('rev',${i})">${x==='host'?'●':x==='guest'?'●':''}</button>`).join('')}</div><div class="actions"><button class="btn" onclick="dispatch('game','reversi')">Новая партия</button></div>`}

// ---------- Game wrappers ----------
const V12_PREV_APPLY=applyAction,V12_PREV_RENDER=renderGame,V12_PREV_HANDLE=handleMessage,V12_PREV_BACK=backMenu;
applyAction=function(a,v,who){
 if(a==='game'&&v==='memory'){state=v12NewMemory();sync();renderFromState();return}
 if(a==='game'&&v==='dots'){state=v12NewDots();sync();renderFromState();return}
 if(a==='game'&&v==='dice'){state=v12NewDice();sync();renderFromState();return}
 if(a==='game'&&v==='near100'){state=v12NewNear();sync();renderFromState();return}
 if(a==='game'&&v==='wordchain'){state={screen:'game',type:'wordchain',words:[],turn:'host',notice:'',winner:null};sync();renderFromState();return}
 if(a==='game'&&v==='reversi'){state=v12RevNew();sync();renderFromState();return}
 if(state.type==='memory'&&a==='mem'){v12MemoryPick(Number(v),who);return}
 if(state.type==='dots'&&a==='dot'){v12DotsMove(String(v),who);return}
 if(state.type==='dice'&&a==='dice_roll'){v12DiceRoll(who);return}
 if(state.type==='dice'&&a==='dice_next'){v12DiceNext();return}
 if(state.type==='near100'&&a==='near'){v12NearAnswer(v,who);return}
 if(state.type==='near100'&&a==='near_next'){v12NearNext();return}
 if(state.type==='wordchain'&&a==='word_move'){v12WordMove(v,who);return}
 if(state.type==='reversi'&&a==='rev'){v12RevMove(Number(v),who);return}
 V12_PREV_APPLY(a,v,who)
};
renderGame=function(){if(state.type==='memory')return renderV12Memory();if(state.type==='dots')return renderV12Dots();if(state.type==='dice')return renderV12Dice();if(state.type==='near100')return renderV12Near();if(state.type==='wordchain')return renderV12Word();if(state.type==='reversi')return renderV12Reversi();return V12_PREV_RENDER()};

// ---------- Stronger realtime prediction ----------
let V12_AIR_RECV=0,V12_AIR_PREV=null,V12_MAZE_RECV=0,V12_MAZE_PREV=null,V12_BOX_RECV=0,V12_BOX_PREV=null;
handleMessage=function(m){
 if(m&&m.t==='airSnap'&&role==='guest'){V12_AIR_PREV=V10_AIR_TARGET?v10CloneAir(V10_AIR_TARGET):null;V12_AIR_RECV=performance.now()}
 if(m&&m.t==='mazePos'){V12_MAZE_PREV=V10_MAZE_TARGET?{...V10_MAZE_TARGET}:null;V12_MAZE_RECV=performance.now()}
 if(m&&m.t==='boxSnap'&&role==='guest'){V12_BOX_PREV=V10_BOX_TARGET?v10CloneBox(V10_BOX_TARGET):null;V12_BOX_RECV=performance.now()}
 V12_PREV_HANDLE(m)
};

// Host sends fewer, richer air snapshots; guest predicts puck between them.
airLoop=function(t=performance.now()){
 if(role!=='host'||state.type!=='air'||!air)return;let dt=Math.min(.03,(t-air.last)/1000||.016);air.last=t;if(!air.over)stepAir(dt);
 let s={p:{x:air.puck.x,y:air.puck.y,vx:air.puck.vx,vy:air.puck.vy},h:{x:air.host.x,y:air.host.y},g:{x:air.guest.x,y:air.guest.y},sh:air.scoreH,sg:air.scoreG,over:air.over};drawAirSnapshot(s);
 if(t-airLastSend>50){direct({t:'airSnap',s});airLastSend=t}airAnim=requestAnimationFrame(airLoop)
};
v10StartAirSmooth=function(){
 cancelAnimationFrame(V10_AIR_RAF);if(role!=='guest'||state.type!=='air')return;
 const loop=()=>{if(role!=='guest'||state.type!=='air')return;if(V10_AIR_TARGET){if(!V10_AIR_DISPLAY)V10_AIR_DISPLAY=v10CloneAir(V10_AIR_TARGET);let d=V10_AIR_DISPLAY,q=V10_AIR_TARGET,age=Math.min(.13,(performance.now()-V12_AIR_RECV)/1000),px=q.p.x+(Number(q.p.vx)||0)*age,py=q.p.y+(Number(q.p.vy)||0)*age;px=Math.max(15,Math.min(705,px));py=Math.max(15,Math.min(465,py));d.p.x=v10Lerp(d.p.x,px,.46);d.p.y=v10Lerp(d.p.y,py,.46);d.h.x=v10Lerp(d.h.x,q.h.x,.38);d.h.y=v10Lerp(d.h.y,q.h.y,.38);d.g.x=v10Lerp(d.g.x,q.g.x,.035);d.g.y=v10Lerp(d.g.y,q.g.y,.035);d.sh=q.sh;d.sg=q.sg;d.over=q.over;drawAirSnapshot(d)}V10_AIR_RAF=requestAnimationFrame(loop)};loop();
};

// Maze: send direction and dead-reckon the remote player.
mazeLoop=function(t=performance.now()){
 if(state.type!=='maze'||state.winner)return;let dt=Math.min(.04,(t-mazeLast)/1000||.016);mazeLast=t;
 if(V10_MAZE_TARGET&&mazeOther){let age=Math.min(.12,(performance.now()-V12_MAZE_RECV)/1000),tx=V10_MAZE_TARGET.x+(Number(V10_MAZE_TARGET.vx)||0)*age,ty=V10_MAZE_TARGET.y+(Number(V10_MAZE_TARGET.vy)||0)*age;if(mazeCan(tx,ty)){mazeOther.x=v10Lerp(mazeOther.x,tx,.38);mazeOther.y=v10Lerp(mazeOther.y,ty,.38)}else{mazeOther.x=v10Lerp(mazeOther.x,V10_MAZE_TARGET.x,.45);mazeOther.y=v10Lerp(mazeOther.y,V10_MAZE_TARGET.y,.45)}}
 if(Date.now()>=(state.startAt||0)&&joy.active&&mazeMine){let speed=178,vx=joy.x*speed,vy=joy.y*speed,nx=mazeMine.x+vx*dt,ny=mazeMine.y+vy*dt;if(mazeCan(nx,mazeMine.y))mazeMine.x=nx;else vx=0;if(mazeCan(mazeMine.x,ny))mazeMine.y=ny;else vy=0;if(t-mazeSend>60){direct({t:'mazePos',x:mazeMine.x,y:mazeMine.y,vx,vy});mazeSend=t}if(Math.hypot(mazeMine.x-V10_MAZE_GOAL.x,mazeMine.y-V10_MAZE_GOAL.y)<27)dispatch('maze_win')}
 drawMaze();mazeFrame=requestAnimationFrame(mazeLoop)
};

// Preserve velocity fields for maze messages before v10 consumes them.
const V12_HANDLE_WITH_VEL=handleMessage;
handleMessage=function(m){if(m&&m.t==='mazePos'){V10_MAZE_TARGET={x:Number(m.x)||0,y:Number(m.y)||0,vx:Number(m.vx)||0,vy:Number(m.vy)||0};V12_MAZE_RECV=performance.now();return}V12_HANDLE_WITH_VEL(m)};

backMenu=function(){cancelAnimationFrame(V10_AIR_RAF);V12_PREV_BACK()};

// ---------- Styles ----------
(function v12Style(){if(document.getElementById('v12Style'))return;let s=document.createElement('style');s.id='v12Style';s.textContent=`
.v12Count{font-size:.72em;opacity:.55;margin-left:6px}.v12Score{display:grid;grid-template-columns:70px 1fr 70px;align-items:center;gap:8px;text-align:center;margin:10px auto 14px;max-width:520px}.v12Score b{font-size:1.7rem}.v12Memory{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:440px;margin:0 auto}.v12Memory button{aspect-ratio:1;border:1px solid #ffffff20;background:#ffffff0b;border-radius:16px;color:#fff;font-size:1.8rem;font-weight:900}.v12Memory button.got.host{background:#ff6fae35}.v12Memory button.got.guest{background:#9879ff35}.v12Dots{display:grid;grid-template-columns:18px 1fr 18px 1fr 18px 1fr 18px;grid-template-rows:18px 1fr 18px 1fr 18px 1fr 18px;gap:0;max-width:430px;aspect-ratio:1;margin:10px auto}.v12Dot{width:14px;height:14px;border-radius:50%;background:#fff;align-self:center;justify-self:center;z-index:2}.v12Edge{border:0;background:#ffffff18;padding:0;min-width:0;min-height:0}.v12Edge.h{height:8px;align-self:center;border-radius:99px}.v12Edge.v{width:8px;justify-self:center;border-radius:99px}.v12Edge.host{background:#ff6fae}.v12Edge.guest{background:#9879ff}.v12Box{display:flex;align-items:center;justify-content:center;font-size:1.5rem;background:#ffffff05}.v12Box.host{background:#ff6fae24}.v12Box.guest{background:#9879ff24}.v12Dice{display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:480px;margin:14px auto}.v12Dice>div,.v12Reveal>div{background:#ffffff08;border:1px solid #ffffff12;border-radius:18px;padding:14px;text-align:center}.v12Dice small,.v12Reveal small{display:block;color:var(--muted);margin-bottom:4px}.v12Dice b{font-size:4.5rem;line-height:1}.v12Reveal{display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:520px;margin:12px auto}.v12Reveal b{font-size:2rem}.v12Words{display:flex;flex-wrap:wrap;gap:7px;justify-content:center;margin:12px 0}.v12Words span{padding:7px 10px;border-radius:99px;background:#ffffff0b;border:1px solid #ffffff12}.v12Reversi{display:grid;grid-template-columns:repeat(6,1fr);gap:3px;max-width:480px;margin:10px auto;background:#ffffff10;padding:5px;border-radius:18px}.v12Reversi button{aspect-ratio:1;border:0;border-radius:9px;background:#264c42;color:transparent;font-size:2rem;position:relative}.v12Reversi button.host,.v12Reversi button.guest{color:#fff}.v12Reversi button.host{color:#ff7fbb}.v12Reversi button.guest{color:#b8a8ff}.v12Reversi button.move:not(:disabled)::after{content:'·';position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff8;font-size:2rem}@media(max-width:520px){.v12Score{grid-template-columns:55px 1fr 55px}.v12Memory{gap:6px}.v12Memory button{border-radius:12px;font-size:1.45rem}.v12Dice b{font-size:3.5rem}}
`;document.head.appendChild(s)})();
