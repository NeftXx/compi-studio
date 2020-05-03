import { JType } from "./type";

export class Variable {
  public constructor(
    public identifier: string,
    public type: JType,
    public ptr: number,
    public isConstant: boolean
  ) {}
}
