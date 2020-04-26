import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import { Scope } from "../../scope/scope";
import CodeBuilder from "../../scope/code_builder";
import { TypeFactory } from "../../scope/type";

export default class And extends Expression {
  public constructor(
    nodeInfo: NodeInfo,
    private expLeft: Expression,
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
    let LV1 = codeBuilder.getNewLabel();
    let LF1 = codeBuilder.getNewLabel();
    let LV2 = codeBuilder.getNewLabel();
    let LF2 = codeBuilder.getNewLabel();
    let ts = codeBuilder.getNewTemporary();

    this.expLeft.translate(typeFactory, codeBuilder, scope);
    let t1 = codeBuilder.getLastTemporary();
    codeBuilder.addUnusedTemporary(t1);
    codeBuilder.setTranslatedCode(`${ts} = 0;\n`);
    codeBuilder.addUnusedTemporary(ts);
    codeBuilder.setTranslatedCode(`if (${t1} == 1) goto ${LV1};\n`);
    codeBuilder.removeUnusedTemporary(t1);
    codeBuilder.setTranslatedCode(`goto ${LF1};\n${LV1}:\n`);

    this.expRight.translate(typeFactory, codeBuilder, scope);
    let t2 = codeBuilder.getLastTemporary();
    codeBuilder.addUnusedTemporary(t2);
    codeBuilder.setTranslatedCode(`if (${t2} == 1) goto ${LV2};\n`);
    codeBuilder.removeUnusedTemporary(t2);
    codeBuilder.setTranslatedCode(`goto ${LF2};\n${LV2}:\n`);
    codeBuilder.setTranslatedCode(`${ts} = 1;\n`);
    codeBuilder.addUnusedTemporary(ts);
    codeBuilder.setTranslatedCode(`${LF1}:\n${LF2}:\n`);
    codeBuilder.setTranslatedCode(
      `${codeBuilder.getNewTemporary()} = ${ts};\n`
    );
  }
}
