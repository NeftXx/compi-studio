import { Variable } from "./variable";
import { ErrorType, JType } from "./type";

export class GlobalScope {
  public errorsList: Array<ErrorType>;
  public filesScope: Map<string, FileScope>;

  public constructor() {
    this.filesScope = new Map();
    this.errorsList = [];
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

  public addError(error: ErrorType) {
    this.errorsList.push(error);
  }
}

export class BlockScope {
  protected size: number;
  protected variables: Map<string, Variable>;

  public constructor(protected errorsList: Array<ErrorType>) {
    this.variables = new Map();
    this.size = 0;
  }

  public addError(error: ErrorType) {
    this.errorsList.push(error);
  }

  public createVariable(name: string, type: JType): boolean {
    if (this.variables.has(name)) return false;
    this.size++;
    this.variables.set(name, new Variable(name, type, this.size));
    return true;
  }

  public getSize(): number {
    return this.size;
  }
}

export class FileScope extends BlockScope {
  public importsScope: Array<FileScope>;
  public methods: Map<string, MethodScope>;

  public constructor(
    public readonly filename: string,
    errorsList: Array<ErrorType>
  ) {
    super(errorsList);
    this.importsScope = [];
    this.methods = new Map();
  }

  public addImport(fileScope: FileScope): void {
    this.importsScope.push(fileScope);
  }

  public createMethod(
    identifier: string,
    paramNames: Array<string>,
    type: JType
  ): boolean {
    let methodTemp = this.methods.get(identifier);
    if (methodTemp) {
      let ok = true;
    }
    this.methods.set(
      identifier,
      new MethodScope(this.errorsList, identifier, paramNames, type)
    );
    return true;
  }

  public getMethod(identifier: string): MethodScope {
    return this.methods.get(identifier);
  }
}

export class MethodScope extends BlockScope {
  public constructor(
    errorsList: Array<ErrorType>,
    private identifier: string,
    private paramNames: Array<string>,
    private returnType: JType
  ) {
    super(errorsList);
    this.size = 1;
  }

  public getReturnType(): JType {
    return this.returnType;
  }

  public getIdentifier(): string {
    return this.identifier;
  }
}
