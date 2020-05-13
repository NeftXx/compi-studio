import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";
import SubIf from "./sub_if";

export default class IfStm extends Statement {
  public constructor(nodeInfo: NodeInfo, public subIfs: Array<SubIf>) {
    super(nodeInfo);
  }

  public createScope(typeFactory: TypeFactory, scope: BlockScope): void {
    for (let subIf of this.subIfs) {
      subIf.createScope(typeFactory, scope);
    }
  }

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {
    for (let subIf of this.subIfs) {
      subIf.continueCounter = this.continueCounter;
      subIf.breksCounter = this.breksCounter;
      subIf.checkScope(typeFactory, scope);
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    let labelExit = codeBuilder.getNewLabel();
    for (let subIf of this.subIfs) {
      subIf.breakLabel = this.breakLabel;
      subIf.continueLabel = this.continueLabel;
      subIf.setLabelExit(labelExit);
      subIf.translate(typeFactory, codeBuilder, scope);
    }
    codeBuilder.setTranslatedCode(`${labelExit}:\n`);
  }
}
