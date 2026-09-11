// v10 gameplay upgrade: smoother realtime, richer Crocodile, harder maze, more games

// ---------- More Crocodile words ----------
const V10_CROC_WORDS=[
'собака','хомяк','лев','тигр','жираф','слон','обезьяна','крокодил','акула','дельфин','кит','черепаха','сова','попугай','орёл','бабочка','паук','улитка','божья коровка','медуза','морской конёк','краб','кенгуру','коала','лама','верблюд','белка','ёж','лиса','волк','медведь','заяц','олень','мышь','лягушка','пчела','муравей','павлин','лебедь','утка','курица','петух','корова','лошадь','свинья','овца','коза',
'дом','небоскрёб','маяк','мост','туннель','фонтан','башня','палатка','иглу','домик на дереве','лестница','лифт','дверь','окно','камин','диван','кровать','ванна','холодильник','телевизор','пылесос','лампа','стул','стол','шкаф','зеркало','подушка','одеяло','чайник','тостер','микроволновка','стиральная машина',
'автобус','поезд','метро','трамвай','такси','мотоцикл','самокат','скейтборд','вертолёт','воздушный шар','подводная лодка','трактор','экскаватор','пожарная машина','скорая помощь','гоночная машина','яхта','лодка','каноэ','санки','лыжи','сноуборд','ролики',
'телефон','ноутбук','наушники','камера','джойстик','клавиатура','мышка','принтер','телескоп','микроскоп','компас','магнит','батарейка','робот-пылесос','дрон','спутник','антенна','фонарик','часы','калькулятор',
'гамбургер','хот-дог','суши','арбуз','банан','ананас','клубника','вишня','лимон','апельсин','виноград','авокадо','морковь','помидор','огурец','картошка','попкорн','пончик','торт','печенье','шоколад','сыр','яичница','блины','вафли','чай','кофе','лимонад','сок','суп','макароны','буррито','тако',
'футбол','баскетбол','теннис','боулинг','бильярд','бокс','карате','плавание','серфинг','парашют','альпинист','рыбалка','шахматы','дартс','йога','танцы','катание на коньках','американские горки','качели','горка',
'радуга','молния','торнадо','вулкан','айсберг','водопад','остров','гора','пустыня','лес','озеро','река','океан','облако','солнце','луна','звезда','комета','планета','космос','снеговик','костёр','песочный замок','следы на снегу',
'пират','космонавт','волшебник','рыцарь','король','королева','детектив','ниндзя','ковбой','супергерой','врач','повар','пожарный','полицейский','фотограф','музыкант','художник','учитель','строитель','почтальон','капитан','балерина','фокусник',
'сокровище','карта','меч','щит','шлем','ключ','замочная скважина','рюкзак','чемодан','кольцо','очки','шляпа','перчатка','зубная щётка','расчёска','ножницы','карандаш','кисть','книга','конверт','свеча','воздушный змей','мыльные пузыри','кубик рубика','пазл','воздушный шарик','песочные часы','якорь','подкова','корзина','тележка','зонт','маска','барабан','пианино','скрипка','саксофон','микрофон'
];
DRAW_WORDS.push(...V10_CROC_WORDS.filter(w=>!DRAW_WORDS.includes(w)));

// ---------- Network traffic shaping for realtime controls ----------
const V10_RAW_DIRECT=direct;
let V10_FAST_PENDING={},V10_FAST_TIMER=0;
let V10_AIR_TARGET=null,V10_AIR_DISPLAY=null,V10_AIR_RAF=0;
function v10FlushFast(){
  V10_FAST_TIMER=0;
  const items=Object.values(V10_FAST_PENDING);V10_FAST_PENDING={};
  for(const msg of items)V10_RAW_DIRECT(msg);
}
direct=function(o){
  if(o&&o.t==='airInput'&&role==='guest'&&V10_AIR_DISPLAY?.g){
    V10_AIR_DISPLAY.g.x=Number(o.x)||V10_AIR_DISPLAY.g.x;
    V10_AIR_DISPLAY.g.y=Number(o.y)||V10_AIR_DISPLAY.g.y;
  }
  if(o&&['airInput','boxDir'].includes(o.t)){
    V10_FAST_PENDING[o.t]=o;
    if(!V10_FAST_TIMER)V10_FAST_TIMER=setTimeout(v10FlushFast,25);
    return true;
  }
  return V10_RAW_DIRECT(o);
};

