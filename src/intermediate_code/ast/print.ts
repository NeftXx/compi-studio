import AstNode from "./ast_node";
import Scope from "../scope/scope";
import Expression from "./expression/expression";
import { ErrorC3D } from "../utils/errorC3D";

export default class Print extends AstNode {
  constructor(
    line: number,
    column: number,
    public terminal: string,
    public exp: Expression
  ) {
    super(line, column);
  }

  public preInterpret(scope: Scope): void {
    scope.addStatement(this);
  }

  public interpret(scope: Scope): void {
    let value = this.exp.interpret(scope);
    if (typeof value !== "number") {
      throw new ErrorC3D(this.line, this.column, "the expression in the print function must be a number.");
    }
    switch (this.terminal) {
      case "c":
        scope.console.append(String.fromCharCode(value));
        return;
      case "d":
        scope.console.append(value.toString());
        return;
      case "i":
        let integer = ~~value;
        scope.console.append(integer.toString());
        return;
    }
  }
}
