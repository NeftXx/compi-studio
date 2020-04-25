import { Server } from 'http';
import SocketIO from 'socket.io';
import { FileInformation, JSharp, JSharpResult } from '@jsharp/jsharp';
import { logger } from './logger';

export default class SocketConnector {
  public on(server: Server) {
    let io = SocketIO.listen(server);
    io.on('connection', function (clientSocket: SocketIO.Socket) {
      logger.info('SOCKET connected client');
      clientSocket.on('filesData', function (data: Array<FileInformation>) {
        let jsharp = new JSharp();
        let translate = jsharp.exec(data);
        clientSocket.emit('translateResult', translate);
      });
    });
  }
}
