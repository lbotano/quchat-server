import express from 'express';
import http from 'http';
import socketio, { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (_req : express.Request, res : express.Response) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket : socketio.Socket) => {
  console.log('a user has connected');
  socket.on('authenticate', (msg : string) => {
    const token = jwt.sign(msg, 'shh');
    console.log(`${msg} logged in.`);
    socket.emit('authenticate', token);
  });
  socket.on('chat message', (msg : string) => {
    const token = socket.handshake.headers.authorization;
    if (token && token.substring(0, 7).toLowerCase() === 'bearer ') {
      try {
        const decodedToken = jwt.verify(token.substring(7), 'shh');
        console.log(`${decodedToken}: ${msg}`);
        io.emit('chat message', `${decodedToken}: ${msg}`);
      } catch (error) {
        console.error(error);
        socket.emit('error', 'authentication error');
      }
    }
  });
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});
