import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import { BlockScope } from "../../scope/scope";
import CodeTranslator from "../../scope/code_builder";
import { TypeFactory, JType } from "../../scope/type";
import Ast from "../ast";

export default class Cast extends Expression {
  public constructor(nodeInfo: NodeInfo, type: JType, private exp: Expression) {
    super(nodeInfo);
    this.type = type;
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    this.exp.verifyType(typeFactory, scope);
    let type = this.exp.type;
    if (typeFactory.isErrorType(type)) {
      this.type = type;
      return;
    }
    if (
      !(
        (typeFactory.isNumeric(this.type) && typeFactory.isNumeric(type)) ||
        (typeFactory.isBoolean(this.type) && typeFactory.isBoolean(type))
      )
    ) {
      this.type = typeFactory.getErrorType(
        `Error no se puede castear una expresion de tipo ${type} a tipo ${this.type}.`,
        this.nodeInfo
      );
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    this.exp.translate(typeFactory, codeBuilder, scope);
    if (
      typeFactory.isDouble(this.type) &&
      typeFactory.isNumeric(this.exp.type)
    ) {
      let dir = codeBuilder.getNewTemporary();
      let last = codeBuilder.getLastAddress();
      codeBuilder.setTranslatedCode(`${dir} = ${last} * 1.0;\n`);
      codeBuilder.removeUnusedTemporary(last);
      codeBuilder.setLastAddress(dir);
      codeBuilder.addUnusedTemporary(dir);
    } else if (
      typeFactory.isNumeric(this.type) &&
      typeFactory.isDouble(this.exp.type)
    ) {
      let t1 = codeBuilder.getNewTemporary();
      let dir = codeBuilder.getNewTemporary();
      let last = codeBuilder.getLastAddress();
      codeBuilder.setTranslatedCode(
        `${t1} = ${last} % 1;
${dir} = ${last} - ${t1};
`
      );
      codeBuilder.removeUnusedTemporary(last);
      codeBuilder.setLastAddress(dir);
      codeBuilder.addUnusedTemporary(dir);
    }
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM = ast.contNodes++;
    let i = this.exp.getAstNode(ast, str);
    str.push(`
  node${NUM}[label="cast"];
  node${ast.contNodes}[label="("];
  node${NUM} -> node${ast.contNodes++};
  node${ast.contNodes}[label="${this.type}"];
  node${NUM} -> node${ast.contNodes++};
  node${ast.contNodes}[label=")"];
  node${NUM} -> node${ast.contNodes++};
  node${NUM} -> node${i};
`);
    return NUM;
  }
}
