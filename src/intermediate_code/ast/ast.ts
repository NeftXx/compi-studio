import AstNode from "./ast_node";
import Scope from "../scope/scope";
import { Optimizer } from "../optimizer";
import MethodDeclaration from "./method/method_declaration";

export default class Ast {
  public scope: Scope;
  public opt: Optimizer;

  constructor(public nodes: Array<AstNode>) {
    this.scope = new Scope();
    this.opt = new Optimizer();
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

  public optimize(): void {
    this.nodes.forEach((node) => {
      if (node instanceof MethodDeclaration) {
        this.opt.optimize(node.nodes);
      }
    });
  }

  public getText(): string {
    let str: Array<string> = [];
    this.nodes.forEach((node) => {
      str.push(node.toString());
    });
    return str.join("");
  }
}
