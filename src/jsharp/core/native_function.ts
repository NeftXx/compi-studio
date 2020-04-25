import CodeBuilder from '@jsharp/scope/code_builder';

export default class NativePrintFunction {
  public static readonly _instance: NativePrintFunction = new NativePrintFunction();

  private constructor() {}

  public generete(codeBuilder: CodeBuilder) {
    this.printString(codeBuilder);
    this.printBoolean(codeBuilder);
  }

  private printString(codeBuilder: CodeBuilder): void {
    let t1 = codeBuilder.getNewTemporary();
    let t2 = codeBuilder.getNewTemporary();
    let t3 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel();
    let L2 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`
# Procedimiento para imprimir una cadena
proc native_print_string begin
  ${t1} = P + 0;
  ${t2} = Stack[${t1}];
${L2}:
  ${t3} = Heap[${t2}];
  if (${t3} == 0) goto ${L1};
  print("%c", ${t3});
  ${t2} = ${t2} + 1;
  goto ${L2};
${L1}:
end
`);
  }

  private printBoolean(codeBuilder: CodeBuilder): void {
    let t1 = codeBuilder.getNewTemporary();
    let t2 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel();
    let L2 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`
# Procedimiento para imprimir un booleano
proc native_print_boolean begin
  ${t1} = P + 0;
  ${t2} = Stack[${t1}];
  if (${t2} == 0) goto ${L1};
  print("%c", 116); # t
  print("%c", 114); # r
  print("%c", 117); # u
  print("%c", 101); # e
  goto ${L2};
${L1}:
  print("%c", 102); # f
  print("%c",  97); # a
  print("%c", 108); # l
  print("%c", 115); # s
  print("%c", 101); # e
${L2}:
end
`);
  }

  public static getInstance(): NativePrintFunction {
    return NativePrintFunction._instance;
  }
}
