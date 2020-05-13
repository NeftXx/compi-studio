import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import { BlockScope, MethodScope } from "../../scope/scope";
import CodeTranslator from "../../scope/code_builder";
import { TypeFactory, JType, ErrorType } from "../../scope/type";

export default class CallFunction extends Expression {
  private identifierReal: string;
  private scopeMethod: MethodScope;

  public constructor(
    nodeInfo: NodeInfo,
    public identifier: string,
    public argumentsList: Array<Expression>
  ) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    this.identifierReal = this.identifier;
    let noError = true;
    let typeCurrent: JType;
    for (let argument of this.argumentsList) {
      argument.verifyType(typeFactory, scope);
      typeCurrent = argument.type;
      if (typeCurrent instanceof ErrorType) {
        scope.addError(typeCurrent);
        noError = false;
      } else {
        this.identifierReal = `${this.identifierReal}_${argument.type}`;
      }
    }
    if (noError) {
      this.scopeMethod = scope.getGlobal().enterMethod(this.identifierReal);
      if (this.scopeMethod) {
        this.type = this.scopeMethod.returnType;
      } else {
        this.type = new ErrorType(
          `No existe una funcion llamada ${this.identifierReal}.`,
          this.nodeInfo
        );
      }
    } else {
      this.type = new ErrorType(
        `Existe errores en los parametros al llamar la funcion ${this.identifier}.`,
        this.nodeInfo
      );
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    const paramList: Array<string> = [];
    for (let argument of this.argumentsList) {
      argument.translate(typeFactory, codeBuilder, scope);
      paramList.push(this.getDir(typeFactory, codeBuilder, argument));
    }
    let scopeSize = scope.size;
    codeBuilder.setTranslatedCode(`P = P + ${scopeSize};\n`);
    let temp = codeBuilder.getNewTemporary();
    let unused = codeBuilder.getUnusedTemporary();
    unused.map((m, n) => {
      codeBuilder.setTranslatedCode(`${temp} = P + ${n};
Stack[${temp}] = ${m};
`);
    });
    codeBuilder.setTranslatedCode(`P = P + ${unused.length};\n`);
    paramList.map((m, n) => {
      codeBuilder.setTranslatedCode(`${temp} = P + ${n + 1};
Stack[${temp}] = ${m};
`);
    });

    codeBuilder.setTranslatedCode(`call ${this.scopeMethod.getName()};\n`);
    let temp2 = codeBuilder.getNewTemporary();
    codeBuilder.setTranslatedCode(`${temp2} = Stack[P];\n`);
    codeBuilder.setTranslatedCode(`P = P - ${unused.length};\n`);
    unused.map((m, n) => {
      codeBuilder.setTranslatedCode(`${temp} = P + ${n};
${m} = Stack[${temp}];
`);
    });
    codeBuilder.setTranslatedCode(`P = P - ${scopeSize};\n`);
    paramList.forEach((m) => {
      codeBuilder.removeUnusedTemporary(m);
    });
    codeBuilder.setLastAddress(temp2);
    codeBuilder.addUnusedTemporary(temp2);
  }

  private getDir(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    exp: Expression
  ) {
    let dirExp: string;
    if (typeFactory.isBoolean(exp.type)) {
      dirExp = codeBuilder.getNewTemporary();
      codeBuilder.printFalseLabels();
      codeBuilder.setTranslatedCode(`${dirExp} = 0;\n`);
      let LS = codeBuilder.getNewLabel();
      codeBuilder.setTranslatedCode(`goto ${LS};\n`);
      codeBuilder.printTrueLabels();
      codeBuilder.setTranslatedCode(`${dirExp} = 1;\n${LS}:\n`);
    } else {
      dirExp = codeBuilder.getLastAddress();
      codeBuilder.removeUnusedTemporary(dirExp);
    }
    return dirExp;
  }
}