// ---------- Crocodile drawing tools ----------
const V10_DRAW_BG='#17101e';
let V10_DRAW_COLOR='#fff7fb',V10_DRAW_WIDTH=5,V10_DRAW_ERASER=false,V10_CROC_BATCH=[],V10_CROC_BATCH_TIMER=0,V10_REMOTE_LAST=null;
function v10CrocColor(c){V10_DRAW_COLOR=c;V10_DRAW_ERASER=false;v10PaintToolState()}
function v10CrocWidth(w){V10_DRAW_WIDTH=Number(w)||5;v10PaintToolState()}
function v10CrocEraser(){V10_DRAW_ERASER=!V10_DRAW_ERASER;v10PaintToolState()}
function v10PaintToolState(){
  document.querySelectorAll('[data-croc-color]').forEach(b=>b.classList.toggle('active',!V10_DRAW_ERASER&&b.dataset.crocColor===V10_DRAW_COLOR));
  document.querySelectorAll('[data-croc-width]').forEach(b=>b.classList.toggle('active',Number(b.dataset.crocWidth)===V10_DRAW_WIDTH));
  const e=$('crocEraser');if(e)e.classList.toggle('active',V10_DRAW_ERASER);
}
function v10QueueDraw(p,now=false){
  V10_CROC_BATCH.push(p);
  if(now){v10FlushDraw();return}
  if(!V10_CROC_BATCH_TIMER)V10_CROC_BATCH_TIMER=setTimeout(v10FlushDraw,28);
}
function v10FlushDraw(){
  clearTimeout(V10_CROC_BATCH_TIMER);V10_CROC_BATCH_TIMER=0;
  if(!V10_CROC_BATCH.length)return;
  const pts=V10_CROC_BATCH.splice(0,V10_CROC_BATCH.length);direct({t:'drawBatch',pts});
}
function v10Stroke(a,b,m={}){
  let c=$('drawCanvas');if(!drawCtx||!c||!a||!b)return;let r=c.getBoundingClientRect();
  drawCtx.save();drawCtx.globalCompositeOperation='source-over';drawCtx.lineCap='round';drawCtx.lineJoin='round';
  drawCtx.strokeStyle=m.e?V10_DRAW_BG:(m.c||V10_DRAW_COLOR);drawCtx.lineWidth=(Number(m.w)||V10_DRAW_WIDTH)*(m.e?1.8:1);
  drawCtx.beginPath();drawCtx.moveTo(a.x*r.width,a.y*r.height);drawCtx.lineTo(b.x*r.width,b.y*r.height);drawCtx.stroke();drawCtx.restore();
}
renderCrocodile=function(){
  $('roundPill').textContent=`Раунд ${state.idx+1}`;$('bar').style.width=state.status==='won'?'100%':'55%';
  let mine=actor()===state.drawer,drawerName=state.drawer==='host'?hostName():guestName();
  if(state.status==='won'){$('gameCard').innerHTML=`<div class="bigemoji">🎉</div><div class="question">Угадано!</div><div class="muted">В следующем раунде рисует другой игрок.</div><div class="actions"><button class="btn" onclick="dispatch('next')">Поменяться ролями</button></div>`;return}
  const tools=mine?`<div class="crocTools"><div class="crocPalette">
    ${['#fff7fb','#ff6fae','#9879ff','#54dc93','#ffd35a','#ff8a4a','#55c7ff','#111111'].map(c=>`<button type="button" class="crocColor" data-croc-color="${c}" style="--sw:${c}" onclick="v10CrocColor('${c}')" aria-label="Цвет"></button>`).join('')}
  </div><div class="crocWidths"><button data-croc-width="2" onclick="v10CrocWidth(2)">тонко</button><button data-croc-width="5" onclick="v10CrocWidth(5)">средне</button><button data-croc-width="10" onclick="v10CrocWidth(10)">толсто</button><button data-croc-width="18" onclick="v10CrocWidth(18)">маркер</button><button id="crocEraser" onclick="v10CrocEraser()">🧽 ластик</button></div></div>`:'';
  $('gameCard').innerHTML=`<div class="eyebrow">${mine?'Твоя очередь рисовать':'Рисует '+esc(drawerName)}</div>${mine?`<div class="secretword">Нарисуй: <b>${esc(secretWord||'получаем слово…')}</b></div>`:`<div class="question smallq">Угадай рисунок</div>`}${tools}<canvas id="drawCanvas" class="drawcanvas"></canvas>${mine?`<div id="guessSeen" class="muted">${lastGuess?'Последняя попытка: '+esc(lastGuess):'Ждём попытку партнёра…'}</div><div class="actions"><button class="ghost" onclick="clearAndSend()">Очистить всё</button><button class="btn" onclick="dispatch('croc_correct')">Угадал(а)!</button></div>`:`<div class="guessrow"><input id="guessInput" maxlength="60" placeholder="Напиши догадку"><button class="btn" onclick="sendGuess()">Угадать</button></div><div class="muted">Рисунок приходит почти сразу через облачную комнату.</div>`}`;
  requestAnimationFrame(()=>{initDrawCanvas(mine);v10PaintToolState()});
};
initDrawCanvas=function(canDraw){
  let c=$('drawCanvas');if(!c)return;let r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);
  c.width=Math.max(1,Math.round(r.width*d));c.height=Math.max(1,Math.round(r.width*.58*d));c.style.height=(r.width*.58)+'px';
  drawCtx=c.getContext('2d');drawCtx.setTransform(d,0,0,d,0,0);drawCtx.fillStyle=V10_DRAW_BG;drawCtx.fillRect(0,0,r.width,r.width*.58);
  V10_REMOTE_LAST=null;if(!canDraw)return;
  const pos=e=>{let b=c.getBoundingClientRect();return{x:(e.clientX-b.left)/b.width,y:(e.clientY-b.top)/b.height}};
  const meta=()=>({c:V10_DRAW_COLOR,w:V10_DRAW_WIDTH,e:V10_DRAW_ERASER?1:0});
  c.onpointerdown=e=>{e.preventDefault();c.setPointerCapture?.(e.pointerId);drawActive=true;drawLast=pos(e);let m=meta();v10Stroke(drawLast,drawLast,m);v10QueueDraw({k:'s',...drawLast,...m})};
  c.onpointermove=e=>{if(!drawActive)return;e.preventDefault();let p=pos(e),m=meta();v10Stroke(drawLast,p,m);v10QueueDraw({k:'m',...p,...m});drawLast=p};
  const end=()=>{if(!drawActive)return;drawActive=false;v10QueueDraw({k:'e'},true)};c.onpointerup=end;c.onpointercancel=end;
};
clearDrawCanvas=function(){let c=$('drawCanvas');if(!c||!drawCtx)return;let r=c.getBoundingClientRect();drawCtx.save();drawCtx.globalCompositeOperation='source-over';drawCtx.fillStyle=V10_DRAW_BG;drawCtx.fillRect(0,0,r.width,r.height);drawCtx.restore();V10_REMOTE_LAST=null};
function v10ReceiveDrawBatch(m){
  if(state.type!=='crocodile'||!Array.isArray(m.pts))return;
  for(const p of m.pts){if(p.k==='s'){V10_REMOTE_LAST={x:p.x,y:p.y};v10Stroke(V10_REMOTE_LAST,V10_REMOTE_LAST,p)}else if(p.k==='m'&&V10_REMOTE_LAST){let q={x:p.x,y:p.y};v10Stroke(V10_REMOTE_LAST,q,p);V10_REMOTE_LAST=q}else if(p.k==='e')V10_REMOTE_LAST=null}
}

