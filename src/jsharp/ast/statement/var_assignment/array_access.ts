import NodeInfo from "../../../scope/node_info";
import Expression from "../../expression/expression";
import { TypeFactory, ArrayType, ErrorType } from "../../../scope/type";
import { BlockScope } from "../../../scope/scope";
import CodeTranslator from "../../../scope/code_builder";
import Access from "./access";

export default class ArrayAccess extends Access {
  public constructor(
    nodeInfo: NodeInfo,
    public exp: Access,
    public valueAccess: Expression
  ) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    this.exp.verifyType(typeFactory, scope);
    let type = this.exp.type;
    if (type instanceof ArrayType) {
      this.itsHeap = true;
      this.type = type.type;
    } else {
      this.type = new ErrorType(
        `Error debe ser un arreglo para acceder a una posición.`,
        this.nodeInfo
      );
    }
    this.valueAccess.verifyType(typeFactory, scope);
    if (!typeFactory.isInteger(this.valueAccess.type)) {
      this.type = new ErrorType(
        `Error se esperaba una expresion de tipo integer para acceder a una posición de un arreglo.`,
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
    let dirExp = codeBuilder.getLastAddress();
    let t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel(),
      L3 = codeBuilder.getNewLabel(),
      L4 = codeBuilder.getNewLabel(),
      L5 = codeBuilder.getNewLabel();
    if (this.exp.itsHeap) {
      codeBuilder.setTranslatedCode(`${t1} = Heap[${dirExp}];\n`);
      codeBuilder.removeUnusedTemporary(dirExp);
    } else {
      codeBuilder.setTranslatedCode(`${t1} = Stack[${dirExp}];\n`);
      codeBuilder.removeUnusedTemporary(dirExp);
    }
    codeBuilder.setTranslatedCode(`${t2} = Heap[${t1}];\n`);
    this.valueAccess.translate(typeFactory, codeBuilder, scope);
    let value = codeBuilder.getLastAddress();
    codeBuilder.setTranslatedCode(`
if (${value} > -1) goto ${L1};
goto ${L2};
${L1}:
if (${value} < ${t2}) goto ${L3};
goto ${L4};
${L3}:
${t3} = ${value} + 1;
${t4} = ${t1} + ${t3};
goto ${L5};
${L4}:
${L2}:
E = 2;
${L5}:
`);
    codeBuilder.setLastAddress(t4);
    codeBuilder.addUnusedTemporary(t4);
  }
}
