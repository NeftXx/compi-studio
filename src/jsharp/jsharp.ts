import Ast from './ast/ast';
import { logger } from '../utils/logger';
import { Parser as JSharpParser } from './grammar/grammar';

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
    try {
      // let parser: any;
      // let trees: Array<Ast> = [];
      // for (let file of data) {
      //   parser = new JSharpParser();
      //   parser.yy = { filename: file.filename };
      //   trees.push(parser.parse(file.content));
      // }
      return {
        translate: 'Hola',
        symbolsTable: '',
        errorsTable: '',
      };
    } catch (error) {
      return {
        translate: '',
        symbolsTable: '',
        errorsTable: '',
      };
    }
  }

  private translate(trees: Array<Ast>): string {
    return '';
  }

  private createSymbolTable(): string {
    return '';
  }

  private createErrorTable(): string {
    return '';
  }
}