// ---------- Smooth remote rendering ----------
function v10Lerp(a,b,k){return a+(b-a)*k}
function v10CloneAir(s){return s?{p:{...s.p},h:{...s.h},g:{...s.g},sh:s.sh||0,sg:s.sg||0,over:!!s.over}:null}
function v10StartAirSmooth(){
  cancelAnimationFrame(V10_AIR_RAF);if(role!=='guest'||state.type!=='air')return;
  const loop=()=>{if(role!=='guest'||state.type!=='air')return;if(V10_AIR_TARGET){if(!V10_AIR_DISPLAY)V10_AIR_DISPLAY=v10CloneAir(V10_AIR_TARGET);for(const k of ['p','h']){V10_AIR_DISPLAY[k].x=v10Lerp(V10_AIR_DISPLAY[k].x,V10_AIR_TARGET[k].x,.38);V10_AIR_DISPLAY[k].y=v10Lerp(V10_AIR_DISPLAY[k].y,V10_AIR_TARGET[k].y,.38)}V10_AIR_DISPLAY.g.x=v10Lerp(V10_AIR_DISPLAY.g.x,V10_AIR_TARGET.g.x,.14);V10_AIR_DISPLAY.g.y=v10Lerp(V10_AIR_DISPLAY.g.y,V10_AIR_TARGET.g.y,.14);V10_AIR_DISPLAY.sh=V10_AIR_TARGET.sh;V10_AIR_DISPLAY.sg=V10_AIR_TARGET.sg;V10_AIR_DISPLAY.over=V10_AIR_TARGET.over;drawAirSnapshot(V10_AIR_DISPLAY)}V10_AIR_RAF=requestAnimationFrame(loop)};loop();
}
const V10_OLD_RENDER_AIR=renderAir;
renderAir=function(){V10_AIR_TARGET=V10_AIR_DISPLAY=null;V10_OLD_RENDER_AIR();if(role==='guest')requestAnimationFrame(v10StartAirSmooth)};

