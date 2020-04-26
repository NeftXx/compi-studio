import CodeBuilder from "../../../scope/code_builder";
import NodeInfo from "../../../scope/node_info";
import { TypeFactory } from "../../..//scope/type";
import { Scope } from "../../../scope/scope";
import Expression from "../expression";

export default class Arithmetic extends Expression {
  public constructor(
    nodeInfo: NodeInfo,
    private expLeft: Expression,
    private operator: string,
    private expRight: Expression
  ) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: Scope): void {
    this.expLeft.verifyType(typeFactory, scope);
    this.expRight.verifyType(typeFactory, scope);
    let type1 = this.expLeft.type;
    let type2 = this.expRight.type;
    if (typeFactory.isBaseType(type1) && typeFactory.isBaseType(type2)) {
      if (
        this.operator === "+" &&
        (typeFactory.isString(type1) ||
          typeFactory.isString(type2) ||
          (typeFactory.isChar(type1) && typeFactory.isChar(type2)))
      ) {
        this.type = typeFactory.getString();
        return;
      }

      if (typeFactory.isBoolean(type1) || typeFactory.isBoolean(type2)) {
        this.type = typeFactory.getErrorType(
          `Error no se puede operar con el operando ${this.operator} una expresion de tipo ${type1} con una expresion ${type2}.`,
          this.nodeInfo
        );
        return;
      }

      if (typeFactory.isDouble(type1) || typeFactory.isDouble(type2)) {
        this.type = typeFactory.getDouble();
        return;
      }
      this.type = typeFactory.getInteger();
      return;
    }
    if (typeFactory.isErrorType(type1)) {
      this.type = type1;
      return;
    }
    if (typeFactory.isErrorType(type2)) {
      this.type = type2;
      return;
    }
    this.type = typeFactory.getErrorType(
      `Error no se puede operar con el operando ${this.operator} una expresion de tipo ${type1} con una expresion ${type2}.`,
      this.nodeInfo
    );
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: Scope
  ): void {
    this.expLeft.translate(typeFactory, codeBuilder, scope);
    let t1 = codeBuilder.getLastTemporary();
    codeBuilder.addUnusedTemporary(t1);
    this.expRight.translate(typeFactory, codeBuilder, scope);
    let t2 = codeBuilder.getNewTemporary();
    codeBuilder.addUnusedTemporary(t2);
    if (typeFactory.isNumeric(this.type)) {
      if (this.operator === "^^") {
      } else {
        let t3 = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(
          `${t3} = ${t1} ${this.operator} ${t2};\n`
        );
        codeBuilder.addUnusedTemporary(t3);
        codeBuilder.removeUnusedTemporary(t1);
        codeBuilder.removeUnusedTemporary(t2);
      }
    } else {
    }
  }
}
