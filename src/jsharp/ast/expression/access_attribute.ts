import Expression from "./expression";
import NodeInfo from "../../scope/node_info";
import { BlockScope } from "../../scope/scope";
import CodeTranslator from "../../scope/code_builder";
import {
  TypeFactory,
  StructureType,
  ErrorType,
  ArrayType,
} from "../../scope/type";

export default class AccessAttribute extends Expression {
  private dir: number;
  public tempDir: string;

  public constructor(
    nodeInfo: NodeInfo,
    public exp: Expression,
    public identifier: string
  ) {
    super(nodeInfo);
    this.dir = -1;
  }

  public verifyType(typeFactory: TypeFactory, scope: BlockScope): void {
    this.exp.verifyType(typeFactory, scope);
    let type = this.exp.type;
    if (type instanceof StructureType && type.structure) {
      let structure = type.structure;
      let count = 0;
      for (let attribute of structure.attributeList) {
        if (this.identifier === attribute.identifier) {
          this.dir = count;
          break;
        }
        count++;
      }
      if (this.dir === -1) {
        this.type = new ErrorType(
          `Error no existe el atributo ${this.identifier} en la estructura ${structure.identifier}.`,
          this.nodeInfo
        );
      } else {
        this.type = structure.attributeList[this.dir].type;
        this.dir += 1;
      }
    } else if (type instanceof ArrayType) {
      if (this.identifier === "length") {
        this.dir = 0;
        this.type = typeFactory.getInteger();
      } else {
        this.type = new ErrorType(
          `Error no existe el atributo ${this.identifier} en una arreglo.`,
          this.nodeInfo
        );
      }
    } else {
      this.type = new ErrorType(
        `Error la expresion dada no es una estructura.`,
        this.nodeInfo
      );
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {
    this.exp.translate(typeFactory, codeBuilder, scope);
    let lastDir = codeBuilder.getLastAddress();
    if (typeFactory.isArrayType(this.exp.type)) {
      let t1 = codeBuilder.getNewTemporary();
      let L1 = codeBuilder.getNewLabel(),
        L2 = codeBuilder.getNewLabel();
      codeBuilder.setTranslatedCode(`# Accediendo a arreglo
if (${lastDir} == -1) goto ${L1};
${t1} = Heap[${lastDir}];
goto ${L2};
${L1}:
E = 4;
${t1} = 0;
${L2}:
`);
      codeBuilder.removeUnusedTemporary(lastDir);
      codeBuilder.setLastAddress(t1);
      codeBuilder.addUnusedTemporary(t1);
    } else {
      let t1 = codeBuilder.getNewTemporary(),
        t2 = codeBuilder.getNewTemporary();
      let L1 = codeBuilder.getNewLabel(),
        L2 = codeBuilder.getNewLabel();
      codeBuilder.removeUnusedTemporary(lastDir);
      codeBuilder.setTranslatedCode(`# Accediendo a estructura
if (${lastDir} == -1) goto ${L1};
${t1} = ${lastDir} + ${this.dir};
${t2} = Heap[${t1}];
goto ${L2};
${L1}:
E = 4;
${t2} = -1;
${L2}:
`);
      if (typeFactory.isBoolean(this.type)) {
        let LV = codeBuilder.getNewLabel(),
          LF = codeBuilder.getNewLabel();
        codeBuilder.setTranslatedCode(`# Convertiendo atributo a booleano
if (${t2} == 1) goto ${LV};
goto ${LF};
`);
        codeBuilder.addTrueLabel(LV);
        codeBuilder.addFalseLabel(LF);
      } else {
        this.tempDir = t1;
        codeBuilder.setLastAddress(t2);
        codeBuilder.addUnusedTemporary(t2);
      }
    }
  }
}
