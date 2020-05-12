import NodeInfo from "./node_info";
import { Structure } from "../ast/statement/structure";

export abstract class JType {
  constructor(public readonly nameType: string) {}

  public getValueDefault(): any {
    return -1;
  }

  public abstract isEquals(otherType: JType): boolean;

  public toString(): string {
    return this.nameType;
  }
}

export class BaseType extends JType {
  public static readonly INTEGER: BaseType = new BaseType("integer");
  public static readonly DOUBLE: BaseType = new BaseType("double");
  public static readonly BOOLEAN: BaseType = new BaseType("boolean");
  public static readonly CHAR: BaseType = new BaseType("char");
  public static readonly STRING: BaseType = new BaseType("String");

  private constructor(name: string) {
    super(name);
  }

  public isEquals(otherType: JType): boolean {
    if (otherType === AuxiliarType.NULL) {
      return this === BaseType.STRING;
    }
    return this === otherType;
  }

  public getValueDefault(): any {
    if (this === BaseType.INTEGER) return 0;
    if (this === BaseType.DOUBLE) return 0.0;
    if (this === BaseType.BOOLEAN) return 0;
    if (this === BaseType.CHAR) return "\0";
    return -1;
  }
}

export class AuxiliarType extends JType {
  public static readonly VOID: AuxiliarType = new AuxiliarType("void");
  public static readonly NULL: AuxiliarType = new AuxiliarType("null");

  private constructor(name: string) {
    super(name);
  }

  public isEquals(otherType: JType): boolean {
    if (this === AuxiliarType.NULL) {
      return (
        otherType === BaseType.STRING ||
        otherType instanceof StructureType ||
        otherType instanceof ArrayType ||
        this === otherType
      );
    }
    return this === otherType;
  }
}

export class ErrorType extends JType {
  public constructor(private message: string, private nodeInfo: NodeInfo) {
    super("error");
  }

  public isEquals(otherType: JType): boolean {
    return otherType instanceof ErrorType;
  }

  public getMessage(): string {
    return this.message;
  }

  public getFilename(): string {
    return this.nodeInfo.filename;
  }

  public getLine(): number {
    return this.nodeInfo.line;
  }

  public getColumn(): number {
    return this.nodeInfo.column;
  }
}

export class StructureType extends JType {
  public enablePointer: number;
  public structure: Structure;

  public constructor(nameType: string, public nameReal: string) {
    super(nameType);
    this.enablePointer = -1;
    this.structure = undefined;
  }

  public isEquals(otherType: JType): boolean {
    return this === otherType || otherType === AuxiliarType.NULL;
  }

  public setStructure(structure: Structure) {
    this.structure = structure;
  }

  public getStructure() {
    return this.structure;
  }
}

export class ArrayType extends JType {
  public constructor(public type: JType, public size: number) {
    super(`${type.nameType}_array`);
  }

  public isEquals(otherType: JType): boolean {
    if (otherType instanceof ArrayType) {
      return this.type === otherType.type && this.size === otherType.size;
    }
    return otherType === AuxiliarType.NULL;
  }
}

export class TypeFactory {
  public structures: Map<string, StructureType>;

  public constructor() {
    this.structures = new Map();
  }

  public createNewStructure(filename: string, nameType: string) {
    let realName = `strc_${filename.replace(/[.]|[-]/gi, "_")}_${nameType}`;
    let structure = this.structures.get(realName);
    if (structure) return structure;
    structure = new StructureType(nameType, realName);
    this.structures.set(realName, structure);
    return structure;
  }

  public getStructure(filename: string, nameType: string) {
    let realName = `strc_${filename.replace(/[.]|[-]/gi, "_")}_${nameType}`;
    return this.structures.get(realName);
  }

  public createArrayType(type: JType, size: number) {
    return new ArrayType(type, size);
  }

  public getInteger(): JType {
    return BaseType.INTEGER;
  }

  public getDouble(): JType {
    return BaseType.DOUBLE;
  }

  public getBoolean(): JType {
    return BaseType.BOOLEAN;
  }

  public getChar(): JType {
    return BaseType.CHAR;
  }

  public getString(): JType {
    return BaseType.STRING;
  }

  public getVoid(): JType {
    return AuxiliarType.VOID;
  }

  public getNull(): JType {
    return AuxiliarType.NULL;
  }

  public getErrorType(message: string, nodeInfo: NodeInfo) {
    return new ErrorType(message, nodeInfo);
  }

  public isInteger(type: JType) {
    return type === BaseType.INTEGER;
  }

  public isDouble(type: JType) {
    return type === BaseType.DOUBLE;
  }

  public isBoolean(type: JType) {
    return type === BaseType.BOOLEAN;
  }

  public isChar(type: JType) {
    return type === BaseType.CHAR;
  }

  public isString(type: JType) {
    return type === BaseType.STRING;
  }

  public isVoid(type: JType) {
    return type === AuxiliarType.VOID;
  }

  public isNull(type: JType) {
    return type === AuxiliarType.NULL;
  }

  public isErrorType(typ) {
    return typ instanceof ErrorType;
  }

  public isBaseType(type1: JType) {
    return type1 instanceof BaseType;
  }

  public isNumeric(type: JType) {
    return (
      type === BaseType.CHAR ||
      type === BaseType.INTEGER ||
      type === BaseType.DOUBLE
    );
  }

  public isStructure(type1: JType) {
    return type1 instanceof StructureType;
  }

  public isArrayType(type1: JType) {
    return type1 instanceof ArrayType;
  }
}
