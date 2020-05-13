import Expression from "./expression";
import { TypeFactory } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";

export default class UMenos extends Expression {
  public constructor(nodeInfo: NodeInfo, private exp: Expression) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    this.exp.verifyType(typeFactory, scope);
    let typeTemp = this.exp.type;
    if (typeFactory.isErrorType(typeTemp)) {
      this.type = typeTemp;
      return;
    }
    if (typeFactory.isInteger(typeTemp) || typeFactory.isDouble(typeTemp)) {
      this.type = typeTemp;
    } else {
      this.type = typeFactory.getErrorType(
        `Error no se puede usar el operando <strong>'-'</strong> con una expresion de tipo <strong>${typeTemp}</strong>.`,
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
    let dir = codeBuilder.getNewTemporary();
    let last = codeBuilder.getLastAddress();
    codeBuilder.removeUnusedTemporary(last);
    codeBuilder.setTranslatedCode(`${dir} = -${last};\n`);
    codeBuilder.setLastAddress(dir);
    codeBuilder.addUnusedTemporary(dir);
  }
}
