import { Server } from "http";
import SocketIO from "socket.io";
import { FileInformation, JSharp } from "../jsharp/jsharp";
import { IntermediateCode } from "../intermediate_code/intermediate_code";
import { logger } from "./logger";

export default class SocketConnector {
  public on(server: Server) {
    let io = SocketIO.listen(server);
    io.on("connection", (clientSocket: SocketIO.Socket) => {
      logger.info("SOCKET connected client");
      clientSocket.on("filesData", (data: Array<FileInformation>) => {
        let jsharp = new JSharp();
        let translate = jsharp.exec(data);
        clientSocket.emit("translateResult", translate);
      });

      clientSocket.on("optimization", (input) => {
        let c3d = new IntermediateCode();
        c3d.exec(input);
        clientSocket.emit("optimizedCode", "hola");
      });
    });
  }
}
