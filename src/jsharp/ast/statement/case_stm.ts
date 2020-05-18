import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";
import Expression from "../expression/expression";
import Ast from "../ast";

export default class CaseStm extends Statement {
  public labelExit: string;

  public constructor(
    nodeInfo: NodeInfo,
    public statements: Array<Statement>,
    public exp?: Expression
  ) {
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
    codeBuilder.setTranslatedCode(`${this.labelExit}:\n`);
    for (let statement of this.statements) {
      statement.breakLabel = this.breakLabel;
      statement.continueLabel = this.continueLabel;
      statement.translate(typeFactory, codeBuilder, scope);
    }
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM = ast.contNodes++;
    if (this.exp) {
      str.push(`  node${NUM}[label="case"]\n`);
      let t = this.exp.getAstNode(ast, str);
      str.push(`  node${NUM} -> node${t};
  node${ast.contNodes}[label=":"];
  node${NUM} -> node${ast.contNodes++};
`);
    } else {
      str.push(`  node${NUM}[label="default"];
  node${ast.contNodes}[label=":"];
  node${NUM} -> node${ast.contNodes++};
`);
    }
    let t: number;
    for (let stm of this.statements) {
      t = stm.getAstNode(ast, str);
      str.push(`  node${NUM} -> node${t};\n`);
    }
    return NUM;
  }
}
