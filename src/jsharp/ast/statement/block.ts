import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";
import Ast from "../ast";

export default class BlockStm extends Statement {
  public constructor(nodeInfo: NodeInfo, private statements: Array<Statement>) {
    super(nodeInfo);
  }

  public createScope(typeFactory: TypeFactory, scope: BlockScope): void {
    for (let statement of this.statements) {
      statement.createScope(typeFactory, scope);
    }
  }

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {
    for (let statement of this.statements) {
      statement.continueCounter = this.continueCounter;
      statement.breksCounter = this.breksCounter;
      statement.checkScope(typeFactory, scope);
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    for (let statement of this.statements) {
      statement.breakLabel = this.breakLabel;
      statement.continueLabel = this.continueLabel;
      statement.translate(typeFactory, codeBuilder, scope);
    }
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM = ast.contNodes++;
    str.push(`  node${NUM}[label="Bloque"];\n`);
    let t: number;
    for (let stm of this.statements) {
      t = stm.getAstNode(ast, str);
      str.push(`  node${NUM} -> node${t};\n`);
    }
    return NUM;
  }
}
