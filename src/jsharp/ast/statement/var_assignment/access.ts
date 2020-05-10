import { AstNode } from "../../ast_node";
import { JType, TypeFactory } from "../../../scope/type";
import { BlockScope } from "../../../scope/scope";

export default abstract class Access extends AstNode {
  public type: JType;
  public itsHeap: boolean = false;
  public abstract verifyType(typeFactory: TypeFactory, scope: BlockScope): void;
}
