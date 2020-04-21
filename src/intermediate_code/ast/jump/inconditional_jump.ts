import Scope from "../../scope/scope";
import Jump from "./jump";

export default class InconJump extends Jump {
  constructor(line: number, column: number, label: string) {
    super(line, column, label);
  }

  public interpret(scope: Scope): void {
    this.getDestinyJump(scope);
  }
}