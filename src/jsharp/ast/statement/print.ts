import Statement from "./statement";
import Expression from "../expression/expression";
import CodeBuilder from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, ErrorType } from "../../scope/type";
import { Scope } from "../../scope/scope";

export default class Print extends Statement {
  public constructor(nodeInfo: NodeInfo, private exp: Expression) {
    super(nodeInfo);
  }

  public buildScope(typeFactory: TypeFactory, scope: Scope): void {
    this.exp.verifyType(typeFactory, scope);
    if (this.exp.type instanceof ErrorType) {
      scope.addError(this.exp.type);
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: Scope
  ): void {
    this.exp.translate(typeFactory, codeBuilder, scope);
    if (typeFactory.isChar(this.exp.type)) {
      codeBuilder.setTranslatedCode(
        `print("%c", ${codeBuilder.getLastTemporary()});\n`
      );
    } else if (typeFactory.isInteger(this.exp.type)) {
      codeBuilder.setTranslatedCode(
        `print("%i", ${codeBuilder.getLastTemporary()});\n`
      );
    } else if (typeFactory.isDouble(this.exp.type)) {
      codeBuilder.setTranslatedCode(
        `print("%d", ${codeBuilder.getLastTemporary()});\n`
      );
    } else if (typeFactory.isBoolean(this.exp.type)) {
      let temporaryLast = codeBuilder.getLastTemporary();
      let t1 = codeBuilder.getNewTemporary();
      codeBuilder.setTranslatedCode(
        `${t1} = P + 1; # Cambio simulado de ambito\n`
      );
      let t2 = codeBuilder.getNewTemporary();
      codeBuilder.setTranslatedCode(`${t2} = ${t1} + 0; # indice parametro\n`);
      codeBuilder.setTranslatedCode(
        `Stack[${t2}] = ${temporaryLast}; # asignacion de parametro\n`
      );
      codeBuilder.setTranslatedCode(
        "P = P + 1;\ncall native_print_boolean;\nP = P - 1;\n"
      );
    } else if (typeFactory.isString(this.exp.type)) {
      let temporaryLast = codeBuilder.getLastTemporary();
      let t1 = codeBuilder.getNewTemporary();
      codeBuilder.setTranslatedCode(
        `${t1} = P + 1; # Cambio simulado de ambito\n`
      );
      let t2 = codeBuilder.getNewTemporary();
      codeBuilder.setTranslatedCode(`${t2} = ${t1} + 0; # indice parametro\n`);
      codeBuilder.setTranslatedCode(
        `Stack[${t2}] = ${temporaryLast}; # asignacion de parametro\n`
      );
      codeBuilder.setTranslatedCode(
        "P = P + 1;\ncall native_print_string;\nP = P - 1;\n"
      );
    }
  }
}
