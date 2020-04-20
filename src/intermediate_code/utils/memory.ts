export default class Memory {
  private stack: Array<number>;
  private heap: Array<number>;

  private constructor() {
    this.stack = new Array();
    this.heap = new Array();
  }

  public setValueStack(position: number, value: number): boolean {
    this.stack[position] = value;
    return true;
  }

  public setValueHeap(position: number, value: number): boolean {
    this.heap[position] = value;
    return true;
  }

  public getValueStack(position: number): number | undefined {
    return this.stack[position];
  }

  public getValueHeap(position: number): number | undefined {
    return this.heap[position];
  }

  public getStack(): Array<number> {
    return this.stack;
  }

  public getHeap(): Array<number> {
    return this.heap;
  }
}
