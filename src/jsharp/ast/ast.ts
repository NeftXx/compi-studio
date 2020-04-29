import { GlobalScope, FileScope } from "../scope/scope";
import { TypeFactory, ErrorType } from "../scope/type";
import Statement from "./statement/statement";
import CodeBuilder from "../scope/code_builder";
import ImportStm from "./statement/import";

export default class Ast {
  public constructor(
    public readonly astNodes: Array<Statement>,
    public readonly filename: string,
    public readonly importList?: ImportStm
  ) {}

  public buildImports(globalScope: GlobalScope) {
    if (this.importList) {
      let fileScope = globalScope.getFileScope(this.filename);
      let currentImport: FileScope;
      for (let importStm of this.importList.filenames) {
        currentImport = globalScope.getFileScope(importStm);
        if (currentImport) {
          if (fileScope === currentImport) {
            globalScope.errorsList.push(
              new ErrorType(
                `Error no se puede importar el mismo archivo.`,
                this.importList.nodeInfo
              )
            );
          } else {
            fileScope.addImport(currentImport);
          }
        } else {
          globalScope.errorsList.push(
            new ErrorType(
              `Error no se encontro el archivo ${importStm}.`,
              this.importList.nodeInfo
            )
          );
        }
      }
    }
  }

  public buildScope(typeFactory: TypeFactory, globalScope: GlobalScope): void {
    let fileScope = globalScope.getFileScope(this.filename);
    for (let statement of this.astNodes) {
      statement.buildScope(typeFactory, fileScope);
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    globalScope: GlobalScope
  ): void {
    let fileScope = globalScope.getFileScope(this.filename);
    for (let statement of this.astNodes) {
      statement.translate(typeFactory, codeBuilder, fileScope);
    }
  }
}
