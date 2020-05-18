import Statement from "./statement";
import Expression from "../expression/expression";
import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, ErrorType, JType } from "../../scope/type";
import { BlockScope, FileScope } from "../../scope/scope";
import Ast from "../ast";

export abstract class Declaration extends Statement {
  protected translateStr(codeBuilder: CodeTranslator, str: string) {
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

export class VarDeclaration extends Declaration {
  public constructor(
    nodeInfo: NodeInfo,
    public isConstant: boolean,
    public identifier: string,
    public exp: Expression
  ) {
    super(nodeInfo);
  }

  public createScope(typeFactory: TypeFactory, scope: BlockScope): void {}

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {
    this.exp.verifyType(typeFactory, scope);
    let type = this.exp.type;
    if (type instanceof ErrorType) {
      scope.addError(type);
    }
    if (typeFactory.isNull(type)) {
      type = new ErrorType(
        `Error no se puede asignar la expresion null a este tipo de declaracion.`,
        this.nodeInfo
      );
      scope.addError(type as ErrorType);
    }
    let ok = scope.createVariableLocal(this.identifier, type, this.isConstant);
    if (!ok) {
      scope.addError(
        new ErrorType(
          `Error la variable ${this.identifier} ya fue declarada.`,
          this.nodeInfo
        )
      );
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    if (scope instanceof FileScope) {
      this.translateGlobal(typeFactory, codeBuilder, scope);
    } else {
      this.translateLocal(typeFactory, codeBuilder, scope);
    }
  }

  private translateLocal(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ) {
    this.exp.translate(typeFactory, codeBuilder, scope);
    let variable = scope.getVariableLocal(this.identifier);
    let dir: string;
    if (typeFactory.isBoolean(this.exp.type)) {
      dir = codeBuilder.getNewTemporary();
      codeBuilder.printFalseLabels();
      codeBuilder.setTranslatedCode(`${dir} = 0;\n`);
      let LS = codeBuilder.getNewLabel();
      codeBuilder.setTranslatedCode(`goto ${LS};\n`);
      codeBuilder.printTrueLabels();
      codeBuilder.setTranslatedCode(`${dir} = 1;\n${LS}:\n`);
    } else {
      dir = codeBuilder.getLastAddress();
    }
    let t1 = codeBuilder.getNewTemporary();
    codeBuilder.setTranslatedCode(`${t1} = P + ${variable.ptr};
Stack[${t1}] = ${dir};
`);
    codeBuilder.removeUnusedTemporary(dir);
  }

  private translateGlobal(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ) {
    codeBuilder.setTranslatedCode(
      `# Inicio declaracion de la variable global ${this.identifier}\n`
    );
    this.exp.translate(typeFactory, codeBuilder, scope);
    let globalScope = scope.getGlobal();
    let variable = globalScope.getVariableLocal(this.identifier);
    let t1 = codeBuilder.getNewTemporary();
    let LV = codeBuilder.getNewLabel();
    let LF = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`${t1} = Heap[${variable.ptr + 1}];
if (${t1} == 1) goto ${LV};`);
    if (typeFactory.isBoolean(this.exp.type)) {
      let dir = codeBuilder.getNewTemporary();
      codeBuilder.printFalseLabels();
      codeBuilder.setTranslatedCode(`${dir} = 0;\n`);
      let LS = codeBuilder.getNewLabel();
      codeBuilder.setTranslatedCode(`goto ${LS};\n`);
      codeBuilder.printTrueLabels();
      codeBuilder.setTranslatedCode(`${dir} = 1;\n${LS}:\n`);
      codeBuilder.setTranslatedCode(`
Heap[${variable.ptr}] = ${dir};
Heap[${variable.ptr + 1}] = 1;
`);
    } else {
      let last = codeBuilder.getLastAddress();
      codeBuilder.setTranslatedCode(`
Heap[${variable.ptr}] = ${last};
Heap[${variable.ptr + 1}] = 1;
`);
      codeBuilder.removeUnusedTemporary(last);
    }
    codeBuilder.setTranslatedCode(`goto ${LF};\n${LV}:\n`);
    let t2 = codeBuilder.getNewTemporary();
    let t3 = codeBuilder.getNewTemporary();
    let size = globalScope.size;
    codeBuilder.setTranslatedCode(
      `${t2} = P + ${size}; # Cambio simulado de ambito\n`
    );
    this.translateStr(codeBuilder, this.nodeInfo.filename);
    codeBuilder.setTranslatedCode(
      `${t3} = ${t2} + 0;\nStack[${t3}] = ${codeBuilder.getLastAddress()};\n`
    );
    codeBuilder.setTranslatedCode(
      `${t3} = ${t2} + 1;\nStack[${t3}] = ${this.nodeInfo.line};\n`
    );
    codeBuilder.setTranslatedCode(
      `${t3} = ${t2} + 2;\nStack[${t3}] = ${this.nodeInfo.column};\n`
    );
    this.translateStr(codeBuilder, this.identifier);
    codeBuilder.setTranslatedCode(
      `${t3} = ${t2} + 3;\nStack[${t3}] = ${codeBuilder.getLastAddress()};\n`
    );
    codeBuilder.setTranslatedCode(
      `P = P + ${size};\ncall native_print_global_variable_error;\nP = P - ${size};\nE = 3;\n`
    );
    codeBuilder.setTranslatedCode(`${LF}:\n`);
    codeBuilder.setTranslatedCode(
      `# Fin declaracion de la variable global ${this.identifier}\n`
    );
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM = ast.contNodes++;
    let temp = this.isConstant ? "const" : "var";
    const NUM_EXP = this.exp.getAstNode(ast, str);
    str.push(`
  node${NUM}[label="${temp}"];
  node${ast.contNodes}[label="${this.identifier}"];
  node${NUM} -> node${ast.contNodes++};
  node${ast.contNodes}[label=":="];
  node${NUM} -> node${ast.contNodes++};
  node${NUM} -> node${NUM_EXP};
`);
    return NUM;
  }
}

export class VarDeclarationGlobal extends Declaration {
  public constructor(
    nodeInfo: NodeInfo,
    public identifier: string,
    public exp: Expression
  ) {
    super(nodeInfo);
  }

  public createScope(typeFactory: TypeFactory, scope: BlockScope): void {
    this.exp.verifyType(typeFactory, scope);
    let type = this.exp.type;
    if (type instanceof ErrorType) {
      scope.addError(type);
    }
    if (typeFactory.isNull(type)) {
      type = new ErrorType(
        `Error no se puede asignar la expresion null a este tipo de declaracion.`,
        this.nodeInfo
      );
      scope.addError(type as ErrorType);
    }
    let globalScope = scope.getGlobal();
    let ok = globalScope.createVariableLocal(this.identifier, type, false);
    if (!ok) {
      let variable = globalScope.getVariableLocal(this.identifier);
      if (!variable.type.isEquals(type)) {
        scope.addError(
          new ErrorType(
            `Error la variable global ${this.identifier} tiene multiples declaraciones con diferentes tipos.`,
            this.nodeInfo
          )
        );
      }
    }
  }

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {}

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    codeBuilder.setTranslatedCode(
      `# Inicio declaracion de la variable global ${this.identifier}\n`
    );
    this.exp.translate(typeFactory, codeBuilder, scope);
    let globalScope = scope.getGlobal();
    let variable = globalScope.getVariableLocal(this.identifier);
    let t1 = codeBuilder.getNewTemporary();
    let LV = codeBuilder.getNewLabel();
    let LF = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`${t1} = Heap[${variable.ptr + 1}];
if (${t1} == 1) goto ${LV};`);
    if (typeFactory.isBoolean(this.exp.type)) {
      let dir = codeBuilder.getNewTemporary();
      codeBuilder.printFalseLabels();
      codeBuilder.setTranslatedCode(`${dir} = 0;\n`);
      let LS = codeBuilder.getNewLabel();
      codeBuilder.setTranslatedCode(`goto ${LS};\n`);
      codeBuilder.printTrueLabels();
      codeBuilder.setTranslatedCode(`${dir} = 1;\n${LS}:\n`);
      codeBuilder.setTranslatedCode(`
Heap[${variable.ptr}] = ${dir};
Heap[${variable.ptr + 1}] = 1;
`);
    } else {
      let last = codeBuilder.getLastAddress();
      codeBuilder.setTranslatedCode(`
Heap[${variable.ptr}] = ${last};
Heap[${variable.ptr + 1}] = 1;
`);
      codeBuilder.removeUnusedTemporary(last);
    }
    codeBuilder.setTranslatedCode(`goto ${LF};\n${LV}:\n`);
    let t2 = codeBuilder.getNewTemporary();
    let t3 = codeBuilder.getNewTemporary();
    let size = globalScope.size;
    codeBuilder.setTranslatedCode(
      `${t2} = P + ${size}; # Cambio simulado de ambito\n`
    );
    this.translateStr(codeBuilder, this.nodeInfo.filename);
    codeBuilder.setTranslatedCode(
      `${t3} = ${t2} + 0;\nStack[${t3}] = ${codeBuilder.getLastAddress()};\n`
    );
    codeBuilder.setTranslatedCode(
      `${t3} = ${t2} + 1;\nStack[${t3}] = ${this.nodeInfo.line};\n`
    );
    codeBuilder.setTranslatedCode(
      `${t3} = ${t2} + 2;\nStack[${t3}] = ${this.nodeInfo.column};\n`
    );
    this.translateStr(codeBuilder, this.identifier);
    codeBuilder.setTranslatedCode(
      `${t3} = ${t2} + 3;\nStack[${t3}] = ${codeBuilder.getLastAddress()};\n`
    );
    codeBuilder.setTranslatedCode(
      `P = P + ${size};\ncall native_print_global_variable_error;\nP = P - ${size};\nE = 3;\n`
    );
    codeBuilder.setTranslatedCode(`${LF}:\n`);
    codeBuilder.setTranslatedCode(
      `# Fin declaracion de la variable global ${this.identifier}\n`
    );
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM = ast.contNodes++;
    const NUM_EXP = this.exp.getAstNode(ast, str);
    str.push(`
  node${NUM}[label="global"];
  node${ast.contNodes}[label="${this.identifier}"];
  node${NUM} -> node${ast.contNodes++};
  node${ast.contNodes}[label=":="];
  node${NUM} -> node${ast.contNodes++};
  node${NUM} -> node${NUM_EXP};
`);
    return NUM;
  }
}

