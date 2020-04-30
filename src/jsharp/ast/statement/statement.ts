import { AstNode } from "../ast_node";
import { TypeFactory } from "../../scope/type";
import { BlockScope } from "../../scope/scope";

export default abstract class Statement extends AstNode {
  public abstract buildScope(typeFactory: TypeFactory, scope: BlockScope): any;
}
