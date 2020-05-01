import Ast from "./ast/ast";
import { logger } from "../utils/logger";
import { Parser as JSharpParser } from "./grammar/grammar";
import { TypeFactory, ErrorType } from "./scope/type";
import CodeBuilder from "./scope/code_builder";
import { GlobalScope } from "./scope/scope";

export interface FileInformation {
  filename: string;
  content: string;
}

export interface JSharpResult {
  isError: boolean;
  translate: string;
  symbolsTable: string;
  errorsTable: string;
}

export class JSharp {
  public exec(data: Array<FileInformation>): JSharpResult {
    let currentFile = "";
    try {
      let typeFactory = new TypeFactory();
      let trees: Array<Ast> = [];
      let parser: any;
      for (let file of data) {
        parser = new JSharpParser();
        currentFile = file.filename;
        parser.yy = { filename: currentFile, typeFactory: typeFactory };
        if (file.content !== "") {
          trees.push(parser.parse(file.content));
        }
      }
      let globalScope = this.createGlobalScope(trees);
      this.buildScopes(trees, typeFactory, globalScope);
      if (globalScope.errorsEmpty()) {
        let codeBuilder = new CodeBuilder();
        this.translate(trees, typeFactory, codeBuilder, globalScope);
        return {
          isError: false,
          translate: codeBuilder.getCodeTranslate(),
          symbolsTable: this.createSymbolTable(),
          errorsTable: "",
        };
      } else {
        return {
          isError: true,
          translate: "",
          symbolsTable: this.createSymbolTable(),
          errorsTable: this.createErrorTable(globalScope.errorsList),
        };
      }
    } catch (error) {
      if (error.hash) {
        return {
          isError: true,
          translate: "",
          symbolsTable: "",
          errorsTable: `
    <tr>
      <td>Error no se esperaba: <strong>${
        error.hash.token
      }</strong>. Se esperaba: <strong>${error.hash.expected.join(
            " "
          )}</strong>.</td>
      <td>${error.hash.loc.first_line}</td>
      <td>${error.hash.loc.last_column}</td>
      <td>${currentFile}</td>
    </tr>`,
        };
      } else {
        logger.error(error.message);
        return {
          isError: true,
          translate: "",
          symbolsTable: "",
          errorsTable: `
    <tr>
      <td>Ocurrio un error en el servidor</td>
      <td>0</td>
      <td>0</td>
      <td></td>
    </tr>
    `,
        };
      }
    }
  }

  private translate(
    trees: Array<Ast>,
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    globalScope: GlobalScope
  ) {
    for (let tree of trees) {
      tree.translate(typeFactory, codeBuilder, globalScope);
    }
  }

  private buildScopes(
    trees: Array<Ast>,
    typeFactory: TypeFactory,
    globalScope: GlobalScope
  ): void {
    for (let tree of trees) {
      tree.buildImports(globalScope);
    }
    for (let tree of trees) {
      tree.buildScope(typeFactory, globalScope);
    }
  }

  private createGlobalScope(trees: Array<Ast>): GlobalScope {
    let globalScope = new GlobalScope();
    for (let ast of trees) {
      globalScope.createFileScope(ast.filename);
    }
    return globalScope;
  }

  private createSymbolTable(): string {
    return "";
  }

  private createErrorTable(errorsList: Array<ErrorType>): string {
    let str = [];
    for (let error of errorsList) {
      str.push(`
    <tr>
      <td>${error.getMessage()}</td>
      <td>${error.getLine()}</td>
      <td>${error.getColumn()}</td>
      <td>${error.getFilename()}</td>
    </tr>`);
    }
    return str.join("");
  }
}
