import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import CodeTranslator from "../../scope/code_builder";
import { BlockScope, FileScope } from "../../scope/scope";
import { TypeFactory, ErrorType } from "../../scope/type";

export default class Identifier extends Expression {
  public constructor(nodeInfo: NodeInfo, public identifier: string) {
    super(nodeInfo);
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    let variable = scope.getVariable(this.identifier);
    if (!variable) {
      let globalScope = scope.getGlobal();
      variable = globalScope.getVariableLocal(this.identifier);
      if (!variable) {
        this.type = new ErrorType(
          `Error la variable ${this.identifier} no ha sido declarada.`,
          this.nodeInfo
        );
      } else {
        this.type = variable.type;
      }
    } else {
      this.type = variable.type;
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    if (scope instanceof FileScope) {
      this.getVariableGlobal(typeFactory, codeBuilder, scope);
    } else {
      let variable = scope.getVariable(this.identifier);
      if (variable) {
        let t1 = codeBuilder.getNewTemporary(),
          t2 = codeBuilder.getNewTemporary();
        codeBuilder.setTranslatedCode(`${t1} = P + ${variable.ptr};
${t2} = Stack[${t1}];\n`);
        if (typeFactory.isBoolean(this.type)) {
          let LV = codeBuilder.getNewLabel(),
            LF = codeBuilder.getNewLabel();
          codeBuilder.setTranslatedCode(`if (${t2} == 1) goto ${LV};
goto ${LF};
`);
          codeBuilder.addTrueLabel(LV);
          codeBuilder.addFalseLabel(LF);
        } else {
          codeBuilder.setLastAddress(t2);
          codeBuilder.addUnusedTemporary(t2);
        }
      } else {
        this.getVariableGlobal(typeFactory, codeBuilder, scope);
      }
    }
  }

  private getVariableGlobal(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ) {
    let globalScope = scope.getGlobal();
    let size = scope.size;
    let variable = globalScope.getVariableLocal(this.identifier);
    if (variable) {
      let LV = codeBuilder.getNewLabel(),
        LF = codeBuilder.getNewLabel();
      let t1 = codeBuilder.getNewTemporary(),
        t2 = codeBuilder.getNewTemporary(),
        t3 = codeBuilder.getNewTemporary(),
        t4 = codeBuilder.getNewTemporary();
      codeBuilder.setTranslatedCode(`${t1} = Heap[${variable.ptr + 1}];
${t2} = -1;
if (${t1} == 0) goto ${LV};
${t2} = Heap[${variable.ptr}];
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
      if (typeFactory.isBoolean(this.type)) {
        let LV = codeBuilder.getNewLabel(),
          LF = codeBuilder.getNewLabel();
        codeBuilder.setTranslatedCode(`if (${t2} == 1) goto ${LV};
goto ${LF};
`);
        codeBuilder.addTrueLabel(LV);
        codeBuilder.addFalseLabel(LF);
      } else {
        codeBuilder.setLastAddress(t2);
        codeBuilder.addUnusedTemporary(t2);
      }
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
}
