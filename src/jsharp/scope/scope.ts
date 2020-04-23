import { Variable } from './variable';

export class Scope {
  public variables: Map<string, Variable>;

  public constructor() {
    this.variables = new Map();
  }
}

export class FileScope extends Scope {}
