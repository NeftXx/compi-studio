import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import { BlockScope } from "../../scope/scope";
import CodeBuilder from "../../scope/code_builder";
import { TypeFactory } from "../../scope/type";

export default abstract class Or extends Expression {
  public constructor(
    nodeInfo: NodeInfo,
    private expLeft: Expression,
    private expRight: Expression
  ) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    this.expLeft.verifyType(typeFactory, scope);
    this.expRight.verifyType(typeFactory, scope);
    let type1 = this.expLeft.type;
    let type2 = this.expRight.type;
    if (typeFactory.isErrorType(type1)) {
      this.type = type1;
      return;
    }
    if (typeFactory.isErrorType(type2)) {
      this.type = type2;
      return;
    }
    if (typeFactory.isBoolean(type1) && typeFactory.isBoolean(type2)) {
      this.type = typeFactory.getBoolean();
    } else {
      this.type = typeFactory.getErrorType(
        `Error no se puede usar el operando <strong>'&&'</strong> con una expresion de tipo <strong>${type1}</strong> con una expresion <strong>${type2}</strong>.`,
        this.nodeInfo
      );
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: BlockScope
  ): void {
    this.expLeft.translate(typeFactory, codeBuilder, scope);
    codeBuilder.printFalseLabels();
    this.expRight.translate(typeFactory, codeBuilder, scope);
  }
}
