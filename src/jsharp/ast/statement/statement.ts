import { AstNode } from "../ast_node";
import { TypeFactory, JType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";

export default abstract class Statement extends AstNode {
  public breksCounter: number = 0;
  public continueCounter: number = 0;
  public breakLabel: string;
  public continueLabel: string;

  public abstract createScope(
    typeFactory: TypeFactory,
    scope: BlockScope
  ): void;
  public abstract checkScope(typeFactory: TypeFactory, scope: BlockScope): any;
}
