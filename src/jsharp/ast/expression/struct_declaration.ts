import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, StructureType, ErrorType } from "../../scope/type";
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
    }
  }
}

export class StructDeclarationArray extends Expression {
  public constructor(nodeInfo: NodeInfo, public identifier: string) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {}

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {}
}
