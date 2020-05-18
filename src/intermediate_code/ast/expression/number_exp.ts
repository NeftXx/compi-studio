import Scope from "../../scope/scope";
import AstNode from "../ast_node";

export default class NumberExp extends AstNode {
  constructor(line: number, column: number, public value: number) {
    super(line, column);
    this.value = value;
  }

  public preInterpret(scope: Scope) {
    scope.addStatement(this);
  }

  public interpret(scope: Scope): number {
    return this.value;
  }

  public toString(): string {
    return this.value.toString();
  }
}
