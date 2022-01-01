import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import socketio, { Server } from 'socket.io';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, SocketData>(server);

const PORT = process.env.PORT || 80;

app.use(express.static('frontend'));

const rooms = [
  'general',
  'music',
  'art',
  'games'
];

io.on('connection', (socket: socketio.Socket) => {
  console.log('a user has connected');

  socket.on('authenticate', async (username: string) => {
    socket.data.username = username;
    await socket.join(rooms[0]);
    socket.emit('authenticate');
    console.log(`${username} logged in.`);
  });

  socket.on('chatMessage', (msg: string) => {
    io.to([...socket.rooms][1]).emit('chatMessage', {
      username: socket.data.username,
      message: msg
    });
    console.log(`${socket.data.username}@${[...socket.rooms][1]}: ${msg}`);
  });

  socket.on('joinRoom', (room: string) => {
    if (rooms.includes(room)) {
      socket.leave([...socket.rooms][1]);
      socket.join(room);
    } else {
      socket.emit('error', 'room does not exist');
    }
  });

  socket.on('getRooms', () => {
    socket.emit('getRooms', rooms);
  });
});

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
