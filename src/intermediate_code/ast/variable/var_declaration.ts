import AstNode from "../ast_node";
import Scope from "../../scope/scope";

export default class VarDeclaration extends AstNode {
  constructor(
    line: number,
    column: number,
    public id: string,
    private isStructure: boolean
  ) {
    super(line, column);
  }

  public preInterpret(scope: Scope): void {
    let ok: boolean;
    if (this.isStructure) ok = scope.addVar(this.id, []);
    else ok = scope.addVar(this.id, 0);

    if (!ok) {
      throw new Error(
        `Semantic error in line ${this.line} and column ${this.column}, the identifier ${this.id} has already been declared.`
      );
    }
  }

  public interpret(scope: Scope): void {
    // No hace nada al momento de interpretar ya que se guardan
    // las declaraciones en el pre-analisis
  }
}
