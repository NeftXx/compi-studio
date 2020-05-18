import { BlockScope } from "../scope/scope";
import CodeTranslator from "../scope/code_builder";
import NodeInfo from "../scope/node_info";
import { TypeFactory } from "../scope/type";
import Ast from "./ast";

export abstract class AstNode {
  public constructor(public nodeInfo: NodeInfo) {}
  public abstract translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void;
  public abstract getAstNode(ast: Ast, str: Array<string>): number;
}
