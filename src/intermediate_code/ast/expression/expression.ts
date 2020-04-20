import AstNode from "../ast_node";
import Scope from "../../scope/scope";

export default abstract class Expression extends AstNode {
  public value: any;

  constructor(line: number, column: number) {
    super(line, column);
    this.value = -1;
  }

  public preInterpret(scope: Scope) {}
}
