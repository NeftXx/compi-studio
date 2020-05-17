import Statement from "./statement";
import Expression from "../expression/expression";
import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, ErrorType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";

export default class Print extends Statement {
  public constructor(nodeInfo: NodeInfo, private exp: Expression) {
    super(nodeInfo);
  }

  public createScope(typeFactory: TypeFactory, scope: BlockScope): void {}

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {
    this.exp.verifyType(typeFactory, scope);
    if (this.exp.type instanceof ErrorType) {
      scope.addError(this.exp.type);
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    this.exp.translate(typeFactory, codeBuilder, scope);
    if (typeFactory.isChar(this.exp.type)) {
      let last = codeBuilder.getLastAddress();
      codeBuilder.setTranslatedCode(`print("%c", ${last});\n`);
      codeBuilder.removeUnusedTemporary(last);
    } else if (typeFactory.isInteger(this.exp.type)) {
      let last = codeBuilder.getLastAddress();
      codeBuilder.setTranslatedCode(`print("%i", ${last});\n`);
      codeBuilder.removeUnusedTemporary(last);
    } else if (typeFactory.isDouble(this.exp.type)) {
      let last = codeBuilder.getLastAddress();
      codeBuilder.setTranslatedCode(`print("%d", ${last});\n`);
      codeBuilder.removeUnusedTemporary(last);
    } else if (typeFactory.isBoolean(this.exp.type)) {
      let dir = codeBuilder.getNewTemporary();
      codeBuilder.printFalseLabels();
      codeBuilder.setTranslatedCode(`${dir} = 0;\n`);
      let LTemp = codeBuilder.getNewLabel();
      codeBuilder.setTranslatedCode(`goto ${LTemp};\n`);
      codeBuilder.printTrueLabels();
      codeBuilder.setTranslatedCode(`${dir} = 1;\n${LTemp}:\n`);
      let t1 = codeBuilder.getNewTemporary();
      let size = scope.size;
      codeBuilder.setTranslatedCode(
        `${t1} = P + ${size}; # Cambio simulado de ambito\n`
      );
      let t2 = codeBuilder.getNewTemporary();
      codeBuilder.setTranslatedCode(`${t2} = ${t1} + 0; # indice parametro\n`);
      codeBuilder.setTranslatedCode(
        `Stack[${t2}] = ${dir}; # asignacion de parametro\n`
      );
      codeBuilder.setTranslatedCode(
        `P = P + ${size};\ncall native_print_boolean;\nP = P - ${size};\n`
      );
    } else if (typeFactory.isString(this.exp.type)) {
      let dirLast = codeBuilder.getLastAddress();
      let t1 = codeBuilder.getNewTemporary();
      let size = scope.size;
      codeBuilder.setTranslatedCode(
        `${t1} = P + ${size}; # Cambio simulado de ambito\n`
      );
      let t2 = codeBuilder.getNewTemporary();
      codeBuilder.setTranslatedCode(`${t2} = ${t1} + 0; # indice parametro\n`);
      codeBuilder.setTranslatedCode(
        `Stack[${t2}] = ${dirLast}; # asignacion de parametro\n`
      );
      codeBuilder.removeUnusedTemporary(dirLast);
      codeBuilder.setTranslatedCode(
        `P = P + ${size};\ncall native_print_string;\nP = P - ${size};\n`
      );
    } else {
      let dirLast = codeBuilder.getLastAddress();
      let LV = codeBuilder.getNewLabel(),
        LF = codeBuilder.getNewLabel();
      codeBuilder.setTranslatedCode(`if (${dirLast} == -1) goto ${LV};
print("%i", ${dirLast});
goto ${LF};
${LV}:
print("%c", 110); print("%c", 117); print("%c", 108); print("%c", 108);
${LF}:
`);
    }
  }
}
