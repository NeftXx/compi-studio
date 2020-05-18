import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, ErrorType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";
import BlockStm from "./block";
import Expression from "../expression/expression";
import Ast from "../ast";

export default class DoWhileStm extends Statement {
  private localScope: BlockScope;

  public constructor(
    nodeInfo: NodeInfo,
    public block: BlockStm,
    public expression: Expression
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
    this.breakLabel = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`${this.continueLabel}:\n`);
    this.block.translate(typeFactory, codeBuilder, this.localScope);
    this.expression.translate(typeFactory, codeBuilder, scope);
    codeBuilder.printTrueLabels();
    codeBuilder.setTranslatedCode(`goto ${this.continueLabel};
${this.breakLabel}:
`);
    codeBuilder.printFalseLabels();
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM = ast.contNodes++;
    str.push(`
  node${NUM}[label="do"];
  node${ast.contNodes}[label="\\{"];
  node${NUM} -> node${ast.contNodes++};
`);
    let t: number = this.block.getAstNode(ast, str);
    str.push(`  node${NUM} -> node${t};
  node${ast.contNodes}[label="\\}"];
  node${NUM} -> node${ast.contNodes++};
  node${ast.contNodes}[label="("];
  node${NUM} -> node${ast.contNodes++};
`);
    t = this.expression.getAstNode(ast, str);
    str.push(`  node${NUM} -> node${t};
  node${ast.contNodes}[label=")"];
  node${NUM} -> node${ast.contNodes++};
`);
    return NUM;
  }
}
