// v8 network reliability: TURN relay fallback for LTE / VPN / CGNAT
const RELAY_ICE_SERVERS=[
 {urls:'stun:stun.l.google.com:19302'},
 {urls:'stun:stun1.l.google.com:19302'},
 {urls:'stun:stun.cloudflare.com:3478'},
 {urls:'stun:openrelay.metered.ca:80'},
 {urls:'turn:openrelay.metered.ca:80',username:'openrelayproject',credential:'openrelayproject'},
 {urls:'turn:openrelay.metered.ca:80?transport=tcp',username:'openrelayproject',credential:'openrelayproject'},
 {urls:'turn:openrelay.metered.ca:443',username:'openrelayproject',credential:'openrelayproject'},
 {urls:'turn:openrelay.metered.ca:443?transport=tcp',username:'openrelayproject',credential:'openrelayproject'},
 {urls:'turns:openrelay.metered.ca:443',username:'openrelayproject',credential:'openrelayproject'}
];
const RELAY_PEER_OPTIONS={host:'0.peerjs.com',port:443,path:'/',secure:true,debug:1,pingInterval:5000,config:{iceServers:RELAY_ICE_SERVERS,iceTransportPolicy:'all',bundlePolicy:'balanced',sdpSemantics:'unified-plan',iceCandidatePoolSize:10}};
let connectionPath='';

makePeer=function(id){
 clearTimeout(reconnectTimer);try{peer?.destroy()}catch(e){};connected=false;connectionPath='';
 if(typeof Peer==='undefined'){status('Не загрузился модуль соединения. Обнови страницу или открой её в Chrome/Safari.','bad');return null}
 peer=id?new Peer(id,RELAY_PEER_OPTIONS):new Peer(undefined,RELAY_PEER_OPTIONS);
 peer.on('error',e=>{
   if(e.type==='unavailable-id'&&role==='host'){roomCode=makeCode();startHost();return}
   if(role==='guest'&&e.type==='peer-unavailable'&&joinAttempt<5){status('Комната ещё не ответила — повторяем подключение…');clearTimeout(joinTimer);joinTimer=setTimeout(connectGuest,900);return}
   if(role==='guest'&&e.type==='webrtc'&&joinAttempt<5){status('Прямой маршрут не прошёл — пробуем TURN-relay…');clearTimeout(joinTimer);joinTimer=setTimeout(connectGuest,900);return}
   connHint(peerErrorText(e));
 });
 peer.on('disconnected',()=>{if(peer&&!peer.destroyed){clearTimeout(reconnectTimer);reconnectTimer=setTimeout(()=>{try{peer.reconnect()}catch(e){}},900)}});
 return peer;
};

async function detectConnectionPath(c){
 try{
   const pc=c?.peerConnection;if(!pc||!pc.getStats)return;
   const stats=await pc.getStats();let pair=null;
   stats.forEach(r=>{if(r.type==='candidate-pair'&&r.state==='succeeded'&&(r.nominated||r.selected))pair=r});
   if(!pair)return;
   const local=stats.get(pair.localCandidateId),remote=stats.get(pair.remoteCandidateId);
   const relay=(local?.candidateType==='relay'||remote?.candidateType==='relay');
   connectionPath=relay?'relay':'direct';
   const hint=$('lobbyHint');
   if(hint)hint.textContent=relay?'Подключено через TURN-relay — подходит для VPN/LTE.':'Подключено напрямую. TURN-relay включится автоматически, если сеть станет строже.';
 }catch(e){}
}

bindConnection=function(c){
 c.on('open',()=>{if(c!==conn)return;clearTimeout(joinTimer);connected=true;joinAttempt=0;if(role==='guest'){send({t:'hello',name:myName});renderLobby();show('lobbyScreen')}else renderLobby();setTimeout(()=>detectConnectionPath(c),700)});
 c.on('data',handleMessage);
 c.on('error',e=>{if(c!==conn)return;let type=e?.type||e?.message||'WebRTC';if(!connected&&role==='guest'&&joinAttempt<5){status('Сеть не пустила прямое соединение — повторяем через relay…');clearTimeout(joinTimer);joinTimer=setTimeout(connectGuest,800)}else if(!connected)connHint('Ошибка соединения: '+type)});
 c.on('close',()=>{if(c!==conn)return;connected=false;connectionPath='';renderLobby();if(role==='guest'&&peer?.open&&joinAttempt<5){toast('Связь прервалась — переподключаемся через доступный маршрут');setTimeout(connectGuest,700)}else toast('Второй игрок отключился')})
};

const _relayRenderLobby=renderLobby;
renderLobby=function(){_relayRenderLobby();if(connected&&connectionPath){let h=$('lobbyHint');if(h)h.textContent=connectionPath==='relay'?'Подключено через TURN-relay — VPN/LTE не мешают.':'Подключено напрямую; TURN-relay готов как запасной маршрут.'}}
