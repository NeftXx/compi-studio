import Jump from './jump';
import Scope from '../../scope/scope';
import RelationalExp from '../expression/relational_exp';
import { ErrorC3D } from '../../utils/errorC3D';

export default class CondJumpIf extends Jump {
  constructor(
    line: number,
    column: number,
    public exp: RelationalExp,
    label: string
  ) {
    super(line, column, label);
  }

  public interpret(scope: Scope): void {
    let value = this.exp.interpret(scope);
    if (typeof value !== 'boolean') {
      throw new ErrorC3D(
        this.line,
        this.column,
        'in the expression given in the if.'
      );
    }

    if (value) {
      this.getDestinyJump(scope);
    }
  }
}
