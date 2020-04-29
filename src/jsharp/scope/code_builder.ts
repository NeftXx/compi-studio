import NativePrintFunction from "../core/native_function";
import NativeStringFunctions from "../core/native_string_functions";

export default class CodeBuilder {
  private temporaryCounter: number;
  private labelCounter: number;
  private translateCode: Array<string>;
  private unusedTemporary: Array<string>;
  private nativeFunction: NativePrintFunction;
  private nativeStringFunctions: NativeStringFunctions;
  private labelJumpMethods: string;
  private lastAddress: string;
  private trueLabels: Array<string>;
  private falseLabels: Array<string>;

  public constructor() {
    this.temporaryCounter = 0;
    this.labelCounter = 0;
    this.translateCode = [];
    this.unusedTemporary = [];
    this.nativeFunction = NativePrintFunction.getInstance();
    this.nativeStringFunctions = NativeStringFunctions.getInstance();
    this.labelJumpMethods = this.getNewLabel();
    this.nativeFunction.generete(this);
    this.nativeStringFunctions.generete(this);
    this.translateCode.push(
      `${this.labelJumpMethods}:\n# Seccion de codigo de usuario\n`
    );
    this.lastAddress = "";
    this.trueLabels = [];
    this.falseLabels = [];
  }

  public getNewTemporary(): string {
    this.temporaryCounter++;
    return `t${this.temporaryCounter}`;
  }

  public getNewLabel(): string {
    this.labelCounter++;
    return `L${this.labelCounter}`;
  }

  public setLastAddress(address: string): void {
    this.lastAddress = address;
  }

  public getLastAddress(): string {
    return this.lastAddress;
  }

  public addTrueLabel(label: string) {
    this.trueLabels.push(label);
  }

  public addFalseLabel(label: string) {
    this.falseLabels.push(label);
  }

  public getTrueLabel(): string {
    return this.trueLabels.pop();
  }

  public getFalseLabel(): string {
    return this.falseLabels.pop();
  }

  public printTrueLabels(): void {
    if (this.trueLabels.length > 0) {
      let length = this.trueLabels.length;
      for (let i = 0; i < length; i++) {
        this.translateCode.push(`${this.trueLabels.pop()}: `);
      }
      this.translateCode.push("\n");
    }
  }

  public printFalseLabels(): void {
    if (this.falseLabels.length > 0) {
      let length = this.falseLabels.length;
      for (let i = 0; i < length; i++) {
        this.translateCode.push(`${this.falseLabels.pop()}: `);
      }
      this.translateCode.push("\n");
    }
  }

  public setTranslatedCode(translatedCode: string): void {
    this.translateCode.push(translatedCode);
  }

  public addUnusedTemporary(temporary: string): void {
    if (this.unusedTemporary.indexOf(temporary) === -1)
      this.unusedTemporary.push(temporary);
  }

  public removeUnusedTemporary(temporary: string): void {
    let index = this.unusedTemporary.indexOf(temporary);
    if (index > -1) this.unusedTemporary.splice(index, 1);
  }

  public getCodeTranslate(): string {
    return this.createHeader() + this.translateCode.join("");
  }

  private createHeader(): string {
    var header = ["# Sección de variables temporales\nvar "];
    for (let i = 1; i <= this.temporaryCounter; i++) {
      header.push(`t${i}`);
      if (i !== this.temporaryCounter) {
        if (i % 20 === 0) header.push(",\n");
        else header.push(", ");
      }
    }
    header.push(";");
    header.push(`

var P, H, E; # Sección de apuntadores
var Heap[];  # Sección de Heap
var Stack[]; # Sección de Stack

goto ${this.labelJumpMethods}; # Ignorar procedimientos
`);
    return header.join("");
  }
}
