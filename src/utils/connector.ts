import { Server } from 'http';
import SocketIO from 'socket.io';

export default class SocketConnector {
  public on(server: Server) {
    let io = SocketIO.listen(server);
    io.on('connection', function (clientSocket: SocketIO.Socket) {
      clientSocket.on('chat message', function (msg: any) {
        io.emit('chat message', msg);
      });
    });
  }
}
