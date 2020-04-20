export class Console {
  private strings: Array<string>;

  public constructor() {
    this.strings = new Array();
  }

  public append(value: string) {
    this.strings.push(value);
  }

  public clear() {
    this.strings.length = 0;
  }

  public toString(): string {
    return this.strings.join("");
  }
}
