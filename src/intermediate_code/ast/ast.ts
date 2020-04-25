import AstNode from "./ast_node";
import Scope from "../scope/scope";
import Jump from "./jump/jump";
import { ErrorC3D } from "../utils/errorC3D";
import MethodInvocation from "./method/method_invocation";

export default class Ast {
  public scope: Scope;

  constructor(public nodes: Array<AstNode>) {
    this.scope = new Scope();
  }

  public preInterpret() {
    let length = this.nodes.length;
    let currentNode: AstNode;
    let i = 0;
    for (; i < length; i++) {
      currentNode = this.nodes[i];
      currentNode.preInterpret(this.scope);
    }
  }

  public interpret() {
    // let currentIndex = 0;
    // let length = this.nodes.length;
    // let currentNode: AstNode;
    // while (currentIndex < length) {
    //   currentNode = this.nodes[currentIndex];
    //   currentNode.interpret(this.scope);
    //   if (currentNode instanceof Jump) {
    //     let destinyJump = currentNode.destinyJump;
    //     if (destinyJump) {
    //       let index = this.nodes.indexOf(destinyJump);
    //       if (index != -1) {
    //         currentIndex = index;
    //         continue;
    //       } else {
    //         throw new ErrorC3D(destinyJump.line, destinyJump.column,
    //           `Could not jump to tag $ {destinyJump.label} it may not be globally declared`
    //         );
    //       }
    //     }
    //   } else if (currentNode instanceof MethodInvocation) {
    //     let method = currentNode.method;
    //     if (method) {
    //       method.callMethod();
    //     }
    //   }
    //   currentIndex++;
    // }
  }
}
