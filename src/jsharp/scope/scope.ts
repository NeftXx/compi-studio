import { Variable } from "./variable";
import { ErrorType } from "./type";

interface HashTable<T> {
  [key: string]: T;
}

export class GlobalScope {
  public errorsList: Array<ErrorType>;
  public filesScope: HashTable<FileScope>;

  public constructor() {
    this.filesScope = {};
  }

  public createFileScope(filename: string): void {
    this.filesScope[filename] = new FileScope(filename, this.errorsList);
  }

  public getFileScope(filename: string): FileScope {
    return this.filesScope[filename];
  }

  public errorsEmpty(): boolean {
    return this.errorsList.length === 0;
  }
}

export class BlockScope {
  public variables: Map<string, Variable>;

  public constructor(private errorsList: Array<ErrorType>) {
    this.variables = new Map();
  }

  public addError(error: ErrorType) {
    this.errorsList.push(error);
  }
}

export class FileScope extends BlockScope {
  public importsScope: Array<FileScope>;
  public methods: HashTable<FileScope>;

  public constructor(
    public readonly filename: string,
    errorsList: Array<ErrorType>
  ) {
    super(errorsList);
    this.importsScope = [];
    this.methods = {};
  }

  public addImport(fileScope: FileScope): void {
    this.importsScope.push(fileScope);
  }

  public createMethod() {}
}

export class MethodScope extends BlockScope {}
