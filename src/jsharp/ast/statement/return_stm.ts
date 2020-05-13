import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, JType, ErrorType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";
import Expression from "../expression/expression";

export default class ReturnStm extends Statement {
  public type: JType;

  public constructor(nodeInfo: NodeInfo, public exp: Expression) {
    super(nodeInfo);
  }

  public createScope(typeFactory: TypeFactory, scope: BlockScope): void {}

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {
    if (this.exp) {
      this.exp.verifyType(typeFactory, scope);
      this.type = this.exp.type;
      if (this.type instanceof ErrorType) scope.addError(this.type);
    } else {
      this.type = typeFactory.getVoid();
    }
    let returnType = scope.returnType;
    if (returnType) {
      let verify =
        (typeFactory.isDouble(returnType) &&
          typeFactory.isNumeric(this.type)) ||
        (typeFactory.isInteger(returnType) &&
          (typeFactory.isInteger(this.type) ||
            typeFactory.isChar(this.type))) ||
        returnType.isEquals(this.type);
      if (!verify) {
        scope.addError(
          new ErrorType(
            `Error no se puede asignar una expresion de tipo ${this.type} a una funcion de tipo ${returnType}.`,
            this.nodeInfo
          )
        );
      }
    } else {
      scope.addError(
        new ErrorType(
          `Error la sentencia return solo puede estar dentro de un procedimiento.`,
          this.nodeInfo
        )
      );
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    let label = codeBuilder.getNewLabel();
    if (this.exp) {
      this.exp.translate(typeFactory, codeBuilder, scope);
      let dirExp = this.getDir(typeFactory, codeBuilder);
      codeBuilder.setTranslatedCode(`Stack[P] = ${dirExp};\n`);
    }
    codeBuilder.setTranslatedCode(`goto ${label};\n`);
    codeBuilder.addReturnLabel(label);
  }

  private getDir(typeFactory: TypeFactory, codeBuilder: CodeTranslator) {
    let dirExp: string;
    if (typeFactory.isBoolean(this.exp.type)) {
      dirExp = codeBuilder.getNewTemporary();
      codeBuilder.printFalseLabels();
      codeBuilder.setTranslatedCode(`${dirExp} = 0;`);
      let LS = codeBuilder.getNewLabel();
      codeBuilder.setTranslatedCode(`goto ${LS};\n`);
      codeBuilder.printTrueLabels();
      codeBuilder.setTranslatedCode(`${dirExp} = 1;\n${LS}:\n`);
    } else {
      dirExp = codeBuilder.getLastAddress();
    }
    return dirExp;
  }
}
