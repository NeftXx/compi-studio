import Expression from '../expression';
import { NodeInfo } from '../../ast_node';

export default abstract class Arithmetic extends Expression {
  public address: string;
}
