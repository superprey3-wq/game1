// v7 illustrated duel + real-time boxing
if(!GAMES.some(x=>x[0]==='boxing')){GAMES.unshift(['boxing','🥊','Бокс 1×1','Двигайтесь джойстиком, бейте джебом и хуком, ставьте блок. Победа — нокаут.']);TITLES.boxing='Бокс 1×1'}
if(typeof CAT!=='undefined')CAT.boxing='Аркада';

// ---------- Illustrated reaction-duel characters ----------
const _fxDuel=renderDuel;
renderDuel=function(){_fxDuel();decorateDuelCharacters()};
function cowboyFigure(side,shoot=false){
 const flip=side==='right'?'style="transform:scaleX(-1)"':'';
 return `<svg ${flip} class="cowboySvg ${shoot?'shooting':''}" viewBox="0 0 150 180" aria-hidden="true">
 <ellipse cx="75" cy="170" rx="46" ry="7" fill="#000" opacity=".25"/>
 <path d="M52 103 L44 154 L63 154 L75 116 L87 154 L106 154 L98 103Z" fill="#26344f"/>
 <path d="M53 88 Q75 72 97 88 L101 117 Q75 128 49 117Z" fill="#9b573b"/>
 <circle cx="75" cy="56" r="27" fill="#e5af82"/>
 <path d="M51 50 Q75 20 99 50 Q95 29 79 25 Q58 25 51 50" fill="#4a2c20"/>
 <path d="M40 40 Q75 20 110 40 L104 49 L46 49Z" fill="#5b3422"/>
 <rect x="55" y="31" width="40" height="9" rx="4" fill="#7b4a2e"/>
 <circle cx="66" cy="57" r="3" fill="#231a17"/><circle cx="85" cy="57" r="3" fill="#231a17"/>
 <path d="M69 70 Q75 75 82 70" fill="none" stroke="#7c4433" stroke-width="3" stroke-linecap="round"/>
 <path d="M54 92 Q34 97 27 116" fill="none" stroke="#e5af82" stroke-width="12" stroke-linecap="round"/>
 <circle cx="25" cy="118" r="8" fill="#e5af82"/>
 <g class="gunArm"><path d="M95 91 Q116 95 121 111" fill="none" stroke="#e5af82" stroke-width="12" stroke-linecap="round"/>
 <rect x="116" y="105" width="31" height="9" rx="3" fill="#373b44"/><rect x="120" y="113" width="8" height="14" rx="2" fill="#5b3422"/>
 <circle class="muzzle" cx="148" cy="109" r="0" fill="#ffd35a"/></g>
 <path d="M47 116 H103" stroke="#6a3829" stroke-width="6"/><circle cx="75" cy="116" r="5" fill="#d5a13e"/>
 </svg>`;
}
function decorateDuelCharacters(){
 document.querySelectorAll('.duelAvatar').forEach((el,i)=>{el.innerHTML=cowboyFigure(i?'right':'left',state?.phase==='fire');el.classList.add('drawn')});
}
(function duelArtStyle(){if(document.getElementById('duelArtStyle'))return;let s=document.createElement('style');s.id='duelArtStyle';s.textContent=`
.duelAvatar.drawn{font-size:0;width:145px;height:165px;display:flex;align-items:flex-end;justify-content:center;filter:none}.duelAvatar.drawn.flip{transform:none}.cowboySvg{width:100%;height:100%;overflow:visible;filter:drop-shadow(0 12px 16px #0008)}.cowboySvg.shooting .gunArm{transform-origin:96px 92px;animation:gunKick .32s ease-out}.cowboySvg.shooting .muzzle{animation:muzzle .22s ease-out}@keyframes gunKick{35%{transform:rotate(-10deg)}100%{transform:rotate(0)}}@keyframes muzzle{0%{r:0;opacity:0}25%{r:15;opacity:1}100%{r:2;opacity:0}}@media(max-width:560px){.duelAvatar.drawn{width:108px;height:132px}.duelScene{gap:10px!important}}`;document.head.appendChild(s)})();

