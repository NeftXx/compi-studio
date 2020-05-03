import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import CodeBuilder from "../../scope/code_builder";
import { BlockScope } from "../../scope/scope";
import { TypeFactory, ErrorType } from "../../scope/type";

export default class Identifier extends Expression {
  public constructor(nodeInfo: NodeInfo, public identifier: string) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    let variable = scope.getVariable(this.identifier);
    if (!variable) {
      let globalScope = scope.getGlobal();
      variable = globalScope.getVariableLocal(this.identifier);
      if (!variable) {
        this.type = new ErrorType(
          `Error la variable ${this.identifier} no ha sido declarada.`,
          this.nodeInfo
        );
      } else {
        this.type = variable.type;
      }
    } else {
      this.type = variable.type;
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: BlockScope
  ): void {
    let variable = scope.getVariable(this.identifier);
    if (variable) {
      let t1 = codeBuilder.getNewTemporary();
      let t2 = codeBuilder.getNewTemporary();
      codeBuilder.setTranslatedCode(`${t1} = P + ${variable.ptr};
${t2} = Stack[${t1}];\n`);
      codeBuilder.setLastAddress(t2);
    } else {
      let globalScope = scope.getGlobal();
      variable = globalScope.getVariableLocal(this.identifier);
      if (variable) {
        let t1 = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`${t1} = Heap[${variable.ptr}];\n`);
        codeBuilder.setLastAddress(t1);
      }
    }
  }
}
