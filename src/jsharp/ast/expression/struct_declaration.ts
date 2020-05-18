import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import {
  TypeFactory,
  StructureType,
  ErrorType,
  ArrayType,
} from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Expression from "./expression";
import Ast from "../ast";

export class StructDeclaration extends Expression {
  private structureType: StructureType;

  public constructor(nodeInfo: NodeInfo, public identifier: string) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    this.structureType = typeFactory.getStructure(
      this.nodeInfo.filename,
      this.identifier
    );
    if (this.structureType && this.structureType.structure) {
      this.type = this.structureType;
    } else {
      this.type = new ErrorType(
        `Error no existe alguna estructura con nombre ${this.identifier}.`,
        this.nodeInfo
      );
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    if (this.structureType && this.structureType.structure) {
      let size = scope.size;
      let t1 = codeBuilder.getNewTemporary(),
        t2 = codeBuilder.getNewTemporary();
      codeBuilder.setTranslatedCode(`P = P + ${size}; # Cambio de ambito      
${t1} = P + 1; # Posicion de parametro
Stack[${t1}] = ${this.nodeInfo.line}; # Mandando linea
${t1} = P + 2; # Posicion de parametro
Stack[${t1}] = ${this.nodeInfo.column}; # Mandado columna
call ${this.structureType.nameReal};
${t2} = Stack[P];
P = P - ${size};
`);
      codeBuilder.setLastAddress(t2);
      codeBuilder.addUnusedTemporary(t2);
    }
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM = ast.contNodes++;
    str.push(`
  node${NUM}[label="Estructura"];
  node${ast.contNodes}[label="strc"];
  node${NUM} -> node${ast.contNodes++};
  node${ast.contNodes}[label="${this.identifier}"];
  node${NUM} -> node${ast.contNodes++};
  node${ast.contNodes}[label="("];
  node${NUM} -> node${ast.contNodes++};
  node${ast.contNodes}[label=")"];
  node${NUM} -> node${ast.contNodes++};
`);
    return NUM;
  }
}

export class StructDeclarationArray extends Expression {
  public constructor(
    nodeInfo: NodeInfo,
    type: ArrayType,
    public exp: Expression
  ) {
    super(nodeInfo);
    this.type = type;
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    if (this.type instanceof ArrayType) {
      let type = this.type.type;
      if (type instanceof StructureType) {
        if (!(type && type.structure)) {
          this.type = new ErrorType(
            `Error no existe alguna estructura con nombre ${type.nameType}.`,
            this.nodeInfo
          );
        }
      }
    } else {
      this.type = new ErrorType(
        `Error no se esperaba este tipo ${this.type}.`,
        this.nodeInfo
      );
    }
    this.exp.verifyType(typeFactory, scope);
    if (!typeFactory.isInteger(this.exp.type)) {
      this.type = new ErrorType(
        `Error se esperaba una expresion de tipo integer para construir el arreglo.`,
        this.nodeInfo
      );
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    if (this.type instanceof ArrayType) {
      let type = this.type.type;
      let t1 = codeBuilder.getNewTemporary(),
        t2 = codeBuilder.getNewTemporary(),
        t3 = codeBuilder.getNewTemporary();
      let L1 = codeBuilder.getNewLabel(),
        L2 = codeBuilder.getNewLabel(),
        L3 = codeBuilder.getNewLabel(),
        L4 = codeBuilder.getNewLabel();
      this.exp.translate(typeFactory, codeBuilder, scope);
      let last = codeBuilder.getLastAddress();
      codeBuilder.setTranslatedCode(`${t1} = -1;
${t2} = ${last};
if (${t2} > -1) goto ${L1};
E = 3;
goto ${L2};
${L1}:
${t1} = H;
Heap[H] = ${t2};
H = H + 1;
${t3} = 0;
${L3}:
if (${t3} > ${t2}) goto ${L4};
Heap[H] = ${type.getValueDefault()};
H = H + 1;
${t3} = ${t3} + 1;
goto ${L3};
${L4}:
${L2}:
`);
      codeBuilder.removeUnusedTemporary(last);
      codeBuilder.setLastAddress(t1);
      codeBuilder.addUnusedTemporary(t1);
    }
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM = ast.contNodes++;
    let i = this.exp.getAstNode(ast, str);
    str.push(`
  node${NUM}[label="Estructura"];
  node${ast.contNodes}[label="strc"];
  node${NUM} -> node${ast.contNodes++};
  node${ast.contNodes}[label="${this.type}"];
  node${NUM} -> node${ast.contNodes++};
  node${ast.contNodes}[label="["];
  node${NUM} -> node${ast.contNodes++};
  node${NUM} -> node${i};
  node${ast.contNodes}[label="]"];
  node${NUM} -> node${ast.contNodes++};
`);
    return NUM;
  }
}
