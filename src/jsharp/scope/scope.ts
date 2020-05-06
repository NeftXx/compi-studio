import { Variable } from "./variable";
import { ErrorType, JType } from "./type";
import { Structure } from "../ast/statement/structure";

export class SymbolTable {
  public filesScope: Map<string, FileScope>;

  public constructor(public errorsList: Array<ErrorType>) {
    this.filesScope = new Map();
  }

  public createFileScope(filename: string): void {
    this.filesScope.set(filename, new FileScope(filename, this.errorsList));
  }

  public enterFileScope(filename: string): FileScope {
    return this.filesScope.get(filename);
  }

  public hasError(): boolean {
    return this.errorsList.length > 0;
  }

  public addError(error: ErrorType) {
    this.errorsList.push(error);
  }

  public getSymbolTable(): string {
    let str: Array<string> = ['<ul class="collapsible">\n'];
    this.filesScope.forEach((scope: FileScope, key: string) => {
      str.push("<li>\n");
      str.push(
        `<div class="collapsible-header"><i class="material-icons">insert_drive_file</i>${key}</div>\n`
      );
      str.push(`<div class="collapsible-body">${scope.getSymbolTable()}</div>`);
      str.push("</li>\n");
    });
    str.push("</ul>\n");
    return str.join("");
  }
}

export class BlockScope {
  public size: number;
  private countScopes: number;
  protected globalScope: FileScope | undefined;
  public variables: Map<string, Variable>;
  public blocks: Map<string, BlockScope>;

  public constructor(
    protected previous: BlockScope | undefined,
    protected errorsList: Array<ErrorType>
  ) {
    this.size = 0;
    this.countScopes = 1;
    this.variables = new Map();
    this.blocks = new Map();
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

  public createBlockScope(): BlockScope {
    let nameScope = `Entorno$${this.countScopes++}`;
    let block = new BlockScope(this, this.errorsList);
    this.blocks.set(nameScope, block);
    block.setGlobal(this.globalScope);
    return block;
  }

  public enterBlockScope(nameScope: string): BlockScope {
    return this.blocks.get(nameScope);
  }

  public createVariableLocal(
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
      this.variables.get(identifier).ptr = address;
      return true;
    }
    return false;
  }

  public getSymbolTable(): string {
    let str: Array<string> = [];
    str.push(`<table class="highlight">
<thead>
  <tr>
    <th>Identificador</th>
    <th>Tipo</th>
    <th>Apuntador</th>
    <th>Es constante</th>
  </tr>
</thead>
<tbody>
`);
    this.variables.forEach((variable: Variable, key: string) => {
      str.push(`<tr>
        <td>${variable.identifier}</td>
        <td>${variable.type}</td>
        <td>${variable.ptr}</td>
        <td>${variable.isConstant}</td>
      </tr>`);
    });
    str.push("</tbody>\n</table>");
    str.push('<ul class="collapsible">\n');
    this.blocks.forEach((scope: MethodScope, key: string) => {
      str.push("<li>\n");
      str.push(
        `<div class="collapsible-header"><i class="material-icons">dynamic_feed</i>${key}</div>\n`
      );
      str.push(`<div class="collapsible-body">${scope.getSymbolTable()}</div>`);
      str.push("</li>\n");
    });
    str.push("</ul>\n");
    return str.join("");
  }
}

export class MethodScope extends BlockScope {
  private nameMethod: string;

  public constructor(
    errorsList: Array<ErrorType>,
    private identifier: string,
    private paramNames: Array<string>,
    private returnType: JType
  ) {
    super(undefined, errorsList);
    this.nameMethod = "";
    this.variables.set(
      "return",
      new Variable("return", this.returnType, -1, false)
    );
  }

  public updateAddresses(): void {
    this.update(this);
    this.updateSize(this);
  }

  private update(currentScope: BlockScope): void {
    currentScope.variables.forEach((variable: Variable) => {
      variable.ptr = this.size++;
    });
    currentScope.blocks.forEach((blockScope: BlockScope) => {
      this.update(blockScope);
    });
  }

  private updateSize(currentScope: BlockScope) {
    currentScope.blocks.forEach((blockScope: BlockScope) => {
      blockScope.size = this.size;
      this.updateSize(blockScope);
    });
  }

  public getParamNames(): Array<string> {
    return this.paramNames;
  }

  public getReturnType(): JType {
    return this.returnType;
  }

  public getIdentifier(): string {
    return this.identifier;
  }

  public setName(nameMethod: string) {
    this.nameMethod = nameMethod;
  }

  public getName(): string {
    if (this.nameMethod !== "") {
      return this.nameMethod;
    }
    return this.identifier;
  }
}

export class FileScope extends BlockScope {
  private countError: number;
  public importsScope: Map<string, FileScope>;
  public structures: Map<string, Structure>;

  public constructor(
    public readonly filename: string,
    errorsList: Array<ErrorType>
  ) {
    super(undefined, errorsList);
    this.importsScope = new Map();
    this.globalScope = this;
    this.countError = 1;
  }

  public addImport(filename: string, fileScope: FileScope): void {
    this.importsScope.set(filename, fileScope);
  }

  public getImport(filename: string) {
    return this.importsScope.get(filename);
  }

  public getStructure(identifier: string): Structure {
    return this.structures.get(identifier);
  }

  public putStructure(identifier: string, structure: Structure): boolean {
    if (this.structures.has(identifier)) return false;
    this.structures.set(identifier, structure);
    return true;
  }

  public createMethod(
    identifier: string,
    paramNames: Array<string>,
    type: JType
  ): boolean {
    if (this.blocks.has(identifier)) return false;
    let methodScope = new MethodScope(
      this.errorsList,
      identifier,
      paramNames,
      type
    );
    methodScope.setGlobal(this);
    this.blocks.set(identifier, methodScope);
    return true;
  }

  public createMethodError(
    identifier: string,
    paramNames: Array<string>,
    type: JType
  ): string {
    identifier = `${identifier}_error${this.countError++}`;
    let methodScope = new MethodScope(
      this.errorsList,
      identifier,
      paramNames,
      type
    );
    methodScope.setGlobal(this);
    this.blocks.set(identifier, methodScope);
    return identifier;
  }

  public enterMethod(identifier: string): MethodScope | undefined {
    let scope = this.blocks.get(identifier);
    if (scope instanceof MethodScope) {
      return scope;
    }
    return undefined;
  }
}
