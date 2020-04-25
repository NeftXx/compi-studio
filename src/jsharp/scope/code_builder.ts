export default class CodeBuilder {
  private temporaryCounter: number;
  private labelCounter: number;
  private translateCode: Array<string>;
  private unusedTemporary: Array<string>;

  public constructor() {
    this.temporaryCounter = 0;
    this.labelCounter = 0;
    this.translateCode = [];
    this.unusedTemporary = [];
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
    return this.translateCode.join('');
  }
}
