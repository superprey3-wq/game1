let peer,conn,role,myName='',otherName='',roomCode='',connected=false;
let joinAttempt=0,joinTimer=0,reconnectTimer=0;
let state={screen:'menu',type:null,idx:0,answers:{host:null,guest:null},reveal:false,matches:0,done:false};
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PEER_OPTIONS={host:'0.peerjs.com',port:443,path:'/',secure:true,debug:1,pingInterval:5000,config:{iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'},{urls:'stun:stun.cloudflare.com:3478'},{urls:'stun:stun.relay.metered.ca:80'}],sdpSemantics:'unified-plan',iceCandidatePoolSize:6}};
function show(id){document.querySelectorAll('.screen').forEach(x=>x.classList.remove('active'));$(id).classList.add('active')}
function toast(t){$('toast').textContent=t;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),2200)}
function status(t,k=''){$('setupStatus').textContent=t;$('setupStatus').className='status show '+k}
function connHint(t){let x=$('lobbyHint');if(x)x.textContent=t;status(t,'bad')}
function cleanCode(v){return String(v||'').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6)}
function makeCode(){const a='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';return Array.from({length:6},()=>a[Math.floor(Math.random()*a.length)]).join('')}
function peerErrorText(e){let t=e?.type||'network';return({network:'Нет связи с сервером комнат. Проверь интернет или открой ссылку в Chrome/Safari.',socket:'Соединение с сервером комнат оборвалось.', 'socket-error':'Ошибка сети при создании комнаты.', 'socket-closed':'Сервер комнат закрыл соединение.', 'peer-unavailable':'Комната пока не найдена. Проверяем ещё раз…',webrtc:'Телефоны видят комнату, но WebRTC-соединение не проходит через сеть.', 'browser-incompatible':'Этот браузер не поддерживает нужное соединение. Открой ссылку в Chrome или Safari.'}[t]||('Ошибка подключения: '+t))}
function makePeer(id){
 clearTimeout(reconnectTimer);try{peer?.destroy()}catch(e){};connected=false;
 if(typeof Peer==='undefined'){status('Не загрузился модуль соединения. Обнови страницу или открой её в Chrome/Safari.','bad');return null}
 peer=id?new Peer(id,PEER_OPTIONS):new Peer(undefined,PEER_OPTIONS);
 peer.on('error',e=>{
   if(e.type==='unavailable-id'&&role==='host'){roomCode=makeCode();startHost();return}
   if(role==='guest'&&e.type==='peer-unavailable'&&joinAttempt<5){status('Комната ещё не ответила — повторяем подключение…');clearTimeout(joinTimer);joinTimer=setTimeout(connectGuest,1200);return}
   connHint(peerErrorText(e));
 });
 peer.on('disconnected',()=>{if(peer&&!peer.destroyed){clearTimeout(reconnectTimer);reconnectTimer=setTimeout(()=>{try{peer.reconnect()}catch(e){}},1200)}});
 return peer;
}
function createRoom(){myName=$('nameInput').value.trim()||'Игрок 1';role='host';roomCode=makeCode();joinAttempt=0;startHost()}
function startHost(){status('Создаём комнату…');if(!makePeer('duo-'+roomCode))return;peer.on('open',()=>{renderLobby();show('lobbyScreen')});peer.on('connection',c=>{if(conn?.open){c.close();return}conn=c;bindConnection(c)})}
function joinRoom(){myName=$('nameInput').value.trim()||'Игрок 2';roomCode=cleanCode($('roomInput').value);if(roomCode.length!==6)return status('Введите 6-значный код комнаты.','bad');role='guest';joinAttempt=0;status('Подключаемся к комнате…');if(!makePeer())return;peer.on('open',connectGuest)}
function connectGuest(){
 if(connected||!peer||peer.destroyed)return;joinAttempt++;clearTimeout(joinTimer);try{if(conn&&!conn.open)conn.close()}catch(e){}
 status('Подключение к комнате… попытка '+joinAttempt+'/5');
 conn=peer.connect('duo-'+roomCode,{reliable:true,serialization:'json'});bindConnection(conn);
 joinTimer=setTimeout(()=>{if(!connected){try{conn?.close()}catch(e){};if(joinAttempt<5)connectGuest();else connHint('Не удалось связать телефоны. Откройте сайт в обычном Chrome/Safari (не во встроенном браузере Telegram/Instagram) и попробуйте одному переключиться между Wi‑Fi и мобильным интернетом.')}} ,4500);
}
function bindConnection(c){
 c.on('open',()=>{if(c!==conn)return;clearTimeout(joinTimer);connected=true;joinAttempt=0;if(role==='guest'){send({t:'hello',name:myName});renderLobby();show('lobbyScreen')}else renderLobby()});
 c.on('data',handleMessage);
 c.on('error',e=>{if(c===conn&&!connected)connHint('Ошибка прямого соединения: '+(e?.type||'WebRTC'))});
 c.on('close',()=>{if(c!==conn)return;connected=false;renderLobby();if(role==='guest'&&peer?.open&&joinAttempt<5){toast('Связь прервалась — переподключаемся');setTimeout(connectGuest,900)}else toast('Второй игрок отключился')})
}
function send(o){if(conn?.open)conn.send(o)}
function handleMessage(m){if(!m||typeof m!=='object')return;if(role==='host'){if(m.t==='hello'){otherName=String(m.name||'Игрок 2').slice(0,24);send({t:'welcome',hostName:myName,guestName:otherName,roomCode});sync();show('menuScreen');renderMenu()}else if(m.t==='act')applyAction(m.a,m.v,'guest')}else{if(m.t==='welcome'){otherName=String(m.hostName||'Игрок 1');roomCode=m.roomCode||roomCode;show('menuScreen');renderMenu()}else if(m.t==='state'){state=m.state;otherName=m.hostName||otherName;renderFromState()}}}
function sync(){if(role==='host')send({t:'state',state,hostName:myName,guestName:otherName})}
function actor(){return role==='host'?'host':'guest'}
function dispatch(a,v){if(!connected)return toast('Сначала дождитесь второго игрока');if(role==='host')applyAction(a,v,'host');else send({t:'act',a,v})}
function renderLobby(){$('roomCodeView').textContent=roomCode;$('hostNameView').textContent=role==='host'?myName:(otherName||'Игрок 1');$('guestNameView').textContent=role==='guest'?myName:(otherName||'Ожидаем…');$('connDot').className='dot'+(connected?' on':'');$('connText').textContent=connected?'Второй игрок подключён':'Ожидаем второго игрока';$('lobbyHint').textContent=connected?'Готово! Открываем меню.':'Отправь ссылку второму человеку. Лучше открывать её в Chrome или Safari.'}
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
window.addEventListener('beforeunload',()=>{clearTimeout(joinTimer);clearTimeout(reconnectTimer);try{peer?.destroy()}catch(e){}});
(function(){let h=location.hash.match(/join=([A-Z0-9]{6})/i);if(h){$('roomInput').value=cleanCode(h[1]);status('Код из приглашения уже вставлен. Введи имя и нажми «Присоединиться».','good')}})();