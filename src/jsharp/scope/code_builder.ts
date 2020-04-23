export default class CodeBuilder {
  private temporaryCounter: number;
  private labelCounter: number;
  private translateCode: Array<string>;

  public constructor() {
    this.temporaryCounter = 0;
    this.labelCounter = 0;
    this.translateCode = [];
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

  public getCodeTranslate(): string {
    return this.translateCode.join("");
  }
}
