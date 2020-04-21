
import Ast from "./ast/ast";
import { parse } from "./grammar/grammar";
import { logger } from "../utils/logger";

export default class IntermediateCode {
  private message: string;

  constructor() {
    this.message = "";
  }

  exec(input: string): boolean {
    try {
      let ast: Ast = parse(input);
      ast.preInterpret();
      ast.interpret();
      this.message = "successfully completed";
      return true;
    } catch (error) {
      logger.error(error.message);
      this.message = error.message;
      return false;
    }
  }

  getMessage(): string {
    return this.message;
  }
}