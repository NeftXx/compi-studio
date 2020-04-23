import Arithmetic from "./arithmetic";
import CodeBuilder from "../../../scope/code_builder";
import { TypeFactory, JType } from "../../../scope/type";
import { Scope } from "../../../scope/scope";
import { NodeInfo } from "../../ast_node";
import Expression from "../expression";

export default class Operation extends Arithmetic {
  public constructor(
    nodeInfo: NodeInfo,
    public expLeft: Expression,
    public operator: string,
    public expRigth: Expression
  ) {
    super(nodeInfo);
  }

  public buildScope(typeFactory: TypeFactory, scope: Scope): void {
    if (
      this.expLeft instanceof Arithmetic &&
      this.expRigth instanceof Arithmetic
    ) {
      this.expLeft.buildScope(typeFactory, scope);
      this.expRigth.buildScope(typeFactory, scope);

      return;
    }
    this.type = typeFactory.getUndefined();
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: Scope
  ): void {}
}
