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
  private countScopes: number;
  protected globalScope: FileScope | undefined;
  public variables: Map<string, Variable>;
  protected blocks: Map<string, BlockScope>;

  public constructor(
    protected previous: BlockScope | undefined,
    protected errorsList: Array<ErrorType>
  ) {
    this.variables = new Map();
  }

  public setGlobal(scope: FileScope) {
    this.globalScope = scope;
  }

  public getGlobal() {
    return this.globalScope;
  }

  public addError(error: ErrorType) {
    this.errorsList.push(error);
  }

  public createScope(): string {
    let nameScope = `Scope$${this.countScopes++}`;
    this.blocks.set(nameScope, new BlockScope(this, this.errorsList));
    return nameScope;
  }

  public getScope(nameScope: string): BlockScope {
    return this.blocks.get(nameScope);
  }

  public createVariable(
    identifier: string,
    type: JType,
    isConstant: boolean
  ): boolean {
    if (this.variables.has(identifier)) return false;
    this.variables.set(
      identifier,
      new Variable(identifier, type, -1, isConstant)
    );
    return true;
  }

  public getVariable(identifier: string): Variable | undefined {
    let found: Variable;
    for (
      let scope: BlockScope = this;
      scope !== undefined;
      scope = scope.previous
    ) {
      found = scope.variables.get(identifier);
      if (found !== undefined) return found;
    }
    return undefined;
  }

  public getVariableLocal(identifier: string): Variable | undefined {
    return this.variables.get(identifier);
  }

  public changeReference(identifier: string, address: number): boolean {
    if (this.variables.has(identifier)) {
      this.variables.get(identifier).address = address;
      return true;
    }
    return false;
  }

  public updateAddress(methodScope: MethodScope) {
    this.variables.forEach((variable: Variable, key: string) => {
      variable.address = variable.address + methodScope.size++;
    });
    this.blocks.forEach((scope: BlockScope, key: string) => {
      scope.updateAddress(methodScope);
    });
  }
}

export class FileScope extends BlockScope {
  public importsScope: Array<FileScope>;
  public methods: Map<string, MethodScope>;

  public constructor(
    public readonly filename: string,
    errorsList: Array<ErrorType>
  ) {
    super(undefined, errorsList);
    this.importsScope = [];
    this.methods = new Map();
    this.globalScope = this;
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
    let methodScope = new MethodScope(
      this.errorsList,
      identifier,
      paramNames,
      type
    );
    methodScope.setGlobal(this);
    this.methods.set(identifier, methodScope);
    return true;
  }

  public getMethod(identifier: string): MethodScope {
    return this.methods.get(identifier);
  }

  public getSize(): number {
    return this.variables.size;
  }
}

export class MethodScope extends BlockScope {
  public size: number;
  private nameMethod: string;

  public constructor(
    errorsList: Array<ErrorType>,
    private identifier: string,
    private paramNames: Array<string>,
    private returnType: JType
  ) {
    super(undefined, errorsList);
    this.blocks = new Map();
    this.size = 1;
    this.nameMethod = "";
  }

  public updateAddresses(): void {
    this.blocks.forEach((scope: BlockScope, key: string) => {
      scope.updateAddress(this);
    });
  }

  public setName(nameMethod: string) {
    this.nameMethod = nameMethod;
  }

  public getName(): string {
    return this.nameMethod;
  }

  public getReturnType(): JType {
    return this.returnType;
  }

  public getIdentifier(): string {
    return this.identifier;
  }

  public getSize(): number {
    return this.size;
  }
}
