import AstNode from "./ast/ast_node";
import Jump from "./ast/jump/jump";

export interface NodeRemoved {
  node: AstNode;
  rule: number;
}

export class Optimizer {
  public readonly listNode: Array<NodeRemoved>;
  public currentJump: Jump | undefined;

  constructor() {
    this.listNode = [];
  }

  optimize(nodes: Array<AstNode>) {}
}
