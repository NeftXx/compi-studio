import Statement from "../statement";
import NodeInfo from "../../../scope/node_info";
import Expression from "../../expression/expression";
import { TypeFactory, ErrorType } from "../../../scope/type";
import { BlockScope } from "../../../scope/scope";
import CodeTranslator from "../../../scope/code_builder";
import Access from "./access";
import IdentifierAccess from "./identifier_access";

export default class DecreaseIncrease extends Statement {
  public constructor(
    nodeInfo: NodeInfo,
    public access: Access,
    public operator: string
  ) {
    super(nodeInfo);
  }

  public createScope(typeFactory: TypeFactory, scope: BlockScope): void {}

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {
    this.access.verifyType(typeFactory, scope);
    let type = this.access.type;
    if (type instanceof ErrorType) {
      scope.addError(type);
    }
    if (this.access instanceof IdentifierAccess) {
      if (this.access.isConstant) {
        scope.addError(
          new ErrorType(
            `Error no se le puede asignar un nuevo valor a la variable ${this.access.identifier} ya que es una constante.`,
            this.nodeInfo
          )
        );
      }
    }
    if (!typeFactory.isNumeric(type)) {
      scope.addError(
        new ErrorType(
          `Error no se puede usar el operador ${this.operator} con una expresion ${type}.`,
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
    this.access.translate(typeFactory, codeBuilder, scope);
    let dirAccess = codeBuilder.getLastAddress();
    let t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary();
    let operator = this.operator === "++" ? "+" : "-";
    if (this.access.itsHeap) {
      codeBuilder.setTranslatedCode(`${t1} = Heap[${dirAccess}];
${t2} = ${t1} ${operator} 1;
Heap[${dirAccess}] = ${t2};
`);
    } else {
      codeBuilder.setTranslatedCode(`${t1} = Stack[${dirAccess}];
${t2} = ${t1} ${operator} 1;
Stack[${dirAccess}] = ${t2};
`);
    }
  }
}
