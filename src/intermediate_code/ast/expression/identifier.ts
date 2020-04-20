import Expression from "../expression/expression";
import Scope from "../../scope/scope";

export default class Identifier extends Expression {
  constructor(line: number, column: number, public id: string) {
    super(line, column);
  }

  public interpret(scope: Scope): void {
    let binding = scope.getVar(this.id);
    if (binding && typeof binding.value === "number") {
      this.value = binding.value;
    } else {
      throw new Error(
        `Semantic error in line ${this.line} and column ${this.column}, variable ${this.id} does not exist or it is a structure.`
      );
    }
  }
}
