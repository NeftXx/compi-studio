import Ast from "./ast/ast";
import { logger } from "../utils/logger";

export default class JSharp {
  public exec(input: string): boolean {
    try {
      return true;
    } catch (error) {
      return false;
    }
  }
}
