import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import { Scope } from "../../scope/scope";
import CodeBuilder from "../../scope/code_builder";
import { TypeFactory } from "../../scope/type";

export default class Relational extends Expression {
  public constructor(
    nodeInfo: NodeInfo,
    private expLeft: Expression,
    private operator: string,
    private expRight: Expression
  ) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: Scope): void {
    this.type = typeFactory.getBoolean();
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: Scope
  ): void {
    this.expLeft.translate(typeFactory, codeBuilder, scope);
    let t1 = codeBuilder.getLastTemporary();
    codeBuilder.addUnusedTemporary(t1);
    this.expRight.translate(typeFactory, codeBuilder, scope);
    let t2 = codeBuilder.getLastTemporary();
    codeBuilder.addUnusedTemporary(t2);
    let t3 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel();
    let L2 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(
      `if (${t1} ${this.operator} ${t2}) goto ${L1};\n`
    );
    codeBuilder.removeUnusedTemporary(t1);
    codeBuilder.removeUnusedTemporary(t2);
    codeBuilder.setTranslatedCode(`${t3} = 0;\n`);
    codeBuilder.addUnusedTemporary(t3);
    codeBuilder.setTranslatedCode(`goto ${L2};\n${L1}:\n`);
    codeBuilder.setTranslatedCode(`${t3} = 1;\n`);
    codeBuilder.addUnusedTemporary(t3);
    codeBuilder.setTranslatedCode(`${L2}:\n`);
    codeBuilder.setTranslatedCode(
      `${codeBuilder.getNewTemporary()} = ${t3};\n`
    );
    codeBuilder.addUnusedTemporary(codeBuilder.getLastTemporary());
    codeBuilder.removeUnusedTemporary(t3);
  }
}
