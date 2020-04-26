import Ast from "./ast/ast";
import { logger } from "../utils/logger";
import { Parser as JSharpParser } from "./grammar/grammar";
import { TypeFactory, ErrorType } from "./scope/type";
import CodeBuilder from "./scope/code_builder";

export interface FileInformation {
  filename: string;
  content: string;
}

export interface JSharpResult {
  translate: string;
  symbolsTable: string;
  errorsTable: string;
}

export class JSharp {
  public exec(data: Array<FileInformation>): JSharpResult {
    let typeFactory = new TypeFactory();
    let codeBuilder = new CodeBuilder();
    let errorsList: Array<ErrorType> = [];
    let parser: any;
    let trees: Array<Ast> = [];
    let currentFile = "";
    try {
      for (let file of data) {
        parser = new JSharpParser();
        currentFile = file.filename;
        parser.yy = { filename: currentFile, typeFactory: typeFactory };
        trees.push(parser.parse(file.content));
      }
      for (let tree of trees) {
        tree.newScope(errorsList);
        tree.buildScope(typeFactory);
        tree.translate(typeFactory, codeBuilder);
      }
      return {
        translate: codeBuilder.getCodeTranslate(),
        symbolsTable: "",
        errorsTable: "",
      };
    } catch (error) {
      if (error.hash) {
        return {
          translate: "",
          symbolsTable: "",
          errorsTable: `
<tr>
  <td>Error no se esperaba el token: ${error.hash.token}.</td>
  <td>${error.hash.loc.first_line}</td>
  <td>${error.hash.loc.last_column}</td>
  <td>${currentFile}</td>
</tr>`,
        };
      } else {
        logger.error(error.message);
        return {
          translate: "",
          symbolsTable: "",
          errorsTable: "",
        };
      }
    }
  }

  private translate(trees: Array<Ast>): string {
    return "";
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
