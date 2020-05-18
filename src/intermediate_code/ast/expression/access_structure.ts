import Scope from "../../scope/scope";
import { ErrorC3D } from "../../utils/errorC3D";
import AstNode from "../ast_node";

export default class AccessHeap extends AstNode {
  constructor(
    line: number,
    column: number,
    private id: string,
    private position: AstNode
  ) {
    super(line, column);
  }

  public preInterpret(scope: Scope) {
    scope.addStatement(this);
  }

  public interpret(scope: Scope): number {
    let position = this.position.interpret(scope);
    let binding = scope.getVar(this.id);
    if (binding && binding.value instanceof Array) {
      let value = binding.value[position];
      if (value) {
        return value;
      } else {
        throw new ErrorC3D(
          this.line,
          this.column,
          `position ${position} does not exist in the ${this.id}.`
        );
      }
    } else {
      throw new ErrorC3D(
        this.line,
        this.column,
        `the variable is not a structure.`
      );
    }
  }

  public toString(): string {
    return `${this.id}[${this.position.toString()}]`;
  }
}