let V10_BOX_TARGET=null,V10_BOX_DISPLAY=null,V10_BOX_RAF=0,V10_BOX_LAST=0;
function v10CloneBox(s){return s?{h:{...s.h},g:{...s.g},winner:s.winner||null}:null}
function v10StartBoxSmooth(t=performance.now()){
  cancelAnimationFrame(V10_BOX_RAF);if(role!=='guest'||state.type!=='boxing')return;V10_BOX_LAST=t;
  const loop=now=>{if(role!=='guest'||state.type!=='boxing')return;let dt=Math.min(.04,(now-V10_BOX_LAST)/1000||.016);V10_BOX_LAST=now;if(V10_BOX_TARGET){if(!V10_BOX_DISPLAY)V10_BOX_DISPLAY=v10CloneBox(V10_BOX_TARGET);let d=V10_BOX_DISPLAY,q=V10_BOX_TARGET;if(boxMyDir)d.g.x=Math.max(380,Math.min(660,d.g.x+boxMyDir*170*dt));d.g.x=v10Lerp(d.g.x,q.g.x,.12);d.h.x=v10Lerp(d.h.x,q.h.x,.34);d.h.hp=v10Lerp(Number(d.h.hp)||0,Number(q.h.hp)||0,.42);d.g.hp=v10Lerp(Number(d.g.hp)||0,Number(q.g.hp)||0,.42);for(const k of ['attack','attackT','block']){d.h[k]=q.h[k];d.g[k]=q.g[k]}d.winner=q.winner;box=d;drawBox()}V10_BOX_RAF=requestAnimationFrame(loop)};V10_BOX_RAF=requestAnimationFrame(loop);
}
const V10_OLD_RENDER_BOXING=renderBoxing;
renderBoxing=function(){V10_BOX_TARGET=V10_BOX_DISPLAY=null;V10_OLD_RENDER_BOXING();if(role==='guest')requestAnimationFrame(()=>v10StartBoxSmooth())};
const V10_OLD_BOX_PRESS=boxPress;
boxPress=function(a){if(role==='guest'&&state.type==='boxing'&&box?.g&&!state.winner){box.g.attack=a;box.g.attackT=a==='hook'?.75:a==='jab'?.38:.72;drawBox()}V10_OLD_BOX_PRESS(a)};

// ---------- Harder maze with real start line and countdown ----------
const V10_MAZE_MAPS=[
 [[40,390,280,20],[400,390,280,20],[150,320,420,20],[40,250,280,20],[400,250,280,20],[150,180,420,20],[40,110,280,20],[400,110,280,20]],
 [[180,390,360,20],[40,320,260,20],[420,320,260,20],[180,250,360,20],[40,180,260,20],[420,180,260,20],[180,110,360,20]],
 [[40,400,250,20],[410,400,270,20],[330,330,60,90],[40,300,210,20],[470,300,210,20],[180,230,360,20],[40,160,280,20],[400,160,280,20],[280,90,160,20]]
];
const V10_MAZE_GOAL={x:360,y:48};let V10_MAZE_TARGET=null;
mazeStartPos=function(){return actor()==='host'?{x:342,y:450}:{x:378,y:450}};
mazeCan=function(x,y){if(x<15||x>705||y<15||y>465)return false;let walls=V10_MAZE_MAPS[state.mazeMap||0]||V10_MAZE_MAPS[0];for(const w of walls)if(circleRectHit(x,y,13,w))return false;return true};
initMazeGame=function(){mazeMine=mazeStartPos();mazeOther=actor()==='host'?{x:378,y:450}:{x:342,y:450};V10_MAZE_TARGET={...mazeOther};direct({t:'mazePos',x:mazeMine.x,y:mazeMine.y});cancelAnimationFrame(mazeFrame);mazeLast=performance.now();mazeLoop()};
mazeLoop=function(t=performance.now()){
  if(state.type!=='maze'||state.winner)return;let dt=Math.min(.04,(t-mazeLast)/1000||.016);mazeLast=t;
  if(V10_MAZE_TARGET&&mazeOther){mazeOther.x=v10Lerp(mazeOther.x,V10_MAZE_TARGET.x,.28);mazeOther.y=v10Lerp(mazeOther.y,V10_MAZE_TARGET.y,.28)}
  if(Date.now()>=(state.startAt||0)&&joy.active&&mazeMine){let speed=178,nx=mazeMine.x+joy.x*speed*dt,ny=mazeMine.y+joy.y*speed*dt;if(mazeCan(nx,mazeMine.y))mazeMine.x=nx;if(mazeCan(mazeMine.x,ny))mazeMine.y=ny;if(t-mazeSend>50){direct({t:'mazePos',x:mazeMine.x,y:mazeMine.y});mazeSend=t}if(Math.hypot(mazeMine.x-V10_MAZE_GOAL.x,mazeMine.y-V10_MAZE_GOAL.y)<27)dispatch('maze_win')}
  drawMaze();mazeFrame=requestAnimationFrame(mazeLoop)
};
renderMaze=function(){
  $('roundPill').textContent='Сложная трасса';$('bar').style.width=state.winner?'100%':'72%';let win=state.winner?(state.winner==='host'?hostName():guestName())+' победил(а) 🎉':'';
  $('gameCard').innerHTML=`<div class="bigemoji">🕹️</div><div class="question smallq">Старт снизу → доберись до ⭐ наверху</div>${win?`<div class="result">${esc(win)}</div>`:''}<canvas id="mazeCanvas" class="aircanvas"></canvas>${state.winner?'':joyHTML('Джойстик персонажа')}<div class="muted">Оба начинают на линии START. Трасса теперь длиннее, уже и меняется между заездами.</div><div class="actions"><button class="ghost" onclick="openChat()">💬 Чат</button><button class="btn" onclick="dispatch('game','maze')">Новая трасса</button></div>`;
  requestAnimationFrame(()=>{mazeCanvas=$('mazeCanvas');if(!mazeCanvas)return;let r=mazeCanvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);mazeCanvas.width=Math.round(r.width*d);mazeCanvas.height=Math.round(r.width*(2/3)*d);mazeCanvas.style.height=(r.width*(2/3))+'px';mazeCtx=mazeCanvas.getContext('2d');mazeCtx.setTransform(mazeCanvas.width/720,0,0,mazeCanvas.height/480,0,0);if(!state.winner){initJoystick();initMazeGame()}else{mazeMine=mazeMine||mazeStartPos();drawMaze()}})
};
drawMaze=function(){
  if(!mazeCtx||!mazeCanvas)return;let x=mazeCtx,walls=V10_MAZE_MAPS[state.mazeMap||0]||V10_MAZE_MAPS[0];x.clearRect(0,0,720,480);x.fillStyle='#15101d';x.fillRect(0,0,720,480);
  x.fillStyle='#ffffff1d';for(const w of walls){x.beginPath();x.roundRect(w[0],w[1],w[2],w[3],7);x.fill()}
  x.save();x.setLineDash([9,8]);x.strokeStyle='#54dc93aa';x.lineWidth=3;x.beginPath();x.moveTo(285,430);x.lineTo(435,430);x.stroke();x.restore();x.fillStyle='#54dc93';x.font='700 15px system-ui';x.textAlign='center';x.fillText('START',360,425);
  x.fillStyle='#ffd35a';x.font='38px system-ui';x.fillText('★',V10_MAZE_GOAL.x,V10_MAZE_GOAL.y+12);
  let h=actor()==='host'?mazeMine:mazeOther,g=actor()==='guest'?mazeMine:mazeOther;if(h){x.fillStyle='#ff6fae';x.beginPath();x.arc(h.x,h.y,13,0,Math.PI*2);x.fill()}if(g){x.fillStyle='#9879ff';x.beginPath();x.arc(g.x,g.y,13,0,Math.PI*2);x.fill()}
  let left=Math.ceil(((state.startAt||0)-Date.now())/1000);if(left>0&&!state.winner){x.fillStyle='#000a';x.fillRect(0,0,720,480);x.fillStyle='#fff';x.font='900 76px system-ui';x.textAlign='center';x.fillText(String(left),360,245);x.font='700 22px system-ui';x.fillText('Приготовились!',360,285)}
};

