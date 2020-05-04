import { BlockScope } from "../scope/scope";
import CodeTranslator from "../scope/code_builder";
import NodeInfo from "../scope/node_info";
import { TypeFactory } from "../scope/type";

export abstract class AstNode {
  public constructor(public nodeInfo: NodeInfo) {}
  public abstract translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void;
}
