import CodeBuilder from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, ErrorType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";
import BlockStm from "./block";
import Expression from "../expression/expression";

export default class DoWhileStm extends Statement {
  public constructor(
    nodeInfo: NodeInfo,
    public block: BlockStm,
    public expression: Expression
  ) {
    super(nodeInfo);
  }

  public buildScope(typeFactory: TypeFactory, scope: BlockScope): void {
    this.block.buildScope(typeFactory, scope);
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
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: BlockScope
  ): void {
    let labelReturn = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`${labelReturn}:\n`);
    this.block.translate(typeFactory, codeBuilder, scope);
    this.expression.translate(typeFactory, codeBuilder, scope);
    codeBuilder.printTrueLabels();
    codeBuilder.setTranslatedCode(`goto ${labelReturn};\n`);
    codeBuilder.printFalseLabels();
  }
}
