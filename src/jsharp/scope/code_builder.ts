import NativePrintFunction from "../core/native_function";
import NativeStringFunctions from "../core/native_string_functions";
import { MethodScope } from "./scope";

export default class CodeTranslator {
  public ptrHeap: number;
  private temporaryCounter: number;
  private labelCounter: number;
  private translateCode: Array<string>;
  private unusedTemporary: Array<string>;
  private nativeFunction: NativePrintFunction;
  private nativeStringFunctions: NativeStringFunctions;
  public readonly labelJumpMethods: string;
  private mainFunction: MethodScope | undefined;
  private lastAddress: string;
  private trueLabels: Array<string>;
  private falseLabels: Array<string>;
  private returnLabels: Array<string>;
  private globalVariables: Array<string>;

  public constructor() {
    this.temporaryCounter = 0;
    this.labelCounter = 0;
    this.translateCode = [];
    this.unusedTemporary = [];
    this.returnLabels = [];
    this.nativeFunction = NativePrintFunction.getInstance();
    this.nativeStringFunctions = NativeStringFunctions.getInstance();
    this.labelJumpMethods = this.getNewLabel();
    this.lastAddress = "";
    this.trueLabels = [];
    this.falseLabels = [];
    this.mainFunction = undefined;
    this.ptrHeap = 0;
    this.globalVariables = [];
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

  public addReturnLabel(label: string) {
    this.returnLabels.push(label);
  }

  public getTrueLabel(): string {
    return this.trueLabels.pop();
  }

  public getFalseLabel(): string {
    return this.falseLabels.pop();
  }

  public getUnusedTemporary() {
    return this.unusedTemporary;
  }

  public swapLabels() {
    let trueLabels = this.falseLabels;
    let falseLabels = this.trueLabels;
    this.falseLabels = falseLabels;
    this.trueLabels = trueLabels;
  }

  public addTrueLabels(labels: Array<string>): void {
    let length = labels.length;
    for (let i = 0; i < length; i++) {
      this.trueLabels.push(labels.pop());
    }
  }

  public addFalseLabels(labels: Array<string>): void {
    let length = labels.length;
    for (let i = 0; i < length; i++) {
      this.falseLabels.push(labels.pop());
    }
  }

  public printTrueLabels(): void {
    let length = this.trueLabels.length;
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        this.translateCode.push(`${this.trueLabels.pop()}: `);
      }
      this.translateCode.push("\n");
    }
  }

  public printFalseLabels(): void {
    let length = this.falseLabels.length;
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        this.translateCode.push(`${this.falseLabels.pop()}: `);
      }
      this.translateCode.push("\n");
    }
  }

  public printReturnLabels(): void {
    let length = this.returnLabels.length;
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        this.translateCode.push(`${this.returnLabels.pop()}: `);
      }
      this.translateCode.push("\n");
    }
  }

  public tempFalseLabels(): Array<string> {
    let falseLabels: Array<string> = [];
    let length = this.falseLabels.length;
    for (let i = 0; i < length; i++) {
      falseLabels.push(this.falseLabels.pop());
    }
    return falseLabels;
  }

  public tempTrueLabels(): Array<string> {
    let trueLabels: Array<string> = [];
    let length = this.trueLabels.length;
    for (let i = 0; i < length; i++) {
      trueLabels.push(this.trueLabels.pop());
    }
    return trueLabels;
  }

  public setMainFunction(method: MethodScope): void {
    if (!this.mainFunction) {
      this.mainFunction = method;
    }
  }

  public setTranslatedCode(translatedCode: string): void {
    this.translateCode.push(translatedCode);
  }

  public setGlobalVariables(translatedCode: string) {
    this.globalVariables.push(translatedCode);
  }

  public addUnusedTemporary(temporary: string): void {
    if (this.unusedTemporary.indexOf(temporary) === -1)
      this.unusedTemporary.push(temporary);
  }

  public removeUnusedTemporary(temporary: string): void {
    let index = this.unusedTemporary.indexOf(temporary);
    if (index > -1) this.unusedTemporary.splice(index, 1);
  }

  public clearUnusedTemporary() {
    this.unusedTemporary.length = 0;
  }

  public getCodeTranslate(): string {
    this.nativeFunction.generete(this);
    this.nativeStringFunctions.generete(this);
    if (this.mainFunction) {
      let t1 = this.getNewTemporary(),
        t2 = this.getNewTemporary();
      return (
        this.createHeader() +
        this.translateCode.join("") +
        `
${this.labelJumpMethods}:
# Inicio de ejecucion del programa
${t1} = P + 0; # Cambio simulado de ambito
${t2} = ${t1} + 0;
Stack[${t2}] = 0;
P = P + 0;
call ${this.mainFunction.getName()};
P = P - 0;
`
      );
    }
    return (
      this.createHeader() +
      this.translateCode.join("") +
      `${this.labelJumpMethods}:`
    );
  }

  private createHeader(): string {
    var header = ["# Sección de variables temporales\nvar "];
    for (let i = 1; i <= this.temporaryCounter; i++) {
      header.push(`t${i}`);
      if (i !== this.temporaryCounter) {
        if (i % 24 === 0) header.push(",\n");
        else header.push(", ");
      }
    }
    header.push(";");
    header.push(`

var P, H, E; # Sección de apuntadores
var Heap[];  # Sección de Heap
var Stack[]; # Sección de Stack

${this.globalVariables.join("")}
H = ${this.ptrHeap};

`);
    return header.join("");
  }
}
