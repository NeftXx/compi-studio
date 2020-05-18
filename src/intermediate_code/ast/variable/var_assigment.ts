import AstNode from "../ast_node";
import Scope from "../../scope/scope";
import { ErrorC3D } from "../../utils/errorC3D";

export default class VarAssigment extends AstNode {
  constructor(
    line: number,
    column: number,
    public id: string,
    public exp: AstNode
  ) {
    super(line, column);
  }

  public preInterpret(scope: Scope): void {
    scope.addStatement(this);
  }

  public interpret(scope: Scope): void {
    let value = this.exp.interpret(scope);
    if (typeof value !== "number") {
      throw new ErrorC3D(
        this.line,
        this.column,
        `when assigning the result in the variable ${this.id}.`
      );
    }

    let binding = scope.getVar(this.id);
    if (binding && typeof binding.value === "number") {
      binding.value = value;
    } else {
      throw new ErrorC3D(
        this.line,
        this.column,
        `in the assignment the identifier ${this.id} is not declared.`
      );
    }
  }

  public toString(): string {
    return `${this.id} = ${this.exp.toString()};\n`;
  }
}
