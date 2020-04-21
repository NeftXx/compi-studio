import Scope from '../../scope/scope';
import { ErrorC3D } from '../../utils/errorC3D';
import AstNode from '../ast_node';

export default class Minus extends AstNode {
  constructor(line: number, column: number, public exp: AstNode) {
    super(line, column);
  }

  public preInterpret(scope: Scope) {
    scope.addStatement(this);
  }

  public interpret(scope: Scope): number {
    let value = this.exp.interpret(scope);
    if (typeof value !== 'number') {
      throw new ErrorC3D(
        this.line,
        this.column,
        `expression must be a number.`
      );
    }
    return -value;
  }
}
