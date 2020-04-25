import NodeInfo from './node_info';

export abstract class JType {
  constructor(public readonly name: string) {}

  public getValueDefault(): any {
    return null;
  }

  public toString(): string {
    return this.name;
  }
}

export class BaseType extends JType {
  public static readonly INTEGER: BaseType = new BaseType('integer');
  public static readonly DOUBLE: BaseType = new BaseType('double');
  public static readonly BOOLEAN: BaseType = new BaseType('boolean');
  public static readonly CHAR: BaseType = new BaseType('char');
  public static readonly STRING: BaseType = new BaseType('String');

  private constructor(name: string) {
    super(name);
  }

  public getValueDefault(): any {
    if (this === BaseType.INTEGER) return 0;
    if (this === BaseType.DOUBLE) return 0.0;
    if (this === BaseType.BOOLEAN) return false;
    if (this === BaseType.CHAR) return '\0';
    return null;
  }
}

export class AuxiliarType extends JType {
  public static readonly VOID: AuxiliarType = new AuxiliarType('void');
  public static readonly NULL: AuxiliarType = new AuxiliarType('null');

  private constructor(name: string) {
    super(name);
  }
}

export class ErrorType extends JType {
  public constructor(private message: string, private nodeInfo: NodeInfo) {
    super('error');
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

export class TypeFactory {
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
}
