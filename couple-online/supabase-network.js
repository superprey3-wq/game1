// v15 cloud transport: Supabase Realtime with race-safe presence + fallback handshake
const CLOUD_URL='https://ksnmwgsjxsdqlxvieaih.supabase.co';
const CLOUD_KEY='sb_publishable_aHzNY3-kTSt_-GQBMCSQVg_WW0vp-1O';
const cloudClient=window.supabase?.createClient(CLOUD_URL,CLOUD_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},realtime:{params:{eventsPerSecond:100}}});
let cloudChannel=null,cloudReady=false,cloudClientId=(crypto.randomUUID?.()||Math.random().toString(36).slice(2));
let cloudHelloTimer=0,cloudJoinTimer=0,cloudDisconnectTimer=0,cloudSawPartner=false,cloudPartnerId='',cloudPartnerName='',cloudPresenceWelcomedFor='',cloudClosing=false;
const _cloudRenderLobby=renderLobby;

function cloudClearTimers(){
 clearInterval(cloudHelloTimer);clearTimeout(cloudJoinTimer);clearTimeout(cloudDisconnectTimer);
 cloudHelloTimer=cloudJoinTimer=cloudDisconnectTimer=0;
}
function cloudCleanup(){
 cloudClearTimers();cloudReady=false;cloudSawPartner=false;cloudPartnerId='';cloudPartnerName='';cloudPresenceWelcomedFor='';
 if(cloudChannel&&cloudClient){try{cloudClient.removeChannel(cloudChannel)}catch(e){}}
 cloudChannel=null;connected=false;
}
function cloudSend(data,to){
 if(!cloudChannel||!cloudReady)return false;
 try{const r=cloudChannel.send({type:'broadcast',event:'room-msg',payload:{from:cloudClientId,to:to||((role==='host')?'guest':'host'),data,ts:Date.now()}});r?.catch?.(()=>{});return true}catch(e){return false}
}
function send(o){return cloudSend(o)}
if(typeof direct!=='undefined')direct=function(o){return cloudSend(o)};

// Compatibility for older game code that still checks conn.open / conn.send.
try{conn={get open(){return !!(cloudReady&&connected)},send:o=>cloudSend(o),close:()=>cloudCleanup(),on:()=>{}}}catch(e){}

function cloudMarkPartner(id,name){
 if(id)cloudPartnerId=String(id);if(name)cloudPartnerName=String(name).slice(0,24);
 cloudSawPartner=true;clearTimeout(cloudDisconnectTimer);cloudDisconnectTimer=0;
}
function cloudIncoming(env){
 if(!env||env.from===cloudClientId)return;
 if(env.to&&env.to!=='all'&&env.to!==role)return;
 const m=env.data;if(!m||typeof m!=='object')return;
 cloudMarkPartner(env.from,m.name||m.hostName||m.guestName||'');
 if(role==='host'&&m.t==='hello'){
   connected=true;otherName=String(m.name||cloudPartnerName||'Игрок 2').slice(0,24);renderLobby();
 }
 if(role==='guest'&&m.t==='welcome'){
   connected=true;clearInterval(cloudHelloTimer);clearTimeout(cloudJoinTimer);cloudHelloTimer=cloudJoinTimer=0;
   if(m.hostName)otherName=String(m.hostName).slice(0,24);renderLobby();
 }
 // Always resolve the latest global handler so upgrade scripts can receive messages.
 handleMessage(m);
}
function cloudFindPartner(){
 if(!cloudChannel)return null;
 const ps=cloudChannel.presenceState?.()||{};
 for(const list of Object.values(ps))for(const p of (Array.isArray(list)?list:[list])){
   if(p&&p.id!==cloudClientId&&p.role&&p.role!==role)return p;
 }
 return null;
}
function cloudPresenceSync(){
 const partner=cloudFindPartner();
 if(partner){
   cloudMarkPartner(partner.id,partner.name);
   if(partner.name)otherName=String(partner.name).slice(0,24);
   if(role==='guest'){
     // Presence itself proves the host exists; repeat hello until welcome arrives.
     if(!connected)cloudSend({t:'hello',name:myName},'host');
   }else if(role==='host'&&!connected){
     // Fallback handshake: do not rely on the very first broadcast arriving.
     connected=true;renderLobby();
     if(cloudPresenceWelcomedFor!==String(partner.id||'')){
       cloudPresenceWelcomedFor=String(partner.id||'');
       handleMessage({t:'hello',name:String(partner.name||'Игрок 2').slice(0,24)});
     }
   }
   return;
 }
 // Presence can briefly report only yourself while peers are joining/reconnecting.
 // Never disconnect immediately; confirm the absence after a grace period.
 if(cloudSawPartner&&connected&&!cloudDisconnectTimer){
   cloudDisconnectTimer=setTimeout(()=>{
     cloudDisconnectTimer=0;
     const stillMissing=!cloudFindPartner();
     if(stillMissing&&connected){connected=false;renderLobby();toast('Связь со вторым игроком потеряна — ждём переподключение')}
   },5000);
 }
}
function cloudOpen(code,onReady){
 cloudCleanup();cloudClosing=false;
 if(!cloudClient){status('Не загрузился облачный модуль соединения. Обнови страницу.','bad');return}
 cloudChannel=cloudClient.channel('couple:'+code,{config:{broadcast:{self:false,ack:false},presence:{key:cloudClientId}}});
 cloudChannel.on('broadcast',{event:'room-msg'},({payload})=>cloudIncoming(payload));
 cloudChannel.on('presence',{event:'sync'},cloudPresenceSync);
 cloudChannel.subscribe(async st=>{
   if(st==='SUBSCRIBED'){
     cloudReady=true;
     try{await cloudChannel.track({id:cloudClientId,role,name:myName,at:Date.now()})}catch(e){}
     onReady?.();
     // One extra presence check after track closes the subscribe/track race.
     setTimeout(cloudPresenceSync,120);
   } else if(st==='CHANNEL_ERROR'||st==='TIMED_OUT'){
     status('Не удалось подключиться к облачной комнате. Повторите через секунду или обновите страницу.','bad');
   } else if(st==='CLOSED'&&!cloudClosing){
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
   const hello=()=>{if(!connected)cloudSend({t:'hello',name:myName},'host')};hello();cloudHelloTimer=setInterval(hello,700);
   cloudJoinTimer=setTimeout(()=>{if(!connected){clearInterval(cloudHelloTimer);cloudHelloTimer=0;let h=$('lobbyHint');if(h)h.textContent='Комната пока не отвечает. Убедитесь, что создатель держит страницу открытой, и попробуйте ещё раз.'}},20000);
 });
};
renderLobby=function(){
 _cloudRenderLobby();let h=$('lobbyHint');if(!h)return;
 if(connected)h.textContent='Подключено через облачный сервер — оба игрока в комнате.';
 else if(cloudReady&&role==='host')h.textContent='Облачная комната готова. Отправь ссылку второму человеку.';
 else if(cloudReady&&role==='guest')h.textContent='Ищем создателя комнаты через облачный сервер…';
};

document.addEventListener('visibilitychange',()=>{
 if(document.visibilityState==='visible'&&cloudChannel&&cloudReady){
   try{cloudChannel.track({id:cloudClientId,role,name:myName,at:Date.now()})}catch(e){}
   if(role==='guest'&&!connected)cloudSend({t:'hello',name:myName},'host');
   setTimeout(cloudPresenceSync,100);
 }
});
window.addEventListener('beforeunload',()=>{cloudClosing=true;try{cloudChannel?.untrack()}catch(e){};cloudCleanup()});
