import CodeBuilder from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, ErrorType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";
import Expression from "../expression/expression";
import BlockStm from "./block";

export default class SubIf extends Statement {
  private labelExit: string;
  private nameScope: string;

  public constructor(
    nodeInfo: NodeInfo,
    public block: BlockStm,
    public expression?: Expression
  ) {
    super(nodeInfo);
    this.labelExit = "";
    this.nameScope = "";
  }

  public setLabelExit(label: string) {
    this.labelExit = label;
  }

  public buildScope(typeFactory: TypeFactory, scope: BlockScope): void {
    if (this.expression) {
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
    this.nameScope = scope.createScope();
    let localScope = scope.getScope(this.nameScope);
    this.block.buildScope(typeFactory, localScope);
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: BlockScope
  ): void {
    if (this.expression) {
      this.expression.translate(typeFactory, codeBuilder, scope);
    }
    codeBuilder.printTrueLabels();
    let localScope = scope.getScope(this.nameScope);
    this.block.translate(typeFactory, codeBuilder, localScope);
    if (this.labelExit !== "") {
      codeBuilder.setTranslatedCode(`goto ${this.labelExit};\n`);
    }
    codeBuilder.printFalseLabels();
  }
}
