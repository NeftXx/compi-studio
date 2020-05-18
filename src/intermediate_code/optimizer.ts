import AstNode from "./ast/ast_node";
import VarAssigment from "./ast/variable/var_assigment";
import Identifier from "./ast/expression/identifier";
import DestinyJump from "./ast/jump/destiny_of_jump";
import InconJump from "./ast/jump/inconditional_jump";
import CondJumpIf from "./ast/jump/conditional_jump_if";
import ArithmeticExp from "./ast/expression/arithmetic_exp";
import NumberExp from "./ast/expression/number_exp";

export interface NodeRemoved {
  nodes: Array<AstNode>;
  opt: AstNode;
  rule: number;
}

export class Optimizer {
  public removedNodes: Array<NodeRemoved>;

  constructor() {
    this.removedNodes = [];
  }

  public report(): string {
    let str: Array<string> = [];
    for (let node of this.removedNodes) {
      str.push(`
<tr>
  <td>${node.rule}</td>
  <td>
`);
      node.nodes.forEach((n) => {
        str.push(`${n.toString()}<br>`);
      });
      let text: string = node.opt
        ? node.opt.toString()
        : "Se elimina la instrucción";
      str.push(`</td>
  <td>${text}</td>
  <td>${node.nodes[0].line}</td>
  <td>${node.nodes[0].column}</td>
</tr>
`);
    }
    return str.join("");
  }

  public optimize(nodes: Array<AstNode>) {
    this.forceSimplification(nodes);
    this.checkRule1(nodes);
    this.checkRule4(nodes);
    this.checkRule2(nodes);
  }

  private checkRule1(nodes: Array<AstNode>) {
    let currentIndex = 0;
    let length = nodes.length - 1;
    let node1: AstNode;
    let node2: AstNode;
    while (currentIndex < length) {
      node1 = nodes[currentIndex];
      node2 = nodes[currentIndex + 1];
      if (
        node1 instanceof VarAssigment &&
        node2 instanceof VarAssigment &&
        node1.exp instanceof Identifier &&
        node2.exp instanceof Identifier
      ) {
        if (node1.id === node2.exp.id && node2.id === node1.exp.id) {
          this.removeItem(nodes, node2, node1, 1);
          length = nodes.length - 1;
        }
      }
      currentIndex++;
    }
  }

  private checkRule2(nodes: Array<AstNode>) {
    let currentJump: InconJump | undefined = undefined;
    let currentIndex = 0;
    let length = nodes.length;
    let nodeCurrent: AstNode;
    while (currentIndex < length) {
      nodeCurrent = nodes[currentIndex];
      if (nodeCurrent instanceof InconJump && !currentJump) {
        currentJump = nodeCurrent;
        currentIndex++;
        continue;
      }
      if (nodeCurrent instanceof DestinyJump && currentJump) {
        if (currentJump.label === nodeCurrent.label) {
          let i = nodes.indexOf(currentJump);
          if (i !== -1) {
            nodes.splice(i, currentIndex - i);
            this.removedNodes.push({
              nodes: [currentJump, nodeCurrent],
              opt: nodeCurrent,
              rule: 2,
            });
            currentJump = undefined;
            length = nodes.length;
            currentIndex = nodes.indexOf(nodeCurrent);
            if (currentIndex === -1) currentIndex = length;
          }
        } else {
          currentJump = undefined;
        }
      }
      currentIndex++;
    }
  }

  private checkRule4(nodes: Array<AstNode>) {
    let currentIndex = 0;
    let length = nodes.length;
    let nodeCurrent: AstNode;
    while (currentIndex < length) {
      nodeCurrent = nodes[currentIndex];
      if (nodeCurrent instanceof CondJumpIf) {
        let jump = nodeCurrent.optimize();
        if (jump) {
          nodes[currentIndex] = jump;
          this.removedNodes.push({
            nodes: [nodeCurrent],
            opt: jump,
            rule: 4,
          });
        }
      }
      currentIndex++;
    }
  }

