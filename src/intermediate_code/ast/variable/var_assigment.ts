import AstNode from "../ast_node";
import Scope from "../../scope/scope";
import Expression from "../expression/expression";

export default class VarAssigment extends AstNode {
  constructor(
    line: number,
    column: number,
    public id: string,
    public exp: Expression
  ) {
    super(line, column);
  }

  public preInterpret(scope: Scope): void {}

  public interpret(scope: Scope): void {
    this.exp.interpret(scope);
    if (typeof this.exp.value !== "number") {
      throw new Error(
        `Semantic error in line ${this.line} and column ${this.column}, when assigning the result in the variable ${this.id}.`
      );
    }

    let binding = scope.getVar(this.id);
    if (binding && typeof binding.value === "number") {
      binding.value = this.exp.value;
    } else {
      throw new Error(
        `Semantic error in line ${this.line} and column ${this.column}, in the assignment the identifier ${this.id} is not declared.`
      );
    }
  }
}
