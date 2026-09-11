// v16 cloud transport: resilient Supabase Realtime for mobile browsers
const CLOUD_URL='https://ksnmwgsjxsdqlxvieaih.supabase.co';
const CLOUD_KEY='sb_publishable_aHzNY3-kTSt_-GQBMCSQVg_WW0vp-1O';
const cloudClient=window.supabase?.createClient(CLOUD_URL,CLOUD_KEY,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false},realtime:{params:{eventsPerSecond:100}}});
let cloudChannel=null,cloudReady=false,cloudClientId=(crypto.randomUUID?.()||Math.random().toString(36).slice(2));
let cloudHelloTimer=0,cloudJoinTimer=0,cloudDisconnectTimer=0,cloudBeaconTimer=0,cloudWatchdogTimer=0,cloudReopenTimer=0;
let cloudSawPartner=false,cloudPartnerId='',cloudPartnerName='',cloudClosing=false,cloudOpening=false,cloudGeneration=0,cloudLastWelcomeAt=0;
const _cloudRenderLobby=renderLobby;

function cloudClearSessionTimers(){
 clearInterval(cloudHelloTimer);clearTimeout(cloudJoinTimer);clearTimeout(cloudDisconnectTimer);clearInterval(cloudBeaconTimer);
 cloudHelloTimer=cloudJoinTimer=cloudDisconnectTimer=cloudBeaconTimer=0;
}
function cloudClearAllTimers(){
 cloudClearSessionTimers();clearInterval(cloudWatchdogTimer);clearTimeout(cloudReopenTimer);cloudWatchdogTimer=cloudReopenTimer=0;
}
function cloudCleanup(){
 cloudClearAllTimers();cloudReady=false;cloudOpening=false;cloudSawPartner=false;cloudPartnerId='';cloudPartnerName='';cloudLastWelcomeAt=0;
 const old=cloudChannel;cloudChannel=null;cloudGeneration++;
 if(old&&cloudClient){try{cloudClient.removeChannel(old)}catch(e){}}
 connected=false;
}
function cloudSend(data,to){
 if(!cloudChannel||!cloudReady)return false;
 try{
   const r=cloudChannel.send({type:'broadcast',event:'room-msg',payload:{from:cloudClientId,to:to||((role==='host')?'guest':'host'),data,ts:Date.now()}});
   r?.catch?.(()=>{});return true
 }catch(e){return false}
}
function send(o){return cloudSend(o)}
if(typeof direct!=='undefined')direct=function(o){return cloudSend(o)};
try{conn={get open(){return !!(cloudReady&&connected)},send:o=>cloudSend(o),close:()=>cloudCleanup(),on:()=>{}}}catch(e){}

