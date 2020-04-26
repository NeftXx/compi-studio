import Expression from "../expression";
import NodeInfo from "../../../scope/node_info";

export default abstract class Or extends Expression {
  public constructor(
    nodeInfo: NodeInfo,
    private expLeft: Expression,
    private expRight: Expression
  ) {
    super(nodeInfo);
  }
}
