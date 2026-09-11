// v17: original visual-search race — first to find the hidden character wins
const V17_FINDER_ID='finder';
const V17_THEMES=[
 {name:'Парк',icon:'🌳',props:['🌲','🌼','🦆','🛝','🌿','🪁']},
 {name:'Пляж',icon:'🏖️',props:['🌴','🐚','⛱️','🦀','🏐','🌊']},
 {name:'Вечеринка',icon:'🎉',props:['🎈','🎵','🪩','🎁','✨','🎊']},
 {name:'Космос',icon:'🚀',props:['🪐','⭐','🌙','☄️','🛰️','👾']},
 {name:'Город',icon:'🌆',props:['🚕','🚲','🚌','☕','🏙️','🚦']},
 {name:'Ярмарка',icon:'🎡',props:['🎠','🍭','🎪','🎟️','🍿','🎯']}
];
const V17_FACES=['🙂','😊','😄','🤓','😎','🥸','😋','😉','🤠','🫠','🤩','😇'];
const V17_ACC=['🧢','🎧','👓','🌸','⭐','🎀','🍀','⚡','💜','🍓','☀️','🐾'];
const V17_SHIRTS=['#ff6fae','#9b7cff','#55c6ff','#67d59b','#ffd35c','#ff8b68','#c68cff','#5dd9d0'];

if(!GAMES.some(g=>g[0]===V17_FINDER_ID))GAMES.push([V17_FINDER_ID,'🔎','Найди первым','Одинаковая шумная сцена на двух телефонах. Кто первым найдёт нужного героя — забирает раунд.']);
TITLES[V17_FINDER_ID]='🔎 Найди первым';
if(typeof CAT!=='undefined')CAT[V17_FINDER_ID]='Лёгкие игры';
if(typeof V12_CATEGORY_ORDER!=='undefined'&&!V12_CATEGORY_ORDER.includes('Лёгкие игры'))V12_CATEGORY_ORDER.splice(2,0,'Лёгкие игры');
if(typeof v12Badge==='function'){
 const V17_OLD_BADGE=v12Badge;
 v12Badge=function(id){if(id===V17_FINDER_ID)return '⚡ кто быстрее';return V17_OLD_BADGE(id)};
}

(function(){
 if(document.getElementById('v17FinderStyle'))return;
 const s=document.createElement('style');s.id='v17FinderStyle';s.textContent=`
 .v17FinderTop{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;margin:8px 0 12px}
 .v17FinderClue{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid rgba(255,255,255,.12);border-radius:18px;background:rgba(255,255,255,.055)}
 .v17FinderClue .sample{position:relative;width:58px;height:58px;border-radius:18px;background:rgba(255,255,255,.08);display:grid;place-items:center;font-size:29px;overflow:hidden}
 .v17FinderClue .acc{position:absolute;right:2px;top:1px;font-size:20px}.v17FinderClue .shirt{position:absolute;bottom:0;left:7px;right:7px;height:12px;border-radius:9px 9px 4px 4px}
 .v17FinderScore{display:flex;gap:7px;align-items:center;font-size:13px}.v17FinderScore b{font-size:22px}.v17FinderScore .sep{opacity:.5}
 .v17SceneWrap{position:relative;border-radius:22px;overflow:hidden;border:1px solid rgba(255,255,255,.12);background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.025));padding:8px}
 .v17SceneTitle{display:flex;justify-content:space-between;align-items:center;padding:4px 5px 9px;font-size:13px;opacity:.82}
 .v17FinderGrid{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:3px;max-height:53vh;overflow:auto;overscroll-behavior:contain;padding:2px}
 .v17Person{position:relative;min-width:0;aspect-ratio:.82;border:0;border-radius:10px;background:rgba(255,255,255,.065);display:flex;align-items:center;justify-content:center;font-size:24px;padding:0;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.035)}
 .v17Person:active{transform:scale(.92)}.v17Person .a{position:absolute;right:0;top:-1px;font-size:14px}.v17Person .sh{position:absolute;left:5px;right:5px;bottom:2px;height:7px;border-radius:6px}.v17Person .p{position:absolute;left:1px;bottom:10px;font-size:10px;opacity:.64}
 .v17Person.found{outline:3px solid #fff;box-shadow:0 0 0 5px rgba(255,102,179,.45),0 0 28px rgba(255,102,179,.6);z-index:2}.v17Person.found:after{content:'🎯';position:absolute;inset:0;display:grid;place-items:center;font-size:34px;background:rgba(25,9,31,.24)}
 .v17FinderBanner{margin:10px 0;padding:12px 14px;border-radius:16px;text-align:center;background:rgba(255,255,255,.08);font-weight:700}.v17FinderBanner.bad{animation:v17shake .25s 1}
 .v17Count{font-size:42px;font-weight:900;text-align:center;padding:15px}.v17FinderHint{font-size:13px;opacity:.72;text-align:center;margin-top:8px}
 @keyframes v17shake{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
 @media(max-width:390px){.v17FinderGrid{grid-template-columns:repeat(7,minmax(0,1fr))}.v17Person{font-size:22px}.v17FinderClue .sample{width:52px;height:52px}}
 `;document.head.appendChild(s);
})();

