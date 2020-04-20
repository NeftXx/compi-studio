import Binding from "./binding";
import MethodDeclaration from "../ast/method/method_declaration";
import DestinyJump from "../ast/jump/destiny_of_jump";

export default class Scope {
  private variables: Map<string, Binding>;
  private methods: Map<string, MethodDeclaration>;
  private labels: Map<string, DestinyJump>;

  constructor() {
    this.variables = new Map();
    this.methods = new Map();
    this.labels = new Map();
  }

  /**
   *
   * @param id nombre de la variable
   * @param value valor de la variable
   */
  public addVar(id: string, value: number | Array<number>): boolean {
    if (this.variables.has(id)) return false;
    this.variables.set(id, new Binding(id, value));
    return true;
  }

  public addMethod(id: string, declaration: MethodDeclaration): boolean {
    if (this.methods.has(id)) return false;
    this.methods.set(id, declaration);
    return true;
  }

  public addLabel(label: string, destinyJump: DestinyJump) {
    if (this.labels.has(label)) return false;
    this.labels.set(label, destinyJump);
    return true;
  }

  public getVar(id: string): Binding | undefined {
    return this.variables.get(id);
  }

  public getMethod(id: string): MethodDeclaration | undefined {
    return this.methods.get(id);
  }

  public getLabel(label: string): DestinyJump | undefined {
    return this.labels.get(label);
  }
}
