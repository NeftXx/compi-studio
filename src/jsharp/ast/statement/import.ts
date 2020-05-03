import NodeInfo from "../../scope/node_info";

export default class ImportStm {
  public constructor(
    public nodeInfo: NodeInfo,
    public filenames: Array<string>
  ) {}
}