function v17Rng(seed){let x=(seed>>>0)||0x9e3779b9;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return((x>>>0)/4294967296)}}
function v17RoundData(seed,round){
 const r=v17Rng(((seed>>>0)+(round*2654435761))>>>0),theme=V17_THEMES[(round-1)%V17_THEMES.length];
 const count=Math.min(96,56+(round-1)*8),target=Math.floor(r()*count);
 const spec={face:Math.floor(r()*V17_FACES.length),acc:Math.floor(r()*V17_ACC.length),shirt:Math.floor(r()*V17_SHIRTS.length)};
 const items=[];
 for(let i=0;i<count;i++){
   let it={face:Math.floor(r()*V17_FACES.length),acc:Math.floor(r()*V17_ACC.length),shirt:Math.floor(r()*V17_SHIRTS.length),prop:Math.floor(r()*theme.props.length)};
   if(i===target)it={...spec,prop:Math.floor(r()*theme.props.length)};
   else if(it.face===spec.face&&it.acc===spec.acc&&it.shirt===spec.shirt)it.acc=(it.acc+1)%V17_ACC.length;
   items.push(it);
 }
 return{theme,count,target,spec,items};
}
function v17NewFinder(){return{screen:'game',type:V17_FINDER_ID,round:1,seed:Math.floor(Math.random()*0xffffffff)>>>0,startAt:Date.now()+1800,score:{host:0,guest:0},penaltyUntil:{host:0,guest:0},misses:{host:0,guest:0},roundWinner:null,winner:null}}
function v17Name(w){return w==='host'?hostName():guestName()}
let V17_RENDER_TIMER=0,V17_BAD_LOCAL_UNTIL=0;
function v17AdvanceFinder(){
 state.round++;state.seed=Math.floor(Math.random()*0xffffffff)>>>0;state.startAt=Date.now()+1500;state.roundWinner=null;state.penaltyUntil={host:0,guest:0};sync();renderFromState();
}
function v17FinderPick(i,who){
 if(state.type!==V17_FINDER_ID||state.winner||state.roundWinner||Date.now()<state.startAt)return;
 if((state.penaltyUntil?.[who]||0)>Date.now())return;
 const d=v17RoundData(state.seed,state.round);
 if(i===d.target){
   state.roundWinner=who;state.score[who]=(state.score[who]||0)+1;
   if(state.score[who]>=3)state.winner=who;
   sync();renderFromState();
   if(!state.winner)setTimeout(()=>{if(state.type===V17_FINDER_ID&&state.roundWinner===who&&!state.winner)v17AdvanceFinder()},2100);
 }else{
   state.penaltyUntil[who]=Date.now()+850;state.misses[who]=(state.misses[who]||0)+1;sync();renderFromState();
 }
}
function v17FinderClick(i){
 if(state.type!==V17_FINDER_ID||state.winner||state.roundWinner)return;
 const me=actor(),wait=Math.max(0,(state.penaltyUntil?.[me]||0)-Date.now());
 if(Date.now()<state.startAt)return toast('Ещё секунду…');
 if(wait>0)return toast('Штраф за промах — '+Math.ceil(wait/100)/10+' сек');
 const d=v17RoundData(state.seed,state.round);
 if(i!==d.target){V17_BAD_LOCAL_UNTIL=Date.now()+500;toast('Не он 😄')}
 dispatch('finder_pick',i);
}
function v17FinderSceneHTML(d,reveal){
 return d.items.map((it,i)=>`<button class="v17Person ${reveal&&i===d.target?'found':''}" ${state.winner||state.roundWinner||Date.now()<state.startAt?'disabled':''} onclick="v17FinderClick(${i})" aria-label="персонаж"><span>${V17_FACES[it.face]}</span><span class="a">${V17_ACC[it.acc]}</span><i class="sh" style="background:${V17_SHIRTS[it.shirt]}"></i><small class="p">${d.theme.props[it.prop]}</small></button>`).join('');
}
function renderV17Finder(){
 clearTimeout(V17_RENDER_TIMER);V17_RENDER_TIMER=0;
 const d=v17RoundData(state.seed,state.round),now=Date.now(),me=actor(),pre=Math.max(0,state.startAt-now),pen=Math.max(0,(state.penaltyUntil?.[me]||0)-now);
 $('roundPill').textContent='Раунд '+state.round+' · до 3';$('bar').style.width=(Math.max(state.score.host,state.score.guest)/3*100)+'%';
 let banner='';
 if(state.winner)banner=`<div class="v17FinderBanner">🏆 ${esc(v17Name(state.winner))} победил(а) со счётом ${state.score.host}:${state.score.guest}</div>`;
 else if(state.roundWinner)banner=`<div class="v17FinderBanner">🎯 Первым нашёл(ла) ${esc(v17Name(state.roundWinner))}! Следующий раунд…</div>`;
 else if(pre>0)banner=`<div class="v17Count">${Math.max(1,Math.ceil(pre/1000))}</div>`;
 else if(pen>0)banner=`<div class="v17FinderBanner bad">Промах — короткий штраф ${Math.ceil(pen/100)/10} сек 😄</div>`;
 else banner=`<div class="v17FinderBanner">Кто первым заметит нужного героя?</div>`;
 $('gameCard').innerHTML=`
 <div class="v17FinderTop"><div class="v17FinderClue"><div class="sample"><span>${V17_FACES[d.spec.face]}</span><span class="acc">${V17_ACC[d.spec.acc]}</span><i class="shirt" style="background:${V17_SHIRTS[d.spec.shirt]}"></i></div><div><small>НАЙДИ</small><b style="display:block">Именно этого героя</b><small>${d.theme.icon} ${esc(d.theme.name)} · ${d.count} персонажей</small></div></div><div class="v17FinderScore"><b>${state.score.host}</b><span class="sep">:</span><b>${state.score.guest}</b></div></div>
 ${banner}
 <div class="v17SceneWrap"><div class="v17SceneTitle"><span>${d.theme.icon} ${esc(d.theme.name)}</span><span>Промахи: ${state.misses.host||0} · ${state.misses.guest||0}</span></div><div class="v17FinderGrid">${v17FinderSceneHTML(d,!!state.roundWinner||!!state.winner)}</div></div>
 <div class="v17FinderHint">Ищи совпадение лица, значка и цвета одежды. Неправильный тап даёт штраф 0,85 сек.</div>
 <div class="actions"><button class="ghost" onclick="openChat?.()">💬 Чат</button>${state.winner?`<button class="btn" onclick="dispatch('game','${V17_FINDER_ID}')">Ещё матч</button>`:''}</div>`;
 if(pre>0)V17_RENDER_TIMER=setTimeout(()=>{if(state.type===V17_FINDER_ID)renderV17Finder()},Math.min(500,pre+20));
 else if(pen>0)V17_RENDER_TIMER=setTimeout(()=>{if(state.type===V17_FINDER_ID)renderV17Finder()},Math.min(300,pen+20));
}

const V17_PREV_APPLY=applyAction,V17_PREV_RENDER=renderGame,V17_PREV_BACK=backMenu;
applyAction=function(a,v,who){
 if(a==='game'&&v===V17_FINDER_ID){state=v17NewFinder();sync();renderFromState();return}
 if(state.type===V17_FINDER_ID&&a==='finder_pick'){v17FinderPick(Number(v),who);return}
 V17_PREV_APPLY(a,v,who);
};
renderGame=function(){if(state.type===V17_FINDER_ID)return renderV17Finder();return V17_PREV_RENDER()};
backMenu=function(){clearTimeout(V17_RENDER_TIMER);V17_RENDER_TIMER=0;return V17_PREV_BACK()};
