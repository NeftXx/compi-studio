import Ast from "./ast/ast";
import { parse } from "./grammar/grammar";
import { logger } from "../utils/logger";

export class IntermediateCode {
  exec(input: string): any {
    try {
      let ast: Ast = parse(input);
      ast.optimize();
      return {
        nodesRemove: ast.opt.report(),
        text: ast.getText(),
      };
    } catch (error) {
      logger.error(error.message);
      console.error(error);
      return {
        nodesRemove: "",
        text: error.message,
      };
    }
  }
}
