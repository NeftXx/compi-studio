import CodeBuilder from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, JType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";

export default class ParameterStm extends Statement {
  public constructor(
    nodeInfo: NodeInfo,
    private type: JType,
    private identifier: string
  ) {
    super(nodeInfo);
  }

  public buildScope(typeFactory: TypeFactory, scope: BlockScope): void {}

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: BlockScope
  ): void {}
}
