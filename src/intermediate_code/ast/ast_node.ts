import Scope from "../scope/scope";
import Ast from "./ast";

export default abstract class AstNode {
  constructor(public line: number, public column: number) {}

  public abstract preInterpret(scope: Scope): void;
  public abstract interpret(scope: Scope): void;
}
