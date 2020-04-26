import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import CodeBuilder from "../../scope/code_builder";
import { Scope } from "../../scope/scope";
import { JType, TypeFactory } from "../../scope/type";

export default class Literal extends Expression {
  public constructor(
    nodeInfo: NodeInfo,
    public type: JType,
    public value: any
  ) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: Scope): JType {
    if (typeFactory.isInteger(this.type) && typeof this.value === "number") {
      this.value = ~~this.value;
    } else if (
      typeFactory.isChar(this.type) &&
      typeof this.value === "string"
    ) {
      this.value = this.value.charCodeAt(0);
    }
    return this.type;
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: Scope
  ): void {
    if (typeof this.value === "string") {
      codeBuilder.setTranslatedCode(`# Inicio de cadena\n`);
      let tempStart = codeBuilder.getNewTemporary();
      codeBuilder.setTranslatedCode(`${tempStart} = H;\n`);
      for (let i = 0; i < this.value.length; i++) {
        codeBuilder.setTranslatedCode(
          `Heap[H] = ${this.value.charCodeAt(i)};\n`
        );
        codeBuilder.setTranslatedCode("H = H + 1;\n");
      }
      codeBuilder.setTranslatedCode(`Heap[H] = 0;\n`);
      codeBuilder.setTranslatedCode("H = H + 1;\n");
      let tempEnd = codeBuilder.getNewTemporary();
      codeBuilder.setTranslatedCode(`${tempEnd} = ${tempStart};\n`);
      codeBuilder.addUnusedTemporary(tempEnd);
      codeBuilder.removeUnusedTemporary(tempStart);
      codeBuilder.setTranslatedCode(`# Fin de cadena\n`);
    } else if (typeof this.value === "number") {
      let temporary = codeBuilder.getNewTemporary();
      codeBuilder.setTranslatedCode(`${temporary} = ${this.value};\n`);
      codeBuilder.addUnusedTemporary(temporary);
    } else {
      let temporary = codeBuilder.getNewTemporary();
      codeBuilder.setTranslatedCode(`${temporary} = -1;\n`);
      codeBuilder.addUnusedTemporary(temporary);
    }
  }
}
