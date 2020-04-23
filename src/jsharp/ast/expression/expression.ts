import { AstNode } from "../ast_node";
import { JType } from "../../scope/type";

export default abstract class Expression extends AstNode {
  public type: JType;
}
