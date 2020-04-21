import Scope from '../../scope/scope';
import { ErrorC3D } from '../../utils/errorC3D';
import AstNode from '../ast_node';

export default class ArithmeticExp extends AstNode {
  constructor(
    line: number,
    column: number,
    public exp1: AstNode,
    public operator: string,
    public exp2: AstNode
  ) {
    super(line, column);
  }

  public preInterpret(scope: Scope) {
    scope.addStatement(this);
  }

  public interpret(scope: Scope): number {
    let valueExp1 = this.exp1.interpret(scope);
    let valueExp2 = this.exp2.interpret(scope);

    if (typeof valueExp1 !== 'number' && typeof valueExp2 !== 'number') {
      throw new ErrorC3D(
        this.line,
        this.column,
        `expressions must be a number.`
      );
    }

    switch (this.operator) {
      case '+':
        return valueExp1 + valueExp2;
      case '-':
        return valueExp1 - valueExp2;
      case '*':
        return valueExp1 * valueExp2;
      case '/':
        return valueExp1 / valueExp2;
      case '%':
        return valueExp1 % valueExp2;
    }

    throw new ErrorC3D(this.line, this.column, `this operator is not valid.`);
  }
}
