import { SymbolTable, FileScope, MethodScope } from "../scope/scope";
import { TypeFactory, ErrorType } from "../scope/type";
import Statement from "./statement/statement";
import CodeTranslator from "../scope/code_builder";
import ImportStm from "./statement/import";
import FunctionStm from "./statement/function";
import { Variable } from "../scope/variable";
import { Declaration } from "./statement/variable_declaration";

export default class Ast {
  private fileScope: FileScope;

  public constructor(
    public readonly astNodes: Array<Statement>,
    public readonly filename: string,
    public readonly importList?: ImportStm
  ) {}

  public createScope(typeFactory: TypeFactory, symbolTable: SymbolTable) {
    let fileScope = symbolTable.enterFileScope(this.filename);
    if (fileScope) {
      this.fileScope = fileScope;
      this.resolveImports(symbolTable);
      this.createScopes(typeFactory);
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

  private createScopes(typeFactory: TypeFactory) {
    for (let statement of this.astNodes) {
      statement.createScope(typeFactory, this.fileScope);
    }
  }

  public checkScope(typeFactory: TypeFactory): void {
    for (let statement of this.astNodes) {
      statement.checkScope(typeFactory, this.fileScope);
    }
  }

  public translateVariables(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator
  ) {
    this.fileScope.variables.forEach((variable: Variable, key: string) => {
      variable.ptr = codeBuilder.ptrHeap++;
      codeBuilder.setGlobalVariables(`
# reservacion de memoria de la variable global ${key}
Heap[${variable.ptr}] = ${variable.type.getValueDefault()};
Heap[${codeBuilder.ptrHeap}] = 0;`);
      codeBuilder.ptrHeap++;
    });
    for (let statement of this.astNodes) {
      if (statement instanceof Declaration) {
        statement.translate(typeFactory, codeBuilder, this.fileScope);
      }
    }
  }

  public translateMethods(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator
  ): void {
    this.fileScope.blocks.forEach((method: MethodScope) =>
      method.updateAddresses()
    );
    for (let statement of this.astNodes) {
      if (statement instanceof FunctionStm) {
        statement.translate(typeFactory, codeBuilder, this.fileScope);
      }
    }
  }
}
