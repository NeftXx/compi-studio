import { FileScope } from "../scope/scope";
import { ErrorType, TypeFactory } from "../scope/type";
import Statement from "./statement/statement";
import CodeBuilder from "../scope/code_builder";

export default class Ast {
  private fileScope: FileScope | undefined;

  public constructor(
    public readonly astNodes: Array<Statement>,
    public readonly filename: string
  ) {}

  public newScope(errorsList: Array<ErrorType>): void {
    this.fileScope = new FileScope(errorsList);
  }

  public buildScope(typeFactory: TypeFactory): void {
    if (this.fileScope) {
      for (let statement of this.astNodes) {
        statement.buildScope(typeFactory, this.fileScope);
      }
    }
  }

  public translate(typeFactory: TypeFactory, codeBuilder: CodeBuilder): void {
    if (this.fileScope) {
      for (let statement of this.astNodes) {
        statement.translate(typeFactory, codeBuilder, this.fileScope);
      }
    }
  }
}
