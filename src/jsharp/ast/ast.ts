import { SymbolTable, FileScope, MethodScope } from "../scope/scope";
import { TypeFactory, ErrorType } from "../scope/type";
import Statement from "./statement/statement";
import CodeBuilder from "../scope/code_builder";
import ImportStm from "./statement/import";
import FunctionStm from "./statement/function";
import { Variable } from "../scope/variable";

export default class Ast {
  private fileScope: FileScope;

  public constructor(
    public readonly astNodes: Array<Statement>,
    public readonly filename: string,
    public readonly importList?: ImportStm
  ) {}

  public createScope(symbolTable: SymbolTable) {
    let fileScope = symbolTable.enterFileScope(this.filename);
    if (fileScope) {
      this.fileScope = fileScope;
      this.resolveImports(symbolTable);
      this.saveMethods();
      this.saveVariables();
    }
  }

  private resolveImports(symbolTable: SymbolTable) {
    if (this.importList) {
      let currentImport: FileScope;
      for (let filenameImport of this.importList.filenames) {
        currentImport = symbolTable.enterFileScope(filenameImport);
        if (currentImport) {
          if (this.fileScope === currentImport) {
            symbolTable.errorsList.push(
              new ErrorType(
                `Error esta intentando importar el mismo archivo ${filenameImport} en su entorno.`,
                this.importList.nodeInfo
              )
            );
          } else {
            this.fileScope.addImport(filenameImport, currentImport);
          }
        } else {
          symbolTable.errorsList.push(
            new ErrorType(
              `Error no se encontro el archivo ${filenameImport}.`,
              this.importList.nodeInfo
            )
          );
        }
      }
    }
  }

  private saveMethods() {
    for (let statement of this.astNodes) {
      if (statement instanceof FunctionStm) {
        statement.createScope(this.fileScope);
      }
    }
  }

  private saveVariables() {
    for (let statement of this.astNodes) {
      statement.createScope(this.fileScope);
    }
  }

  public checkScope(typeFactory: TypeFactory): void {
    for (let statement of this.astNodes) {
      statement.checkScope(typeFactory, this.fileScope);
    }
  }

  public translate(typeFactory: TypeFactory, codeBuilder: CodeBuilder): void {
    this.fileScope.variables.forEach((variable: Variable, key: string) => {
      variable.ptr = codeBuilder.ptrHeap++;
      codeBuilder.ptrHeap++;
      codeBuilder.setGlobalVariables(`
# declaracion de la variable global ${key}
Heap[${variable.ptr}] = ${variable.type.getValueDefault()};
Heap[${codeBuilder.ptrHeap}] = 0;`);
    });
    this.fileScope.blocks.forEach((method: MethodScope) =>
      method.updateAddresses()
    );
    for (let statement of this.astNodes) {
      statement.translate(typeFactory, codeBuilder, this.fileScope);
    }
  }
}
