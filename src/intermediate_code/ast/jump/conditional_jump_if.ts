import Jump from "./jump";
import Scope from "../../scope/scope";
import RelationalExp from "../expression/relational_exp";
import { ErrorC3D } from "../../utils/errorC3D";
import InconJump from "./inconditional_jump";

export default class CondJumpIf extends Jump {
  constructor(
    line: number,
    column: number,
    public cond: RelationalExp,
    label: string
  ) {
    super(line, column, label);
  }

  public interpret(scope: Scope): void {
    let value = this.cond.interpret(scope);
    if (typeof value !== "boolean") {
      throw new ErrorC3D(
        this.line,
        this.column,
        "in the expression given in the if."
      );
    }

    if (value) {
      this.getDestinyJump(scope);
    }
  }

  public optimize(): InconJump | undefined {
    if (this.cond.isEquals())
      return new InconJump(this.line, this.column, this.label);
    return undefined;
  }

  public toString(): string {
    return `if (${this.cond.toString()}) goto ${this.label};\n`;
  }
}
