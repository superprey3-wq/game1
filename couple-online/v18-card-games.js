// v18: two-player card games — Durak + 21
const V18_RANKS=['6','7','8','9','10','J','Q','K','A'];
const V18_SUITS=['♠','♥','♦','♣'];
const V18_RED=new Set(['♥','♦']);

const V18_CARD_GAMES=[
 ['durak','🃏','Подкидной дурак','Классическая дуэль на 36 карт: козырь, атака, защита, взять или бито.'],
 ['twentyone','♠️','21 · карты','Набирайте карты и старайтесь подойти к 21 ближе соперника, не перебрав.']
];
for(const g of V18_CARD_GAMES)if(!GAMES.some(x=>x[0]===g[0])){GAMES.push(g);TITLES[g[0]]=g[2]}
if(typeof CAT!=='undefined')for(const g of V18_CARD_GAMES)CAT[g[0]]='🃏 Карточные';
if(typeof V12_CATEGORY_ORDER!=='undefined'&&!V12_CATEGORY_ORDER.includes('🃏 Карточные')){
 const i=V12_CATEGORY_ORDER.indexOf('Лёгкие игры');V12_CATEGORY_ORDER.splice(i<0?2:i+1,0,'🃏 Карточные');
}
if(typeof v12Badge==='function'){
 const V18_OLD_BADGE=v12Badge;
 v12Badge=function(id){if(id==='durak')return '36 карт';if(id==='twentyone')return 'до 21';return V18_OLD_BADGE(id)};
}

(function(){
 if(document.getElementById('v18CardsStyle'))return;
 const s=document.createElement('style');s.id='v18CardsStyle';s.textContent=`
 .v18Info{display:flex;justify-content:space-between;gap:10px;align-items:center;margin:9px 0 12px;padding:10px 12px;border-radius:16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.09);font-size:13px}
 .v18Info b{font-size:18px}.v18Hand{display:flex;gap:7px;flex-wrap:wrap;justify-content:center;margin:12px 0}.v18Card{width:54px;height:78px;border:0;border-radius:11px;background:#faf7f3;color:#17131c;font-weight:900;font-size:17px;position:relative;padding:6px;box-shadow:0 5px 14px rgba(0,0,0,.25);transition:.13s transform,.13s opacity}.v18Card.red{color:#d72c55}.v18Card:not(:disabled):active{transform:translateY(-6px) scale(.98)}.v18Card:disabled{opacity:.72}.v18Card .s{font-size:19px;display:block}.v18Card .mini{position:absolute;right:5px;bottom:3px;font-size:22px}.v18Back{width:38px;height:55px;border-radius:9px;background:repeating-linear-gradient(45deg,#7a45bd 0 5px,#a36ee4 5px 10px);border:2px solid rgba(255,255,255,.65);box-shadow:0 4px 10px rgba(0,0,0,.22)}
 .v18Opponent{display:flex;justify-content:center;gap:3px;flex-wrap:wrap;min-height:58px;margin:7px 0}.v18Table{min-height:126px;display:flex;justify-content:center;gap:9px;flex-wrap:wrap;align-items:center;padding:12px;border-radius:19px;background:rgba(255,255,255,.045);border:1px dashed rgba(255,255,255,.13)}.v18Pair{width:74px;height:104px;position:relative}.v18Pair .v18Card{position:absolute;left:0;top:0;transform:scale(.88)}.v18Pair .v18Card.def{left:18px;top:23px;transform:rotate(9deg) scale(.88)}
 .v18Trump{display:inline-flex;align-items:center;gap:6px;padding:6px 9px;border-radius:12px;background:rgba(255,255,255,.07)}.v18Turn{font-weight:800;text-align:center;margin:8px 0}.v18Hint{text-align:center;font-size:13px;opacity:.72;margin:8px 0}.v18DeckMeta{display:flex;justify-content:center;gap:12px;align-items:center;font-size:13px;opacity:.8;margin-top:5px}
 .v18TwentyHands{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}.v18TwentyBox{padding:12px;border-radius:18px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.09);text-align:center}.v18TwentyBox.active{outline:2px solid rgba(255,111,174,.8)}.v18TwentyBox .total{font-size:34px;font-weight:900;margin:5px 0}.v18TwentyCards{display:flex;gap:4px;justify-content:center;flex-wrap:wrap;min-height:58px}.v18TwentyCards .v18Card{width:43px;height:62px;font-size:14px;padding:4px}.v18TwentyCards .v18Card .mini{font-size:17px}.v18Result{padding:14px;border-radius:17px;background:rgba(255,255,255,.075);text-align:center;font-weight:800;margin:10px 0}.v18Score{display:flex;justify-content:center;gap:12px;align-items:center;font-size:13px}.v18Score b{font-size:25px}.v18CardBtnRow{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:10px}
 @media(max-width:390px){.v18Card{width:48px;height:70px}.v18Pair{width:66px;height:96px}.v18TwentyHands{grid-template-columns:1fr}.v18TwentyCards .v18Card{width:40px;height:58px}}
 `;document.head.appendChild(s);
})();

