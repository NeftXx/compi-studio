import { JType } from './type';

export class Variable {
  public constructor(
    public name: string,
    public type: JType,
    public address: number
  ) {}
}
