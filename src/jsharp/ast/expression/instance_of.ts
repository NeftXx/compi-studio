import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import { BlockScope } from "../../scope/scope";
import CodeTranslator from "../../scope/code_builder";
import { TypeFactory } from "../../scope/type";

export default class FunctionInstanceOf extends Expression {
  public constructor(
    nodeInfo: NodeInfo,
    private expLeft: Expression,
    private expRight: Expression
  ) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {}

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {}
}
