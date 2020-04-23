import Arithmetic from './arithmetic';
import CodeBuilder from '../../../scope/code_builder';
import { Scope } from '../../../scope/scope';
import { NodeInfo } from '../../ast_node';
import { JType, TypeFactory } from '../../../scope/type';

export default class JNumber extends Arithmetic {
  public constructor(
    nodeInfo: NodeInfo,
    type: JType,
    public value: number | string
  ) {
    super(nodeInfo);
    this.type = type;
  }

  public buildScope(typeFactory: TypeFactory, scope: Scope): void {
    if (typeFactory.isInteger(this.type) && typeof this.value === 'number') {
      this.value = ~~this.value;
    } else if (
      typeFactory.isChar(this.type) &&
      typeof this.value === 'string'
    ) {
      this.value = this.value.charCodeAt(0);
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: Scope
  ): void {
    this.address = this.value.toString();
  }
}
