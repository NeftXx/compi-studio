export default class ConsoleC3D {
  private strings: Array<string>;

  public constructor() {
    this.strings = new Array();
  }

  public append(value: string) {
    this.strings.push(value);
  }

  public toString(): string {
    return this.strings.join("");
  }
}
