import Scope from "../../scope/scope";
import { ErrorC3D } from "../../utils/errorC3D";
import AstNode from "../ast_node";

export default class Identifier extends AstNode {
  constructor(line: number, column: number, public id: string) {
    super(line, column);
  }

  public preInterpret(scope: Scope) {
    scope.addStatement(this);
  }

  public interpret(scope: Scope): number {
    let binding = scope.getVar(this.id);
    if (binding && typeof binding.value === "number") {
      return binding.value;
    } else {
      throw new ErrorC3D(
        this.line,
        this.column,
        `variable ${this.id} does not exist or it is a structure.`
      );
    }
  }

  public toString(): string {
    return this.id;
  }
}