  private forceSimplification(nodes: Array<AstNode>) {
    let currentIndex = 0;
    let length = nodes.length;
    let nodeCurrent: AstNode;
    while (currentIndex < length) {
      nodeCurrent = nodes[currentIndex];
      if (
        nodeCurrent instanceof VarAssigment &&
        nodeCurrent.exp instanceof ArithmeticExp
      ) {
        let arithmetic = nodeCurrent.exp;
        let exp1 = arithmetic.exp1;
        let exp2 = arithmetic.exp2;
        if (exp1 instanceof Identifier && exp2 instanceof NumberExp) {
          if (
            arithmetic.operator === "+" &&
            nodeCurrent.id === exp1.id &&
            exp2.value === 0
          ) {
            this.removeItem(nodes, nodeCurrent, undefined, 8);
            length = nodes.length - 1;
          } else if (
            arithmetic.operator === "-" &&
            nodeCurrent.id === exp1.id &&
            exp2.value === 0
          ) {
            this.removeItem(nodes, nodeCurrent, undefined, 9);
            length = nodes.length - 1;
          } else if (
            arithmetic.operator === "*" &&
            nodeCurrent.id === exp1.id &&
            exp2.value === 1
          ) {
            this.removeItem(nodes, nodeCurrent, undefined, 10);
            length = nodes.length - 1;
          } else if (
            arithmetic.operator === "/" &&
            nodeCurrent.id === exp1.id &&
            exp2.value === 1
          ) {
            this.removeItem(nodes, nodeCurrent, undefined, 11);
            length = nodes.length - 1;
          } else if (
            arithmetic.operator === "+" &&
            nodeCurrent.id !== exp1.id &&
            exp2.value === 0
          ) {
            nodes[currentIndex] = new VarAssigment(
              nodeCurrent.line,
              nodeCurrent.column,
              nodeCurrent.id,
              exp1
            );
            this.removedNodes.push({
              nodes: [nodeCurrent],
              opt: nodes[currentIndex],
              rule: 12,
            });
          } else if (
            arithmetic.operator === "-" &&
            nodeCurrent.id !== exp1.id &&
            exp2.value === 0
          ) {
            nodes[currentIndex] = new VarAssigment(
              nodeCurrent.line,
              nodeCurrent.column,
              nodeCurrent.id,
              exp1
            );
            this.removedNodes.push({
              nodes: [nodeCurrent],
              opt: nodes[currentIndex],
              rule: 13,
            });
          } else if (
            arithmetic.operator === "*" &&
            nodeCurrent.id !== exp1.id &&
            exp2.value === 1
          ) {
            nodes[currentIndex] = new VarAssigment(
              nodeCurrent.line,
              nodeCurrent.column,
              nodeCurrent.id,
              exp1
            );
            this.removedNodes.push({
              nodes: [nodeCurrent],
              opt: nodes[currentIndex],
              rule: 14,
            });
          } else if (
            arithmetic.operator === "/" &&
            nodeCurrent.id === exp1.id &&
            exp2.value === 1
          ) {
            nodes[currentIndex] = new VarAssigment(
              nodeCurrent.line,
              nodeCurrent.column,
              nodeCurrent.id,
              exp1
            );
            this.removedNodes.push({
              nodes: [nodeCurrent],
              opt: nodes[currentIndex],
              rule: 15,
            });
          } else if (arithmetic.operator === "*" && exp2.value === 2) {
            nodes[currentIndex] = new VarAssigment(
              nodeCurrent.line,
              nodeCurrent.column,
              nodeCurrent.id,
              new ArithmeticExp(
                arithmetic.line,
                arithmetic.column,
                exp1,
                "+",
                exp1
              )
            );
            this.removedNodes.push({
              nodes: [nodeCurrent],
              opt: nodes[currentIndex],
              rule: 16,
            });
          } else if (arithmetic.operator === "*" && exp2.value === 0) {
            nodes[currentIndex] = new VarAssigment(
              nodeCurrent.line,
              nodeCurrent.column,
              nodeCurrent.id,
              exp2
            );
            this.removedNodes.push({
              nodes: [nodeCurrent],
              opt: nodes[currentIndex],
              rule: 17,
            });
          }
        } else if (exp1 instanceof NumberExp && exp2 instanceof Identifier) {
          if (
            arithmetic.operator === "+" &&
            nodeCurrent.id === exp2.id &&
            exp1.value === 0
          ) {
            this.removeItem(nodes, nodeCurrent, undefined, 8);
            length = nodes.length - 1;
          } else if (
            arithmetic.operator === "-" &&
            nodeCurrent.id === exp2.id &&
            exp1.value === 0
          ) {
            this.removeItem(nodes, nodeCurrent, undefined, 9);
            length = nodes.length - 1;
          } else if (
            arithmetic.operator === "*" &&
            nodeCurrent.id === exp2.id &&
            exp1.value === 1
          ) {
            this.removeItem(nodes, nodeCurrent, undefined, 10);
            length = nodes.length - 1;
          } else if (
            arithmetic.operator === "+" &&
            nodeCurrent.id !== exp2.id &&
            exp1.value === 0
          ) {
            nodes[currentIndex] = new VarAssigment(
              nodeCurrent.line,
              nodeCurrent.column,
              nodeCurrent.id,
              exp2
            );
            this.removedNodes.push({
              nodes: [nodeCurrent],
              opt: nodes[currentIndex],
              rule: 12,
            });
          } else if (
            arithmetic.operator === "-" &&
            nodeCurrent.id !== exp2.id &&
            exp1.value === 0
          ) {
            nodes[currentIndex] = new VarAssigment(
              nodeCurrent.line,
              nodeCurrent.column,
              nodeCurrent.id,
              exp2
            );
            this.removedNodes.push({
              nodes: [nodeCurrent],
              opt: nodes[currentIndex],
              rule: 13,
            });
          } else if (
            arithmetic.operator === "*" &&
            nodeCurrent.id !== exp2.id &&
            exp1.value === 1
          ) {
            nodes[currentIndex] = new VarAssigment(
              nodeCurrent.line,
              nodeCurrent.column,
              nodeCurrent.id,
              exp2
            );
            this.removedNodes.push({
              nodes: [nodeCurrent],
              opt: nodes[currentIndex],
              rule: 14,
            });
          } else if (arithmetic.operator === "/" && exp1.value === 0) {
            nodes[currentIndex] = new VarAssigment(
              nodeCurrent.line,
              nodeCurrent.column,
              nodeCurrent.id,
              exp1
            );
            this.removedNodes.push({
              nodes: [nodeCurrent],
              opt: nodes[currentIndex],
              rule: 18,
            });
          } else if (arithmetic.operator === "*" && exp1.value === 2) {
            nodes[currentIndex] = new VarAssigment(
              nodeCurrent.line,
              nodeCurrent.column,
              nodeCurrent.id,
              new ArithmeticExp(
                arithmetic.line,
                arithmetic.column,
                exp2,
                "+",
                exp2
              )
            );
            this.removedNodes.push({
              nodes: [nodeCurrent],
              opt: nodes[currentIndex],
              rule: 16,
            });
          }
        }
      }
      currentIndex++;
    }
  }

  private removeItem(
    astNodes: Array<AstNode>,
    node: AstNode,
    opt: AstNode,
    rule: number
  ) {
    let i = astNodes.indexOf(node);
    if (i !== -1) {
      this.removedNodes.push({ nodes: astNodes.splice(i, 1), rule, opt });
    }
  }
}
