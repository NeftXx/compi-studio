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
    this.translateCode.push(`${this.labelJumpMethods}:\n`);
  }

  public getNewTemporary(): string {
    this.temporaryCounter++;
    return `t${this.temporaryCounter}`;
  }

  public getNewLabel(): string {
    this.labelCounter++;
    return `L${this.labelCounter}`;
  }

  public getLastTemporary(): string {
    return `t${this.temporaryCounter}`;
  }

  public getLastLabel(): string {
    return `L${this.labelCounter}`;
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
