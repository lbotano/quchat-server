import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import socketio, { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);

type MessageRequest = {
  token: string,
  message: string
};

app.use(express.static('frontend'));

io.on('connection', (socket : socketio.Socket) => {
  console.log('a user has connected');

  socket.on('authenticate', (msg : string) => {
    const token = jwt.sign(msg, 'shh');
    console.log(`${msg} logged in.`);
    socket.emit('authenticate', token);
  });

  socket.on('chat message', (msg : MessageRequest) => {
    const token = msg.token;

    try {
      const decodedToken = jwt.verify(token, 'shh');
      console.log(`${decodedToken}: ${msg.message}`);
      io.emit('chat message', {
        username: decodedToken,
        message: msg.message
      });
    } catch (error) {
      console.error(error);
      socket.emit('error', 'authentication error');
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log(`listening on *:${process.env.PORT}`);
});