function cloudMarkPartner(id,name){
 if(id)cloudPartnerId=String(id);if(name)cloudPartnerName=String(name).slice(0,24);
 cloudSawPartner=true;clearTimeout(cloudDisconnectTimer);cloudDisconnectTimer=0;
}
function cloudHostAccept(name,id,force=false){
 if(role!=='host')return;
 const now=Date.now(),partnerName=String(name||cloudPartnerName||'Игрок 2').slice(0,24),partnerId=String(id||cloudPartnerId||'');
 cloudMarkPartner(partnerId,partnerName);otherName=partnerName;
 const first=!connected;connected=true;
 if(first)renderLobby();
 if(force||first||partnerId!==cloudPartnerId||now-cloudLastWelcomeAt>2500){
   cloudLastWelcomeAt=now;
   cloudSend({t:'welcome',hostName:myName,guestName:otherName,roomCode},'guest');
   try{sync()}catch(e){}
   if(first){try{renderFromState()}catch(e){show('menuScreen');renderMenu()}}
 }
}
function cloudGuestAccept(m){
 if(role!=='guest')return;
 connected=true;cloudMarkPartner(cloudPartnerId,m?.hostName||cloudPartnerName||'Игрок 1');
 if(m?.hostName)otherName=String(m.hostName).slice(0,24);
 clearInterval(cloudHelloTimer);clearTimeout(cloudJoinTimer);cloudHelloTimer=cloudJoinTimer=0;
 renderLobby();
 try{renderFromState()}catch(e){show('menuScreen');renderMenu()}
}
function cloudIncoming(env){
 if(!env||env.from===cloudClientId)return;
 if(env.to&&env.to!=='all'&&env.to!==role)return;
 const m=env.data;if(!m||typeof m!=='object')return;
 if(m.role&&m.role===role)return;
 cloudMarkPartner(env.from,m.name||m.hostName||m.guestName||'');
 if(m.t==='cloudBeacon'){
   if(m.name)otherName=String(m.name).slice(0,24);
   if(role==='host'&&m.role==='guest')cloudHostAccept(m.name,env.from);
   else if(role==='guest'&&m.role==='host'&&!connected)cloudSend({t:'hello',name:myName},'host');
   return;
 }
 if(role==='host'&&m.t==='hello'){
   cloudHostAccept(m.name,env.from,true);return;
 }
 if(role==='guest'&&m.t==='welcome'){
   cloudGuestAccept(m);return;
 }
 // Resolve the latest global handler so all game-upgrade scripts receive their messages.
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
   if(role==='host')cloudHostAccept(partner.name,partner.id);
   else if(role==='guest'&&!connected)cloudSend({t:'hello',name:myName},'host');
   return;
 }
 if(cloudSawPartner&&connected&&!cloudDisconnectTimer){
   cloudDisconnectTimer=setTimeout(()=>{
     cloudDisconnectTimer=0;
     if(!cloudFindPartner()&&connected){connected=false;renderLobby();toast('Связь со вторым игроком потеряна — переподключаемся')}
   },7000);
 }
}
function cloudStartHello(){
 clearInterval(cloudHelloTimer);clearTimeout(cloudJoinTimer);
 const hello=()=>{if(role==='guest'&&!connected&&cloudReady)cloudSend({t:'hello',name:myName},'host')};
 hello();cloudHelloTimer=setInterval(hello,850);
 cloudJoinTimer=setTimeout(()=>{
   if(!connected){let h=$('lobbyHint');if(h)h.textContent='Создатель комнаты пока не в сети. Оставь эту страницу открытой — подключение произойдёт автоматически, когда он вернётся.'}
 },12000);
}
function cloudStartBeacon(){
 clearInterval(cloudBeaconTimer);
 const beat=()=>{if(cloudReady&&roomCode&&role)cloudSend({t:'cloudBeacon',role,name:myName,roomCode},'all')};
 beat();cloudBeaconTimer=setInterval(beat,1000);
}
function cloudChannelState(){return String(cloudChannel?.state||'').toLowerCase()}
function cloudStartWatchdog(){
 clearInterval(cloudWatchdogTimer);
 cloudWatchdogTimer=setInterval(()=>{
   if(cloudClosing||!roomCode||!role||document.visibilityState==='hidden')return;
   const st=cloudChannelState();
   if(!cloudChannel||!cloudReady||st==='closed'||st==='errored')cloudScheduleReopen(150);
   else{
     try{cloudChannel.track({id:cloudClientId,role,name:myName,at:Date.now()})}catch(e){}
     cloudSend({t:'cloudBeacon',role,name:myName,roomCode},'all');cloudPresenceSync();
   }
 },2500);
}
function cloudScheduleReopen(delay=250){
 if(cloudClosing||cloudOpening||!roomCode||!role)return;
 clearTimeout(cloudReopenTimer);
 cloudReopenTimer=setTimeout(()=>{
   cloudReopenTimer=0;if(cloudClosing||cloudOpening)return;
   const st=cloudChannelState();
   if(cloudChannel&&cloudReady&&(st==='joined'||st==='joining')){
     try{cloudChannel.track({id:cloudClientId,role,name:myName,at:Date.now()})}catch(e){}
     cloudStartBeacon();if(role==='guest'&&!connected)cloudStartHello();cloudPresenceSync();return;
   }
   cloudOpen(roomCode,()=>{
     if(role==='guest'&&!connected)cloudStartHello();
     cloudStartBeacon();cloudStartWatchdog();renderLobby();
   },true);
 },delay);
}
function cloudOpen(code,onReady,resume=false){
 const old=cloudChannel,gen=++cloudGeneration;
 cloudOpening=true;cloudReady=false;clearTimeout(cloudDisconnectTimer);cloudDisconnectTimer=0;
 if(old&&cloudClient){try{cloudClient.removeChannel(old)}catch(e){}}
 cloudChannel=null;
 if(!cloudClient){cloudOpening=false;status('Не загрузился облачный модуль соединения. Обнови страницу.','bad');return}
 const ch=cloudClient.channel('couple:'+code,{config:{broadcast:{self:false,ack:false},presence:{key:cloudClientId}}});cloudChannel=ch;
 ch.on('broadcast',{event:'room-msg'},({payload})=>{if(gen===cloudGeneration&&ch===cloudChannel)cloudIncoming(payload)});
 ch.on('presence',{event:'sync'},()=>{if(gen===cloudGeneration&&ch===cloudChannel)cloudPresenceSync()});
 ch.subscribe(async st=>{
   if(gen!==cloudGeneration||ch!==cloudChannel)return;
   if(st==='SUBSCRIBED'){
     cloudOpening=false;cloudReady=true;
     try{await ch.track({id:cloudClientId,role,name:myName,at:Date.now()})}catch(e){}
     cloudStartBeacon();cloudStartWatchdog();onReady?.();setTimeout(cloudPresenceSync,150);
   }else if(st==='CHANNEL_ERROR'||st==='TIMED_OUT'){
     cloudOpening=false;cloudReady=false;
     if(!resume)status('Не удалось подключиться к облачной комнате. Переподключаемся…','bad');
     cloudScheduleReopen(700);
   }else if(st==='CLOSED'&&!cloudClosing){
     cloudOpening=false;cloudReady=false;connected=false;renderLobby();cloudScheduleReopen(350);
   }
 });
}

