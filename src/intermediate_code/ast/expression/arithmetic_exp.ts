import Scope from "../../scope/scope";
import Expression from "../expression/expression";

export default class ArithmeticExp extends Expression {
  constructor(
    line: number,
    column: number,
    public exp1: Expression,
    public operator: string,
    public exp2: Expression
  ) {
    super(line, column);
  }

  public interpret(scope: Scope): void {
    this.exp1.interpret(scope);
    this.exp2.interpret(scope);

    if (
      typeof this.exp1.value !== "number" &&
      typeof this.exp2.value !== "number"
    ) {
      throw new Error(
        `Semantic error in line ${this.line} and column ${this.column}, expressions must be a number.`
      );
    }

    switch (this.operator) {
      case "+":
        this.value = this.exp1.value + this.exp2.value;
        return;
      case "-":
        this.value = this.exp1.value - this.exp2.value;
        return;
      case "*":
        this.value = this.exp1.value * this.exp2.value;
        return;
      case "/":
        this.value = this.exp1.value / this.exp2.value;
        return;
      case "%":
        this.value = this.exp1.value % this.exp2.value;
        return;
    }
  }
}