// ---------- New games ----------
for(const g of [
 ['taprush','👆','Тап-баттл','8 секунд: кто успеет сделать больше нажатий. Счёт считается локально без задержки.'],
 ['fleet','🚢','Морской бой mini','По 5 скрытых кораблей на поле 5×5. Ходы по очереди.'],
 ['bulls','🔐','Взлом кода','У каждого секрет из 4 разных цифр. Угадывайте код по подсказкам «быки и коровы».']
])if(!GAMES.some(x=>x[0]===g[0])){GAMES.push(g);TITLES[g[0]]=g[2]}
if(typeof CAT!=='undefined'){CAT.taprush='Аркада';CAT.fleet='Настолки';CAT.bulls='Настолки'}

let V10_TAP={session:null,mine:0,other:0,lastSend:0,raf:0,final:false,finishTimer:0};
function v10TapReset(){cancelAnimationFrame(V10_TAP.raf);clearTimeout(V10_TAP.finishTimer);V10_TAP={session:state.session,mine:0,other:0,lastSend:0,raf:0,final:false,finishTimer:0}}
function v10TapPress(){if(state.type!=='taprush'||state.phase==='done'||Date.now()<(state.startAt||0)||Date.now()>=(state.endAt||0))return;V10_TAP.mine++;let m=$('tapMine');if(m)m.textContent=V10_TAP.mine;let now=performance.now();if(now-V10_TAP.lastSend>90){direct({t:'tapCount',n:V10_TAP.mine});V10_TAP.lastSend=now}}
function v10TapLoop(){cancelAnimationFrame(V10_TAP.raf);const loop=()=>{if(state.type!=='taprush')return;let now=Date.now(),before=(state.startAt||0)-now,left=(state.endAt||0)-now,txt=before>0?`Старт через ${Math.max(1,Math.ceil(before/1000))}`:left>0?`${(left/1000).toFixed(1)} сек`:'Финиш!';let t=$('tapTimer');if(t)t.textContent=txt;let b=$('tapButton');if(b)b.disabled=before>0||left<=0||state.phase==='done';if(left<=0&&!V10_TAP.final&&state.phase!=='done'){V10_TAP.final=true;direct({t:'tapCount',n:V10_TAP.mine,final:true});if(role==='host')V10_TAP.finishTimer=setTimeout(v10TapFinishHost,450)}V10_TAP.raf=requestAnimationFrame(loop)};loop()}
function v10TapFinishHost(){if(role!=='host'||state.type!=='taprush'||state.phase==='done')return;let h=V10_TAP.mine,g=V10_TAP.other;state.phase='done';state.scores={host:h,guest:g};state.winner=h===g?'draw':h>g?'host':'guest';sync();renderFromState()}
function renderTapRush(){
  if(V10_TAP.session!==state.session)v10TapReset();$('roundPill').textContent='8 секунд';$('bar').style.width=state.phase==='done'?'100%':'70%';
  if(state.phase==='done'){let s=state.scores||{host:0,guest:0},w=state.winner==='draw'?'Ничья!':(state.winner==='host'?hostName():guestName())+' победил(а)!';$('gameCard').innerHTML=`<div class="bigemoji">🏁</div><div class="question">${esc(w)}</div><div class="tapScore"><b>${s.host}</b><span>${esc(hostName())} : ${esc(guestName())}</span><b>${s.guest}</b></div><div class="actions"><button class="ghost" onclick="openChat()">💬 Чат</button><button class="btn" onclick="dispatch('game','taprush')">Ещё раунд</button></div>`;return}
  let mineName=myName,other=role==='host'?guestName():hostName();$('gameCard').innerHTML=`<div class="question smallq">Кто быстрее пальцами?</div><div id="tapTimer" class="tapTimer">Приготовились…</div><div class="tapScore"><b id="tapMine">${V10_TAP.mine}</b><span>${esc(mineName)} · ${esc(other)}</span><b id="tapOther">${V10_TAP.other}</b></div><button id="tapButton" class="tapButton" onclick="v10TapPress()">ТАП!</button><div class="muted">Нажатие считается на твоём телефоне сразу; в сеть отправляется только счёт.</div>`;requestAnimationFrame(v10TapLoop)
}

