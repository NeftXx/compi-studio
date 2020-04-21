import AstNode from '../ast_node';
import Scope from '../../scope/scope';
import Jump from '../jump/jump';
import MethodInvocation from './method_invocation';
import Ast from '../ast';

export default class MethodDeclaration extends AstNode {
  constructor(
    line: number,
    column: number,
    public id: string,
    public nodes: Array<AstNode>
  ) {
    super(line, column);
  }

  public preInterpret(scope: Scope): void {
    this.nodes.forEach((node) => {
      node.preInterpret(scope);
    });
    scope.addMethod(this.id, this);
    scope.addStatement(this);
  }

  public interpret(scope: Scope): void {
    // El interpretar de esta clase se paso al metodo call, esto para
    // no alterar el flujo natural del interprete
  }
}
