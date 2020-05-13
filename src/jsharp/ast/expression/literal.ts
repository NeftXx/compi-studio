import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import CodeTranslator from "../../scope/code_builder";
import { BlockScope } from "../../scope/scope";
import { JType, TypeFactory } from "../../scope/type";

export default class Literal extends Expression {
  public constructor(nodeInfo: NodeInfo, type: JType, public value: any) {
    super(nodeInfo);
    this.type = type;
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    if (typeFactory.isInteger(this.type) && typeof this.value === "number") {
      this.value = ~~this.value;
    } else if (
      typeFactory.isChar(this.type) &&
      typeof this.value === "string"
    ) {
      this.value = this.value.charCodeAt(0);
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    if (typeof this.value === "string") {
      codeBuilder.setTranslatedCode(`# Inicio de cadena\n`);
      let tempStart = codeBuilder.getNewTemporary();
      codeBuilder.setTranslatedCode(`${tempStart} = H;\n`);
      let length = this.value.length;
      codeBuilder.setTranslatedCode(`Heap[H] = ${length};
H = H + 1;
`);
      for (let i = 0; i < length; i++) {
        codeBuilder.setTranslatedCode(`Heap[H] = ${this.value.charCodeAt(i)};
H = H + 1;
`);
      }
      codeBuilder.setTranslatedCode(`Heap[H] = 0;\n`);
      codeBuilder.setTranslatedCode("H = H + 1;\n");
      codeBuilder.setTranslatedCode(`# Fin de cadena\n`);
      codeBuilder.setLastAddress(tempStart);
      codeBuilder.addUnusedTemporary(tempStart);
    } else if (typeof this.value === "number") {
      codeBuilder.setLastAddress(this.value.toString());
    } else if (typeof this.value === "boolean") {
      let label = codeBuilder.getNewLabel();
      codeBuilder.setTranslatedCode(`goto ${label};\n`);
      if (this.value) codeBuilder.addTrueLabel(label);
      else codeBuilder.addFalseLabel(label);
    } else {
      codeBuilder.setLastAddress("-1");
    }
  }
}
