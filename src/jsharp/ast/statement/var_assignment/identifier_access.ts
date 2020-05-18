import NodeInfo from "../../../scope/node_info";
import { TypeFactory, ErrorType } from "../../../scope/type";
import { BlockScope } from "../../../scope/scope";
import CodeTranslator from "../../../scope/code_builder";
import Access from "./access";
import Ast from "../../ast";

export default class IdentifierAccess extends Access {
  public isConstant: boolean;

  public constructor(nodeInfo: NodeInfo, public identifier: string) {
    super(nodeInfo);
    this.isConstant = false;
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    let variable = scope.getVariable(this.identifier);
    if (variable) {
      this.isConstant = variable.isConstant;
      this.itsHeap = false;
      this.type = variable.type;
    } else {
      let globalScope = scope.getGlobal();
      variable = globalScope.getVariableLocal(this.identifier);
      if (variable) {
        this.isConstant = variable.isConstant;
        this.itsHeap = true;
        this.type = variable.type;
      } else {
        this.type = new ErrorType(
          `Error la variable ${this.identifier} no ha sido declarada.`,
          this.nodeInfo
        );
      }
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    if (this.itsHeap) {
      let globalScope = scope.getGlobal();
      let size = scope.size;
      let variable = globalScope.getVariableLocal(this.identifier);
      let LV = codeBuilder.getNewLabel(),
        LF = codeBuilder.getNewLabel();
      let t1 = codeBuilder.getNewTemporary(),
        t2 = codeBuilder.getNewTemporary(),
        t3 = codeBuilder.getNewTemporary(),
        t4 = codeBuilder.getNewTemporary();
      codeBuilder.setTranslatedCode(`${t1} = Heap[${variable.ptr + 1}];
${t2} = -1;
if (${t1} == 0) goto ${LV};
${t2} = ${variable.ptr};
goto ${LF};
${LV}:
${t3} = P + ${size}; # Cambio simulado de ambito
`);
      this.translateStr(codeBuilder, this.nodeInfo.filename);
      codeBuilder.setTranslatedCode(`${t4} = ${t3} + 0;
Stack[${t4}] = ${codeBuilder.getLastAddress()};
${t4} = ${t3} + 1;
Stack[${t4}] = ${this.nodeInfo.line};
${t4} = ${t3} + 2;
Stack[${t4}] = ${this.nodeInfo.column};
`);
      this.translateStr(codeBuilder, this.identifier);
      codeBuilder.setTranslatedCode(`${t4} = ${t3} + 3;
Stack[${t4}] = ${codeBuilder.getLastAddress()};
P = P + ${size};
call native_print_get_global_variable_error;
P = P - ${size};
E = 3;
${LF}:
`);
      codeBuilder.setLastAddress(t2);
      codeBuilder.addUnusedTemporary(t2);
    } else {
      let variable = scope.getVariable(this.identifier);
      let t1 = codeBuilder.getNewTemporary();
      codeBuilder.setTranslatedCode(`${t1} = P + ${variable.ptr};\n`);
      codeBuilder.setLastAddress(t1);
      codeBuilder.addUnusedTemporary(t1);
    }
  }

  private translateStr(codeBuilder: CodeTranslator, str: string) {
    codeBuilder.setTranslatedCode(`# Inicio de cadena\n`);
    let tempStart = codeBuilder.getNewTemporary();
    codeBuilder.setTranslatedCode(`${tempStart} = H;\n`);
    for (let i = 0; i < str.length; i++) {
      codeBuilder.setTranslatedCode(`Heap[H] = ${str.charCodeAt(i)};\n`);
      codeBuilder.setTranslatedCode("H = H + 1;\n");
    }
    codeBuilder.setTranslatedCode(`Heap[H] = 0;\n`);
    codeBuilder.setTranslatedCode("H = H + 1;\n");
    codeBuilder.setTranslatedCode(`# Fin de cadena\n`);
    codeBuilder.setLastAddress(tempStart);
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM = ast.contNodes++;
    str.push(`  node${NUM}[label="Identificador"];
  node${ast.contNodes}[label="${this.identifier}"];
  node${NUM} -> node${ast.contNodes++};
`);
    return NUM;
  }
}