let V10_FLEET={session:null,ships:new Set(),incoming:new Map(),outgoing:new Map(),pending:false};
function v10FleetReset(){let ships=new Set();while(ships.size<5)ships.add(Math.floor(Math.random()*25));V10_FLEET={session:state.session,ships,incoming:new Map(),outgoing:new Map(),pending:false}}
function v10FleetCell(i,own){let m=own?V10_FLEET.incoming:V10_FLEET.outgoing,v=m.get(i),ship=own&&V10_FLEET.ships.has(i);return `<button ${own?'disabled':''} class="fleetCell ${ship?'ship':''} ${v||''}" ${own?'':`onclick="v10FleetShoot(${i})"`}>${v==='hit'?'💥':v==='miss'?'·':ship?'🚢':''}</button>`}
function renderFleet(){if(V10_FLEET.session!==state.session)v10FleetReset();$('roundPill').textContent='5×5';$('bar').style.width=state.winner?'100%':'72%';let turn=state.turn===actor()?'Твой ход':'Ход партнёра';let win=state.winner?(state.winner==='host'?hostName():guestName())+' победил(а)!':'';$('gameCard').innerHTML=`<div class="question smallq">Морской бой mini</div>${win?`<div class="result">🚢 ${esc(win)}</div>`:`<div class="muted fleetTurn">${esc(turn)}</div>`}<div class="fleetWrap"><div><b>Поле соперника</b><div class="fleetGrid">${Array.from({length:25},(_,i)=>v10FleetCell(i,false)).join('')}</div></div><div><b>Твои корабли</b><div class="fleetGrid own">${Array.from({length:25},(_,i)=>v10FleetCell(i,true)).join('')}</div></div></div><div class="muted">Спрятано 5 кораблей. 💥 — попадание, · — мимо.</div><div class="actions"><button class="ghost" onclick="openChat()">💬 Чат</button><button class="btn" onclick="dispatch('game','fleet')">Новая игра</button></div>`}
function v10FleetShoot(i){if(state.type!=='fleet'||state.winner||state.turn!==actor()||V10_FLEET.pending||V10_FLEET.outgoing.has(i))return;V10_FLEET.pending=true;direct({t:'fleetShot',cell:i,shooter:actor()});renderFleet()}
function v10FleetOnShot(m){let i=Number(m.cell);if(state.type!=='fleet'||m.shooter===actor()||i<0||i>24)return;let hit=V10_FLEET.ships.has(i);V10_FLEET.incoming.set(i,hit?'hit':'miss');let remaining=[...V10_FLEET.ships].filter(c=>V10_FLEET.incoming.get(c)!=='hit').length;direct({t:'fleetResult',cell:i,shooter:m.shooter,hit,remaining});if(role==='host')v10FleetHostResolve(m.shooter,hit,remaining);renderFleet()}
function v10FleetOnResult(m){if(state.type!=='fleet'||m.shooter!==actor())return;let i=Number(m.cell);V10_FLEET.outgoing.set(i,m.hit?'hit':'miss');V10_FLEET.pending=false;if(role==='host')v10FleetHostResolve(m.shooter,!!m.hit,Number(m.remaining));renderFleet()}
function v10FleetHostResolve(shooter,hit,remaining){if(role!=='host'||state.type!=='fleet'||state.winner)return;state.fleetHits=state.fleetHits||{host:0,guest:0};state.fleetHits[shooter]=5-Math.max(0,remaining);if(remaining<=0)state.winner=shooter;else state.turn=shooter==='host'?'guest':'host';sync();renderFromState()}

