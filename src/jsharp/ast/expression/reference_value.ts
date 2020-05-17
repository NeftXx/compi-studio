import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import { BlockScope } from "../../scope/scope";
import CodeTranslator from "../../scope/code_builder";
import { TypeFactory } from "../../scope/type";

export default class ReferenceValue extends Expression {
  public constructor(nodeInfo: NodeInfo, private exp: Expression) {
    super(nodeInfo);
  }
  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    this.exp.verifyType(typeFactory, scope);
    this.type = this.exp.type;
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    this.exp.translate(typeFactory, codeBuilder, scope);
    if (typeFactory.isArrayType(this.exp.type)) {
      this.linealize(codeBuilder, scope);
    }
  }

  private linealize(codeBuilder: CodeTranslator, scope: BlockScope) {
    let t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary();
    let dir = codeBuilder.getLastAddress();
    let size = scope.size;
    codeBuilder.setTranslatedCode(`P = P + ${size}; # Cambio de ambito
# Mandando parametros
${t1} = P + 1; # parametro numero 0
Stack[${t1}] = ${dir}; # Enviando parametros
call native_copiar_arreglo;
${t2} = Stack[P]; # Obteniendo valor del return
P = P - ${size}; # Regresando a ambito actual
`);
    codeBuilder.removeUnusedTemporary(dir);
    codeBuilder.setLastAddress(t2);
    codeBuilder.addUnusedTemporary(t2);
  }
}
