import Expression from "./expression";
import Scope from "../../scope/scope";

export default class Minus extends Expression {
  constructor(line: number, column: number, public exp: Expression) {
    super(line, column);
  }

  public interpret(scope: Scope): void {
    this.exp.interpret(scope);
    if (typeof this.exp.value !== "number") {
      throw new Error(
        `Semantic error in line ${this.line} and column ${this.column}, expression must be a number.`
      );
    }
    this.value = -this.exp.value;
  }
}
