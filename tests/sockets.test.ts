import { createServer } from 'http';
import { Server, Socket as ServerSocket } from 'socket.io';
import { io as Client, Socket as ClientSocket} from 'socket.io-client';
import { AddressInfo } from 'net';

describe('Sockets', () => {
  let io: Server,
    serverSocket: ServerSocket,
    clientSocket: ClientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server<ClientToServerEvents, ServerToClientEvents, SocketData>(httpServer);
    httpServer.listen(() => {
      const address: AddressInfo = httpServer.address() as AddressInfo;
      const port = address.port;
      clientSocket = Client(`http://localhost:${port}`);
      io.on('connection', (socket: ServerSocket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test('should work', (done) => {
    clientSocket.on('hello', (arg) => {
      expect(arg).toBe('world');
      done();
    });
    serverSocket.emit('hello', 'world');
  });
});
