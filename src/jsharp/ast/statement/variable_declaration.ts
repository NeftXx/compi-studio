import Statement from "./statement";
import Expression from "../expression/expression";
import CodeBuilder from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, ErrorType, JType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";

export class VarDeclaration extends Statement {
  public constructor(
    nodeInfo: NodeInfo,
    public isConstant: boolean,
    public identifier: string,
    public exp: Expression
  ) {
    super(nodeInfo);
  }

  public createScope(scope: BlockScope): void {}

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {
    this.exp.verifyType(typeFactory, scope);
    let type = this.exp.type;
    if (type instanceof ErrorType) {
      scope.addError(type);
    }
    let ok = scope.createVariableLocal(this.identifier, type, this.isConstant);
    if (!ok) {
      scope.addError(
        new ErrorType(
          `Error la variable ${this.identifier} ya fue declarada.`,
          this.nodeInfo
        )
      );
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: BlockScope
  ): void {}
}

export class VarDeclarationGlobal extends Statement {
  public constructor(
    nodeInfo: NodeInfo,
    public identifier: string,
    public exp: Expression
  ) {
    super(nodeInfo);
  }

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {
    this.exp.verifyType(typeFactory, scope);
    let type = this.exp.type;
    if (type instanceof ErrorType) {
      scope.addError(type);
    }
    let globalScope = scope.getGlobal();
    let ok = globalScope.createVariableLocal(this.identifier, type, false);
    if (!ok) {
      scope.addError(
        new ErrorType(
          `Error la variable ${this.identifier} ya fue declarada en el ambito global del archivo ${globalScope.filename}`,
          this.nodeInfo
        )
      );
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: BlockScope
  ): void {
    this.exp.translate(typeFactory, codeBuilder, scope);
    let globalScope = scope.getGlobal();
    let variable = globalScope.getVariableLocal(this.identifier);
    if (
      typeFactory.isNumeric(this.exp.type) ||
      typeFactory.isString(this.exp.type)
    ) {
      codeBuilder.setTranslatedCode(
        `stack[${variable.ptr}] = ${codeBuilder.getLastAddress()};\n`
      );
    } else if (typeFactory.isBoolean(this.exp.type)) {
      let dir = codeBuilder.getNewTemporary();
      codeBuilder.printFalseLabels();
      codeBuilder.setTranslatedCode(`${dir} = 0;`);
      let LS = codeBuilder.getNewLabel();
      codeBuilder.setTranslatedCode(`goto ${LS};\n`);
      codeBuilder.printTrueLabels();
      codeBuilder.setTranslatedCode(`${dir} = 1;\n${LS}:\n`);
      codeBuilder.setTranslatedCode(`stack[${variable.ptr}] = ${dir};\n`);
    }
  }
}

export class VarDeclarationType extends Statement {
  public constructor(
    nodeInfo: NodeInfo,
    public type: JType,
    public idList: Array<string>,
    public exp?: Expression
  ) {
    super(nodeInfo);
  }

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {
    this.exp.verifyType(typeFactory, scope);
    let typeExp = this.exp.type;
    if (typeExp instanceof ErrorType) {
      scope.addError(typeExp);
    }
    let verify =
      (typeFactory.isDouble(this.type) && typeFactory.isNumeric(typeExp)) ||
      (typeFactory.isInteger(this.type) &&
        (typeFactory.isInteger(typeExp) || typeFactory.isChar(typeExp))) ||
      this.type.isEquals(typeExp);
    if (!verify) {
      scope.addError(
        new ErrorType(
          `Error no se puede asignar una expresion de tipo ${typeExp} en una declaracion de variables de tipo ${this.type}.`,
          this.nodeInfo
        )
      );
    }
    let ok: boolean;
    for (let identifier of this.idList) {
      ok = scope.createVariableLocal(identifier, this.type, false);
      if (!ok) {
        scope.addError(
          new ErrorType(
            `Error la variable ${identifier} ya fue declarada.`,
            this.nodeInfo
          )
        );
      }
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: BlockScope
  ): void {}
}
