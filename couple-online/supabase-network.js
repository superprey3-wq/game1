// v9 cloud transport: Supabase Realtime Broadcast instead of direct WebRTC
const CLOUD_URL='https://ksnmwgsjxsdqlxvieaih.supabase.co';
const CLOUD_KEY='sb_publishable_aHzNY3-kTSt_-GQBMCSQVg_WW0vp-1O';
const cloudClient=window.supabase?.createClient(CLOUD_URL,CLOUD_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},realtime:{params:{eventsPerSecond:100}}});
let cloudChannel=null,cloudReady=false,cloudClientId=(crypto.randomUUID?.()||Math.random().toString(36).slice(2)),cloudHelloTimer=0,cloudJoinTimer=0;
const _cloudHandle=handleMessage,_cloudRenderLobby=renderLobby;

function cloudCleanup(){
 clearInterval(cloudHelloTimer);clearTimeout(cloudJoinTimer);cloudHelloTimer=cloudJoinTimer=0;cloudReady=false;
 if(cloudChannel&&cloudClient){try{cloudClient.removeChannel(cloudChannel)}catch(e){}}
 cloudChannel=null;connected=false;
}
function cloudSend(data,to){
 if(!cloudChannel||!cloudReady)return false;
 cloudChannel.send({type:'broadcast',event:'room-msg',payload:{from:cloudClientId,to:to||((role==='host')?'guest':'host'),data,ts:Date.now()}}).catch?.(()=>{});
 return true;
}
function send(o){return cloudSend(o)}
if(typeof direct!=='undefined')direct=function(o){return cloudSend(o)};

function cloudIncoming(env){
 if(!env||env.from===cloudClientId)return;
 if(env.to&&env.to!=='all'&&env.to!==role)return;
 const m=env.data;if(!m||typeof m!=='object')return;
 if(role==='host'&&m.t==='hello'){
   connected=true;otherName=String(m.name||'Игрок 2').slice(0,24);renderLobby();
 }
 if(role==='guest'&&m.t==='welcome'){
   connected=true;clearInterval(cloudHelloTimer);clearTimeout(cloudJoinTimer);renderLobby();
 }
 _cloudHandle(m);
}
function cloudPresenceSync(){
 if(!cloudChannel)return;
 const ps=cloudChannel.presenceState?.()||{};let partner=false;
 Object.values(ps).flat().forEach(p=>{if(p&&p.id!==cloudClientId&&p.role&&p.role!==role)partner=true});
 if(!partner&&connected){connected=false;renderLobby();toast('Второй игрок отключился')}
}
function cloudOpen(code,onReady){
 cloudCleanup();
 if(!cloudClient){status('Не загрузился облачный модуль соединения. Обнови страницу.','bad');return}
 cloudChannel=cloudClient.channel('couple:'+code,{config:{broadcast:{self:false,ack:false},presence:{key:cloudClientId}}});
 cloudChannel.on('broadcast',{event:'room-msg'},({payload})=>cloudIncoming(payload));
 cloudChannel.on('presence',{event:'sync'},cloudPresenceSync);
 cloudChannel.subscribe(async st=>{
   if(st==='SUBSCRIBED'){
     cloudReady=true;
     try{await cloudChannel.track({id:cloudClientId,role,name:myName,at:Date.now()})}catch(e){}
     onReady?.();
   } else if(st==='CHANNEL_ERROR'||st==='TIMED_OUT'){
     status('Не удалось подключиться к облачной комнате. Проверяем сеть…','bad');
   } else if(st==='CLOSED'&&cloudReady){
     cloudReady=false;connected=false;renderLobby();status('Связь с облачной комнатой прервалась. Обнови страницу.','bad');
   }
 });
}

createRoom=function(){
 myName=$('nameInput').value.trim()||'Игрок 1';role='host';roomCode=makeCode();otherName='';connected=false;
 status('Создаём облачную комнату…');
 cloudOpen(roomCode,()=>{show('lobbyScreen');renderLobby();status('Комната готова. Отправь ссылку второму человеку.','good')});
};
joinRoom=function(){
 myName=$('nameInput').value.trim()||'Игрок 2';roomCode=cleanCode($('roomInput').value);if(roomCode.length!==6)return status('Введите 6-значный код комнаты.','bad');
 role='guest';otherName='';connected=false;status('Подключаемся к облачной комнате…');
 cloudOpen(roomCode,()=>{
   show('lobbyScreen');renderLobby();
   const hello=()=>{if(!connected)cloudSend({t:'hello',name:myName},'host')};hello();cloudHelloTimer=setInterval(hello,900);
   cloudJoinTimer=setTimeout(()=>{if(!connected){clearInterval(cloudHelloTimer);status('Комната не отвечает. Проверь код и что создатель не закрыл страницу.','bad');let h=$('lobbyHint');if(h)h.textContent='Комната не отвечает. Попроси создателя открыть ссылку заново.'}},12000);
 });
};
renderLobby=function(){
 _cloudRenderLobby();let h=$('lobbyHint');if(!h)return;
 if(connected)h.textContent='Подключено через облачный сервер — VPN, LTE и разные сети не мешают.';
 else if(cloudReady&&role==='host')h.textContent='Облачная комната готова. Отправь ссылку второму человеку.';
 else if(cloudReady&&role==='guest')h.textContent='Ищем создателя комнаты через облачный сервер…';
};

// PeerJS is no longer used for room traffic in v9.
window.addEventListener('beforeunload',()=>{try{cloudChannel?.untrack()}catch(e){};cloudCleanup()});
