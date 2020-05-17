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
    this.linealize(codeBuilder);
  }

  private linealize(codeBuilder: CodeTranslator) {
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
      t12 = codeBuilder.getNewTemporary(),
      t13 = codeBuilder.getNewTemporary(),
      t14 = codeBuilder.getNewTemporary(),
      t15 = codeBuilder.getNewTemporary(),
      t16 = codeBuilder.getNewTemporary(),
      t17 = codeBuilder.getNewTemporary(),
      t18 = codeBuilder.getNewTemporary(),
      t19 = codeBuilder.getNewTemporary(),
      t20 = codeBuilder.getNewTemporary(),
      t21 = codeBuilder.getNewTemporary(),
      t22 = codeBuilder.getNewTemporary(),
      t23 = codeBuilder.getNewTemporary(),
      t24 = codeBuilder.getNewTemporary(),
      t25 = codeBuilder.getNewTemporary(),
      t26 = codeBuilder.getNewTemporary(),
      t27 = codeBuilder.getNewTemporary(),
      t28 = codeBuilder.getNewTemporary(),
      t29 = codeBuilder.getNewTemporary(),
      t30 = codeBuilder.getNewTemporary(),
      t31 = codeBuilder.getNewTemporary(),
      t32 = codeBuilder.getNewTemporary(),
      t33 = codeBuilder.getNewTemporary(),
      t34 = codeBuilder.getNewTemporary(),
      t35 = codeBuilder.getNewTemporary();
    let L2 = codeBuilder.getNewLabel(),
      L3 = codeBuilder.getNewLabel(),
      L4 = codeBuilder.getNewLabel(),
      L5 = codeBuilder.getNewLabel(),
      L6 = codeBuilder.getNewLabel(),
      L7 = codeBuilder.getNewLabel(),
      L8 = codeBuilder.getNewLabel(),
      L9 = codeBuilder.getNewLabel(),
      L10 = codeBuilder.getNewLabel(),
      L11 = codeBuilder.getNewLabel(),
      L12 = codeBuilder.getNewLabel(),
      L13 = codeBuilder.getNewLabel(),
      L14 = codeBuilder.getNewLabel(),
      L15 = codeBuilder.getNewLabel(),
      L16 = codeBuilder.getNewLabel(),
      L17 = codeBuilder.getNewLabel(),
      L18 = codeBuilder.getNewLabel(),
      L19 = codeBuilder.getNewLabel(),
      L20 = codeBuilder.getNewLabel(),
      L21 = codeBuilder.getNewLabel(),
      L22 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`
# Inicio de procedimiento
proc native_copiar_arreglo  begin
# Obteniendo variable arreglo
${t1} = P + 1; # Direccion de la variable arreglo
${t2} = Stack[${t1}]; # Guardando valor de la variable arreglo en temporal
# Accediendo a arreglo
if (${t2} == -1) goto ${L2};
${t3} = Heap[${t2}];
goto ${L3};
${L2}:
E = 4;
${t3} = 0;
${L3}:
${t4} = P + 2; # Direccion de variable  len
Stack[${t4}] = ${t3}; # Asignacion de valor a variable len
# Obteniendo variable len
${t8} = P + 2; # Direccion de la variable len
${t9} = Stack[${t8}]; # Guardando valor de la variable len en temporal
${t5} = -1;
${t6} = ${t9};
if (${t6} > -1) goto ${L4};
E = 3;
goto ${L5};
${L4}:
${t5} = H;
Heap[H] = ${t6};
H = H + 1;
${t7} = 0;
${L6}:
if (${t7} > ${t6}) goto ${L7};
Heap[H] = 0;
H = H + 1;
${t7} = ${t7} + 1;
goto ${L6};
${L7}:
${L5}:
${t10} = P + 3; # Direccion de variable  copia
Stack[${t10}] = ${t5}; # Asignacion de valor a variable copia
${t11} = P + 4; # Direccion de variable  i
Stack[${t11}] = 0; # Asignacion de valor a variable i
${L8}:
# Obteniendo variable i
${t12} = P + 4; # Direccion de la variable i
${t13} = Stack[${t12}]; # Guardando valor de la variable i en temporal
# Obteniendo variable len
${t14} = P + 2; # Direccion de la variable len
${t15} = Stack[${t14}]; # Guardando valor de la variable len en temporal
if (${t13} < ${t15}) goto ${L9};
goto ${L10};
${L9}: 
${t16} = P + 3;
${t17} = Stack[${t16}];
${t18} = Heap[${t17}];
# Obteniendo variable i
${t21} = P + 4; # Direccion de la variable i
${t22} = Stack[${t21}]; # Guardando valor de la variable i en temporal
if (${t22} > -1) goto ${L12};
goto ${L13};
${L12}:
if (${t22} < ${t18}) goto ${L14};
goto ${L15};
${L14}:
${t19} = ${t22} + 1;
${t20} = ${t17} + ${t19};
goto ${L16};
${L15}:
${L13}:
E = 2;
${L16}:
# Obteniendo variable arreglo
${t23} = P + 1; # Direccion de la variable arreglo
${t24} = Stack[${t23}]; # Guardando valor de la variable arreglo en temporal
${t25} = Heap[${t24}]; # Obteniendo direccion del arreglo
# Obteniendo variable i
${t29} = P + 4; # Direccion de la variable i
${t30} = Stack[${t29}]; # Guardando valor de la variable i en temporal
# Verificando que la posicion este dentro de los limites del arreglo
if (${t30} > -1) goto ${L17};
goto ${L18};
${L17}:
if (${t30} < ${t25}) goto ${L19};
goto ${L20};
${L19}:
${t26} = ${t30} + 1;
${t27} = ${t24} + ${t26};
${t28} = Heap[${t27}];
goto ${L21};
${L20}:
${L18}:
E = 2;
${L21}:
Heap[${t20}] = ${t28};
${t31} = P + 4;
${t32} = Stack[${t31}];
${t33} = ${t32} + 1;
Stack[${t31}] = ${t33};
goto ${L8};
${L11}:
${L10}: 
# Obteniendo variable copia
${t34} = P + 3; # Direccion de la variable copia
${t35} = Stack[${t34}]; # Guardando valor de la variable copia en temporal
Stack[P] = ${t35};
goto ${L22};
${L22}:
end
`);
  }

  private printString(codeBuilder: CodeTranslator): void {
    let t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel(),
      L3 = codeBuilder.getNewLabel(),
      L4 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`
# Procedimiento para imprimir una cadena
proc native_print_string begin
  ${t1} = P + 0; # Posicion de parametro
  ${t2} = Stack[${t1}]; # Obteniendo direccion de la cadena
  if (${t2} == -1) goto ${L1};
  goto ${L2};
${L1}:
  print("%c", 110); print("%c", 117); print("%c", 108); print("%c", 108);
  goto ${L3};
${L2}:
  ${t3} = ${t2} + 1;
${L4}:
  ${t4} = Heap[${t3}]; # Obteniendo letra por letra
  if (${t4} == 0) goto ${L3}; # Mientras no sea nulo
  print("%c", ${t4}); # Imprimir letra
  ${t3} = ${t3} + 1; # Aumentado el contador
  goto ${L4}; # Regresear a evaluar
# Salir
${L3}: 
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
  ${t1} = P + 0; # Obteniendo direccion del parametro
  ${t2} = Stack[${t1}]; # Valor del parametro
  if (${t2} == 0) goto ${L1}; # Si es falso
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
      t8 = codeBuilder.getNewTemporary();
    codeBuilder.setTranslatedCode(`
proc native_print_global_variable_error begin
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
  ${t1} = P + 0; # Acceso a parametro
  ${t2} = Stack[${t1}]; # Obteniendo la direccion del nombre del archivo
  P = P + 4; # Cambio de ambito
  Stack[P] = ${t2}; # Enviando parametro
  call native_print_string;
  P = P - 4; # Regresando a ambito actual
  print("%c",  44); # ,
  print("%c",  32); #
  print("%c", 108); # l
  print("%c", 105); # i
  print("%c", 110); # n
  print("%c", 101); # e
  print("%c",  97); # a
  print("%c",  32); #
  ${t3} = P + 1;
  ${t4} = Stack[${t3}];
  print("%i", ${t4});
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
  ${t5} = P + 2;
  ${t6} = Stack[${t5}];
  print("%i", ${t6});
  print("%c",  46); # .
  print("%c",  32); # 
  print("%c",  76); # L
  print("%c",  97); # a
  print("%c",  32); # 
  print("%c", 118); # v
  print("%c",  97); # a
  print("%c", 114); # r
  print("%c", 105); # i
  print("%c",  97); # a
  print("%c",  98); # b
  print("%c", 108); # l
  print("%c", 101); # e
  print("%c",  32); # 
  print("%c", 103); # g
  print("%c", 108); # l
  print("%c", 111); # o
  print("%c",  98); # b
  print("%c",  97); # a
  print("%c", 108); # l
  print("%c",  32); # 
  print("%c",  91); # [
  ${t7} = P + 3; # Posicion del nombre de la variable
  ${t8} = Stack[${t7}]; # Obtiniendo nombre
  P = P + 4; # Cambio de ambito
  Stack[P] = ${t8}; # Enviando la cadena
  call native_print_string;
  P = P - 4; # Regresando a ambito actual
  print("%c",  93); # ]
  print("%c",  32); #
  print("%c", 121); # n
  print("%c",  97); # o
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
  print("%c",  97); # o
  print("%c",  46); # .
  print("%c",  10); #
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
  ${t3} = P + 4;
  ${t4} = ${t3} + 0;
  Stack[${t4}] = ${t2};
  P = P + 4;
  call native_print_string;
  P = P - 4;
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
  ${t11} = P + 4;
  ${t12} = ${t11} + 0;
  Stack[${t12}] = ${t10};
  P = P + 4;
  call native_print_string;
  P = P - 4;
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
  ${t3} = P + 4;
  ${t4} = ${t3} + 0;
  Stack[${t4}] = ${t2};
  P = P + 4;
  call native_print_string;
  P = P - 4;
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
  ${t11} = P + 4;
  ${t12} = ${t11} + 0;
  Stack[${t12}] = ${t10};
  P = P + 4;
  call native_print_string;
  P = P - 4;
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
  ${t3} = P + 4;
  ${t4} = ${t3} + 0;
  Stack[${t4}] = ${t2};
  P = P + 4;
  call native_print_string;
  P = P - 4;
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
  ${t11} = P + 4;
  ${t12} = ${t11} + 0;
  Stack[${t12}] = ${t10};
  P = P + 4;
  call native_print_string;
  P = P - 4;
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
