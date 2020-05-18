import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import { BlockScope, MethodScope } from "../../scope/scope";
import CodeTranslator from "../../scope/code_builder";
import { TypeFactory, JType, ErrorType } from "../../scope/type";
import Ast from "../ast";

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
    codeBuilder.setTranslatedCode(`P = P + ${scopeSize}; # Cambio de ambito\n`);
    let temp = codeBuilder.getNewTemporary();
    let unused = codeBuilder.getUnusedTemporary();
    unused.map((m, n) => {
      codeBuilder.setTranslatedCode(`${temp} = P + ${n}; # Direccion de temporal no usado
Stack[${temp}] = ${m}; # Guardando temporal no usado
`);
    });
    codeBuilder.setTranslatedCode(`# Aumentando el ambito, para guardar temporales no usados
P = P + ${unused.length};
# Mandando parametros
`);
    paramList.map((m, n) => {
      codeBuilder.setTranslatedCode(`${temp} = P + ${
        n + 1
      }; # parametro numero ${n}
Stack[${temp}] = ${m}; # Enviando parametros
`);
    });

    codeBuilder.setTranslatedCode(`call ${this.scopeMethod.getName()};\n`);
    let temp2 = codeBuilder.getNewTemporary();
    codeBuilder.setTranslatedCode(
      `${temp2} = Stack[P]; # Obteniendo valor del return\n`
    );
    codeBuilder.setTranslatedCode(`# Regresando a la posicion donde estan los temporales
P = P - ${unused.length};
`);
    unused.map((m, n) => {
      codeBuilder.setTranslatedCode(`${temp} = P + ${n}; # Posicion de temporal
${m} = Stack[${temp}]; # Recuperando temporal
`);
    });
    codeBuilder.setTranslatedCode(`P = P - ${scopeSize};\n`);
    paramList.forEach((m) => {
      codeBuilder.removeUnusedTemporary(m);
    });
    codeBuilder.setLastAddress(temp2);
    if (!typeFactory.isVoid(this.type)) codeBuilder.addUnusedTemporary(temp2);
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
    }
    return dirExp;
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM = ast.contNodes++;
    str.push(`
  node${NUM}[label="Llamada a funcion"];
  node${ast.contNodes}[label="${this.identifier}"];
  node${NUM} -> node${ast.contNodes++};
  node${ast.contNodes}[label="("]
  node${NUM} -> node${ast.contNodes++};
`);
    let i: number;
    for (let arg of this.argumentsList) {
      i = arg.getAstNode(ast, str);
      str.push(`  node${NUM} -> node${i};\n`);
    }
    str.push(`
  node${ast.contNodes}[label=")"]
  node${NUM} -> node${ast.contNodes++};
  node${ast.contNodes}[label=";"]
  node${NUM} -> node${ast.contNodes++};
`);
    return NUM;
  }
}
