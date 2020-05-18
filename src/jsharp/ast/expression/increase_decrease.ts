import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import { BlockScope, FileScope } from "../../scope/scope";
import CodeTranslator from "../../scope/code_builder";
import { TypeFactory, ErrorType } from "../../scope/type";
import AccessArray from "./access_array";
import AccessAttribute from "./access_attribute";
import Identifier from "./identifier";
import Ast from "../ast";

export default class IncreaseDecrease extends Expression {
  public constructor(
    nodeInfo: NodeInfo,
    private exp: Expression,
    private operator: string
  ) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    this.exp.verifyType(typeFactory, scope);
    let type = this.exp.type;
    if (type instanceof ErrorType) {
      scope.addError(type);
    }
    let verify =
      this.exp instanceof AccessArray ||
      this.exp instanceof AccessAttribute ||
      this.exp instanceof Identifier;
    if (verify) {
      if (
        this.exp instanceof AccessAttribute &&
        typeFactory.isArrayType(this.exp.exp.type)
      ) {
        this.type = new ErrorType(
          `Error no se puede usar el operador ${this.operator} en un atributo de un arreglo.`,
          this.nodeInfo
        );
      } else {
        if (typeFactory.isNumeric(type)) {
          this.type = type;
        } else {
          this.type = new ErrorType(
            `Error no se puede usar el operador ${this.operator} con una expresion ${type}.`,
            this.nodeInfo
          );
        }
      }
    } else {
      this.type = new ErrorType(
        `-Error no se puede usar el operador ${this.operator} con una expresion ${type}.`,
        this.nodeInfo
      );
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    this.exp.translate(typeFactory, codeBuilder, scope);
    if (this.exp instanceof Identifier) {
      this.translateId(codeBuilder, scope, this.exp);
    } else if (this.exp instanceof AccessAttribute) {
      this.translateAccess(codeBuilder, this.exp);
    } else if (this.exp instanceof AccessArray) {
      this.translateArray(codeBuilder, this.exp);
    }
  }

  private translateId(
    codeBuilder: CodeTranslator,
    scope: BlockScope,
    id: Identifier
  ) {
    let operator = this.operator === "++" ? "+" : "-";
    if (scope instanceof FileScope) {
      let variable = scope.getVariableLocal(id.identifier);
      if (variable) {
        let t1 = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`${t1} = ${codeBuilder.getLastAddress()} ${operator} 1; # Aplicando ${
          id.identifier
        }${this.operator}
Heap[${variable.ptr}] = ${t1}; # Asignando nuevo valor
`);
      }
    } else {
      let variable = scope.getVariable(id.identifier);
      if (variable) {
        let t1 = codeBuilder.getNewTemporary(),
          t2 = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`${t1} = ${codeBuilder.getLastAddress()} ${operator} 1; # Aplicando ${
          id.identifier
        }${this.operator}
${t2} = P + ${variable.ptr}; # Direccion de la variable ${id.identifier}
Stack[${t2}] = ${t1}; # Guardando nuevo valor en la variable ${id.identifier}
`);
      } else {
        variable = scope.getGlobal().getVariableLocal(id.identifier);
        if (variable) {
          let t1 = codeBuilder.getNewTemporary();
          codeBuilder.setTranslatedCode(`${t1} = ${codeBuilder.getLastAddress()} ${operator} 1; # Aplicando ${
            id.identifier
          }${this.operator}
Heap[${variable.ptr}] = ${t1}; # Asignando nuevo valor
`);
        }
      }
    }
  }

  private translateAccess(
    codeBuilder: CodeTranslator,
    access: AccessAttribute
  ) {
    let operator = this.operator === "++" ? "+" : "-";
    let t1 = codeBuilder.getNewTemporary();
    codeBuilder.setTranslatedCode(`${t1} = ${codeBuilder.getLastAddress()} ${operator} 1;
Heap[${access.tempDir}] = ${t1};
`);
  }

  private translateArray(
    codeBuilder: CodeTranslator,
    arrayAccess: AccessArray
  ) {
    let operator = this.operator === "++" ? "+" : "-";
    let t1 = codeBuilder.getNewTemporary();
    codeBuilder.setTranslatedCode(`${t1} = ${codeBuilder.getLastAddress()} ${operator} 1;
Heap[${arrayAccess.tempDir}] = ${t1};
`);
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM = ast.contNodes++;
    let i = this.exp.getAstNode(ast, str);
    str.push(`
  node${NUM}[label="Aumento/Incremento"];
  node${NUM} -> node${i};
  node${ast.contNodes}[label="${this.operator}"];
  node${NUM} -> node${ast.contNodes++};
`);
    return NUM;
  }
}
