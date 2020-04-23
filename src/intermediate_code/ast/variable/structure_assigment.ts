import AstNode from '../ast_node';
import Scope from '../../scope/scope';
import { ErrorC3D } from '../../utils/errorC3D';

export default class StructureAssigment extends AstNode {
  public static readonly MAX_MEMORY: number = 67108864;

  constructor(
    line: number,
    column: number,
    public id: string,
    public position: AstNode,
    public exp: AstNode
  ) {
    super(line, column);
  }

  public preInterpret(scope: Scope): void {
    scope.addStatement(this);
  }

  public interpret(scope: Scope): void {
    let position = this.position.interpret(scope);
    let value = this.exp.interpret(scope);
    if (typeof position !== 'number' || typeof value !== 'number') {
      throw new ErrorC3D(
        this.line,
        this.column,
        `when assigning the result in the ${this.id}.`
      );
    }
    let binding = scope.getVar(this.id);
    if (binding && binding.value instanceof Array) {
      if (position > StructureAssigment.MAX_MEMORY) {
        return;
      }
      binding.value[position] = value;
    }
  }
}
