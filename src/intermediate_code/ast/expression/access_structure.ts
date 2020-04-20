import Expression from "../expression/expression";
import Scope from "../../scope/scope";

export default class AccessHeap extends Expression {
  constructor(
    line: number,
    column: number,
    private id: string,
    private position: Expression
  ) {
    super(line, column);
  }

  public interpret(scope: Scope): void {
    this.position.interpret(scope);
    let binding = scope.getVar(this.id);
    if (binding && binding.value instanceof Array) {
      let value = binding.value[this.position.value];
      if (value) {
        this.value = value;
      } else {
        throw new Error(
          `Semantic error in line ${this.line} and column ${this.column}, position ${this.position.value} does not exist in the ${this.id}.`
        );
      }
    } else {
      throw new Error(
        `Semantic error in line ${this.line} and column ${this.column}, the variable is not a structure.`
      );
    }
  }
}
