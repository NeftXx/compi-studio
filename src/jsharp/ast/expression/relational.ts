import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import { BlockScope } from "../../scope/scope";
import CodeTranslator from "../../scope/code_builder";
import { TypeFactory } from "../../scope/type";
import Ast from "../ast";

export default class Relational extends Expression {
  public constructor(
    nodeInfo: NodeInfo,
    private expLeft: Expression,
    private operator: string,
    private expRight: Expression
  ) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    this.expLeft.verifyType(typeFactory, scope);
    let type1 = this.expLeft.type;
    this.expRight.verifyType(typeFactory, scope);
    let type2 = this.expRight.type;
    if (typeFactory.isErrorType(type1)) {
      this.type = type1;
      return;
    }
    if (typeFactory.isErrorType(type2)) {
      this.type = type2;
      return;
    }
    if (typeFactory.isNumeric(type1) && typeFactory.isNumeric(type2)) {
      this.type = typeFactory.getBoolean();
    } else {
      this.type = typeFactory.getErrorType(
        `Error no se puede usar el operando <strong>'${this.operator}'</strong> con una expresion de tipo <strong>${type1}</strong> con una expresion <strong>${type2}</strong>.`,
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
    let dir1 = codeBuilder.getLastAddress();
    this.expRight.translate(typeFactory, codeBuilder, scope);
    let dir2 = codeBuilder.getLastAddress();
    let LV = codeBuilder.getNewLabel();
    let LF = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(
      `if (${dir1} ${this.operator} ${dir2}) goto ${LV};\ngoto ${LF};\n`
    );
    codeBuilder.removeUnusedTemporary(dir1);
    codeBuilder.removeUnusedTemporary(dir2);
    codeBuilder.addTrueLabel(LV);
    codeBuilder.addFalseLabel(LF);
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM = ast.contNodes++;
    let i = this.expLeft.getAstNode(ast, str);
    let j = this.expRight.getAstNode(ast, str);
    str.push(`
  node${NUM}[label="\\${this.operator}"];
  node${NUM} -> node${i};
  node${NUM} -> node${j};
`);
    return NUM;
  }
}
