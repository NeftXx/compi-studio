import { Variable } from "./variable";
import { ErrorType } from "./type";

export class Scope {
  public variables: Map<string, Variable>;

  public constructor(private errorsList: Array<ErrorType>) {
    this.variables = new Map();
  }

  public addError(error: ErrorType) {
    this.errorsList.push(error);
  }
}

export class FileScope extends Scope {
  public constructor(errorsList: Array<ErrorType>) {
    super(errorsList);
  }
}
