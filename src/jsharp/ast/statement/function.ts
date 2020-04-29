import CodeBuilder from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, JType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";
import Parameter from "./parameter";
import Block from "./block";

export default class FunctionStm extends Statement {
  public constructor(
    nodeInfo: NodeInfo,
    private type: JType,
    private identifier: string,
    private parameters: Array<Parameter>,
    private block: Block
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
