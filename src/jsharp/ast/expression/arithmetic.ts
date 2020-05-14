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
    let size = scope.size;
    if (typeFactory.isNumeric(this.type)) {
      this.expLeft.translate(typeFactory, codeBuilder, scope);
      let dir1 = codeBuilder.getLastAddress();
      this.expRight.translate(typeFactory, codeBuilder, scope);
      let dir2 = codeBuilder.getLastAddress();
      if (this.operator === "^^") {
        codeBuilder.setTranslatedCode(`P = P + ${size}; # Cambio de ambito\n`);

        let t4 = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`${t4} = P + 1; # indice parametro\n`);
        codeBuilder.setTranslatedCode(
          `Stack[${t4}] = ${dir1}; # asignacion de parametro\n`
        );
        codeBuilder.removeUnusedTemporary(dir1);
        t4 = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`${t4} = P + 2; # indice parametro\n`);
        codeBuilder.setTranslatedCode(
          `Stack[${t4}] = ${dir2}; # asignacion de parametro\n`
        );
        codeBuilder.removeUnusedTemporary(dir2);
        let dir = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`P = P + ${size};
call native_potencia;
${dir} = Stack[P]; # asignacion del resultado del return
P = P - ${size};`);
        codeBuilder.setLastAddress(dir);
        codeBuilder.addUnusedTemporary(dir);
      } else {
        let dir = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(
          `${dir} = ${dir1} ${this.operator} ${dir2};\n`
        );
        codeBuilder.removeUnusedTemporary(dir1);
        codeBuilder.removeUnusedTemporary(dir2);
        codeBuilder.setLastAddress(dir);
        codeBuilder.addUnusedTemporary(dir);
      }
    } else if (typeFactory.isString(this.type)) {
      let type1 = this.expLeft.type;
      let type2 = this.expRight.type;
      if (typeFactory.isString(type1) && typeFactory.isString(type2)) {
        this.expLeft.translate(typeFactory, codeBuilder, scope);
        let dir1 = codeBuilder.getLastAddress();
        this.expRight.translate(typeFactory, codeBuilder, scope);
        let dir2 = codeBuilder.getLastAddress();
        codeBuilder.setTranslatedCode(`P = P + ${size}; # Cambio de ambito\n`);
        let temp = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`${temp} = P + 1; # indice parametro\n`);
        codeBuilder.setTranslatedCode(
          `Stack[${temp}] = ${dir1}; # asignacion de parametro\n`
        );
        codeBuilder.removeUnusedTemporary(dir1);
        codeBuilder.setTranslatedCode(`${temp} = P + 2; # indice parametro
Stack[${temp}] = ${dir2}; # asignacion de parametro
`);
        codeBuilder.removeUnusedTemporary(dir2);
        let dir = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`call native_concatenar_cadenas;
${dir} = stack[P]; # asignacion del resultado del return
P = P - ${size};
`);
        codeBuilder.setLastAddress(dir);
        codeBuilder.addUnusedTemporary(dir);
      } else if (typeFactory.isString(type1) && typeFactory.isBoolean(type2)) {
        this.expLeft.translate(typeFactory, codeBuilder, scope);
        let dir1 = codeBuilder.getLastAddress();
        this.expRight.translate(typeFactory, codeBuilder, scope);
        let dir2 = codeBuilder.getNewTemporary();
        codeBuilder.printFalseLabels();
        codeBuilder.setTranslatedCode(`${dir2} = 0;\n`);
        let LTemp = codeBuilder.getNewLabel();
        codeBuilder.setTranslatedCode(`goto ${LTemp};\n`);
        codeBuilder.printTrueLabels();
        codeBuilder.setTranslatedCode(`${dir2} = 1;\n${LTemp}:
P = P + ${size}; # Cambio de ambito
`);
        let temp = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`${temp} = P + 1; # Indice parametro
Stack[${temp}] = ${dir1};
`);
        codeBuilder.removeUnusedTemporary(dir1);
        let dir = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`${temp} = P + 2; # indice de parametro
Stack[${temp}] = ${dir2};
call native_concatenar_string_boolean;
${dir} = Stack[P]; # asignacion del resultado del return
P = P - ${size};
`);
        codeBuilder.setLastAddress(dir);
        codeBuilder.addUnusedTemporary(dir);
      } else if (typeFactory.isBoolean(type1) && typeFactory.isString(type2)) {
        this.expLeft.translate(typeFactory, codeBuilder, scope);
        let dir1 = codeBuilder.getNewTemporary();
        codeBuilder.printFalseLabels();
        codeBuilder.setTranslatedCode(`${dir1} = 0;\n`);
        let LTemp = codeBuilder.getNewLabel();
        codeBuilder.setTranslatedCode(`goto ${LTemp};\n`);
        codeBuilder.printTrueLabels();
        codeBuilder.setTranslatedCode(`${dir1} = 1;\n${LTemp}:\n`);
        this.expRight.translate(typeFactory, codeBuilder, scope);
        let dir2 = codeBuilder.getLastAddress();
        codeBuilder.setTranslatedCode(`P = P + ${size}; # Cambio de ambito\n`);
        let temp = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`${temp} = P + 1; # indice parametro
Stack[${temp}] = ${dir1};
${temp} = P + 2; # indice parametro
Stack[${temp}] = ${dir2}; # asignacion de parametro
`);
        codeBuilder.removeUnusedTemporary(dir2);
        let dir = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`call native_concatenar_boolean_string;
${dir} = Stack[P]; # asignacion del resultado del return
P = P - ${size};
`);
        codeBuilder.setLastAddress(dir);
        codeBuilder.addUnusedTemporary(dir);
      } else if (typeFactory.isChar(type1) && typeFactory.isChar(type2)) {
        this.expLeft.translate(typeFactory, codeBuilder, scope);
        let dir1 = codeBuilder.getLastAddress();
        this.expRight.translate(typeFactory, codeBuilder, scope);
        let dir2 = codeBuilder.getLastAddress();
        codeBuilder.setTranslatedCode(`P = P + ${size}; # Cambio de ambito\n`);
        let t2 = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`${t2} = P + 1;
Stack[${t2}] = ${dir1}; # asignacion de parametro
`);
        codeBuilder.removeUnusedTemporary(dir1);
        let dir = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`${t2} = P + 2;
Stack[${t2}] = ${dir2}; # asignacion de parametro
call native_concatenar_caracteres;
${dir} = Stack[P]; # asignacion del resultado del return
P = P - ${size};
`);
        codeBuilder.removeUnusedTemporary(dir2);
        codeBuilder.setLastAddress(dir);
        codeBuilder.addUnusedTemporary(dir);
      } else if (typeFactory.isChar(type1) && typeFactory.isString(type2)) {
        this.expLeft.translate(typeFactory, codeBuilder, scope);
        let dir1 = codeBuilder.getLastAddress();
        this.expRight.translate(typeFactory, codeBuilder, scope);
        let dir2 = codeBuilder.getLastAddress();
        codeBuilder.setTranslatedCode(`P = P + ${size}; # Cambio de ambito\n`);
        let t2 = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`${t2} = P + 1;
Stack[${t2}] = ${dir1}; # asignacion de parametro
`);
        codeBuilder.removeUnusedTemporary(dir1);
        let dir = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`${t2} = P + 2;
Stack[${t2}] = ${dir2}; # asignacion de parametro
call native_concatenar_caracter_string;
${dir} = Stack[P]; # asignacion del resultado del return
P = P - ${size};
`);
        codeBuilder.removeUnusedTemporary(dir2);
        codeBuilder.setLastAddress(dir);
        codeBuilder.addUnusedTemporary(dir);
      } else if (typeFactory.isString(type1) && typeFactory.isChar(type2)) {
        this.expLeft.translate(typeFactory, codeBuilder, scope);
        let dir1 = codeBuilder.getLastAddress();
        this.expRight.translate(typeFactory, codeBuilder, scope);
        let dir2 = codeBuilder.getLastAddress();
        codeBuilder.setTranslatedCode(`P = P + ${size}; # Cambio de ambito\n`);
        let t2 = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`${t2} = P + 1;
Stack[${t2}] = ${dir1}; # asignacion de parametro
`);
        codeBuilder.removeUnusedTemporary(dir1);
        let dir = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`${t2} = P + 2;
Stack[${t2}] = ${dir2}; # asignacion de parametro
call native_concatenar_string_caracter;
${dir} = Stack[P]; # asignacion del resultado del return
P = P - ${size};
`);
        codeBuilder.removeUnusedTemporary(dir2);
        codeBuilder.setLastAddress(dir);
        codeBuilder.addUnusedTemporary(dir);
      } else if (
        (typeFactory.isInteger(type1) || typeFactory.isDouble(type1)) &&
        typeFactory.isString(type2)
      ) {
        this.expLeft.translate(typeFactory, codeBuilder, scope);
        let dir1 = codeBuilder.getLastAddress();
        this.expRight.translate(typeFactory, codeBuilder, scope);
        let dir2 = codeBuilder.getLastAddress();
        codeBuilder.setTranslatedCode(`P = P + ${size}; # Cambio de ambito\n`);
        let t2 = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`${t2} = P + 1;
Stack[${t2}] = ${dir1}; # asignacion de parametro
`);
        codeBuilder.removeUnusedTemporary(dir1);
        let dir = codeBuilder.getNewTemporary();
        let cond = typeFactory.isDouble(type1) ? 1 : 0;
        codeBuilder.setTranslatedCode(`${t2} = P + 2;
Stack[${t2}] = ${cond};
${t2} = P + 3;
Stack[${t2}] = ${dir2}; # asignacion de parametro
call native_concatenar_numero_string;
${dir} = Stack[P]; # asignacion del resultado del return
P = P - ${size};
`);
        codeBuilder.removeUnusedTemporary(dir2);
        codeBuilder.setLastAddress(dir);
        codeBuilder.addUnusedTemporary(dir);
      } else if (
        typeFactory.isString(type1) &&
        (typeFactory.isInteger(type2) || typeFactory.isDouble(type2))
      ) {
        this.expLeft.translate(typeFactory, codeBuilder, scope);
        let dir1 = codeBuilder.getLastAddress();
        this.expRight.translate(typeFactory, codeBuilder, scope);
        let dir2 = codeBuilder.getLastAddress();
        codeBuilder.setTranslatedCode(`P = P + ${size}; # Cambio de ambito\n`);
        let t2 = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`${t2} = P + 1;
Stack[${t2}] = ${dir1}; # asignacion de parametro
`);
        codeBuilder.removeUnusedTemporary(dir1);
        let dir = codeBuilder.getNewTemporary();
        let cond = typeFactory.isDouble(type2) ? 1 : 0;
        codeBuilder.setTranslatedCode(`${t2} = P + 2;
Stack[${t2}] = ${dir2}; # asignacion de parametro
${t2} = P + 3;
Stack[${t2}] = ${cond}; # asignacion de parametro
call native_concatenar_string_numero;
${dir} = Stack[P]; # asignacion del resultado del return
P = P - ${size};
`);
        codeBuilder.removeUnusedTemporary(dir2);
        codeBuilder.setLastAddress(dir);
        codeBuilder.addUnusedTemporary(dir);
      }
    }
  }
}
