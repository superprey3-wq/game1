import http from 'node:http';
import { WebSocketServer, WebSocket } from 'ws';

const PORT = Number(process.env.PORT || 8080);
const rooms = new Map();

function cleanCode(v='') {
  return String(v).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
}
function send(ws, obj) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(obj));
  }
}
function closeSafe(ws, code=1000, reason='') {
  try { ws?.close(code, reason); } catch {}
}
function peerOf(room, role) {
  return role === 'host' ? room.guest : room.host;
}
function cleanup(roomCode, role, ws) {
  const room = rooms.get(roomCode);
  if (!room) return;
  if (role === 'host' && room.host === ws) {
    send(room.guest, { t: 'relay-peer-left', role: 'host' });
    closeSafe(room.guest, 4001, 'Host left');
    rooms.delete(roomCode);
    return;
  }
  if (role === 'guest' && room.guest === ws) {
    room.guest = null;
    send(room.host, { t: 'relay-peer-left', role: 'guest' });
    room.updatedAt = Date.now();
  }
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
    res.end(JSON.stringify({ ok: true, rooms: rooms.size, now: Date.now() }));
    return;
  }
  res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
  res.end('Couple Online relay is running.');
});

const wss = new WebSocketServer({ server, maxPayload: 256 * 1024 });

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, 'http://relay.local');
  const roomCode = cleanCode(url.searchParams.get('room'));
  const role = url.searchParams.get('role') === 'host' ? 'host' : 'guest';
  const name = String(url.searchParams.get('name') || '').slice(0, 24);

  if (roomCode.length < 4) {
    send(ws, { t: 'relay-error', code: 'bad-room', message: 'Invalid room code' });
    return closeSafe(ws, 4002, 'Invalid room');
  }

  let room = rooms.get(roomCode);
  if (role === 'host') {
    if (room?.host?.readyState === WebSocket.OPEN) {
      send(ws, { t: 'relay-error', code: 'room-exists', message: 'Room already exists' });
      return closeSafe(ws, 4003, 'Room exists');
    }
    room = { host: ws, guest: null, hostName: name || 'Игрок 1', guestName: '', createdAt: Date.now(), updatedAt: Date.now() };
    rooms.set(roomCode, room);
  } else {
    if (!room?.host || room.host.readyState !== WebSocket.OPEN) {
      send(ws, { t: 'relay-error', code: 'room-not-found', message: 'Room not found' });
      return closeSafe(ws, 4004, 'Room not found');
    }
    if (room.guest?.readyState === WebSocket.OPEN) {
      send(ws, { t: 'relay-error', code: 'room-full', message: 'Room already has two players' });
      return closeSafe(ws, 4005, 'Room full');
    }
    room.guest = ws;
    room.guestName = name || 'Игрок 2';
    room.updatedAt = Date.now();
    send(room.host, { t: 'relay-peer-joined', role: 'guest', name: room.guestName });
  }

  ws._roomCode = roomCode;
  ws._role = role;
  ws._alive = true;
  ws.on('pong', () => { ws._alive = true; });

  send(ws, { t: 'relay-ready', roomCode, role, transport: 'wss' });
  if (role === 'guest') {
    send(ws, { t: 'relay-peer-joined', role: 'host', name: room.hostName });
  }

  ws.on('message', data => {
    if (typeof data !== 'string' && !Buffer.isBuffer(data)) return;
    if (data.length > 256 * 1024) return;
    let msg;
    try { msg = JSON.parse(data.toString()); } catch { return; }
    if (!msg || typeof msg !== 'object') return;
    const currentRoom = rooms.get(roomCode);
    if (!currentRoom) return;
    currentRoom.updatedAt = Date.now();
    const peer = peerOf(currentRoom, role);
    if (peer?.readyState === WebSocket.OPEN) {
      send(peer, { t: 'relay-data', data: msg });
    }
  });

  ws.on('close', () => cleanup(roomCode, role, ws));
  ws.on('error', () => cleanup(roomCode, role, ws));
});

const heartbeat = setInterval(() => {
  for (const ws of wss.clients) {
    if (ws._alive === false) {
      try { ws.terminate(); } catch {}
      continue;
    }
    ws._alive = false;
    try { ws.ping(); } catch {}
  }
  const now = Date.now();
  for (const [code, room] of rooms) {
    if ((!room.host || room.host.readyState !== WebSocket.OPEN) || now - room.updatedAt > 1000 * 60 * 60 * 6) {
      closeSafe(room.host, 4000, 'Room expired');
      closeSafe(room.guest, 4000, 'Room expired');
      rooms.delete(code);
    }
  }
}, 30000);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Couple Online relay listening on ${PORT}`);
});

process.on('SIGTERM', () => {
  clearInterval(heartbeat);
  for (const room of rooms.values()) {
    closeSafe(room.host, 1001, 'Server restarting');
    closeSafe(room.guest, 1001, 'Server restarting');
  }
  server.close(() => process.exit(0));
});
