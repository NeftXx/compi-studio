import CodeBuilder from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, JType, ErrorType } from "../../scope/type";
import { MethodScope } from "../../scope/scope";
import Statement from "./statement";

export default class ParameterStm extends Statement {
  public constructor(
    nodeInfo: NodeInfo,
    public type: JType,
    public identifier: string
  ) {
    super(nodeInfo);
  }

  public createScope(scope: MethodScope): void {
    let ok = scope.createVariableLocal(this.identifier, this.type, false);
    if (!ok) {
      scope.addError(
        new ErrorType(
          `Error el parametro ${
            this.identifier
          } ya esta declarado en el metodo ${scope.getIdentifier()}.`,
          this.nodeInfo
        )
      );
    }
  }

  public checkScope(typeFactory: TypeFactory, scope: MethodScope): void {}

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: MethodScope
  ): void {}
}
