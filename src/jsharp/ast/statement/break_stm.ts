import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, ErrorType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";
import Ast from "../ast";

export default class BreakStm extends Statement {
  public breakLabel: string;

  public constructor(nodeInfo: NodeInfo) {
    super(nodeInfo);
    this.breakLabel = "";
  }

  public createScope(typeFactory: TypeFactory, scope: BlockScope): void {}

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {
    if (this.breksCounter === 0) {
      scope.addError(
        new ErrorType(
          `Error la sentencia <strong>break</strong> solo puede venir dentro de una sentencia <strong>while, do while, switch o for</strong>.`,
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
    codeBuilder.setTranslatedCode(`goto ${this.breakLabel};\n`);
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM = ast.contNodes++;
    str.push(`node${NUM}[label="break"];`);
    return NUM;
  }
}
