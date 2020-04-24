import Ast from "./ast/ast";
import { logger } from "../utils/logger";

export interface Data {
  files: Array<FileInformation>;
}

export interface FileInformation {
  filename: string;
  content: string;
}

export class JSharp {
  public exec(data: Data): boolean {
    try {
      return true;
    } catch (error) {
      return false;
    }
  }
}
