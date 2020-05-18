import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, ErrorType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";
import Expression from "../expression/expression";
import BlockStm from "./block";
import Ast from "../ast";

export default class SubIf extends Statement {
  private labelExit: string;
  private localScope: BlockScope;

  public constructor(
    nodeInfo: NodeInfo,
    public block: BlockStm,
    public expression?: Expression
  ) {
    super(nodeInfo);
    this.labelExit = "";
  }

  public setLabelExit(label: string) {
    this.labelExit = label;
  }

  public createScope(typeFactory: TypeFactory, scope: BlockScope): void {
    this.localScope = scope.createBlockScope();
    this.block.createScope(typeFactory, this.localScope);
  }

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {
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
    this.block.continueCounter = this.continueCounter;
    this.block.breksCounter = this.breksCounter;
    this.block.checkScope(typeFactory, this.localScope);
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    if (this.expression) {
      this.expression.translate(typeFactory, codeBuilder, scope);
      codeBuilder.printTrueLabels();
      let falseLabels = codeBuilder.tempFalseLabels();
      this.block.breakLabel = this.breakLabel;
      this.block.continueLabel = this.continueLabel;
      this.block.translate(typeFactory, codeBuilder, this.localScope);
      codeBuilder.setTranslatedCode(`goto ${this.labelExit};\n`);
      let length = falseLabels.length;
      for (let i = 0; i < length; i++) {
        codeBuilder.setTranslatedCode(`${falseLabels.pop()}: `);
      }
      codeBuilder.setTranslatedCode("\n");
    } else {
      this.block.breakLabel = this.breakLabel;
      this.block.continueLabel = this.continueLabel;
      this.block.translate(typeFactory, codeBuilder, this.localScope);
      codeBuilder.setTranslatedCode(`goto ${this.labelExit};\n`);
    }
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM = ast.contNodes++;
    const NUM_BLOCK = this.block.getAstNode(ast, str);
    if (this.expression) {
      const NUM_EXP = this.expression.getAstNode(ast, str);
      str.push(`
  node${NUM}[label="if"];
  node${ast.contNodes}[label="("];
  node${NUM} -> node${ast.contNodes++};
  node${NUM} -> node${NUM_EXP};
  node${ast.contNodes}[label=")"];
  node${NUM} -> node${ast.contNodes++};
  node${ast.contNodes}[label="\\{"];
  node${NUM} -> node${ast.contNodes++};
  node${NUM} -> node${NUM_BLOCK};
  node${ast.contNodes}[label="\\}"];
  node${NUM} -> node${ast.contNodes++};
`);
    } else {
      str.push(`  
  node${NUM}[label="else"];
  node${ast.contNodes}[label="\\{"];
  node${NUM} -> node${ast.contNodes++};
  node${NUM} -> node${NUM_BLOCK};
  node${ast.contNodes}[label="\\}"];
  node${NUM} -> node${ast.contNodes++};
`);
    }
    return NUM;
  }
}
