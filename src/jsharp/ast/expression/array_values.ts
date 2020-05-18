import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import { BlockScope } from "../../scope/scope";
import CodeTranslator from "../../scope/code_builder";
import { TypeFactory, ArrayType, ErrorType } from "../../scope/type";
import Ast from "../ast";

export default class ArrayValues extends Expression {
  public constructor(nodeInfo: NodeInfo, public expList: Array<Expression>) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    let length = this.expList.length;
    if (length > 0) {
      let exp = this.expList[0];
      exp.verifyType(typeFactory, scope);
      this.type = exp.type;
      if (this.type instanceof ErrorType) return;
      let verify: boolean;
      for (let i = 1; i < length; i++) {
        exp = this.expList[i];
        exp.verifyType(typeFactory, scope);
        let typeExp = exp.type;
        verify =
          (typeFactory.isDouble(this.type) && typeFactory.isNumeric(typeExp)) ||
          (typeFactory.isInteger(this.type) &&
            (typeFactory.isInteger(typeExp) || typeFactory.isChar(typeExp))) ||
          this.type.isEquals(typeExp);
        if (!verify) {
          scope.addError(
            new ErrorType(
              `Error no se puede asignar una expresion de tipo ${typeExp} en una declaracion de un arreglo de tipo ${this.type}.`,
              this.nodeInfo
            )
          );
        }
      }
      this.type = typeFactory.createArrayType(this.type, 1);
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    if (this.type instanceof ArrayType) {
      let values: Array<string> = [];
      for (let exp of this.expList) {
        exp.translate(typeFactory, codeBuilder, scope);
        values.push(this.getDir(typeFactory, codeBuilder, exp));
      }
      let length = values.length;
      let dir = codeBuilder.getNewTemporary();
      codeBuilder.setTranslatedCode(`${dir} = H;
Heap[H] = ${length};
H = H + 1;
`);
      values.forEach((v) => {
        codeBuilder.removeUnusedTemporary(v);
        codeBuilder.setTranslatedCode(`Heap[H] = ${v};
H = H + 1;
`);
      });
      codeBuilder.setLastAddress(dir);
      codeBuilder.addUnusedTemporary(dir);
    }
  }

  private getDir(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    exp: Expression
  ) {
    let dirExp: string;
    if (typeFactory.isBoolean(exp.type)) {
      dirExp = codeBuilder.getNewTemporary();
      codeBuilder.printFalseLabels();
      codeBuilder.setTranslatedCode(`${dirExp} = 0;\n`);
      let LS = codeBuilder.getNewLabel();
      codeBuilder.setTranslatedCode(`goto ${LS};\n`);
      codeBuilder.printTrueLabels();
      codeBuilder.setTranslatedCode(`${dirExp} = 1;\n${LS}:\n`);
    } else {
      dirExp = codeBuilder.getLastAddress();
    }
    return dirExp;
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM = ast.contNodes++;
    str.push(`
  node${NUM}[label="Valores de Array"];
  node${ast.contNodes}[label="{"];
  node${NUM} -> node${ast.contNodes++};
`);
    let i: number;
    for (let exp of this.expList) {
      i = exp.getAstNode(ast, str);
      str.push(`  node${NUM} -> node${i};\n`);
    }
    str.push(`
  node${ast.contNodes}[label="}"];
  node${NUM} -> node${ast.contNodes++};
`);
    return NUM;
  }
}
