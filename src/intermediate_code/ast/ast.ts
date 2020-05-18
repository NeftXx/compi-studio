import AstNode from "./ast_node";
import Scope from "../scope/scope";

export default class Ast {
  public scope: Scope;

  constructor(public nodes: Array<AstNode>) {
    this.scope = new Scope();
  }

  public preInterpret() {
    let length = this.nodes.length;
    let currentNode: AstNode;
    let i = 0;
    for (; i < length; i++) {
      currentNode = this.nodes[i];
      currentNode.preInterpret(this.scope);
    }
  }

  public optimize() {}
}
