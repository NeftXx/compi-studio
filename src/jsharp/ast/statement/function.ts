import CodeBuilder from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, JType, ErrorType } from "../../scope/type";
import { FileScope, MethodScope } from "../../scope/scope";
import Statement from "./statement";
import Parameter from "./parameter";
import Block from "./block";

export default class FunctionStm extends Statement {
  private methodScope: MethodScope | undefined;
  private identifierReal: string;

  public constructor(
    nodeInfo: NodeInfo,
    private type: JType,
    private identifier: string,
    private parameters: Array<Parameter>,
    private block: Block
  ) {
    super(nodeInfo);
  }

  public createScope(scope: FileScope) {
    let paramNames: Array<string> = [];
    for (let parameter of this.parameters) {
      paramNames.push(parameter.identifier);
      this.identifierReal = `${this.identifier}_${parameter.type}`;
    }
    let ok = scope.createMethod(this.identifierReal, paramNames, this.type);
    if (ok) {
      scope.addError(
        new ErrorType(
          `Error ya fue declarado el metodo ${this.identifierReal}.`,
          this.nodeInfo
        )
      );
      this.identifierReal = scope.createMethodError(
        this.identifierReal,
        paramNames,
        this.type
      );
    }
    this.methodScope = scope.enterMethod(this.identifierReal);
    let nameFunction = `${scope.filename.replace(/[.]|[-]/gi, "_")}_${
      this.identifierReal
    }`;
    this.methodScope.setName(nameFunction);
    for (let parameter of this.parameters) {
      parameter.createScope(this.methodScope);
    }
    this.block.createScope(this.methodScope);
  }

  public checkScope(typeFactory: TypeFactory, scope: FileScope): void {
    for (let parameter of this.parameters) {
      parameter.checkScope(typeFactory, this.methodScope);
    }
    this.block.checkScope(typeFactory, this.methodScope);
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: FileScope
  ): void {
    if (this.identifier === "principal") {
      codeBuilder.setMainFunction(this.methodScope);
    }
    codeBuilder.setTranslatedCode(
      `proc ${this.methodScope.getName()}  begin\n`
    );
    this.block.translate(typeFactory, codeBuilder, this.methodScope);
    codeBuilder.setTranslatedCode("end\n");
  }
}
