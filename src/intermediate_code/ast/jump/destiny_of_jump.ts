import Scope from '../../scope/scope';
import AstNode from '../ast_node';

export default class DestinyJump extends AstNode {
  constructor(line: number, column: number, public label: string) {
    super(line, column);
  }

  public preInterpret(scope: Scope): void {
    scope.addLabel(this.label, this);
  }

  public interpret(scope: Scope): void {}
}