let V10_BULL={session:null,secret:'',history:[],pending:false};
function v10BullSecret(){let a=[];while(a.length<4){let d=String(Math.floor(Math.random()*10));if(!a.includes(d))a.push(d)}return a.join('')}
function v10BullReset(){V10_BULL={session:state.session,secret:v10BullSecret(),history:[],pending:false}}
function v10BullEval(g){let bulls=0,cows=0;for(let i=0;i<4;i++)if(g[i]===V10_BULL.secret[i])bulls++;else if(V10_BULL.secret.includes(g[i]))cows++;return{bulls,cows}}
function renderBulls(){if(V10_BULL.session!==state.session)v10BullReset();$('roundPill').textContent='4 цифры';$('bar').style.width=state.winner?'100%':'68%';let turn=state.turn===actor()?'Твой ход':'Ход партнёра',win=state.winner?(state.winner==='host'?hostName():guestName())+' взломал(а) код!':'';let hist=V10_BULL.history.slice().reverse().map(h=>`<div class="bullRow"><b>${h.guess}</b><span>🐂 ${h.bulls} · 🐄 ${h.cows}</span></div>`).join('')||'<div class="muted">Попыток пока нет.</div>';$('gameCard').innerHTML=`<div class="question smallq">Взлом кода</div><div class="secretword">Твой секрет: <b>${V10_BULL.secret}</b></div>${win?`<div class="result">🔓 ${esc(win)}</div>`:`<div class="muted">${esc(turn)}</div><div class="guessrow"><input id="bullInput" inputmode="numeric" maxlength="4" placeholder="4 разные цифры"><button class="btn" onclick="v10BullGuess()">Проверить</button></div>`}<div class="bullLegend">🐂 бык = цифра и место верны · 🐄 корова = цифра есть, но место другое</div><div class="bullHistory">${hist}</div><div class="actions"><button class="ghost" onclick="openChat()">💬 Чат</button><button class="btn" onclick="dispatch('game','bulls')">Новый код</button></div>`}
function v10BullGuess(){if(state.type!=='bulls'||state.winner||state.turn!==actor()||V10_BULL.pending)return;let i=$('bullInput'),g=String(i?.value||'').replace(/\D/g,'').slice(0,4);if(g.length!==4||new Set(g).size!==4)return toast('Нужно 4 разные цифры');V10_BULL.pending=true;direct({t:'bullGuess',guess:g,shooter:actor()});if(i)i.value=''}
function v10BullOnGuess(m){if(state.type!=='bulls'||m.shooter===actor())return;let g=String(m.guess||'').slice(0,4),r=v10BullEval(g);direct({t:'bullResult',guess:g,shooter:m.shooter,...r});if(role==='host')v10BullHostResolve(m.shooter,r.bulls);}
function v10BullOnResult(m){if(state.type!=='bulls'||m.shooter!==actor())return;V10_BULL.pending=false;V10_BULL.history.push({guess:String(m.guess||''),bulls:Number(m.bulls)||0,cows:Number(m.cows)||0});if(role==='host')v10BullHostResolve(m.shooter,Number(m.bulls)||0);renderBulls()}
function v10BullHostResolve(shooter,bulls){if(role!=='host'||state.type!=='bulls'||state.winner)return;if(bulls===4)state.winner=shooter;else state.turn=shooter==='host'?'guest':'host';sync();renderFromState()}

