import CodeBuilder from '@jsharp/scope/code_builder';

export default class NativeStringFunctions {
  public static readonly _instance: NativeStringFunctions = new NativeStringFunctions();

  private constructor() {}

  public generete(codeBuilder: CodeBuilder) {
    this.concatStringString(codeBuilder);
  }

  private concatStringString(codeBuilder: CodeBuilder) {
    codeBuilder.setTranslatedCode('');
  }

  public static getInstance(): NativeStringFunctions {
    return NativeStringFunctions._instance;
  }
}
