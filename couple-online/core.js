let peer,conn,role,myName='',otherName='',roomCode='',connected=false;
let state={screen:'menu',type:null,idx:0,answers:{host:null,guest:null},reveal:false,matches:0,done:false};
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function show(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));$(id).classList.add('active')}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),1800)}
function status(t,k=''){$('setupStatus').textContent=t;$('setupStatus').className='status show '+k}
function cleanCode(v){return String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6)}
function makeCode(){const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';return Array.from({length:6},()=>a[Math.floor(Math.random()*a.length)]).join('')}
function makePeer(id){try{peer?.destroy()}catch(e){};peer=new Peer(id,{debug:0});peer.on('error',e=>{if(e.type==='unavailable-id'&&role==='host'){roomCode=makeCode();startHost();return}status('Ошибка подключения: '+(e.type||'сеть'),'bad')})}
function createRoom(){myName=$('nameInput').value.trim()||'Игрок 1';role='host';roomCode=makeCode();startHost()}
function startHost(){status('Создаём комнату…');makePeer('duo-'+roomCode);peer.on('open',()=>{renderLobby();show('lobbyScreen')});peer.on('connection',c=>{if(conn?.open){c.close();return}conn=c;bindConnection()})}
function joinRoom(){myName=$('nameInput').value.trim()||'Игрок 2';roomCode=cleanCode($('roomInput').value);if(roomCode.length!==6)return status('Введите 6-значный код комнаты.','bad');role='guest';status('Подключаемся…');makePeer();peer.on('open',()=>{conn=peer.connect('duo-'+roomCode,{reliable:true});bindConnection();setTimeout(()=>{if(!connected)status('Комната не отвечает. Проверь код и попроси создателя не закрывать страницу.','bad')},8000)})}
function bindConnection(){conn.on('open',()=>{connected=true;if(role==='guest'){send({t:'hello',name:myName});renderLobby();show('lobbyScreen')}else renderLobby()});conn.on('data',handleMessage);conn.on('close',()=>{connected=false;renderLobby();toast('Второй игрок отключился')})}
function send(o){if(conn?.open)conn.send(o)}
function handleMessage(m){if(!m||typeof m!=='object')return;if(role==='host'){if(m.t==='hello'){otherName=String(m.name||'Игрок 2').slice(0,24);send({t:'welcome',hostName:myName,guestName:otherName,roomCode});sync();show('menuScreen');renderMenu()}else if(m.t==='act')applyAction(m.a,m.v,'guest')}else{if(m.t==='welcome'){otherName=String(m.hostName||'Игрок 1');roomCode=m.roomCode||roomCode;show('menuScreen');renderMenu()}else if(m.t==='state'){state=m.state;otherName=m.hostName||otherName;renderFromState()}}}
function sync(){if(role==='host')send({t:'state',state,hostName:myName,guestName:otherName})}
function actor(){return role==='host'?'host':'guest'}
function dispatch(a,v){if(!connected)return toast('Сначала дождитесь второго игрока');if(role==='host')applyAction(a,v,'host');else send({t:'act',a,v})}
function renderLobby(){$('roomCodeView').textContent=roomCode;$('hostNameView').textContent=role==='host'?myName:(otherName||'Игрок 1');$('guestNameView').textContent=role==='guest'?myName:(otherName||'Ожидаем…');$('connDot').className='dot'+(connected?' on':'');$('connText').textContent=connected?'Второй игрок подключён':'Ожидаем второго игрока';$('lobbyHint').textContent=connected?'Готово! Открываем меню.':'Отправь ссылку второму человеку и не закрывай страницу.'}
function hostName(){return role==='host'?myName:otherName||'Игрок 1'}
function guestName(){return role==='guest'?myName:otherName||'Игрок 2'}
function copyText(t,msg){navigator.clipboard?.writeText(t).then(()=>toast(msg)).catch(()=>prompt('Скопируй:',t))}
function copyCode(){copyText(roomCode,'Код скопирован')}
function copyInvite(){copyText(location.href.split('#')[0]+'#join='+roomCode,'Ссылка скопирована')}
function renderMenu(){$('menuPlayers').textContent=hostName()+' + '+guestName();$('menuCode').textContent=roomCode;$('gamesGrid').innerHTML=GAMES.map(g=>`<button class="tile" onclick="chooseGame('${g[0]}')"><div class="ico">${g[1]}</div><b>${g[2]}</b><span>${g[3]}</span></button>`).join('')}
function chooseGame(t){dispatch('game',t)}
function backMenu(){dispatch('menu')}
function reset(type){state={screen:'game',type,idx:type==='truth'?Math.floor(Math.random()*TRUTH.length):0,answers:{host:null,guest:null},reveal:false,matches:0,done:false}}
function applyAction(a,v,who){if(a==='menu')state={screen:'menu',type:null,idx:0,answers:{host:null,guest:null},reveal:false,matches:0,done:false};else if(a==='game')reset(v);else if(a==='answer'&&!state.reveal&&!state.done){state.answers[who]=v;if(state.answers.host!==null&&state.answers.guest!==null)state.reveal=true}else if(a==='next'){if(state.type==='compat'&&state.reveal&&state.answers.host===state.answers.guest)state.matches++;let len=state.type==='who'?WHO.length:state.type==='would'?WOULD.length:state.type==='compat'?COMPAT.length:state.type==='talk'?TALK.length:TRUTH.length;if(state.type==='truth')state.idx=Math.floor(Math.random()*TRUTH.length);else state.idx++;if(state.type==='compat'&&state.idx>=len)state.done=true;else if(state.idx>=len)state.idx=0;state.answers={host:null,guest:null};state.reveal=false}sync();renderFromState()}
function renderFromState(){if(state.screen==='menu'){show('menuScreen');renderMenu();return}show('gameScreen');$('gameTitle').textContent=TITLES[state.type]||'Игра';renderGame()}
window.addEventListener('beforeunload',()=>{try{peer?.destroy()}catch(e){}});
(function(){let h=location.hash.match(/join=([A-Z0-9]{6})/i);if(h){$('roomInput').value=cleanCode(h[1]);status('Код из приглашения уже вставлен. Введи имя и нажми «Присоединиться».','good')}})();