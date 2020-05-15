import CodeTranslator from "../../scope/code_builder";
import NodeInfo from "../../scope/node_info";
import { TypeFactory, JType, ErrorType, StructureType } from "../../scope/type";
import { BlockScope } from "../../scope/scope";
import Statement from "./statement";
import Expression from "../expression/expression";

export class Structure extends Statement {
  private type: StructureType;
  private scopeDefinition: BlockScope;

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
        this.scopeDefinition = scope;
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
        t2 = codeBuilder.getNewTemporary();
      let L1 = codeBuilder.getNewLabel(),
        L2 = codeBuilder.getNewLabel();
      let size = scope.size;
      codeBuilder.setTranslatedCode(`${t1} = Heap[${this.type.enablePointer}];
if (${t1} == 1) goto ${L1};
Heap[${this.type.enablePointer}] = 1;
goto ${L2};
${L1}:
P = P + ${size}; # Cambio de ambito
`);
      this.translateStr(codeBuilder, this.nodeInfo.filename);
      codeBuilder.setTranslatedCode(`Stack[P] = ${codeBuilder.getLastAddress()};
${t2} = P + 1;
Stack[${t2}] = ${this.nodeInfo.line};
${t2} = P + 2;
Stack[${t2}] = ${this.nodeInfo.column};
`);
      this.translateStr(codeBuilder, this.identifier);
      codeBuilder.setTranslatedCode(`${t2} = P + 3;
Stack[${t2}] = ${codeBuilder.getLastAddress()};
call native_print_error_decl_struct;
P = P - ${size};
E = 3;
${L2}:
`);
    }
  }

  public translateConctructor(
    nameReal: string,
    typeFactory: TypeFactory,
    codeBuilder: CodeTranslator
  ) {
    let size = this.attributeList.length;
    let t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary(),
      t5 = codeBuilder.getNewTemporary(),
      t6 = codeBuilder.getNewTemporary(),
      t7 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`
# Constructor de la estructura ${this.identifier}
proc ${nameReal} begin
${t1} = -1; # Nulo
${t2} = Heap[${this.type.enablePointer}]; # Posicion del puntero de habilitacion
if (${t2} == 0) goto ${L1}; # Si es igual a cero no esta declarado aun
${t1} = H; # Puntero donde se guardara el objeto ${this.identifier}
Heap[${t1}] = ${size}; # Tamaño de la estructura
H = H + ${size + 1}; # Aumento del heap
`);

    for (let i = 0; i < size; i++) {
      let attribute = this.attributeList[i];
      attribute.translate(typeFactory, codeBuilder, this.scopeDefinition);
      codeBuilder.setTranslatedCode(
        `${t3} = ${t1} + ${i + 1};
Heap[${t3}] = ${codeBuilder.getLastAddress()}; # Enviando valor del atributo ${
          attribute.identifier
        }
`
      );
    }
    codeBuilder.setTranslatedCode(`goto ${L2}; # Salto a la etiqueta return
${L1}: # Etiqueta si el objeto no esta declarado
${t4} = P + 3; # Cambio simulado de ambito
# Nombre del archivo ${this.nodeInfo.filename}
`);
    this.translateStr(codeBuilder, this.nodeInfo.filename);
    codeBuilder.setTranslatedCode(`Stack[${t4}] = ${codeBuilder.getLastAddress()}; # Enviando el nombre del archivo
${t5} = ${t4} + 1; # Posicion del parametro a enviar
${t6} = P + 1; # Obteniendo parametro de la variable linea
${t7} = Stack[${t6}]; # Gurdando parametro en temporal
Stack[${t5}] = ${t7}; # Enviando valor de la linea
${t5} = ${t4} + 2; # Posicion del parametro a enviar
${t6} = P + 2; # Obtiendo parametro de la variable columna
${t7} = Stack[${t6}]; # Guardando parametro en temporal
Stack[${t5}] = ${t7}; # Enviando valor de columna
`);
    this.translateStr(codeBuilder, this.identifier);
    codeBuilder.setTranslatedCode(`${t5} = ${t4} + 3; # Posicion del parametro a enviar
Stack[${t5}] = ${codeBuilder.getLastAddress()}; # Enviando en nombre de la estructura ${
      this.identifier
    }
P = P + 3; # Cambio de ambito
call native_print_error_get_struct;
P = P - 3; # Regreso de ambito
E = 3; # Excepcion
${L2}:
# Salvo el puntero a retornar
Stack[P] = ${t1};
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
  ): void {
    if (this.exp) {
      this.exp.translate(typeFactory, codeBuilder, scope);
      if (typeFactory.isBoolean(this.exp.type)) {
        let dir = codeBuilder.getNewTemporary();
        codeBuilder.printFalseLabels();
        codeBuilder.setTranslatedCode(`${dir} = 0;\n`);
        let LTemp = codeBuilder.getNewLabel();
        codeBuilder.setTranslatedCode(`goto ${LTemp};\n`);
        codeBuilder.printTrueLabels();
        codeBuilder.setTranslatedCode(`${dir} = 1\n${LTemp}:\n`);
        codeBuilder.setLastAddress(dir);
      }
    } else {
      codeBuilder.setLastAddress(this.type.getValueDefault());
    }
  }
}
