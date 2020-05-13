import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, ErrorType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";
import Expression from "../expression/expression";

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
}
