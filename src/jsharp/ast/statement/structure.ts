import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, JType, ErrorType, StructureType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";
import Expression from "../expression/expression";

export class Structure extends Statement {
  private type: StructureType;

  public constructor(
    nodeInfo: NodeInfo,
    public identifier: string,
    public attributeList: Array<Attribute>
  ) {
    super(nodeInfo);
  }

  public createScope(typeFactory: TypeFactory, scope: BlockScope): void {
    this.type = typeFactory.createNewStructure(
      this.nodeInfo.filename,
      this.identifier
    );
    if (this.type) {
      if (!this.type.structure) {
        let currentId: string;
        let length = this.attributeList.length;
        for (let i = 0; i < length; i++) {
          currentId = this.attributeList[i].identifier;
          for (let j = 0; j < length; j++) {
            if (i !== j && currentId === this.attributeList[j].identifier) {
              scope.addError(
                new ErrorType(
                  `Error en la estructura ${this.identifier} existen dos atributos con el mismo identificador.`,
                  this.attributeList[i].nodeInfo
                )
              );
            }
          }
        }
        this.type.setStructure(this);
      }
    }
  }

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {
    if (this.type) {
      if (this.type.structure) {
        let length = this.attributeList.length;
        for (let i = 0; i < length; i++) {
          this.attributeList[i].checkScope(typeFactory, scope);
        }
        let attributeList = this.type.structure.attributeList;
        let lengthThis = this.attributeList.length;
        let lengthType = attributeList.length;
        if (lengthThis === lengthType) {
          for (let i = 0; i < lengthType; i++) {
            let attribute = attributeList[i];
            let found = false;
            for (let j = 0; i < lengthType; j++) {
              if (attribute.identifier === this.attributeList[j].identifier) {
                found = true;
                if (!attribute.type.isEquals(this.attributeList[j].type)) {
                  scope.addError(
                    new ErrorType(
                      `Error se ha encontrado que el atributo ${attribute.identifier} tiene diferentes tipos en multiples declaraciones de la estructura  ${this.identifier}.`,
                      attribute.nodeInfo
                    )
                  );
                }
                break;
              }
            }
            if (!found) {
              scope.addError(
                new ErrorType(
                  `Error no se ha encontrado ${attribute.identifier} dentro de la declaracion de la estructura ${this.identifier}. Esto pudo ocurrir si existen multiples declaraciones de la estructura ${this.identifier}.`,
                  attribute.nodeInfo
                )
              );
            }
          }
        }
      } else {
        scope.addError(
          new ErrorType(
            `Error existe multiples declaraciones de la estructura ${this.identifier} con cantidades diferentes de atributos.`,
            this.nodeInfo
          )
        );
      }
    } else {
      scope.addError(
        new ErrorType(
          `Error no existe una estructura con nombre ${this.identifier}.`,
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
    if (this.type && this.type.structure) {
      let t1 = codeBuilder.getNewTemporary(),
        t2 = codeBuilder.getNewTemporary(),
        t3 = codeBuilder.getNewTemporary();
      let L1 = codeBuilder.getNewLabel(),
        L2 = codeBuilder.getNewLabel();
      codeBuilder.setTranslatedCode(`${t1} = Heap[${this.type.enablePointer}];
if (${t1} == 1) goto ${L1};
Heap[${this.type.enablePointer}] = 1;
goto ${L2};
${L1}:
${t2} = P + ${scope.size}; # Cambio simulado de ambito
`);
      this.translateStr(codeBuilder, this.nodeInfo.filename);
      codeBuilder.setTranslatedCode(`${t3} = ${t2} + 0;
Stack[${t3}] = ${codeBuilder.getLastAddress()};
${t3} = ${t2} + 1;
Stack[${t3}] = ${this.nodeInfo.line};
${t3} = ${t2} + 2;
Stack[${t3}] = ${this.nodeInfo.column};
`);
      this.translateStr(codeBuilder, this.identifier);
      codeBuilder.setTranslatedCode(`${t3} = ${t2} + 3;
Stack[${t3}] = ${codeBuilder.getLastAddress()};
P = P + 4;
call native_print_error_decl_struct;
P = P - 4;
E = 3;
${L2}:
`);
    }
  }

  public translateConctructor(nameReal: string, codeBuilder: CodeTranslator) {
    let size = this.attributeList.length;
    let t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary(),
      t5 = codeBuilder.getNewTemporary(),
      t6 = codeBuilder.getNewTemporary(),
      t7 = codeBuilder.getNewTemporary(),
      t8 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`
# Constructor de la estructura ${this.identifier}
proc ${nameReal} begin
  ${t1} = -1;
  ${t2} = Heap[${this.type.enablePointer}];
  if (${t2} == 0) goto ${L1};
  ${t1} = H;
  H = H + ${size};
`);

    for (let i = 0; i < size; i++) {
      codeBuilder.setTranslatedCode(`  ${t3} = ${t1} + ${i};
  Heap[${t3}] = ${this.attributeList[i].type.getValueDefault()};
`);
    }

    codeBuilder.setTranslatedCode(`  goto ${L2};
${L1}:
  ${t4} = P + 3; # Cambio simulado de ambito
`);
    this.translateStr(codeBuilder, this.nodeInfo.filename);
    codeBuilder.setTranslatedCode(`${t5} = ${t4} + 0;
Stack[${t5}] = ${codeBuilder.getLastAddress()};
${t5} = ${t4} + 1;
${t6} = P + 1;
${t7} = Stack[${t6}];
Stack[${t5}] = ${t7};
${t5} = ${t4} + 2;
${t6} = P + 2;
${t7} = Stack[${t6}];
Stack[${t5}] = ${t7};
`);
    this.translateStr(codeBuilder, this.identifier);
    codeBuilder.setTranslatedCode(`${t5} = ${t4} + 3;
Stack[${t5}] = ${codeBuilder.getLastAddress()};
P = P + 3;
call native_print_error_get_struct;
P = P - 3;
E = 3;
${L2}:
${t8} = P + 0;
Stack[${t8}] = ${t1};
end

`);
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

export class Attribute extends Statement {
  public constructor(
    nodeInfo: NodeInfo,
    public type: JType,
    public identifier: string,
    public exp?: Expression
  ) {
    super(nodeInfo);
  }

  public createScope(typeFactory: TypeFactory, scope: BlockScope): void {}

  public checkScope(typeFactory: TypeFactory, scope: BlockScope): void {
    if (this.exp) {
      this.exp.verifyType(typeFactory, scope);
      let typeExp = this.exp.type;
      let verify =
        (typeFactory.isDouble(this.type) && typeFactory.isNumeric(typeExp)) ||
        (typeFactory.isInteger(this.type) &&
          (typeFactory.isInteger(typeExp) || typeFactory.isChar(typeExp))) ||
        this.type.isEquals(typeExp);
      if (!verify) {
        new ErrorType(
          `Error no se puede asignar una expresion de tipo ${typeExp} en una declaracion de variables de tipo ${this.type}.`,
          this.nodeInfo
        );
      }
    }
  }

  public translate(
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator,
    scope: BlockScope
  ): void {}
}