export class VarDeclarationType extends Declaration {
  public constructor(
    nodeInfo: NodeInfo,
    public type: JType,
    public idList: Array<string>,
    public exp?: Expression
  ) {
    super(nodeInfo);
  }

  public createScope(typeFactory: TypeFactory, scope: BlockScope): void {}

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {
    if (this.exp) {
      this.exp.verifyType(typeFactory, scope);
      let typeExp = this.exp.type;
      if (typeExp instanceof ErrorType) {
        scope.addError(typeExp);
      }
      let verify =
        (typeFactory.isDouble(this.type) && typeFactory.isNumeric(typeExp)) ||
        (typeFactory.isInteger(this.type) &&
          (typeFactory.isInteger(typeExp) || typeFactory.isChar(typeExp))) ||
        this.type.isEquals(typeExp);
      if (!verify) {
        scope.addError(
          new ErrorType(
            `Error no se puede asignar una expresion de tipo ${typeExp} en una declaracion de variables de tipo ${this.type}.`,
            this.nodeInfo
          )
        );
      }
    }
    let ok: boolean;
    for (let identifier of this.idList) {
      ok = scope.createVariableLocal(identifier, this.type, false);
      if (!ok) {
        scope.addError(
          new ErrorType(
            `Error la variable ${identifier} ya fue declarada.`,
            this.nodeInfo
          )
        );
      }
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    if (scope instanceof FileScope) {
      this.translateGlobal(typeFactory, codeBuilder, scope);
    } else {
      this.translateLocal(typeFactory, codeBuilder, scope);
    }
  }

  private translateLocal(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ) {
    let dir: string;
    if (this.exp) {
      this.exp.translate(typeFactory, codeBuilder, scope);
      if (typeFactory.isBoolean(this.exp.type)) {
        dir = codeBuilder.getNewTemporary();
        codeBuilder.printFalseLabels();
        codeBuilder.setTranslatedCode(`${dir} = 0;\n`);
        let LS = codeBuilder.getNewLabel();
        codeBuilder.setTranslatedCode(`goto ${LS};\n`);
        codeBuilder.printTrueLabels();
        codeBuilder.setTranslatedCode(`${dir} = 1;\n${LS}:\n`);
      } else {
        dir = codeBuilder.getLastAddress();
      }
    } else {
      dir = this.type.getValueDefault();
    }
    let t1 = codeBuilder.getNewTemporary();
    this.idList.forEach((id) => {
      let variable = scope.getVariableLocal(id);
      codeBuilder.setTranslatedCode(`${t1} = P + ${variable.ptr}; # Direccion de variable  ${id}
Stack[${t1}] = ${dir}; # Asignacion de valor a variable ${id}
`);
    });
    codeBuilder.removeUnusedTemporary(dir);
  }

  private translateGlobal(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ) {
    let dirExp: string;
    if (this.exp) {
      this.exp.translate(typeFactory, codeBuilder, scope);
      dirExp = codeBuilder.getLastAddress();
    } else {
      dirExp = this.type.getValueDefault();
    }
    this.idList.forEach((id) => {
      codeBuilder.setTranslatedCode(
        `# Inicio declaracion de la variable global ${id}\n`
      );
      let globalScope = scope.getGlobal();
      let variable = globalScope.getVariableLocal(id);
      let t1 = codeBuilder.getNewTemporary();
      let LV = codeBuilder.getNewLabel();
      let LF = codeBuilder.getNewLabel();
      codeBuilder.setTranslatedCode(`${t1} = Heap[${variable.ptr + 1}];
  if (${t1} == 1) goto ${LV};`);
      if (typeFactory.isBoolean(this.exp.type)) {
        let dir = codeBuilder.getNewTemporary();
        codeBuilder.printFalseLabels();
        codeBuilder.setTranslatedCode(`${dir} = 0;`);
        let LS = codeBuilder.getNewLabel();
        codeBuilder.setTranslatedCode(`goto ${LS};\n`);
        codeBuilder.printTrueLabels();
        codeBuilder.setTranslatedCode(`${dir} = 1;\n${LS}:\n`);
        codeBuilder.setTranslatedCode(`
  Heap[${variable.ptr}] = ${dir};
  Heap[${variable.ptr + 1}] = 1;
  `);
      } else {
        codeBuilder.setTranslatedCode(`
  Heap[${variable.ptr}] = ${dirExp};
  Heap[${variable.ptr + 1}] = 1;
  `);
        codeBuilder.removeUnusedTemporary(dirExp);
      }
      codeBuilder.setTranslatedCode(`goto ${LF};\n${LV}:\n`);
      let t2 = codeBuilder.getNewTemporary();
      let t3 = codeBuilder.getNewTemporary();
      let size = globalScope.size;
      codeBuilder.setTranslatedCode(
        `${t2} = P + ${size}; # Cambio simulado de ambito\n`
      );
      this.translateStr(codeBuilder, this.nodeInfo.filename);
      codeBuilder.setTranslatedCode(
        `${t3} = ${t2} + 0;\nStack[${t3}] = ${codeBuilder.getLastAddress()};\n`
      );
      codeBuilder.setTranslatedCode(
        `${t3} = ${t2} + 1;\nStack[${t3}] = ${this.nodeInfo.line};\n`
      );
      codeBuilder.setTranslatedCode(
        `${t3} = ${t2} + 2;\nStack[${t3}] = ${this.nodeInfo.column};\n`
      );
      this.translateStr(codeBuilder, id);
      codeBuilder.setTranslatedCode(
        `${t3} = ${t2} + 3;\nStack[${t3}] = ${codeBuilder.getLastAddress()};\n`
      );
      codeBuilder.setTranslatedCode(
        `P = P + ${size};\ncall native_print_global_variable_error;\nP = P - ${size};\nE = 3;\n`
      );
      codeBuilder.setTranslatedCode(`${LF}:\n`);
      codeBuilder.setTranslatedCode(
        `# Fin declaracion de la variable global ${id}\n`
      );
    });
  }

  getAstNode(ast: Ast, str: Array<string>): number {
    const NUM = ast.contNodes++;
    str.push(`
  node${NUM}[label="Declaracion"];
  node${ast.contNodes}[label="${this.type}"];
  node${NUM} -> node${ast.contNodes++};
`);
    for (let id of this.idList) {
      str.push(`
  node${ast.contNodes}[label="${id}"];
  node${NUM} -> node${ast.contNodes++};
`);
    }
    if (this.exp) {
      const NUM_EXP = this.exp.getAstNode(ast, str);
      str.push(`
  node${ast.contNodes}[label=":="];
  node${NUM} -> node${ast.contNodes};
  node${NUM} -> node${NUM_EXP};
`);
    }
    return NUM;
  }
}