createRoom=function(){
 myName=$('nameInput').value.trim()||'Игрок 1';role='host';roomCode=makeCode();otherName='';connected=false;cloudSawPartner=false;
 status('Создаём облачную комнату…');
 cloudOpen(roomCode,()=>{show('lobbyScreen');renderLobby();status('Комната готова. Отправь ссылку второму человеку.','good')});
};
joinRoom=function(){
 myName=$('nameInput').value.trim()||'Игрок 2';roomCode=cleanCode($('roomInput').value);if(roomCode.length!==6)return status('Введите 6-значный код комнаты.','bad');
 role='guest';otherName='';connected=false;cloudSawPartner=false;status('Подключаемся к облачной комнате…');
 cloudOpen(roomCode,()=>{show('lobbyScreen');renderLobby();cloudStartHello()});
};
renderLobby=function(){
 _cloudRenderLobby();let h=$('lobbyHint');if(!h)return;
 if(connected)h.textContent='Подключено через облачный сервер — оба игрока в комнате.';
 else if(cloudReady&&role==='host')h.textContent='Облачная комната готова. Отправь ссылку второму человеку.';
 else if(cloudReady&&role==='guest')h.textContent='Ищем создателя комнаты через облачный сервер…';
};

function cloudWake(){
 if(cloudClosing||!roomCode||!role)return;
 if(document.visibilityState!=='hidden')cloudScheduleReopen(80);
}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')cloudWake()});
window.addEventListener('focus',cloudWake);
window.addEventListener('pageshow',cloudWake);
window.addEventListener('online',cloudWake);
window.addEventListener('beforeunload',()=>{cloudClosing=true;try{cloudChannel?.untrack()}catch(e){};cloudCleanup()});
