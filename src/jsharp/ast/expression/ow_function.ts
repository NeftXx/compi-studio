import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import CodeTranslator from "../../scope/code_builder";
import { BlockScope, FileScope } from "../../scope/scope";
import { TypeFactory, ErrorType } from "../../scope/type";
import Identifier from "./identifier";

export default class OwnFunctions extends Expression {
  private static readonly STRING_FUNCTIONS: Array<string> = [
    "tochararray",
    "length",
    "touppercase",
    "tolowercase",
    "charat",
  ];

  private static readonly ARRAY_FUNCTIONS: Array<string> = ["linealize"];

  private static readonly STRUCTURE_FUNCTIONS: Array<string> = [
    "size",
    "getreference",
    "instanceof",
  ];

  public constructor(
    nodeInfo: NodeInfo,
    public exp: Expression,
    public identifier: string,
    public param?: Expression
  ) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    this.exp.verifyType(typeFactory, scope);
    let type = this.exp.type;
    if (type instanceof ErrorType) {
      scope.addError(type);
    }
    if (typeFactory.isString(type)) {
      if (this.identifier === OwnFunctions.STRING_FUNCTIONS[0]) {
        this.type = typeFactory.createArrayType(typeFactory.getChar(), 1);
      } else if (this.identifier === OwnFunctions.STRING_FUNCTIONS[1]) {
        this.type = typeFactory.getInteger();
      } else if (this.identifier === OwnFunctions.STRING_FUNCTIONS[2]) {
        this.type = typeFactory.getString();
      } else if (this.identifier === OwnFunctions.STRING_FUNCTIONS[3]) {
        this.type = typeFactory.getString();
      } else if (this.identifier === OwnFunctions.STRING_FUNCTIONS[4]) {
        if (this.param) {
          this.param.verifyType(typeFactory, scope);
          let type = this.param.type;
          if (typeFactory.isInteger(type) || typeFactory.isChar(type)) {
            this.type = typeFactory.getChar();
          } else {
            this.type = new ErrorType(
              `Error en el parametro de la funcion charAt, se esperaba una expresion de tipo integer.`,
              this.nodeInfo
            );
          }
        } else {
          this.type = new ErrorType(
            `Error la funcion charAt, esperaba un parametro de tipo integer.`,
            this.nodeInfo
          );
        }
      } else {
        this.type = new ErrorType(
          `Error no existe la funcion ${this.identifier} en la estructura String.`,
          this.nodeInfo
        );
      }
    } else if (typeFactory.isArrayType(type)) {
      if (this.identifier === OwnFunctions.ARRAY_FUNCTIONS[0]) {
        this.type = type;
      } else {
        this.type = new ErrorType(
          `Error no existe la funcion ${this.identifier} en un arreglo.`,
          this.nodeInfo
        );
      }
    } else if (typeFactory.isStructure(type)) {
      if (this.identifier === OwnFunctions.STRUCTURE_FUNCTIONS[0]) {
        this.type = typeFactory.getInteger();
      } else if (this.identifier === OwnFunctions.STRUCTURE_FUNCTIONS[1]) {
        this.type = typeFactory.getInteger();
      } else if (this.identifier === OwnFunctions.STRUCTURE_FUNCTIONS[2]) {
        if (this.param) {
          if (this.param instanceof Identifier) {
            let structure = typeFactory.getStructure(
              this.nodeInfo.filename,
              this.param.identifier
            );
            if (structure) {
              this.type = typeFactory.getBoolean();
            } else {
              this.type = new ErrorType(
                `Error no existe una estructura con el identificador ${this.identifier}.`,
                this.nodeInfo
              );
            }
          } else {
            this.type = new ErrorType(
              `Error la funcion instanceOf, esperaba como parametro un identificador.`,
              this.nodeInfo
            );
          }
        } else {
          this.type = new ErrorType(
            `Error la funcion instanceOf, esperaba como parametro un identificador.`,
            this.nodeInfo
          );
        }
      } else {
        this.type = new ErrorType(
          `Error no existe la funcion ${this.identifier} en una estructura.`,
          this.nodeInfo
        );
      }
    } else {
      this.type = new ErrorType(
        `Error la expresion de tipo ${type} no tiene una funcion llamada ${this.identifier}.`,
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
    let type = this.exp.type;
    if (typeFactory.isString(type)) {
      if (this.identifier === OwnFunctions.STRING_FUNCTIONS[0]) {
        this.toCharArray(typeFactory, codeBuilder, scope);
      } else if (this.identifier === OwnFunctions.STRING_FUNCTIONS[1]) {
        this.lengthString(typeFactory, codeBuilder, scope);
      } else if (this.identifier === OwnFunctions.STRING_FUNCTIONS[2]) {
        this.toUpperCase(typeFactory, codeBuilder, scope);
      } else if (this.identifier === OwnFunctions.STRING_FUNCTIONS[3]) {
        this.toLowerCase(typeFactory, codeBuilder, scope);
      } else if (this.identifier === OwnFunctions.STRING_FUNCTIONS[4]) {
        this.chartAt(typeFactory, codeBuilder, scope);
      }
    }
  }

  private chartAt(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ) {
    let t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary();
    let dir = codeBuilder.getLastAddress();
    codeBuilder.removeUnusedTemporary(dir);
    this.param.translate(typeFactory, codeBuilder, scope);
    let dirParam = codeBuilder.getLastAddress();
    codeBuilder.removeUnusedTemporary(dirParam);
    let size = scope.size;
    codeBuilder.setTranslatedCode(`${t1} = P + ${size}; # Cambio simulado de ambito
${t2} = ${t1} + 1;
Stack[${t2}] = ${dir};
${t2} = ${t1} + 2;
Stack[${t2}] = ${dirParam};
P = P + ${size};
call native_char_at;
P = P - ${size};
${t3} = Stack[${t1}];
`);
    codeBuilder.setLastAddress(t3);
    codeBuilder.addUnusedTemporary(t3);
  }

  private toUpperCase(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ) {
    let t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary();
    let dir = codeBuilder.getLastAddress();
    codeBuilder.removeUnusedTemporary(dir);
    let size = scope.size;
    codeBuilder.setTranslatedCode(`${t1} = P + ${size}; # Cambio simulado de ambito
${t2} = ${t1} + 1;
Stack[${t2}] = ${dir};
P = P + ${size};
call native_to_upper_case;
P = P - ${size};
${t3} = Stack[${t1}];
`);
    codeBuilder.setLastAddress(t3);
    codeBuilder.addUnusedTemporary(t3);
  }

  private toLowerCase(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ) {
    let t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary();
    let dir = codeBuilder.getLastAddress();
    codeBuilder.removeUnusedTemporary(dir);
    let size = scope.size;
    codeBuilder.setTranslatedCode(`${t1} = P + ${size}; # Cambio simulado de ambito
${t2} = ${t1} + 1;
Stack[${t2}] = ${dir};
P = P + ${size};
call native_to_lower_case;
P = P - ${size};
${t3} = Stack[${t1}];
`);
    codeBuilder.setLastAddress(t3);
    codeBuilder.addUnusedTemporary(t3);
  }

  private lengthString(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ) {
    let t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary();
    let dir = codeBuilder.getLastAddress();
    codeBuilder.removeUnusedTemporary(dir);
    let size = scope.size;
    codeBuilder.setTranslatedCode(`${t1} = P + ${size}; # Cambio simulado de ambito
${t2} = ${t1} + 1;
Stack[${t2}] = ${dir};
P = P + ${size};
call native_cadena_length;
P = P - ${size};
${t3} = Stack[${t1}];
`);
    codeBuilder.setLastAddress(t3);
    codeBuilder.addUnusedTemporary(t3);
  }

  private toCharArray(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ) {
    let t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary();
    let dir = codeBuilder.getLastAddress();
    codeBuilder.removeUnusedTemporary(dir);
    let size = scope.size;
    codeBuilder.setTranslatedCode(`${t1} = P + ${size}; # Cambio simulado de ambito
${t2} = ${t1} + 1;
Stack[${t2}] = ${dir};
P = P + ${size};
call native_to_char_array;
P = P - ${size};
${t3} = Stack[${t1}];
`);
    codeBuilder.setLastAddress(t3);
    codeBuilder.addUnusedTemporary(t3);
  }
}
