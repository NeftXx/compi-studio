export class ErrorC3D extends Error {
  constructor(public line: number, public column: number, message?: string) {
    super(`Semantic error in line ${line} and column ${column}, ${message}`);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = ErrorC3D.name;
  }
}
