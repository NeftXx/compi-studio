import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, ErrorType, JType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";
import Expression from "../expression/expression";
import CaseStm from "./case_stm";
import Ast from "../ast";

export default class SwitchStm extends Statement {
  private localScope: BlockScope;

  public constructor(
    nodeInfo: NodeInfo,
    public exp: Expression,
    public labels: Array<CaseStm>
  ) {
    super(nodeInfo);
  }

  public createScope(typeFactory: TypeFactory, scope: BlockScope): void {
    this.localScope = scope.createBlockScope();
    for (let label of this.labels) {
      label.createScope(typeFactory, this.localScope);
    }
  }

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {
    this.exp.verifyType(typeFactory, scope);
    let type = this.exp.type;
    if (type instanceof ErrorType) {
      scope.addError(type);
    }
    this.breksCounter++;
    for (let label of this.labels) {
      if (label.exp) {
        label.exp.verifyType(typeFactory, scope);
        let type = label.exp.type;
        if (type instanceof ErrorType) {
          scope.addError(type);
        } else {
          if (!typeFactory.isBaseType(type)) {
            scope.addError(
              new ErrorType(
                `Error no se esperaba una expresion de tipo ${type}.`,
                label.exp.nodeInfo
              )
            );
          }
        }
      }
      label.continueCounter = this.continueCounter;
      label.breksCounter = this.breksCounter;
      label.checkScope(typeFactory, this.localScope);
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    this.exp.translate(typeFactory, codeBuilder, scope);
    let dirExp = this.getDir(typeFactory, codeBuilder);
    let defaultLabel: CaseStm;
    let dirCurrent: string;
    this.breakLabel = codeBuilder.getNewLabel();
    let typeExp = this.exp.type;
    let scopeSize = scope.size;
    let t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary();
    let dirCond: string;
    for (let label of this.labels) {
      label.labelExit = codeBuilder.getNewLabel();
      if (label.exp) {
        label.exp.translate(typeFactory, codeBuilder, scope);
        dirCurrent = this.getDir(typeFactory, codeBuilder);
        dirCond = dirExp;
        if (
          typeFactory.isString(typeExp) &&
          typeFactory.isString(label.exp.type)
        ) {
          codeBuilder.setTranslatedCode(`P = P + ${scopeSize};
${t1} = P + 1;
Stack[${t1}] = ${dirExp};
${t1} = P + 2;
Stack[${t1}] = ${dirCurrent};
call native_comparar_cadenas;
${t2} = Stack[P];
P = P - ${scopeSize};
`);
          codeBuilder.removeUnusedTemporary(dirCurrent);
          dirCond = t2;
          dirCurrent = "1";
        }
        codeBuilder.setTranslatedCode(
          `if (${dirCond} == ${dirCurrent}) goto ${label.labelExit};\n`
        );
        codeBuilder.removeUnusedTemporary(dirCurrent);
      } else {
        if (!defaultLabel) {
          defaultLabel = label;
        }
      }
    }
    codeBuilder.removeUnusedTemporary(dirExp);
    if (defaultLabel) {
      codeBuilder.setTranslatedCode(`goto ${defaultLabel.labelExit};\n`);
    }

    for (let label of this.labels) {
      if (label.exp) {
        label.breakLabel = this.breakLabel;
        label.continueLabel = this.continueLabel;
        label.translate(typeFactory, codeBuilder, this.localScope);
      }
    }
    codeBuilder.setTranslatedCode(`goto ${this.breakLabel};\n`);
    if (defaultLabel) {
      defaultLabel.breakLabel = this.breakLabel;
      defaultLabel.continueLabel = this.continueLabel;
      defaultLabel.translate(typeFactory, codeBuilder, this.localScope);
    }
    codeBuilder.setTranslatedCode(`${this.breakLabel}:\n`);
  }

  private getDir(typeFactory: TypeFactory, codeBuilder: CodeTranslator) {
    let dirExp: string;
    if (typeFactory.isBoolean(this.exp.type)) {
      dirExp = codeBuilder.getNewTemporary();
      codeBuilder.printFalseLabels();
      codeBuilder.setTranslatedCode(`${dirExp} = 0;`);
      let LS = codeBuilder.getNewLabel();
      codeBuilder.setTranslatedCode(`goto ${LS};\n`);
      codeBuilder.printTrueLabels();
      codeBuilder.setTranslatedCode(`${dirExp} = 1;\n${LS}:\n`);
      codeBuilder.addUnusedTemporary(dirExp);
    } else {
      dirExp = codeBuilder.getLastAddress();
    }
    return dirExp;
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM_EXP = this.exp.getAstNode(ast, str);

    const NUM = ast.contNodes++;
    str.push(`
  node${NUM}[label="switch"];
  node${ast.contNodes}[label="("];
  node${NUM} -> node${ast.contNodes++};
  node${NUM} -> node${NUM_EXP};
  node${ast.contNodes}[label=")"];
  node${NUM} -> node${ast.contNodes++};
  node${ast.contNodes}[label="\\{"];
  node${NUM} -> node${ast.contNodes++};
`);
    let t: number;
    for (let label of this.labels) {
      t = label.getAstNode(ast, str);
      str.push(`  node${NUM} -> node${t};\n`);
    }
    str.push(`
  node${ast.contNodes}[label="\\}"];
  node${NUM} -> node${ast.contNodes++};
`);
    return NUM;
  }
}
