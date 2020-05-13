import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import { BlockScope } from "../../scope/scope";
import CodeTranslator from "../../scope/code_builder";
import { TypeFactory, ArrayType, ErrorType } from "../../scope/type";

export default class AccessArray extends Expression {
  public constructor(
    nodeInfo: NodeInfo,
    private exp: Expression,
    private access: Expression
  ) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    this.exp.verifyType(typeFactory, scope);
    let type = this.exp.type;
    if (type instanceof ArrayType) {
      this.type = type.type;
    } else {
      this.type = new ErrorType(
        `Error debe ser un arreglo para acceder a una posición.`,
        this.nodeInfo
      );
    }
    this.access.verifyType(typeFactory, scope);
    if (!typeFactory.isInteger(this.access.type)) {
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
    let dir = codeBuilder.getLastAddress();
    let t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel(),
      L3 = codeBuilder.getNewLabel(),
      L4 = codeBuilder.getNewLabel(),
      L5 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`${t1} = Heap[${dir}];`);
    codeBuilder.removeUnusedTemporary(dir);
    this.access.translate(typeFactory, codeBuilder, scope);
    let value = codeBuilder.getLastAddress();
    codeBuilder.removeUnusedTemporary(value);
    codeBuilder.setTranslatedCode(`
if (${value} > -1) goto ${L1};
goto ${L2};
${L1}:
if (${value} < ${t1}) goto ${L3};
goto ${L4};
${L3}:
${t2} = ${value} + 1;
${t3} = ${dir} + ${t2};
${t4} = Heap[${t3}];
goto ${L5};
${L4}:
${L2}:
E = 2;
${L5}:
`);
    if (typeFactory.isBoolean(this.type)) {
      let LV = codeBuilder.getNewLabel(),
        LF = codeBuilder.getNewLabel();
      codeBuilder.setTranslatedCode(`if (${t4} == 1) goto ${LV};
goto ${LF};
`);
      codeBuilder.addTrueLabel(LV);
      codeBuilder.addFalseLabel(LF);
    } else {
      codeBuilder.setLastAddress(t4);
      codeBuilder.addUnusedTemporary(t4);
    }
  }
}