// ---------- Boxing ----------
let box=null,boxCanvas=null,boxCtx=null,boxFrame=0,boxLast=0,boxSend=0,boxGuestDir=0,boxMyDir=0;
const _fxApply=applyAction,_fxRender=renderGame,_fxHandle=handleMessage,_fxBack=backMenu;
function newBox(){return{h:{x:190,hp:100,block:0,attack:'',attackT:0},g:{x:530,hp:100,block:0,attack:'',attackT:0},winner:null}}
applyAction=function(a,v,who){
 if(a==='game'&&v==='boxing'){state={screen:'game',type:'boxing',winner:null};if(role==='host')box=newBox();sync();renderFromState();return}
 if(state.type==='boxing'&&a==='box_restart'){if(role==='host'){box=newBox();state.winner=null;direct({t:'boxReset'});sync()}renderFromState();return}
 _fxApply(a,v,who)
};
renderGame=function(){if(state.type==='boxing')return renderBoxing();return _fxRender()};
handleMessage=function(m){
 if(m&&m.t==='boxDir'&&role==='host'&&box){boxGuestDir=Math.max(-1,Math.min(1,Number(m.x)||0));return}
 if(m&&m.t==='boxAct'&&role==='host'&&box){boxAction('guest',String(m.a||''));return}
 if(m&&m.t==='boxSnap'&&role==='guest'){box=m.s;drawBox();return}
 if(m&&m.t==='boxReset'&&role==='guest'){box=null;return}
 _fxHandle(m)
};
backMenu=function(){stopBox();_fxBack()};
function stopBox(){cancelAnimationFrame(boxFrame);boxFrame=0;boxCanvas=boxCtx=null;boxMyDir=boxGuestDir=0}
function renderBoxing(){
 $('roundPill').textContent='Нокаут';$('bar').style.width='100%';
 let me=actor()==='host'?'розовый':'фиолетовый';
 $('gameCard').innerHTML=`<div class="boxHud"><div><small>${esc(hostName())}</small><div class="hp"><i id="hpH"></i></div></div><b>🥊</b><div><small>${esc(guestName())}</small><div class="hp"><i id="hpG"></i></div></div></div><canvas id="boxCanvas" class="boxCanvas"></canvas><div id="boxStatus" class="boxStatus">Ты — ${me} боксёр</div>${state.winner?`<div class="result">${esc(state.winner==='host'?hostName():guestName())} победил(а) нокаутом!</div>`:`${joyHTML('Движение')}<div class="fightButtons"><button class="fight jab" onclick="boxPress('jab')">🥊 Джеб</button><button class="fight hook" onclick="boxPress('hook')">💥 Хук</button><button class="fight block" onclick="boxPress('block')">🛡️ Блок</button></div>`}<div class="actions"><button class="ghost" onclick="openChat()">💬 Чат</button><button class="btn" onclick="dispatch('box_restart')">Новый бой</button></div>`;
 requestAnimationFrame(initBoxCanvas)
}
function initBoxCanvas(){let c=$('boxCanvas');if(!c)return;boxCanvas=c;let r=c.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);c.width=Math.round(r.width*d);c.height=Math.round(r.width*.58*d);c.style.height=(r.width*.58)+'px';boxCtx=c.getContext('2d');boxCtx.setTransform(c.width/720,0,0,c.height/420,0,0);initJoystick((x)=>{boxMyDir=x;if(role==='guest')direct({t:'boxDir',x})});if(role==='host'){if(!box)box=newBox();boxLast=performance.now();cancelAnimationFrame(boxFrame);boxLoop()}else drawBox()}
function boxPress(a){if(state.type!=='boxing'||state.winner)return;if(role==='host')boxAction('host',a);else direct({t:'boxAct',a})}
function boxAction(who,a){if(!box||box.winner)return;let f=who==='host'?box.h:box.g,o=who==='host'?box.g:box.h,dist=Math.abs(f.x-o.x);if(f.attackT>0)return;if(a==='block'){f.block=.85;f.attack='block';f.attackT=.72;return}let dmg=a==='hook'?18:9,range=a==='hook'?125:145,cool=a==='hook'?.75:.38;f.attack=a;f.attackT=cool;if(dist<=range){let actual=o.block>0?Math.max(2,Math.round(dmg*.25)):dmg;o.hp=Math.max(0,o.hp-actual);if(o.hp<=0){box.winner=who;state.winner=who;sync()}}}
function boxLoop(t=performance.now()){if(role!=='host'||state.type!=='boxing'||!box)return;let dt=Math.min(.035,(t-boxLast)/1000||.016);boxLast=t;let speed=170;if(!box.winner){moveF(box.h,boxMyDir,speed,dt,60,340);moveF(box.g,boxGuestDir,speed,dt,380,660);let min=112;if(box.g.x-box.h.x<min){let mid=(box.g.x+box.h.x)/2;box.h.x=mid-min/2;box.g.x=mid+min/2}tickF(box.h,dt);tickF(box.g,dt)}drawBox();if(t-boxSend>45){direct({t:'boxSnap',s:box});boxSend=t}boxFrame=requestAnimationFrame(boxLoop)}
function moveF(f,dir,s,dt,min,max){if(f.attackT>0&&f.attack!=='block')dir*=.3;f.x=Math.max(min,Math.min(max,f.x+dir*s*dt))}
function tickF(f,dt){f.attackT=Math.max(0,f.attackT-dt);f.block=Math.max(0,f.block-dt);if(f.attackT<=0)f.attack=''}
function drawBox(){if(!boxCtx||!boxCanvas)return;let x=boxCtx;x.clearRect(0,0,720,420);let g=x.createLinearGradient(0,0,0,420);g.addColorStop(0,'#241730');g.addColorStop(1,'#100b16');x.fillStyle=g;x.fillRect(0,0,720,420);x.strokeStyle='#ffffff24';x.lineWidth=5;x.strokeRect(20,40,680,330);x.strokeStyle='#ff6fae55';for(let y of [115,205,295]){x.beginPath();x.moveTo(20,y);x.lineTo(700,y);x.stroke()}x.fillStyle='#ffffff0b';x.fillRect(20,330,680,40);let h=box?.h||{x:190,hp:100},gg=box?.g||{x:530,hp:100};drawFighter(h,'#ff6fae',1);drawFighter(gg,'#9879ff',-1);let hh=$('hpH'),hg=$('hpG');if(hh)hh.style.width=(h.hp||0)+'%';if(hg)hg.style.width=(gg.hp||0)+'%';if(box?.winner){x.fillStyle='#000b';x.fillRect(0,0,720,420);x.fillStyle='#fff';x.textAlign='center';x.font='900 44px system-ui';x.fillText('K.O.!',360,190);x.font='700 24px system-ui';x.fillText((box.winner==='host'?hostName():guestName())+' побеждает',360,235)}}
function drawFighter(f,color,face){let x=boxCtx,bx=f.x,ground=330;let lean=f.attack==='hook'?10*face:0;x.save();x.translate(bx+lean,0);if(face<0)x.scale(-1,1);x.lineCap='round';x.strokeStyle='#d5a17b';x.lineWidth=18;x.beginPath();x.moveTo(0,208);x.lineTo(-22,292);x.moveTo(0,208);x.lineTo(22,292);x.stroke();x.fillStyle=color;x.beginPath();x.roundRect(-35,135,70,92,24);x.fill();x.fillStyle='#d5a17b';x.beginPath();x.arc(0,112,29,0,Math.PI*2);x.fill();x.fillStyle='#30202a';x.beginPath();x.arc(0,100,29,Math.PI,Math.PI*2);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(9,112,3,0,Math.PI*2);x.fill();let front=f.attack==='jab'?82:f.attack==='hook'?72:45,fy=f.attack==='hook'?145:156;if(f.attack==='block'){front=29;fy=114}x.strokeStyle='#d5a17b';x.lineWidth=14;x.beginPath();x.moveTo(20,150);x.lineTo(front,fy);x.moveTo(-20,150);x.lineTo(f.attack==='block'?15:-44,f.attack==='block'?128:163);x.stroke();x.fillStyle='#f04455';x.beginPath();x.arc(front,fy,17,0,Math.PI*2);x.fill();x.beginPath();x.arc(f.attack==='block'?15:-44,f.attack==='block'?128:163,17,0,Math.PI*2);x.fill();x.restore()}
(function boxStyle(){if(document.getElementById('boxStyle'))return;let s=document.createElement('style');s.id='boxStyle';s.textContent=`.boxCanvas{width:100%;display:block;border-radius:20px;border:1px solid #ffffff18;background:#15101d;touch-action:none}.boxHud{display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:center;margin:4px 0 12px}.boxHud>div{text-align:left}.boxHud>div:last-child{text-align:right}.boxHud small{display:block;color:var(--muted);margin-bottom:5px}.hp{height:12px;border-radius:99px;background:#ffffff10;overflow:hidden;border:1px solid #ffffff16}.hp i{display:block;width:100%;height:100%;background:linear-gradient(90deg,#54dc93,#e9d34d,#ff596d);transition:width .15s}.boxStatus{margin:10px 0;color:var(--muted)}.fightButtons{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;max-width:560px;margin:10px auto}.fight{border:1px solid #ffffff1c;color:#fff;padding:14px 8px;border-radius:16px;font-weight:850;touch-action:manipulation}.fight.jab{background:#ff6fae20}.fight.hook{background:#ff8a4a24}.fight.block{background:#9879ff20}@media(max-width:520px){.fightButtons{grid-template-columns:1fr 1fr}.fight.block{grid-column:1/-1}}`;document.head.appendChild(s)})();
