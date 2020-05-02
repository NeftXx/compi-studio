import { GlobalScope, FileScope, MethodScope } from "../scope/scope";
import { TypeFactory, ErrorType } from "../scope/type";
import Statement from "./statement/statement";
import CodeBuilder from "../scope/code_builder";
import ImportStm from "./statement/import";
import FunctionStm from "./statement/function";
import { Variable } from "../scope/variable";

export default class Ast {
  public constructor(
    public readonly astNodes: Array<Statement>,
    public readonly filename: string,
    public readonly importList?: ImportStm
  ) {}

  public resolveImports(globalScope: GlobalScope) {
    if (this.importList) {
      let fileScope = globalScope.enterFileScope(this.filename);
      let currentImport: FileScope;
      for (let filenameImport of this.importList.filenames) {
        currentImport = globalScope.enterFileScope(filenameImport);
        if (currentImport) {
          if (fileScope === currentImport) {
            globalScope.errorsList.push(
              new ErrorType(
                `Error esta intentando importar el mismo archivo ${filenameImport} en su entorno.`,
                this.importList.nodeInfo
              )
            );
          } else {
            fileScope.addImport(filenameImport, currentImport);
          }
        } else {
          globalScope.errorsList.push(
            new ErrorType(
              `Error no se encontro el archivo ${filenameImport}.`,
              this.importList.nodeInfo
            )
          );
        }
      }
    }
  }

  public buildScope(typeFactory: TypeFactory, globalScope: GlobalScope): void {
    let fileScope = globalScope.enterFileScope(this.filename);
    for (let statement of this.astNodes) {
      if (statement instanceof FunctionStm) {
        statement.buildScope(typeFactory, fileScope);
      }
    }
    for (let statement of this.astNodes) {
      if (!(statement instanceof FunctionStm)) {
        statement.buildScope(typeFactory, fileScope);
      }
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    globalScope: GlobalScope
  ): void {
    let fileScope = globalScope.enterFileScope(this.filename);
    fileScope.variables.forEach((variable: Variable, key: string) => {
      variable.address = codeBuilder.ptrStack++;
      codeBuilder.setGlobalVariables(
        `stack[${variable.address}] = ${variable.type.getValueDefault()};\n`
      );
    });
    fileScope.methods.forEach((method: MethodScope, key: string) => {
      method.updateAddresses();
    });
    for (let statement of this.astNodes) {
      statement.translate(typeFactory, codeBuilder, fileScope);
    }
  }
}