function v18Other(w){return w==='host'?'guest':'host'}
function v18Name(w){return w==='host'?hostName():guestName()}
function v18Shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function v18Deck36(){return v18Shuffle(Array.from({length:36},(_,i)=>i))}
function v18Suit(c){return V18_SUITS[Math.floor(c/9)]}
function v18RankI(c){return c%9}
function v18Rank(c){return V18_RANKS[v18RankI(c)]}
function v18CardHTML(c,cls='',disabled=false,on=''){
 const s=v18Suit(c),r=v18Rank(c),red=V18_RED.has(s)?' red':'';
 return `<button class="v18Card${red} ${cls}" ${disabled?'disabled':''} ${on?`onclick="${on}"`:''}><span>${r}</span><span class="s">${s}</span><span class="mini">${s}</span></button>`;
}
function v18Backs(n){return Array.from({length:Math.min(n,12)},()=>'<i class="v18Back"></i>').join('')+(n>12?`<b>+${n-12}</b>`:'')}

// ---------------- Durak ----------------
function v18DurakLowestTrumpOwner(hands,trump){
 let best=null,owner='host';
 for(const who of ['host','guest'])for(const c of hands[who])if(v18Suit(c)===trump&&(!best||v18RankI(c)<v18RankI(best))){best=c;owner=who}
 return best==null?'host':owner;
}
function v18DurakDraw(state,who){while(state.hands[who].length<6&&state.deck.length)state.hands[who].push(state.deck.pop())}
function v18DurakCheckWinner(s){
 if(s.deck.length)return null;
 const h=s.hands.host.length,g=s.hands.guest.length;
 if(h===0&&g===0)return'draw';if(h===0)return'host';if(g===0)return'guest';return null;
}
function v18NewDurak(){
 const deck=v18Deck36(),trump=v18Suit(deck[0]),hands={host:[],guest:[]};
 for(let i=0;i<6;i++){hands.host.push(deck.pop());hands.guest.push(deck.pop())}
 const attacker=v18DurakLowestTrumpOwner(hands,trump);
 return{screen:'game',type:'durak',deck,trump,hands,attacker,defender:v18Other(attacker),table:[],phase:'attack',limit:Math.min(6,hands[v18Other(attacker)].length),winner:null,round:1,last:''};
}
function v18DurakCanAttack(s,c){
 if(!s.table.length)return true;
 const ranks=new Set();for(const p of s.table){ranks.add(v18RankI(p.a));if(p.d!=null)ranks.add(v18RankI(p.d))}
 return ranks.has(v18RankI(c));
}
function v18DurakCanBeat(a,d,trump){
 const sa=v18Suit(a),sd=v18Suit(d);if(sd===sa&&v18RankI(d)>v18RankI(a))return true;if(sd===trump&&sa!==trump)return true;return false;
}
function v18DurakPlay(idx,who){
 const s=state;if(s.type!=='durak'||s.winner||who!==s.attacker||s.phase!=='attack')return;
 idx=Number(idx);if(!Number.isInteger(idx)||idx<0||idx>=s.hands[who].length)return;
 const c=s.hands[who][idx];if(s.table.length>=s.limit||!v18DurakCanAttack(s,c))return;
 s.hands[who].splice(idx,1);s.table.push({a:c,d:null});s.phase='defend';s.last=v18Name(who)+' атакует';sync();renderFromState();
}
function v18DurakBeat(idx,who){
 const s=state;if(s.type!=='durak'||s.winner||who!==s.defender||s.phase!=='defend')return;
 idx=Number(idx);if(!Number.isInteger(idx)||idx<0||idx>=s.hands[who].length)return;
 const pair=s.table.find(p=>p.d==null);if(!pair)return;const c=s.hands[who][idx];if(!v18DurakCanBeat(pair.a,c,s.trump))return;
 s.hands[who].splice(idx,1);pair.d=c;s.phase='attack';s.last=v18Name(who)+' отбился(ась)';sync();renderFromState();
}
function v18DurakEnd(who){
 const s=state;if(s.type!=='durak'||s.winner||who!==s.attacker||s.phase!=='attack'||!s.table.length||s.table.some(p=>p.d==null))return;
 const oldA=s.attacker,oldD=s.defender;s.table=[];v18DurakDraw(s,oldA);v18DurakDraw(s,oldD);s.attacker=oldD;s.defender=oldA;s.phase='attack';s.limit=Math.min(6,s.hands[s.defender].length);s.round++;s.last='Бито. Теперь атакует '+v18Name(s.attacker);s.winner=v18DurakCheckWinner(s);sync();renderFromState();
}
function v18DurakTake(who){
 const s=state;if(s.type!=='durak'||s.winner||who!==s.defender||s.phase!=='defend'||!s.table.length)return;
 for(const p of s.table){s.hands[who].push(p.a);if(p.d!=null)s.hands[who].push(p.d)}
 s.table=[];v18DurakDraw(s,s.attacker);v18DurakDraw(s,s.defender);s.phase='attack';s.limit=Math.min(6,s.hands[s.defender].length);s.round++;s.last=v18Name(who)+' взял(а). '+v18Name(s.attacker)+' снова атакует';s.winner=v18DurakCheckWinner(s);sync();renderFromState();
}
function v18DurakPlayable(c,who){const s=state;if(who===s.attacker&&s.phase==='attack')return s.table.length<s.limit&&v18DurakCanAttack(s,c);if(who===s.defender&&s.phase==='defend'){const p=s.table.find(x=>x.d==null);return !!p&&v18DurakCanBeat(p.a,c,s.trump)}return false}
function renderV18Durak(){
 const s=state,me=actor(),opp=v18Other(me),myTurn=(me===s.attacker&&s.phase==='attack')||(me===s.defender&&s.phase==='defend');$('roundPill').textContent='Круг '+s.round;$('bar').style.width=((36-s.deck.length)/36*100)+'%';
 let status;if(s.winner){status=s.winner==='draw'?'Ничья — карт ни у кого не осталось 😄':`${v18Name(s.winner)} вышел(а) первым! ${v18Name(v18Other(s.winner))} — дурак 😄`}else if(s.phase==='attack')status=s.attacker===me?'Твоя атака':'Атакует '+v18Name(s.attacker);else status=s.defender===me?'Отбивайся или бери':'Отбивается '+v18Name(s.defender);
 const table=s.table.length?s.table.map(p=>`<div class="v18Pair">${v18CardHTML(p.a,'',true)}${p.d!=null?v18CardHTML(p.d,'def',true):''}</div>`).join(''):'<span class="muted">Стол пуст — можно ходить любой картой</span>';
 const hand=s.hands[me].map((c,i)=>v18CardHTML(c,'',!myTurn||!v18DurakPlayable(c,me),me===s.attacker?`dispatch('durak_play',${i})`:`dispatch('durak_beat',${i})`)).join('');
 $('gameCard').innerHTML=`<div class="v18Info"><div><small>Козырь</small><div class="v18Trump"><b class="${V18_RED.has(s.trump)?'red':''}">${s.trump}</b></div></div><div style="text-align:right"><small>Колода</small><b style="display:block">${s.deck.length}</b></div></div><div class="v18Turn">${esc(status)}</div><div class="v18Opponent">${v18Backs(s.hands[opp].length)}</div><div class="v18Hint">У ${esc(v18Name(opp))}: ${s.hands[opp].length} карт</div><div class="v18Table">${table}</div><div class="v18Hint">Твои карты · ${s.hands[me].length}</div><div class="v18Hand">${hand||'<span class="muted">Карт нет</span>'}</div><div class="v18CardBtnRow">${!s.winner&&me===s.defender&&s.phase==='defend'?'<button class="ghost" onclick="dispatch(\'durak_take\')">🙌 Взять</button>':''}${!s.winner&&me===s.attacker&&s.phase==='attack'&&s.table.length&&s.table.every(p=>p.d!=null)?'<button class="btn" onclick="dispatch(\'durak_end\')">✅ Бито</button>':''}${s.winner?'<button class="btn" onclick="dispatch(\'game\',\'durak\')">Новая партия</button>':''}</div><div class="v18Hint">${esc(s.last||'Первым ходит игрок с младшим козырем.')}</div>`;
}

