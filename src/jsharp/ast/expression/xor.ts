import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import { BlockScope } from "../../scope/scope";
import CodeTranslator from "../../scope/code_builder";
import { TypeFactory } from "../../scope/type";
import Ast from "../ast";

export default class Xor extends Expression {
  public constructor(
    nodeInfo: NodeInfo,
    private expLeft: Expression,
    private expRight: Expression
  ) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    this.expLeft.verifyType(typeFactory, scope);
    this.expRight.verifyType(typeFactory, scope);
    let type1 = this.expLeft.type;
    let type2 = this.expRight.type;
    if (typeFactory.isErrorType(type1)) {
      this.type = type1;
      return;
    }
    if (typeFactory.isErrorType(type2)) {
      this.type = type2;
      return;
    }
    if (typeFactory.isBoolean(type1) && typeFactory.isBoolean(type2)) {
      this.type = typeFactory.getBoolean();
    } else {
      this.type = typeFactory.getErrorType(
        `Error no se puede usar el operando <strong>'^'</strong> con una expresion de tipo <strong>${type1}</strong> con una expresion <strong>${type2}</strong>.`,
        this.nodeInfo
      );
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    this.expLeft.translate(typeFactory, codeBuilder, scope);
    codeBuilder.printFalseLabels();
    let tempTrueLabels = codeBuilder.tempTrueLabels();
    this.expRight.translate(typeFactory, codeBuilder, scope);
    this.printLabels(codeBuilder, tempTrueLabels);
    tempTrueLabels = codeBuilder.tempTrueLabels();
    let tempFalseLabels = codeBuilder.tempFalseLabels();
    this.expRight.translate(typeFactory, codeBuilder, scope);
    codeBuilder.swapLabels();
    codeBuilder.addFalseLabels(tempFalseLabels);
    codeBuilder.addTrueLabels(tempTrueLabels);
  }

  private printLabels(codeBuilder: CodeTranslator, labels: Array<string>) {
    let length = labels.length;
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        codeBuilder.setTranslatedCode(`${labels.pop()}: `);
      }
      codeBuilder.setTranslatedCode("\n");
    }
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM = ast.contNodes++;
    let i = this.expLeft.getAstNode(ast, str);
    let j = this.expRight.getAstNode(ast, str);
    str.push(`
  node${NUM}[label="^^"];
  node${NUM} -> node${i};
  node${NUM} -> node${j};
`);
    return NUM;
  }
}
