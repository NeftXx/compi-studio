import CodeBuilder from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, JType, ErrorType } from "../../scope/type";
import { FileScope } from "../../scope/scope";
import Statement from "./statement";
import Parameter from "./parameter";
import Block from "./block";

export default class FunctionStm extends Statement {
  private identifierReal: string;
  public constructor(
    nodeInfo: NodeInfo,
    private type: JType,
    private identifier: string,
    private parameters: Array<Parameter>,
    private block: Block
  ) {
    super(nodeInfo);
    this.identifierReal = this.identifier;
  }

  public buildScope(typeFactory: TypeFactory, scope: FileScope): void {
    let paramNames: Array<string> = [];
    for (let parameter of this.parameters) {
      paramNames.push(parameter.identifier);
      this.identifierReal = `${this.identifierReal}_${parameter.type}`;
    }
    let ok = scope.createMethod(this.identifierReal, paramNames, this.type);
    if (!ok) {
      scope.addError(
        new ErrorType(
          `Error ya existe un metodo declarado con este nombre ${this.identifier}`,
          this.nodeInfo
        )
      );
    } else {
      let methodScope = scope.getMethod(this.identifierReal);
      for (let parameter of this.parameters) {
        parameter.buildScope(typeFactory, methodScope);
      }
      this.block.buildScope(typeFactory, methodScope);
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: FileScope
  ): void {
    let nameFunction = `${scope.filename.replace(/[.]|[-]/gi, "_")}_${
      this.identifierReal
    }`;
    let methodScope = scope.getMethod(this.identifierReal);
    if (this.identifier === "principal") {
      methodScope.setName(nameFunction);
      codeBuilder.setMainFunction(methodScope);
    }
    codeBuilder.setTranslatedCode(`proc ${nameFunction}  begin\n`);
    this.block.translate(typeFactory, codeBuilder, methodScope);
    codeBuilder.setTranslatedCode("end\n");
  }
}
