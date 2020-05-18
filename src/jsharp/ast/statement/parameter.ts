import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, JType, ErrorType } from "../../scope/type";
import { MethodScope } from "../../scope/scope";
import Statement from "./statement";
import Ast from "../ast";

export default class ParameterStm extends Statement {
  public constructor(
    nodeInfo: NodeInfo,
    public type: JType,
    public identifier: string
  ) {
    super(nodeInfo);
  }

  public createScope(typeFactory: TypeFactory, scope: MethodScope): void {
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
    codeBuilder: CodeTranslator,
    scope: MethodScope
  ): void {}

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM = ast.contNodes++;
    str.push(`
  node${NUM}[label="Parametro"];
  node${ast.contNodes}[label="${this.type}"];
  node${NUM} -> node${ast.contNodes++};
  node${ast.contNodes}[label="${this.identifier}"];
  node${NUM} -> node${ast.contNodes++};
`);
    return NUM;
  }
}
