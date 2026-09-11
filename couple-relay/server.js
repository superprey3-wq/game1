import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['https://superprey3-wq.github.io'],
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling'],
  pingInterval: 10000,
  pingTimeout: 20000,
  maxHttpBufferSize: 1e6
});

const rooms = new Map();

app.get('/', (_req, res) => res.json({ ok: true, service: 'couple-relay' }));
app.get('/health', (_req, res) => res.json({ ok: true, rooms: rooms.size, time: Date.now() }));

function roomSnapshot(code) {
  const room = rooms.get(code);
  if (!room) return null;
  return {
    code,
    players: [...room.players.values()].map(p => ({ id: p.id, role: p.role, name: p.name })),
    hostId: room.hostId || null
  };
}

function leaveRoom(socket) {
  const code = socket.data.roomCode;
  if (!code) return;
  const room = rooms.get(code);
  if (!room) return;
  room.players.delete(socket.id);
  if (room.hostId === socket.id) room.hostId = null;
  socket.leave(code);
  socket.data.roomCode = null;
  if (room.players.size === 0) {
    rooms.delete(code);
    return;
  }
  io.to(code).emit('presence', roomSnapshot(code));
  io.to(code).emit('peer-left');
}

io.on('connection', socket => {
  socket.emit('relay-ready', { id: socket.id, transport: socket.conn.transport.name });

  socket.on('create-room', ({ code, name }, ack = () => {}) => {
    code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    if (code.length !== 6) return ack({ ok: false, error: 'bad-code' });
    leaveRoom(socket);
    if (rooms.has(code) && rooms.get(code).players.size > 0) return ack({ ok: false, error: 'room-exists' });
    const room = { hostId: socket.id, players: new Map() };
    room.players.set(socket.id, { id: socket.id, role: 'host', name: String(name || 'Игрок 1').slice(0, 24) });
    rooms.set(code, room);
    socket.data.roomCode = code;
    socket.join(code);
    ack({ ok: true, role: 'host', room: roomSnapshot(code) });
    io.to(code).emit('presence', roomSnapshot(code));
  });

  socket.on('join-room', ({ code, name }, ack = () => {}) => {
    code = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    const room = rooms.get(code);
    if (!room) return ack({ ok: false, error: 'not-found' });
    if (room.players.size >= 2) return ack({ ok: false, error: 'full' });
    leaveRoom(socket);
    room.players.set(socket.id, { id: socket.id, role: 'guest', name: String(name || 'Игрок 2').slice(0, 24) });
    socket.data.roomCode = code;
    socket.join(code);
    ack({ ok: true, role: 'guest', room: roomSnapshot(code) });
    io.to(code).emit('presence', roomSnapshot(code));
    io.to(room.hostId).emit('guest-joined', roomSnapshot(code));
  });

  socket.on('relay', payload => {
    const code = socket.data.roomCode;
    if (!code || !rooms.has(code)) return;
    socket.to(code).emit('relay', payload);
  });

  socket.on('room-state', payload => {
    const code = socket.data.roomCode;
    if (!code || !rooms.has(code)) return;
    const room = rooms.get(code);
    if (room.hostId !== socket.id) return;
    socket.to(code).emit('room-state', payload);
  });

  socket.on('disconnect', () => leaveRoom(socket));
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`couple-relay listening on ${port}`));
