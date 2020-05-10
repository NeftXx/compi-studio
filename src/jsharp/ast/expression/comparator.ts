import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import { BlockScope } from "../../scope/scope";
import CodeTranslator from "../../scope/code_builder";
import { TypeFactory } from "../../scope/type";

export default class Comparator extends Expression {
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
    if (this.operator === "==" || this.operator === "!=") {
      if (
        (typeFactory.isNumeric(type1) && typeFactory.isNumeric(type2)) ||
        type1.isEquals(type2)
      ) {
        this.type = typeFactory.getBoolean();
      } else {
        this.type = typeFactory.getErrorType(
          `Error no se puede usar el operando <strong>'${this.operator}'</strong> con una expresion de tipo <strong>${type1}</strong> con una expresion <strong>${type2}</strong>.`,
          this.nodeInfo
        );
      }
    } else if (this.operator === "===" || this.operator === "!==") {
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
    if (this.operator === "==" || this.operator === "!=") {
      this.expLeft.translate(typeFactory, codeBuilder, scope);
      let dir1 = codeBuilder.getLastAddress();
      this.expRight.translate(typeFactory, codeBuilder, scope);
      let dir2 = codeBuilder.getLastAddress();
      if (
        typeFactory.isString(this.expLeft.type) &&
        typeFactory.isString(this.expRight.type)
      ) {
        codeBuilder.setTranslatedCode(`
`);
        dir2 = "0";
      }
      let LV = codeBuilder.getNewLabel();
      let LF = codeBuilder.getNewLabel();
      codeBuilder.setTranslatedCode(
        `if (${dir1} ${this.operator} ${dir2}) goto ${LV};\ngoto ${LF};\n`
      );
      codeBuilder.addTrueLabel(LV);
      codeBuilder.addFalseLabel(LF);
      return;
    } else if (this.operator === "===") {
    }
  }
}
