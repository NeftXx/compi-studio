import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import { BlockScope } from "../../scope/scope";
import CodeTranslator from "../../scope/code_builder";
import { TypeFactory } from "../../scope/type";

export default class Not extends Expression {
  public constructor(nodeInfo: NodeInfo, private exp: Expression) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    this.exp.verifyType(typeFactory, scope);
    let type = this.exp.type;
    if (typeFactory.isErrorType(type)) {
      this.type = type;
      return;
    }
    if (typeFactory.isBoolean(type)) {
      this.type = type;
    } else {
      this.type = typeFactory.getErrorType(
        `Error no se puede usar el operando <strong>'!'</strong> con una expresion de tipo <strong>${type}</strong>.`,
        this.nodeInfo
      );
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    this.exp.translate(typeFactory, codeBuilder, scope);
    codeBuilder.swapLabels();
  }
}
