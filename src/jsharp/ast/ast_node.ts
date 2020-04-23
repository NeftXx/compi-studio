import Ast from "./ast";
import { Scope } from "../scope/scope";
import { TypeFactory } from "../scope/type";
import CodeBuilder from "../scope/code_builder";

export abstract class AstNode {
  public constructor(public nodeInfo: NodeInfo) {}
  public abstract buildScope(typeFactory: TypeFactory, scope: Scope): void;
  public abstract translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: Scope
  ): void;
}

export class NodeInfo {
  public constructor(
    public filename: string,
    public line: number,
    public column: number
  ) {}
}