// ---------------- 21 ----------------
function v18Deck52(){return v18Shuffle(Array.from({length:52},(_,i)=>i))}
function v18Suit52(c){return V18_SUITS[Math.floor(c/13)]}
function v18Rank52I(c){return c%13}
function v18Rank52(c){return ['2','3','4','5','6','7','8','9','10','J','Q','K','A'][v18Rank52I(c)]}
function v18Card52HTML(c,disabled=true){const s=v18Suit52(c),r=v18Rank52(c),red=V18_RED.has(s)?' red':'';return `<button class="v18Card${red}" ${disabled?'disabled':''}><span>${r}</span><span class="s">${s}</span><span class="mini">${s}</span></button>`}
function v18TwentyTotal(hand){let total=0,aces=0;for(const c of hand){const r=v18Rank52I(c);if(r===12){total+=11;aces++}else total+=Math.min(r+2,10)}while(total>21&&aces){total-=10;aces--}return total}
function v18TwentyDraw(s,who){if(s.deck.length)s.hands[who].push(s.deck.pop())}
function v18TwentyResolve(s){
 const h=v18TwentyTotal(s.hands.host),g=v18TwentyTotal(s.hands.guest);let w='draw';if(h>21&&g<=21)w='guest';else if(g>21&&h<=21)w='host';else if(h<=21&&g<=21){if(h>g)w='host';else if(g>h)w='guest'}
 s.roundWinner=w;if(w!=='draw')s.score[w]++;if(s.score.host>=3||s.score.guest>=3)s.winner=s.score.host>=3?'host':'guest';s.turn=null;
}
function v18NewTwenty(){
 const deck=v18Deck52(),hands={host:[],guest:[]};for(let i=0;i<2;i++){hands.host.push(deck.pop());hands.guest.push(deck.pop())}
 return{screen:'game',type:'twentyone',deck,hands,turn:'host',stood:{host:false,guest:false},score:{host:0,guest:0},round:1,roundWinner:null,winner:null};
}
function v18TwentyAdvanceTurn(s){
 if(s.turn==='host'){s.stood.host=true;s.turn='guest'}else{s.stood.guest=true;v18TwentyResolve(s)}
}
function v18TwentyHit(who){
 const s=state;if(s.type!=='twentyone'||s.winner||s.roundWinner||who!==s.turn)return;v18TwentyDraw(s,who);const t=v18TwentyTotal(s.hands[who]);if(t>=21)v18TwentyAdvanceTurn(s);sync();renderFromState();
}
function v18TwentyStand(who){const s=state;if(s.type!=='twentyone'||s.winner||s.roundWinner||who!==s.turn)return;v18TwentyAdvanceTurn(s);sync();renderFromState()}
function v18TwentyNext(){
 const s=state;if(s.type!=='twentyone'||s.winner||!s.roundWinner)return;const score={...s.score},round=s.round+1,deck=v18Deck52(),hands={host:[],guest:[]};for(let i=0;i<2;i++){hands.host.push(deck.pop());hands.guest.push(deck.pop())}state={screen:'game',type:'twentyone',deck,hands,turn:round%2===0?'guest':'host',stood:{host:false,guest:false},score,round,roundWinner:null,winner:null};sync();renderFromState();
}
function renderV18Twenty(){
 const s=state,me=actor(),opp=v18Other(me),done=!!s.roundWinner||!!s.winner,myTotal=v18TwentyTotal(s.hands[me]),oppTotal=v18TwentyTotal(s.hands[opp]);$('roundPill').textContent='Раунд '+s.round+' · до 3';$('bar').style.width=(Math.max(s.score.host,s.score.guest)/3*100)+'%';
 let result='';if(s.winner)result=`🏆 ${v18Name(s.winner)} выиграл(а) матч ${s.score.host}:${s.score.guest}`;else if(s.roundWinner)result=s.roundWinner==='draw'?`Ничья: ${v18TwentyTotal(s.hands.host)} : ${v18TwentyTotal(s.hands.guest)}`:`${v18Name(s.roundWinner)} берёт раунд — ${v18TwentyTotal(s.hands[s.roundWinner])} очков`;
 const oppCards=done?s.hands[opp].map(c=>v18Card52HTML(c)).join(''):v18Backs(s.hands[opp].length);
 const myCards=s.hands[me].map(c=>v18Card52HTML(c)).join('');
 $('gameCard').innerHTML=`<div class="v18Score"><b>${s.score.host}</b><span>${esc(hostName())} · ${esc(guestName())}</span><b>${s.score.guest}</b></div>${result?`<div class="v18Result">${esc(result)}</div>`:''}<div class="v18TwentyHands"><div class="v18TwentyBox ${s.turn===opp?'active':''}"><small>${esc(v18Name(opp))}</small><div class="total">${done?oppTotal:'?'}</div><div class="v18TwentyCards">${oppCards}</div></div><div class="v18TwentyBox ${s.turn===me?'active':''}"><small>Ты · ${esc(v18Name(me))}</small><div class="total">${myTotal}</div><div class="v18TwentyCards">${myCards}</div></div></div>${!done&&s.turn===me?`<div class="v18CardBtnRow"><button class="btn" onclick="dispatch('twenty_hit')">➕ Ещё карту</button><button class="ghost" onclick="dispatch('twenty_stand')">✋ Хватит</button></div>`:!done?`<div class="v18Turn">Ходит ${esc(v18Name(s.turn))}…</div>`:''}<div class="v18Hint">Туз считается за 11 или 1. Валет, дама и король — по 10.</div><div class="v18CardBtnRow">${s.roundWinner&&!s.winner?'<button class="btn" onclick="dispatch(\'twenty_next\')">Следующий раунд</button>':''}${s.winner?'<button class="btn" onclick="dispatch(\'game\',\'twentyone\')">Новый матч</button>':''}</div>`;
}

const V18_PREV_APPLY=applyAction,V18_PREV_RENDER=renderGame;
applyAction=function(a,v,who){
 if(a==='game'&&v==='durak'){state=v18NewDurak();sync();renderFromState();return}
 if(a==='game'&&v==='twentyone'){state=v18NewTwenty();sync();renderFromState();return}
 if(state.type==='durak'){
  if(a==='durak_play'){v18DurakPlay(v,who);return}
  if(a==='durak_beat'){v18DurakBeat(v,who);return}
  if(a==='durak_take'){v18DurakTake(who);return}
  if(a==='durak_end'){v18DurakEnd(who);return}
 }
 if(state.type==='twentyone'){
  if(a==='twenty_hit'){v18TwentyHit(who);return}
  if(a==='twenty_stand'){v18TwentyStand(who);return}
  if(a==='twenty_next'){v18TwentyNext();return}
 }
 V18_PREV_APPLY(a,v,who);
};
renderGame=function(){if(state.type==='durak')return renderV18Durak();if(state.type==='twentyone')return renderV18Twenty();return V18_PREV_RENDER()};
