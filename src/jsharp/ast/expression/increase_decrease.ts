import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import { BlockScope } from "../../scope/scope";
import CodeTranslator from "../../scope/code_builder";
import { TypeFactory, ArrayType, ErrorType } from "../../scope/type";
import AccessArray from "./access_array";
import AccessAttribute from "./access_attribute";
import Identifier from "./identifier";

export default class IncreaseDecrease extends Expression {
  public constructor(
    nodeInfo: NodeInfo,
    private exp: Expression,
    private operator: string
  ) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    this.exp.verifyType(typeFactory, scope);
    let type = this.exp.type;
    if (type instanceof ErrorType) {
      scope.addError(type);
    }
    let verify =
      this.exp instanceof AccessArray ||
      this.exp instanceof AccessAttribute ||
      this.exp instanceof Identifier;
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {}
}
