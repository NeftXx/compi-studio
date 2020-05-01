import CodeBuilder from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, ErrorType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";
import BlockStm from "./block";
import Expression from "../expression/expression";

export default class WhileStm extends Statement {
  private nameScope: string;

  public constructor(
    nodeInfo: NodeInfo,
    public expression: Expression,
    public block: BlockStm
  ) {
    super(nodeInfo);
    this.nameScope = "";
  }

  public buildScope(typeFactory: TypeFactory, scope: BlockScope): void {
    this.expression.verifyType(typeFactory, scope);
    let type = this.expression.type;
    if (type instanceof ErrorType) {
      scope.addError(type);
    } else {
      if (!typeFactory.isBoolean(type)) {
        scope.addError(
          new ErrorType(
            `Error no se esperaba una expresion de tipo ${type}.`,
            this.expression.nodeInfo
          )
        );
      }
    }
    this.nameScope = scope.createScope();
    let localScope = scope.getScope(this.nameScope);
    this.block.buildScope(typeFactory, localScope);
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: BlockScope
  ): void {
    let labelReturn = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`${labelReturn}:\n`);
    this.expression.translate(typeFactory, codeBuilder, scope);
    codeBuilder.printTrueLabels();
    let localScope = scope.getScope(this.nameScope);
    this.block.translate(typeFactory, codeBuilder, localScope);
    codeBuilder.setTranslatedCode(`goto ${labelReturn};\n`);
    codeBuilder.printFalseLabels();
  }
}
