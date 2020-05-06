import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Expression from "./expression";

export default class Arithmetic extends Expression {
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
          `Error no se puede usar el operando <strong>'${this.operator}'</strong> con una expresion de tipo <strong>${type1}</strong> con una expresion <strong>${type2}</strong>.`,
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
    this.type = typeFactory.getErrorType(
      `Error no se puede usar el operando <strong>'${this.operator}'</strong> con una expresion de tipo <strong>${type1}</strong> con una expresion <strong>${type2}</strong>.`,
      this.nodeInfo
    );
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
    let size = scope.size;
    if (typeFactory.isNumeric(this.type)) {
      if (this.operator === "^^") {
        let t3 = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(
          `${t3} = P + ${size}; # Cambio simulado de ambito\n`
        );

        let t4 = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(
          `${t4} = ${t3} + 1; # indice parametro\n`
        );
        codeBuilder.setTranslatedCode(
          `Stack[${t4}] = ${dir1}; # asignacion de parametro\n`
        );

        t4 = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(
          `${t4} = ${t3} + 2; # indice parametro\n`
        );
        codeBuilder.setTranslatedCode(
          `Stack[${t4}] = ${dir2}; # asignacion de parametro\n`
        );

        codeBuilder.setTranslatedCode(
          `P = P + ${size};\ncall native_potencia;\nP = P - ${size};\n`
        );
        t4 = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`${t4} = ${t3} + 0; # indice return\n`);
        let dir = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(
          `${dir} = stack[${t4}]; # asignacion del resultado del return\n`
        );
        codeBuilder.setLastAddress(dir);
      } else {
        let dir = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(
          `${dir} = ${dir1} ${this.operator} ${dir2};\n`
        );
        codeBuilder.setLastAddress(dir);
      }
    } else {
    }
  }
}
