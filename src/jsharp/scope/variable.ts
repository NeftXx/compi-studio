import { JType } from "./type";

export class Variable {
  public constructor(
    public identifier: string,
    public type: JType,
    public address: number,
    public isConstant: boolean
  ) {}
}
