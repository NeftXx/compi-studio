import CodeTranslator from "../scope/code_builder";

export default class NativePrintFunction {
  public static readonly _instance: NativePrintFunction = new NativePrintFunction();

  private constructor() {}

  public generete(codeBuilder: CodeTranslator) {
    this.printString(codeBuilder);
    this.printBoolean(codeBuilder);
    this.pow(codeBuilder);
    this.printGlobalVariableError(codeBuilder);
    this.printGlobalGetVariableError(codeBuilder);
    this.printErrorDeclStruct(codeBuilder);
    this.printErrorGetStruct(codeBuilder);
  }

  private printString(codeBuilder: CodeTranslator): void {
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

  private printBoolean(codeBuilder: CodeTranslator): void {
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

  private pow(codeBuilder: CodeTranslator): void {
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

  private printGlobalVariableError(codeBuilder: CodeTranslator) {
    let t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary(),
      t5 = codeBuilder.getNewTemporary(),
      t6 = codeBuilder.getNewTemporary(),
      t7 = codeBuilder.getNewTemporary(),
      t8 = codeBuilder.getNewTemporary(),
      t9 = codeBuilder.getNewTemporary(),
      t10 = codeBuilder.getNewTemporary(),
      t11 = codeBuilder.getNewTemporary(),
      t12 = codeBuilder.getNewTemporary();
    codeBuilder.setTranslatedCode(`
proc native_print_global_variable_error begin
  print("%c",  69);
  print("%c", 114);
  print("%c", 114);
  print("%c", 111);
  print("%c", 114);
  print("%c",  32);
  print("%c", 101);
  print("%c", 110);
  print("%c",  32);
  print("%c", 101);
  print("%c", 108);
  print("%c",  32);
  print("%c",  97);
  print("%c", 114);
  print("%c",  99);
  print("%c", 104);
  print("%c", 105);
  print("%c", 118);
  print("%c", 111);
  print("%c",  32);
  ${t1} = P + 0;
  ${t2} = Stack[${t1}];
  ${t3} = P + 1;
  ${t4} = ${t3} + 0;
  Stack[${t4}] = ${t2};
  P = P + 1;
  call native_print_string;
  P = P - 1;
  print("%c",  44);
  print("%c",  32);
  print("%c", 108);
  print("%c", 105);
  print("%c", 110);
  print("%c", 101);
  print("%c",  97);
  print("%c",  32);
  ${t5} = P + 1;
  ${t6} = Stack[${t5}];
  print("%i", ${t6});
  print("%c",  32);
  print("%c", 121);
  print("%c",  32);
  print("%c",  99);
  print("%c", 111);
  print("%c", 108);
  print("%c", 117);
  print("%c", 109);
  print("%c", 110);
  print("%c",  97);
  print("%c",  32);
  ${t7} = P + 2;
  ${t8} = Stack[${t7}];
  print("%i", ${t8});
  print("%c",  46);
  print("%c",  32);
  print("%c",  76);
  print("%c",  97);
  print("%c",  32);
  print("%c", 118);
  print("%c",  97);
  print("%c", 114);
  print("%c", 105);
  print("%c",  97);
  print("%c",  98);
  print("%c", 108);
  print("%c", 101);
  print("%c",  32);
  print("%c", 103);
  print("%c", 108);
  print("%c", 111);
  print("%c",  98);
  print("%c",  97);
  print("%c", 108);
  print("%c",  32);
  print("%c",  91);
  ${t9} = P + 3;
  ${t10} = Stack[${t9}];
  ${t11} = P + 1;
  ${t12} = ${t11} + 0;
  Stack[${t12}] = ${t10};
  P = P + 1;
  call native_print_string;
  P = P - 1;
  print("%c",  93);
  print("%c",  32);
  print("%c", 121);
  print("%c",  97);
  print("%c",  32);
  print("%c", 104);
  print("%c",  97);
  print("%c",  32);
  print("%c", 115);
  print("%c", 105);
  print("%c", 100);
  print("%c", 111);
  print("%c",  32);
  print("%c", 100);
  print("%c", 101);
  print("%c",  99);
  print("%c", 108);
  print("%c",  97);
  print("%c", 114);
  print("%c",  97);
  print("%c", 100);
  print("%c",  97);
  print("%c",  46); 
  print("%c",  10); 
end
`);
  }

  private printGlobalGetVariableError(codeBuilder: CodeTranslator) {
    let t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary(),
      t5 = codeBuilder.getNewTemporary(),
      t6 = codeBuilder.getNewTemporary(),
      t7 = codeBuilder.getNewTemporary(),
      t8 = codeBuilder.getNewTemporary(),
      t9 = codeBuilder.getNewTemporary(),
      t10 = codeBuilder.getNewTemporary(),
      t11 = codeBuilder.getNewTemporary(),
      t12 = codeBuilder.getNewTemporary();
    codeBuilder.setTranslatedCode(`
proc native_print_get_global_variable_error begin
  print("%c",  69);
  print("%c", 114);
  print("%c", 114);
  print("%c", 111);
  print("%c", 114);
  print("%c",  32);
  print("%c", 101);
  print("%c", 110);
  print("%c",  32);
  print("%c", 101);
  print("%c", 108);
  print("%c",  32);
  print("%c",  97);
  print("%c", 114);
  print("%c",  99);
  print("%c", 104);
  print("%c", 105);
  print("%c", 118);
  print("%c", 111);
  print("%c",  32);
  ${t1} = P + 0;
  ${t2} = Stack[${t1}];
  ${t3} = P + 1;
  ${t4} = ${t3} + 0;
  Stack[${t4}] = ${t2};
  P = P + 1;
  call native_print_string;
  P = P - 1;
  print("%c",  44);
  print("%c",  32);
  print("%c", 108);
  print("%c", 105);
  print("%c", 110);
  print("%c", 101);
  print("%c",  97);
  print("%c",  32);
  ${t5} = P + 1;
  ${t6} = Stack[${t5}];
  print("%i", ${t6});
  print("%c",  32);
  print("%c", 121);
  print("%c",  32);
  print("%c",  99);
  print("%c", 111);
  print("%c", 108);
  print("%c", 117);
  print("%c", 109);
  print("%c", 110);
  print("%c",  97);
  print("%c",  32);
  ${t7} = P + 2;
  ${t8} = Stack[${t7}];
  print("%i", ${t8});
  print("%c",  46);
  print("%c",  32);
  print("%c",  76);
  print("%c",  97);
  print("%c",  32);
  print("%c", 118);
  print("%c",  97);
  print("%c", 114);
  print("%c", 105);
  print("%c",  97);
  print("%c",  98);
  print("%c", 108);
  print("%c", 101);
  print("%c",  32);
  print("%c", 103);
  print("%c", 108);
  print("%c", 111);
  print("%c",  98);
  print("%c",  97);
  print("%c", 108);
  print("%c",  32);
  print("%c",  91);
  ${t9} = P + 3;
  ${t10} = Stack[${t9}];
  ${t11} = P + 1;
  ${t12} = ${t11} + 0;
  Stack[${t12}] = ${t10};
  P = P + 1;
  call native_print_string;
  P = P - 1;
  print("%c",  93);
  print("%c",  32);
  print("%c", 110);
  print("%c", 111);
  print("%c",  32);
  print("%c", 104);
  print("%c",  97);
  print("%c",  32);
  print("%c", 115);
  print("%c", 105);
  print("%c", 100);
  print("%c", 111);
  print("%c",  32);
  print("%c", 100);
  print("%c", 101);
  print("%c",  99);
  print("%c", 108);
  print("%c",  97);
  print("%c", 114);
  print("%c",  97);
  print("%c", 100);
  print("%c",  97);
  print("%c",  32);
  print("%c",  97);
  print("%c", 117);
  print("%c", 110);
  print("%c",  46);
  print("%c",  10);
end
`);
  }

  private printErrorDeclStruct(codeBuilder: CodeTranslator) {
    let t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary(),
      t5 = codeBuilder.getNewTemporary(),
      t6 = codeBuilder.getNewTemporary(),
      t7 = codeBuilder.getNewTemporary(),
      t8 = codeBuilder.getNewTemporary(),
      t9 = codeBuilder.getNewTemporary(),
      t10 = codeBuilder.getNewTemporary(),
      t11 = codeBuilder.getNewTemporary(),
      t12 = codeBuilder.getNewTemporary();
    codeBuilder.setTranslatedCode(`
proc native_print_error_decl_struct begin
  print("%c",  69); # E
  print("%c", 114); # r
  print("%c", 114); # r
  print("%c", 111); # o
  print("%c", 114); # r
  print("%c",  32); #
  print("%c", 101); # e
  print("%c", 110); # n
  print("%c",  32); #
  print("%c", 101); # e
  print("%c", 108); # l
  print("%c",  32); #
  print("%c",  97); # a
  print("%c", 114); # r
  print("%c",  99); # c
  print("%c", 104); # h
  print("%c", 105); # i
  print("%c", 118); # v
  print("%c", 111); # o
  print("%c",  32); #
  ${t1} = P + 0;
  ${t2} = Stack[${t1}];
  ${t3} = P + 1;
  ${t4} = ${t3} + 0;
  Stack[${t4}] = ${t2};
  P = P + 1;
  call native_print_string;
  P = P - 1;
  print("%c",  44); # ,
  print("%c",  32); # 
  print("%c", 108); # l
  print("%c", 105); # i
  print("%c", 110); # n
  print("%c", 101); # e
  print("%c",  97); # a
  print("%c",  32); # 
  ${t5} = P + 1;
  ${t6} = Stack[${t5}];
  print("%i", ${t6});
  print("%c",  32); #
  print("%c", 121); # y
  print("%c",  32); #
  print("%c",  99); # c
  print("%c", 111); # o
  print("%c", 108); # l
  print("%c", 117); # u
  print("%c", 109); # m
  print("%c", 110); # n
  print("%c",  97); # a
  print("%c",  32); #
  ${t7} = P + 2;
  ${t8} = Stack[${t7}];
  print("%i", ${t8});
  print("%c",  46); # .
  print("%c",  32); #
  print("%c",  76); # L
  print("%c",  97); # a
  print("%c",  32); #
  print("%c", 101); # e
  print("%c", 115); # s
  print("%c", 116); # t
  print("%c", 114); # r
  print("%c", 117); # u
  print("%c",  99); # c
  print("%c", 116); # t
  print("%c", 117); # u
  print("%c", 114); # r
  print("%c",  97); # a
  print("%c",  32); #
  ${t9} = P + 3;
  ${t10} = Stack[${t9}];
  ${t11} = P + 1;
  ${t12} = ${t11} + 0;
  Stack[${t12}] = ${t10};
  P = P + 1;
  call native_print_string;
  P = P - 1;
  print("%c",  32); #
  print("%c", 121); # y
  print("%c",  97); # a
  print("%c",  32); #
  print("%c", 102); # f
  print("%c", 117); # u
  print("%c", 101); # e
  print("%c",  32); #
  print("%c", 100); # d
  print("%c", 101); # e
  print("%c",  99); # c
  print("%c", 108); # l
  print("%c",  97); # a
  print("%c", 114); # r
  print("%c",  97); # a
  print("%c", 100); # d
  print("%c",  97); # a
  print("%c",  46); # .
  print("%c",  10); # 
end
`);
  }

  private printErrorGetStruct(codeBuilder: CodeTranslator) {
    let t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary(),
      t5 = codeBuilder.getNewTemporary(),
      t6 = codeBuilder.getNewTemporary(),
      t7 = codeBuilder.getNewTemporary(),
      t8 = codeBuilder.getNewTemporary(),
      t9 = codeBuilder.getNewTemporary(),
      t10 = codeBuilder.getNewTemporary(),
      t11 = codeBuilder.getNewTemporary(),
      t12 = codeBuilder.getNewTemporary();
    codeBuilder.setTranslatedCode(`
proc native_print_error_get_struct begin
  print("%c",  69); # E
  print("%c", 114); # r
  print("%c", 114); # r
  print("%c", 111); # o
  print("%c", 114); # r
  print("%c",  32); # 
  print("%c", 101); # e
  print("%c", 110); # n
  print("%c",  32); # 
  print("%c", 101); # e
  print("%c", 108); # l
  print("%c",  32); # 
  print("%c",  97); # a
  print("%c", 114); # r
  print("%c",  99); # c
  print("%c", 104); # h
  print("%c", 105); # i
  print("%c", 118); # v
  print("%c", 111); # o
  print("%c",  32); # 
  ${t1} = P + 0;
  ${t2} = Stack[${t1}];
  ${t3} = P + 1;
  ${t4} = ${t3} + 0;
  Stack[${t4}] = ${t2};
  P = P + 1;
  call native_print_string;
  P = P - 1;
  print("%c",  44); # ,
  print("%c",  32); # 
  print("%c", 108); # l
  print("%c", 105); # i
  print("%c", 110); # n
  print("%c", 101); # e
  print("%c",  97); # a
  print("%c",  32); # 
  ${t5} = P + 1;
  ${t6} = Stack[${t5}];
  print("%i", ${t6});
  print("%c",  32); # 
  print("%c", 121); # y
  print("%c",  32); # 
  print("%c",  99); # c
  print("%c", 111); # o
  print("%c", 108); # l
  print("%c", 117); # u
  print("%c", 109); # m
  print("%c", 110); # n
  print("%c",  97); # a
  print("%c",  32); # 
  ${t7} = P + 2;
  ${t8} = Stack[${t7}];
  print("%i", ${t8});
  print("%c",  46); # .
  print("%c",  32); #
  print("%c",  76); # L
  print("%c",  97); # a
  print("%c",  32); #
  print("%c", 101); # e
  print("%c", 115); # s
  print("%c", 116); # t
  print("%c", 114); # r
  print("%c", 117); # u
  print("%c",  99); # c
  print("%c", 116); # t
  print("%c", 117); # u
  print("%c", 114); # r
  print("%c",  97); # a
  print("%c",  32); #
  ${t9} = P + 3;
  ${t10} = Stack[${t9}];
  ${t11} = P + 1;
  ${t12} = ${t11} + 0;
  Stack[${t12}] = ${t10};
  P = P + 1;
  call native_print_string;
  P = P - 1;
  print("%c",  32); # 
  print("%c", 110); # n
  print("%c", 111); # o
  print("%c",  32); # 
  print("%c", 104); # h
  print("%c",  97); # a
  print("%c",  32); # 
  print("%c", 115); # s
  print("%c", 105); # i
  print("%c", 100); # d
  print("%c", 111); # o
  print("%c",  32); # 
  print("%c", 100); # d
  print("%c", 101); # e
  print("%c",  99); # c
  print("%c", 108); # l
  print("%c",  97); # a
  print("%c", 114); # r
  print("%c",  97); # a
  print("%c", 100); # d
  print("%c", 111); # o
  print("%c",  32); # 
  print("%c",  97); # a
  print("%c", 117); # u
  print("%c", 110); # n
  print("%c",  46); # .
  print("%c",  10); #   
end
`);
  }

  public static getInstance(): NativePrintFunction {
    return NativePrintFunction._instance;
  }
}
