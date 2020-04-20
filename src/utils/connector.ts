import { Server } from "http";
import SocketIO from "socket.io";

export default class SocketConnector {
  public on(server: Server) {
    let io = SocketIO.listen(server);
    io.on("connection", function (clientSocket: SocketIO.Socket) {});
  }
}
