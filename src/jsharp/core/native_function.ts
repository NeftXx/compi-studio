import CodeBuilder from "../scope/code_builder";

export default class NativePrintFunction {
  public static readonly _instance: NativePrintFunction = new NativePrintFunction();

  private constructor() {}

  public generete(codeBuilder: CodeBuilder) {
    this.printString(codeBuilder);
    this.printBoolean(codeBuilder);
    this.pow(codeBuilder);
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

  private pow(codeBuilder: CodeBuilder): void {
    let t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel(),
      L3 = codeBuilder.getNewLabel(),
      L4 = codeBuilder.getNewLabel(),
      L5 = codeBuilder.getNewLabel(),
      L6 = codeBuilder.getNewLabel(),
      L7 = codeBuilder.getNewLabel(),
      L8 = codeBuilder.getNewLabel(),
      L9 = codeBuilder.getNewLabel(),
      L10 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`
# Procedimiento para calcular una potencia
proc native_potencia begin
  ${t1} = P + 3;
  stack[${t1}] = 1; # potencia
  ${t1} = P + 2;
  ${t2} = stack[${t1}]; # exponente
  # exponente == 0
  if (${t2} == 0) goto ${L1};
  # exponente > 0
  if (${t2} > 0) goto ${L2};
  # exponente < 0
  goto ${L3};
  # For que calcula una potencia con un exponente positivo
  ${L2}:
    ${t1} = P + 4; # pos i
    stack[${t1}] = 0; # i = 0
    ${L4}: # retorno del for
      ${t1} = P + 2;
      ${t2} = stack[${t1}]; # exponente
      ${t1} = P + 4;
      ${t3} = stack[${t1}]; # i
      # exponente > i
      if (${t2} > ${t3}) goto ${L5};
      goto ${L1};
      ${L6}: # actualizacion i++
        ${t1} = P + 4;
        ${t2} = stack[${t1}]; # i
        ${t3} = ${t2} + 1;
        stack[${t1}] = ${t3}; # i = i + 1
        goto ${L4}; # regreso a la condicion
      ${L5}:
        ${t1} = P + 3;
        ${t2} = stack[${t1}]; # potencia
        ${t1} = P + 1;
        ${t3} = stack[${t1}]; # base
        ${t4} = ${t2} * ${t3};
        ${t1} = P + 3;
        stack[${t1}] = ${t4}; # potencia = potencia * base
        goto ${L6}; # salto a la actualizacion
  # For que calcula una potencia con un exponente negativo
  ${L3}:
    ${t1} = P + 4;
    stack[${t1}] = 0; # i = 0
    ${L7}: # retorno del for
      ${t1} = P + 2;
      ${t2} = stack[${t1}]; # exponente
      ${t1} = P + 4;
      ${t3} = stack[${t1}]; # i
      if (${t2} > ${t3}) goto ${L8}; # exponente > i
      goto ${L9};
      ${L10}: # actualizacion i++
        ${t1} = P + 4;
        ${t2} = stack[${t1}]; # i
        ${t3} = ${t2} + 1;
        stack[${t1}] = ${t3}; # i = i + 1
        goto ${L7}; # regreso a la condicion
      ${L8}:
        ${t1} = P + 3;
        ${t2} = stack[${t1}]; # potencia
        ${t1} = P + 1;
        ${t3} = stack[${t1}]; # base
        ${t4} = ${t2} * ${t3};
        ${t1} = P + 3;
        stack[${t1}] = ${t4}; # potencia = potencia * base
        goto ${L10}; # salto a la actualizacion
      ${L9}:
        ${t1} = P + 3;
        ${t2} = stack[${t1}]; # potencia
        ${t3} = 1 / ${t2};
        stack[${t1}] = ${t3}; # potencia = 1 / potencia
  # etiqueta de return
  ${L1}:
    ${t1} = P + 0;
    ${t2} = P + 3;
    ${t3} = stack[${t2}]; # potencia
    stack[${t1}] = ${t3}; # return potencia
end
`);
  }

  public static getInstance(): NativePrintFunction {
    return NativePrintFunction._instance;
  }
}
