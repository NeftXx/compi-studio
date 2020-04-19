import express from "express";
import { createServer, Server } from "http";
import morgan from "morgan";
import path from "path";
import { logger, stream } from "./utils/logger";

import indexRoutes from "./routes/index";
import { error404, errorHandler } from "./routes/error";

export default class Application {
  private app: express.Application;
  public server: Server;

  constructor(public readonly PORT: number) {
    this.app = express();
    this.server = createServer(this.app);
    this.settings();
    this.middlewares();
    this.routes();
  }

  private settings() {
    this.app.set("views", path.join(__dirname, "views"));
    this.app.set("view engine", "ejs");
  }

  private middlewares() {
    this.app.use(morgan("tiny", { stream: stream }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private routes() {
    this.app.use(express.static(path.join(__dirname, "public")));
    this.app.use(indexRoutes);
    this.app.use(error404);
    this.app.use(errorHandler);
  }

  public start() {
    this.server.listen(this.PORT, () => {
      logger.info(`Server started at http://localhost:${this.PORT}`);
    });
  }
}
