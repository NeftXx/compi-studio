import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, ErrorType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";
import CallFunction from "../expression/call_function";
import Ast from "../ast";

export default class CallFunctionStm extends Statement {
  public constructor(nodeInfo: NodeInfo, public callFunction: CallFunction) {
    super(nodeInfo);
  }

  public createScope(typeFactory: TypeFactory, scope: BlockScope): void {}

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {
    this.callFunction.verifyType(typeFactory, scope);
    let type = this.callFunction.type;
    if (type instanceof ErrorType) {
      scope.addError(type);
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    this.callFunction.translate(typeFactory, codeBuilder, scope);
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    return this.callFunction.getAstNode(ast, str);
  }
}
