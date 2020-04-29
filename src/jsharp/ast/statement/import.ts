import CodeBuilder from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";

export default class ImportStm extends Statement {
  public constructor(nodeInfo: NodeInfo, public filenames: Array<string>) {
    super(nodeInfo);
  }

  public buildScope(typeFactory: TypeFactory, scope: BlockScope): void {}

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeBuilder,
    scope: BlockScope
  ): void {}
}
