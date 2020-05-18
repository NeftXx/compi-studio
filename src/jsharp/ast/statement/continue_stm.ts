import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, ErrorType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";
import Ast from "../ast";

export default class ContinueStm extends Statement {
  public continueLabel: string;
  public constructor(nodeInfo: NodeInfo) {
    super(nodeInfo);
    this.continueLabel = "";
  }

  public createScope(typeFactory: TypeFactory, scope: BlockScope): void {}

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {
    if (this.continueCounter === 0) {
      scope.addError(
        new ErrorType(
          `Error la sentencia <strong>continue</strong> solo puede venir dentro de una sentencia <strong>while, do while, o for</strong>.`,
          this.nodeInfo
        )
      );
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    codeBuilder.setTranslatedCode(`goto ${this.continueLabel};\n`);
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM = ast.contNodes++;
    str.push(`  node${NUM}[label="continue"];\n`);
    return NUM;
  }
}
