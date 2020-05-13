import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import {
  TypeFactory,
  StructureType,
  ErrorType,
  ArrayType,
  BaseType,
} from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Expression from "./expression";

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
        t2 = codeBuilder.getNewTemporary(),
        t3 = codeBuilder.getNewTemporary(),
        t4 = codeBuilder.getNewTemporary(),
        t5 = codeBuilder.getNewTemporary(),
        t6 = codeBuilder.getNewTemporary();
      codeBuilder.setTranslatedCode(`${t1} = P + ${size}; # Cambio simulado de ambito      
${t2} = ${t1} + 1;
Stack[${t2}] = ${this.nodeInfo.line};
${t3} = ${t1} + 2;
Stack[${t3}] = ${this.nodeInfo.column};
${t4} = ${t1} + 0;
Stack[${t4}] = -1;
P = P + ${size};
call ${this.structureType.nameReal};
P = P - ${size};
${t5} = ${t1} + 0;
${t6} = Stack[${t5}];
`);
      codeBuilder.setLastAddress(t6);
      codeBuilder.addUnusedTemporary(t6);
    }
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
      if (type instanceof BaseType) {
        this.translateBaseType(typeFactory, codeBuilder, scope, type);
      } else if (type instanceof StructureType) {
        this.translateStructureType(typeFactory, codeBuilder, scope, type);
      }
    }
  }

  private translateBaseType(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope,
    type: BaseType
  ) {
    let t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel(),
      L3 = codeBuilder.getNewLabel(),
      L4 = codeBuilder.getNewLabel();
    this.exp.translate(typeFactory, codeBuilder, scope);
    codeBuilder.setTranslatedCode(`${t1} = -1;
${t2} = ${codeBuilder.getLastAddress()};
if (${t2} > -1) goto ${L1};
E = 3;
goto ${L2};
${L1}:
${t1} = H;
Heap[H] = ${t2};
${t3} = 0;
${L3}:
if (${t3} > ${t2}) goto ${L4};
H = H + 1;
Heap[H] = ${type.getValueDefault()};
${t3} = ${t3} + 1;
goto ${L3};
${L4}:
${L2}:
`);
    codeBuilder.setLastAddress(t1);
    codeBuilder.addUnusedTemporary(t1);
  }

  private translateStructureType(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope,
    type: StructureType
  ) {
    this.exp.translate(typeFactory, codeBuilder, scope);
  }
}
