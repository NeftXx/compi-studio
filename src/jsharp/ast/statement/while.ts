import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, ErrorType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";
import BlockStm from "./block";
import Expression from "../expression/expression";
import Ast from "../ast";

export default class WhileStm extends Statement {
  private localScope: BlockScope;

  public constructor(
    nodeInfo: NodeInfo,
    public expression: Expression,
    public block: BlockStm
  ) {
    super(nodeInfo);
  }

  public createScope(typeFactory: TypeFactory, scope: BlockScope): void {
    this.localScope = scope.createBlockScope();
    this.block.createScope(typeFactory, this.localScope);
  }

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {
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
    this.block.continueCounter = ++this.continueCounter;
    this.block.breksCounter = ++this.breksCounter;
    this.block.checkScope(typeFactory, this.localScope);
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    this.continueLabel = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`${this.continueLabel}:\n`);
    this.expression.translate(typeFactory, codeBuilder, scope);
    codeBuilder.printTrueLabels();
    let falseLabels = codeBuilder.tempFalseLabels();
    this.breakLabel = codeBuilder.getNewLabel();
    this.block.breakLabel = this.breakLabel;
    this.block.continueLabel = this.continueLabel;
    this.block.translate(typeFactory, codeBuilder, this.localScope);
    codeBuilder.setTranslatedCode(`goto ${this.continueLabel};
${this.breakLabel}:
`);
    let length = falseLabels.length;
    for (let i = 0; i < length; i++) {
      codeBuilder.setTranslatedCode(`${falseLabels.pop()}: `);
    }
    codeBuilder.setTranslatedCode("\n");
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM_EXP = this.expression.getAstNode(ast, str);
    const NUM_BLOCK = this.block.getAstNode(ast, str);
    const NUM = ast.contNodes++;
    str.push(`
  node${NUM}[label="while"];
  node${ast.contNodes}[label="("];
  node${NUM} -> node${ast.contNodes++};
  node${NUM} -> node${NUM_EXP};
  node${ast.contNodes}[label=")"];
  node${NUM} -> node${ast.contNodes++};
  node${NUM} -> node${NUM_BLOCK};
`);
    return NUM;
  }
}
