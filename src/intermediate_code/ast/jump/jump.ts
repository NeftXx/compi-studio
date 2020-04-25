import AstNode from "../ast_node";
import DestinyJump from "./destiny_of_jump";
import Scope from "../../scope/scope";
import { ErrorC3D } from "../../utils/errorC3D";

export default abstract class Jump extends AstNode {
  public destinyJump: DestinyJump | undefined;

  constructor(line: number, column: number, public label: string) {
    super(line, column);
  }

  public preInterpret(scope: Scope): void {
    // No hace nada al momento del pre interpretar
  }

  public getDestinyJump(scope: Scope) {
    let destinyJump = scope.getLabel(this.label);
    if (destinyJump) {
      this.destinyJump = destinyJump;
    } else {
      throw new ErrorC3D(
        this.line,
        this.column,
        `the tag ${this.label} was not found.`
      );
    }
  }
}
