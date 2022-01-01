interface ServerToClientEvents {
  authenticate: () => void;
  chatMessage: ({
    username: string,
    message: string
  }) => void;
  getRooms: () => void;
  error: (msg: string) => void;
}

interface ClientToServerEvents {
  authenticate: (username: string) => void;
  chatMessage: (msg: string) => void;
  joinRoom: (room: string) => void;
  getRooms: () => void;
}

interface SocketData {
  username: string;
}
