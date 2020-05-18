import AstNode from "../ast_node";
import Scope from "../../scope/scope";
import MethodDeclaration from "./method_declaration";
import { ErrorC3D } from "../../utils/errorC3D";

export default class MethodInvocation extends AstNode {
  public method: MethodDeclaration | undefined;

  constructor(line: number, column: number, public id: string) {
    super(line, column);
  }

  public preInterpret(scope: Scope) {
    scope.addStatement(this);
  }

  public interpret(scope: Scope): void {
    let method = scope.getMethod(this.id);
    if (method) {
      this.method = method;
    } else {
      throw new ErrorC3D(
        this.line,
        this.column,
        `${this.id} method not found.`
      );
    }
  }

  public toString(): string {
    return `call ${this.id};\n`;
  }
}
