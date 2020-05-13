import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, ErrorType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";
import Expression from "../expression/expression";
import BlockStm from "./block";

export default class ForStm extends Statement {
  private localScope: BlockScope;

  public constructor(
    nodeInfo: NodeInfo,
    public block: BlockStm,
    public init?: Statement,
    public cond?: Expression,
    public final?: Statement
  ) {
    super(nodeInfo);
  }

  public createScope(typeFactory: TypeFactory, scope: BlockScope): void {
    this.localScope = scope.createBlockScope();
    this.block.createScope(typeFactory, this.localScope);
    if (this.init) this.init.createScope(typeFactory, this.localScope);
    if (this.final) this.final.createScope(typeFactory, this.localScope);
  }

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {
    if (this.init) this.init.checkScope(typeFactory, this.localScope);
    if (this.cond) {
      this.cond.verifyType(typeFactory, this.localScope);
      let type = this.cond.type;
      if (type instanceof ErrorType) {
        scope.addError(type);
      } else {
        if (!typeFactory.isBoolean(type)) {
          scope.addError(
            new ErrorType(
              `Error no se esperaba una expresion de tipo ${type}.`,
              this.cond.nodeInfo
            )
          );
        }
      }
    }
    if (this.final) this.final.checkScope(typeFactory, this.localScope);
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
    if (this.init) {
      this.init.translate(typeFactory, codeBuilder, this.localScope);
    }
    codeBuilder.setTranslatedCode(`${this.continueLabel}:\n`);
    let falseLabels: Array<string> = [];
    if (this.cond) {
      this.cond.translate(typeFactory, codeBuilder, this.localScope);
      codeBuilder.printTrueLabels();
      falseLabels = codeBuilder.tempFalseLabels();
    }
    this.breakLabel = codeBuilder.getNewLabel();
    this.block.breakLabel = this.breakLabel;
    this.block.continueLabel = this.continueLabel;
    this.block.translate(typeFactory, codeBuilder, this.localScope);
    if (this.final) {
      this.final.translate(typeFactory, codeBuilder, this.localScope);
    }
    codeBuilder.setTranslatedCode(`goto ${this.continueLabel};
${this.breakLabel}:
`);
    let length = falseLabels.length;
    for (let i = 0; i < length; i++) {
      codeBuilder.setTranslatedCode(`${falseLabels.pop()}: `);
    }
    codeBuilder.setTranslatedCode("\n");
  }
}
