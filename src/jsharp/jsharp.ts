import Ast from "./ast/ast";
import { logger } from "../utils/logger";
import { Parser as JSharpParser } from "./grammar/grammar";
import { TypeFactory, ErrorType } from "./scope/type";
import CodeBuilder from "./scope/code_builder";
import { SymbolTable } from "./scope/scope";

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
      let typeFactory = new TypeFactory(); // controlador de tipos
      let trees: Array<Ast> = []; // arreglo de AST
      let parser: any;
      for (let file of data) {
        // Si el contenido esta vacio no se analiza
        if (file.content !== "") {
          parser = new JSharpParser();
          currentFile = file.filename;
          // enviando el nombre del archivo actual y el controlador de tipos al analizador
          parser.yy = { filename: currentFile, typeFactory: typeFactory };
          trees.push(parser.parse(file.content));
        }
      }
      let symbolTable = this.createSymbolTable(trees);
      this.buildScopes(trees, typeFactory, symbolTable);
      if (symbolTable.hasError()) {
        return {
          isError: true,
          translate: "",
          symbolsTable: symbolTable.getSymbolTable(),
          errorsTable: this.createErrorTable(symbolTable.errorsList),
        };
      } else {
        let codeBuilder = new CodeBuilder();
        this.translate(trees, typeFactory, codeBuilder);
        return {
          isError: false,
          translate: codeBuilder.getCodeTranslate(),
          symbolsTable: symbolTable.getSymbolTable(),
          errorsTable: "",
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
      <td>Ha ocurrido un error en el servidor</td>
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
    codeBuilder: CodeBuilder
  ) {
    for (let tree of trees) {
      tree.translate(typeFactory, codeBuilder);
    }
  }

  private buildScopes(
    trees: Array<Ast>,
    typeFactory: TypeFactory,
    symbolTable: SymbolTable
  ): void {
    for (let tree of trees) {
      tree.createScope(typeFactory, symbolTable);
    }
    for (let tree of trees) {
      tree.checkScope(typeFactory);
    }
  }

  private createSymbolTable(trees: Array<Ast>): SymbolTable {
    let symbolTable = new SymbolTable();
    for (let ast of trees) {
      symbolTable.createFileScope(ast.filename);
    }
    return symbolTable;
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
