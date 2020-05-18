import AstNode from "../ast_node";
import Scope from "../../scope/scope";

export default class MethodDeclaration extends AstNode {
  constructor(
    line: number,
    column: number,
    public id: string,
    public nodes: Array<AstNode>
  ) {
    super(line, column);
  }

  public preInterpret(scope: Scope): void {
    this.nodes.forEach((node) => {
      node.preInterpret(scope);
    });
    scope.addMethod(this.id, this);
    scope.addStatement(this);
  }

  public interpret(scope: Scope): void {
    // El interpretar de esta clase se paso al metodo call, esto para
    // no alterar el flujo natural del interprete
  }

  public toString(): string {
    let str: Array<string> = [`proc ${this.id} begin\n`];
    this.nodes.forEach((node) => {
      str.push(node.toString());
    });
    str.push(`end\n`);
    return str.join("");
  }
}
