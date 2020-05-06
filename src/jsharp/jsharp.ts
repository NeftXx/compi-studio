import Ast from "./ast/ast";
import { logger } from "../utils/logger";
import { Parser as JSharpParser } from "./grammar/grammar";
import { TypeFactory, ErrorType, StructureType } from "./scope/type";
import CodeTranslator from "./scope/code_builder";
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
      let errorsList: Array<ErrorType> = []; // arreglo de errores
      let parser: any;
      for (let file of data) {
        // Si el contenido esta vacio no se analiza
        if (file.content !== "") {
          parser = new JSharpParser();
          currentFile = file.filename;
          // enviando el nombre del archivo actual, el controlador de tipos
          // y el arreglo de errores al analizador
          parser.yy = {
            filename: currentFile,
            typeFactory: typeFactory,
            errorsList: errorsList,
          };
          trees.push(parser.parse(file.content));
        }
      }
      // creando la tabla de simbolos
      let symbolTable = this.createSymbolTable(trees, errorsList);
      // construyendo la tabla
      this.buildScopes(trees, typeFactory, symbolTable);
      // si existen errores
      if (symbolTable.hasError()) {
        // no se traduce nada, y envio la tabla de errores y la tabla de simbolos
        return {
          isError: true,
          translate: "",
          symbolsTable: symbolTable.getSymbolTable(),
          errorsTable: this.createErrorTable(symbolTable.errorsList),
        };
      } else {
        // creo un manejador que me ayuda a traducir el codigo de algo nivel
        let codeTranslator = new CodeTranslator();
        // realizo la traduccion
        this.translate(trees, typeFactory, codeTranslator);
        // retorno la traduccion y la tabla de simbolos
        return {
          isError: false,
          translate: codeTranslator.getCodeTranslate(),
          symbolsTable: symbolTable.getSymbolTable(),
          errorsTable: "",
        };
      }
    } catch (error) {
      // Si ocurrio un error, verifico si fue del analizador o un error de codigo mio
      if (error.hash) {
        // si es del analizador debulvo el error
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
        // muestro el error en consola
        logger.error(error.message);
        console.log(error);
        // y reporte que hubo un error en el servidor
        return {
          isError: true,
          translate: "",
          symbolsTable: "",
          errorsTable: `
    <tr>
      <td>Ha ocurrido un error en el servidor</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    `,
        };
      }
    }
  }

  private buildScopes(
    trees: Array<Ast>,
    typeFactory: TypeFactory,
    symbolTable: SymbolTable
  ): void {
    // creo los entornos de cada bloque y guardo las variables globales
    for (let tree of trees) {
      tree.createScope(typeFactory, symbolTable);
    }
    // luego paso a comprobar los entornos, es decir miro si los tipos de las
    // expresiones son validos y que las variables existan
    for (let tree of trees) {
      tree.checkScope(typeFactory);
    }
  }

  private translate(
    trees: Array<Ast>,
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator
  ) {
    // primero debo traducir las estructuras
    let structures = typeFactory.structures;
    codeBuilder.setGlobalVariables(`# Banderas para las estructuras\n`);
    structures.forEach((strc: StructureType) => {
      strc.enablePointer = codeBuilder.ptrHeap++;
      codeBuilder.setGlobalVariables(`Heap[${strc.enablePointer}] = 0;\n`);
    });
    for (let tree of trees) {
      tree.translateStructure(typeFactory, codeBuilder);
    }
    // luego traducir las variables globales
    for (let tree of trees) {
      tree.translateVariables(typeFactory, codeBuilder);
    }
    // tengo que saltar las funciones, para este salto
    codeBuilder.setTranslatedCode(`goto ${codeBuilder.labelJumpMethods};\n`);
    // Traducir los contructores de las estructuras
    structures.forEach((strc: StructureType, key: string) => {
      if (strc.structure) {
        strc.structure.translateConctructor(key, typeFactory, codeBuilder);
      }
    });
    // luego todas las funciones de cada archivo
    for (let tree of trees) {
      tree.translateMethods(typeFactory, codeBuilder);
    }
  }

  private createSymbolTable(
    trees: Array<Ast>,
    errorsList: Array<ErrorType>
  ): SymbolTable {
    // al inicio la tabla de simbolos solo crea
    // los entornos globales de los archivos
    let symbolTable = new SymbolTable(errorsList);
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