// ---------- Final wrappers ----------
const V10_PREV_APPLY=applyAction,V10_PREV_RENDER=renderGame,V10_PREV_HANDLE=handleMessage,V10_PREV_BACK=backMenu;
applyAction=function(a,v,who){
  if(a==='game'&&v==='maze'){state={screen:'game',type:'maze',winner:null,mazeMap:Math.floor(Math.random()*V10_MAZE_MAPS.length),startAt:Date.now()+3000};sync();renderFromState();return}
  if(a==='game'&&v==='taprush'){state={screen:'game',type:'taprush',phase:'go',session:Math.random().toString(36).slice(2),startAt:Date.now()+2500,endAt:Date.now()+10500,scores:{host:0,guest:0},winner:null};sync();renderFromState();return}
  if(a==='game'&&v==='fleet'){state={screen:'game',type:'fleet',session:Math.random().toString(36).slice(2),turn:Math.random()>.5?'host':'guest',winner:null,fleetHits:{host:0,guest:0}};sync();renderFromState();return}
  if(a==='game'&&v==='bulls'){state={screen:'game',type:'bulls',session:Math.random().toString(36).slice(2),turn:Math.random()>.5?'host':'guest',winner:null};sync();renderFromState();return}
  V10_PREV_APPLY(a,v,who)
};
renderGame=function(){if(state.type==='taprush')return renderTapRush();if(state.type==='fleet')return renderFleet();if(state.type==='bulls')return renderBulls();return V10_PREV_RENDER()};
handleMessage=function(m){
  if(m&&m.t==='drawBatch'){v10ReceiveDrawBatch(m);return}
  if(m&&m.t==='airSnap'&&role==='guest'){airLatest=m.s;V10_AIR_TARGET=v10CloneAir(m.s);if(!V10_AIR_DISPLAY)V10_AIR_DISPLAY=v10CloneAir(m.s);return}
  if(m&&m.t==='mazePos'){V10_MAZE_TARGET={x:Number(m.x)||0,y:Number(m.y)||0};return}
  if(m&&m.t==='boxSnap'&&role==='guest'){V10_BOX_TARGET=v10CloneBox(m.s);if(!V10_BOX_DISPLAY)V10_BOX_DISPLAY=v10CloneBox(m.s);box=V10_BOX_DISPLAY;return}
  if(m&&m.t==='tapCount'){V10_TAP.other=Math.max(V10_TAP.other,Number(m.n)||0);let e=$('tapOther');if(e)e.textContent=V10_TAP.other;if(role==='host'&&m.final&&Date.now()>=(state.endAt||0))V10_TAP.finishTimer=setTimeout(v10TapFinishHost,220);return}
  if(m&&m.t==='fleetShot'){v10FleetOnShot(m);return}
  if(m&&m.t==='fleetResult'){v10FleetOnResult(m);return}
  if(m&&m.t==='bullGuess'){v10BullOnGuess(m);return}
  if(m&&m.t==='bullResult'){v10BullOnResult(m);return}
  V10_PREV_HANDLE(m)
};
backMenu=function(){cancelAnimationFrame(V10_AIR_RAF);cancelAnimationFrame(V10_BOX_RAF);cancelAnimationFrame(V10_TAP.raf);clearTimeout(V10_TAP.finishTimer);v10FlushDraw();V10_PREV_BACK()};

// ---------- Styles ----------
(function v10Styles(){if(document.getElementById('v10Styles'))return;let s=document.createElement('style');s.id='v10Styles';s.textContent=`
.crocTools{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:center;margin:10px 0 12px}.crocPalette,.crocWidths{display:flex;gap:7px;flex-wrap:wrap;justify-content:center}.crocColor{width:31px;height:31px;border-radius:50%;border:3px solid #ffffff22;background:var(--sw);box-shadow:0 3px 10px #0004}.crocColor.active{border-color:#fff;transform:scale(1.12)}.crocWidths button{border:1px solid #ffffff1c;background:#ffffff0b;color:#fff;border-radius:12px;padding:8px 10px;font-weight:750}.crocWidths button.active{background:#ffffff22;border-color:#ffffff66}.drawcanvas{touch-action:none}
.tapTimer{text-align:center;font-weight:900;font-size:clamp(28px,7vw,52px);margin:8px 0}.tapScore{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px;margin:12px auto;max-width:520px}.tapScore b{font-size:clamp(34px,8vw,62px)}.tapScore span{color:var(--muted);text-align:center}.tapButton{display:block;width:min(320px,82vw);height:150px;margin:14px auto;border:0;border-radius:34px;background:linear-gradient(135deg,#ff6fae,#9879ff);color:#fff;font-size:42px;font-weight:1000;box-shadow:0 16px 42px #8d5cff44;touch-action:manipulation}.tapButton:active{transform:scale(.96)}.tapButton:disabled{filter:grayscale(.45);opacity:.55}
.fleetWrap{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin:16px 0}.fleetWrap>div>b{display:block;margin-bottom:8px}.fleetGrid{display:grid;grid-template-columns:repeat(5,1fr);gap:5px}.fleetCell{aspect-ratio:1;border:1px solid #ffffff18;background:#ffffff09;color:#fff;border-radius:9px;font-size:clamp(12px,4vw,22px);padding:0}.fleetCell.ship{background:#9879ff28}.fleetCell.hit{background:#ff596d36}.fleetCell.miss{background:#55c7ff18;color:#7ccfff}.fleetTurn{text-align:center;font-weight:800}.bullLegend{font-size:13px;color:var(--muted);margin:10px 0}.bullHistory{display:grid;gap:7px;max-width:480px;margin:12px auto}.bullRow{display:flex;justify-content:space-between;gap:12px;background:#ffffff09;border:1px solid #ffffff12;padding:9px 12px;border-radius:12px}.bullRow b{letter-spacing:.18em}
@media(max-width:620px){.fleetWrap{grid-template-columns:1fr}.tapButton{height:130px}.crocTools{align-items:stretch}.crocWidths button{font-size:12px}}
`;document.head.appendChild(s)})();
