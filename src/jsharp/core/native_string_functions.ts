import CodeTranslator from "../scope/code_builder";

export default class NativeStringFunctions {
  public static readonly _instance: NativeStringFunctions = new NativeStringFunctions();

  private constructor() {}

  public generete(codeBuilder: CodeTranslator) {
    this.integerToString(codeBuilder);
    this.toChartArray(codeBuilder);
    this.lengthString(codeBuilder);
    this.toLowerCase(codeBuilder);
    this.toUpperCase(codeBuilder);
    this.charAt(codeBuilder);
    this.compareStrings(codeBuilder);
    this.concatStringChar(codeBuilder);
    this.concatCharString(codeBuilder);
    this.concatStringNumber(codeBuilder);
    this.concatNumberString(codeBuilder);
    this.concatStrings(codeBuilder);
    this.concantChars(codeBuilder);
    this.concatBooleanString(codeBuilder);
    this.concatStringBoolean(codeBuilder);
  }

  private concatStringChar(codeBuilder: CodeTranslator) {
    let t0 = codeBuilder.getNewTemporary(),
      t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`proc native_concatenar_string_caracter begin
  ${t0} = H;
  ${t1} = P + 1;
  ${t2} = Stack[${t1}];
  ${t3} = Heap[${t2}];
  ${t1} = ${t3} + 1;
  Heap[${t0}] = ${t1};
  H = H + 1;
  ${t2} = ${t2} + 1;
${L1}:
  ${t4} = Heap[${t2}];
  if (${t4} == 0) goto ${L2};
  Heap[H] = ${t4};
  H = H + 1;
  ${t2} = ${t2} + 1;
  goto ${L1};
${L2}:
  ${t1} = P + 2;
  ${t2} = Stack[${t1}];
  Heap[H] = ${t2};
  H = H + 1;
  Heap[H] = 0;
  H = H + 1;
  Stack[P] = ${t0};
end
`);
  }

  private concatCharString(codeBuilder: CodeTranslator) {
    let t0 = codeBuilder.getNewTemporary(),
      t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary(),
      t5 = codeBuilder.getNewTemporary(),
      t6 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`proc native_concatenar_caracter_string begin
  ${t1} = P + 1;
  ${t2} = Stack[${t1}];
  ${t0} = H;
  H = H + 1;
  Heap[H] = ${t2};
  H = H + 1;
  ${t3} = P + 2;
  ${t4} = Stack[${t3}];
  ${t1} = Heap[${t4}];
  ${t2} = ${t1} + 1;
  Heap[${t0}] = ${t2};  
  ${t5} = ${t4} + 1;
${L1}:
  ${t6} = Heap[${t5}];
  if (${t6} == 0) goto ${L2};
  Heap[H] = ${t6};
  H = H + 1;
  ${t5} = ${t5} + 1;
  goto ${L1};
${L2}:
  Heap[H] = 0;
  H = H + 1;
  Stack[P] = ${t0};
end
`);
  }

  private concatStringNumber(codeBuilder: CodeTranslator) {
    let t0 = codeBuilder.getNewTemporary(),
      t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary(),
      t5 = codeBuilder.getNewTemporary(),
      t6 = codeBuilder.getNewTemporary();
    codeBuilder.setTranslatedCode(`proc native_concatenar_string_numero begin
  ${t1} = P + 1;
  ${t2} = Stack[${t1}];
  ${t1} = P + 2;
  ${t3} = Stack[${t1}];
  ${t1} = P + 3;
  ${t4} = Stack[${t1}];
  ${t1} = P + 4;
  ${t5} = ${t1} + 1;
  Stack[${t5}] = ${t3};
  ${t5} = ${t1} + 2;
  Stack[${t5}] = ${t4};
  P = P + 4;
  call native_integer_to_string;
  P = P - 4;
  ${t6} = Stack[${t1}];
  ${t5} = ${t1} + 1;
  Stack[${t5}] = ${t2};
  ${t5} = ${t1} + 2;
  Stack[${t5}] = ${t6};
  P = P + 3;
  call native_concatenar_cadenas;
  P = P - 3;
  ${t0} = Stack[${t1}];
  Stack[P] = ${t0};
end
`);
  }

  private concatNumberString(codeBuilder: CodeTranslator) {
    let t0 = codeBuilder.getNewTemporary(),
      t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary(),
      t5 = codeBuilder.getNewTemporary(),
      t6 = codeBuilder.getNewTemporary();
    codeBuilder.setTranslatedCode(`proc native_concatenar_numero_string begin
  ${t1} = P + 1;
  ${t2} = Stack[${t1}];
  ${t1} = P + 2;
  ${t3} = Stack[${t1}];
  ${t1} = P + 4;
  ${t4} = ${t1} + 1;
  Stack[${t4}] = ${t2};
  ${t4} = ${t1} + 2;
  Stack[${t4}] = ${t3};
  P = P + 4;
  call native_integer_to_string;
  P = P - 4;
  ${t5} = Stack[${t1}];
  ${t4} = ${t1} + 1;
  Stack[${t4}] = ${t5};
  ${t5} = P + 3;
  ${t6} = Stack[${t5}];
  ${t4} = ${t1} + 2;
  Stack[${t4}] = ${t6};
  P = P + 3;
  call native_concatenar_cadenas;
  P = P - 3;
  ${t0} = Stack[${t1}];
  Stack[P] = ${t0};
end

`);
  }

  private concatStrings(codeBuilder: CodeTranslator) {
    let t0 = codeBuilder.getNewTemporary(),
      t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary(),
      t5 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel(),
      L3 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`
proc native_concatenar_cadenas begin
  ${t0} = H;
  Heap[H] = 0;
  H = H + 1;
  ${t1} = P + 1;
  ${t2} = Stack[${t1}];
  ${t1} = P + 2;
  ${t3} = Stack[${t1}];
  ${t2} = ${t2} + 1;
  ${t3} = ${t3} + 1;
  ${t4} = 0;
${L1}:
  ${t5} = Heap[${t2}];
  if (${t5} == 0) goto ${L2};
  Heap[H] = ${t5};
  H = H + 1;
  ${t2} = ${t2} + 1;
  ${t4} = ${t4} + 1;
  goto ${L1};
${L2}:
  ${t5} = Heap[${t3}];
  if (${t5} == 0) goto ${L3};
  Heap[H] = ${t5};
  H = H + 1;
  ${t3} = ${t3} + 1;
  ${t4} = ${t4} + 1;
  goto ${L2};
${L3}:  
  Heap[${t0}] = ${t4};
  Heap[H] = 0;
  H = H + 1;
  Stack[P] = ${t0};
end
`);
  }

  private concantChars(codeBuilder: CodeTranslator) {
    let t0 = codeBuilder.getNewTemporary(),
      t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary();
    codeBuilder.setTranslatedCode(`proc native_concatenar_caracteres begin
  ${t1} = P + 1;
  ${t2} = Stack[${t1}];
  ${t3} = P + 2;
  ${t4} = Stack[${t3}];
  ${t0} = H;
  Heap[H] = 2;
  H = H + 1;
  Heap[H] = ${t2};
  H = H + 1;
  Heap[H] = ${t4};
  H = H + 1;
  Heap[H] = 0;
  H = H + 1;
  Stack[P] = ${t0};
end
`);
  }

  private concatBooleanString(codeBuilder: CodeTranslator) {
    let t0 = codeBuilder.getNewTemporary(),
      t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel(),
      L3 = codeBuilder.getNewLabel(),
      L4 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`proc native_concatenar_boolean_string begin
  ${t1} = P + 1;
  ${t2} = Stack[${t1}];
  ${t0} = H;
  H = H + 1;
  if (${t2} == 0) goto ${L1};
  ${t3} = 4;
  Heap[H] = 116; # t
  H = H + 1;
  Heap[H] = 114; # r
  H = H + 1;
  Heap[H] = 117; # u
  H = H + 1;
  Heap[H] = 101; # e
  H = H + 1; 
  goto ${L2};
${L1}:
  ${t3} = 5;
  Heap[H] = 102; # f
  H = H + 1;
  Heap[H] =  97; # a
  H = H + 1;
  Heap[H] = 108; # l
  H = H + 1;
  Heap[H] = 115; # s
  H = H + 1;
  Heap[H] = 101; # e
  H = H + 1;
${L2}:
  ${t1} = P + 2;
  ${t2} = Stack[${t1}];
  ${t4} = Heap[${t2}];
  ${t3} = ${t4} + ${t3};
  ${t2} = ${t2} + 1;
${L3}:
  ${t4} = Heap[${t2}]; 
  if (${t4} == 0) goto ${L4};
  Heap[H] = ${t4};
  H = H + 1;
  ${t2} = ${t2} + 1;
  goto ${L3};
${L4}:
  Heap[${t0}] = ${t3};
  Heap[H] = 0;
  H = H + 1;
  Stack[P] = ${t0};
end
`);
  }

  private concatStringBoolean(codeBuilder: CodeTranslator) {
    let t0 = codeBuilder.getNewTemporary(),
      t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel(),
      L3 = codeBuilder.getNewLabel(),
      L4 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`proc native_concatenar_string_boolean begin
  ${t1} = P + 1;
  ${t2} = Stack[${t1}];
  ${t0} = H;
  ${t3} = Heap[${t2}];
  H = H + 1;
  ${t2} = ${t2} + 1;
${L1}:
  ${t4} = Heap[${t2}];
  if (${t4} == 0) goto ${L2};
  Heap[H] = ${t4};
  H = H + 1;
  ${t2} = ${t2} + 1;
  goto ${L1};
${L2}:
  ${t1} = P + 2;
  ${t2} = Stack[${t1}];
  if (${t2} == 0) goto ${L3};
  ${t3} = ${t3} + 4;
  Heap[H] = 116; # t
  H = H + 1;
  Heap[H] = 114; # r
  H = H + 1;
  Heap[H] = 117; # u
  H = H + 1;
  Heap[H] = 101; # e
  H = H + 1;
  goto ${L4};
${L3}:
  ${t3} = ${t3} + 5;
  Heap[H] = 102; # f
  H = H + 1;
  Heap[H] =  97; # a
  H = H + 1;
  Heap[H] = 108; # l
  H = H + 1;
  Heap[H] = 115; # s
  H = H + 1;
  Heap[H] = 101; # e
  H = H + 1;
${L4}:
  Heap[${t0}] = ${t3};
  Heap[H] = 0;
  H = H + 1;
  Stack[P] = ${t0};
end
`);
  }

  private integerToString(codeBuilder: CodeTranslator) {
    let t0 = codeBuilder.getNewTemporary(),
      tCont = codeBuilder.getNewTemporary(),
      dirAux = codeBuilder.getNewTemporary(),
      num = codeBuilder.getNewTemporary(),
      t1 = codeBuilder.getNewTemporary(),
      tc = codeBuilder.getNewTemporary(),
      tt = codeBuilder.getNewTemporary(),
      t9 = codeBuilder.getNewTemporary(),
      t10 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary(),
      t5 = codeBuilder.getNewTemporary(),
      t6 = codeBuilder.getNewTemporary(),
      t7 = codeBuilder.getNewTemporary(),
      tnum = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel(),
      L3 = codeBuilder.getNewLabel(),
      L4 = codeBuilder.getNewLabel(),
      L5 = codeBuilder.getNewLabel(),
      L6 = codeBuilder.getNewLabel(),
      L7 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`proc native_integer_to_string begin
  ${t0} = H;
  ${tCont} = 0;
  Heap[H] = 0;
  ${dirAux} = P + 1;
  ${num} = Stack[${dirAux}];
  if (${num} >= 0) goto ${L1};
  H = H + 1;
  Heap[H] = 45;
  ${tCont} = 1;
  ${num} = -${num};
${L1}:
  ${dirAux} = P + 2;
  if (${dirAux} == 0) goto ${L2};
  ${t1} = ${num} % 1;
  ${tc} = P + 3;
  ${tt} = ${num} - ${t1};
  Stack[${tc}] = ${tt};
  P = P + 3;
  call native_aux_integer_to_string;
  P = P - 3;
  H = H + 1;
  Heap[H] = 46;
  ${t9} = ${t1} * 100000;
  ${t10} = ${t9} % 1;
  ${t2} = ${t9} - ${t10};
  Stack[${tc}] = ${t2};
  P = P + 3;
  call native_aux_integer_to_string;
  P = P - 3;
  goto ${L3};
${L2}:
  ${tc} = P + 3;
  Stack[${tc}] = ${num};
  P = P + 3;
  call native_aux_integer_to_string;
  P = P - 3;
${L3}:
  H = H + 1;
  Heap[H] = 0;
  H = H + 1;
  Heap[${t0}] = ${tCont};
  Stack[P] = ${t0};
end

proc native_aux_integer_to_string begin
  ${t2} = Stack[P];
  ${t3} = 1;
${L4}:
  if (${t2} < 10) goto ${L5};
  ${t2} = ${t2} / 10;
  ${t3} = ${t3} + 1;
  goto ${L4};
${L5}:
  ${t2} = Stack[P];
  ${t4} = ${t3};
${L6}:
  if (${t3} <= 0) goto ${L7};
  ${t5} = H + ${t3};
  ${t6} = ${t2} % 10;
  ${tCont} = ${tCont} + 1;
  ${tnum} = ${t6} + 48;
  Heap[${t5}] = ${tnum};
  ${t7} = ${t2} / 10;
  ${t6} = ${t7} % 1;
  ${t2} = ${t7} - ${t6};
  ${t3} = ${t3} - 1;
  goto ${L6};
${L7}:
  H = H + ${t4};
end

`);
  }

  private charAt(codeBuilder: CodeTranslator) {
    let t0 = codeBuilder.getNewTemporary(),
      t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary(),
      t5 = codeBuilder.getNewTemporary(),
      t6 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel(),
      L3 = codeBuilder.getNewLabel(),
      L4 = codeBuilder.getNewLabel(),
      L5 = codeBuilder.getNewLabel(),
      L6 = codeBuilder.getNewLabel(),
      L7 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`
proc native_char_at begin
  ${t0} = 0;
  ${t1} = P + 1;
  ${t2} = Stack[${t1}];
  if (${t2} == -1) goto ${L1};
  goto ${L2};
${L1}:
  E = 4;
  goto ${L3};
${L2}:
  ${t1} = P + 2;
  ${t3} = Stack[${t1}];
  if (${t3} > -1) goto ${L4};
  goto ${L5};
${L4}:
  ${t4} = Heap[${t2}];
  if (${t3} < ${t4}) goto ${L6};
  goto ${L7};
${L6}:
  ${t5} = ${t2} + 1;
  ${t6} = ${t5} + ${t3};
  ${t0} = Heap[${t6}];
  goto ${L3};
${L5}: ${L7}:
  E = 3;
${L3}:
  Stack[P] = ${t0};
end

`);
  }

  private toUpperCase(codeBuilder: CodeTranslator) {
    let t0 = codeBuilder.getNewTemporary(),
      t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary(),
      t5 = codeBuilder.getNewTemporary(),
      t6 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel(),
      L3 = codeBuilder.getNewLabel(),
      L4 = codeBuilder.getNewLabel(),
      L5 = codeBuilder.getNewLabel(),
      L6 = codeBuilder.getNewLabel(),
      L7 = codeBuilder.getNewLabel(),
      L8 = codeBuilder.getNewLabel(),
      L9 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`
proc native_to_upper_case begin
  ${t0} = -1;
  ${t1} = P + 1;
  ${t2} = Stack[${t1}];
  if (${t2} == -1) goto ${L1};
  goto ${L2};
${L1}:
  E = 4;
  goto ${L3};
${L2}:
  ${t3} = Heap[${t2}];
  ${t0} = H;
  Heap[H] = ${t3};
  H = H + 1;
  ${t4} = ${t2} + 1;
${L4}:
  ${t5} = Heap[${t4}];
  if (${t5} == 0) goto ${L5};
  if (${t5} >= 97) goto ${L6};
  goto ${L7};
${L6}:
  if (${t5} <= 122) goto ${L8};
  goto ${L9};
${L8}:
  ${t6} = ${t5} - 32;
  Heap[H] = ${t6};
  H = H + 1;
  ${t4} = ${t4} + 1;
  goto ${L4};
${L7}: ${L9}:
  Heap[H] = ${t5};
  H = H + 1;
  ${t4} = ${t4} + 1;
  goto ${L4};
${L5}:
  Heap[H] = 0;
  H = H + 1;
${L3}:
  Stack[P] = ${t0};
end

`);
  }

  private toLowerCase(codeBuilder: CodeTranslator) {
    let t0 = codeBuilder.getNewTemporary(),
      t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary(),
      t5 = codeBuilder.getNewTemporary(),
      t6 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel(),
      L3 = codeBuilder.getNewLabel(),
      L4 = codeBuilder.getNewLabel(),
      L5 = codeBuilder.getNewLabel(),
      L6 = codeBuilder.getNewLabel(),
      L7 = codeBuilder.getNewLabel(),
      L8 = codeBuilder.getNewLabel(),
      L9 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`
proc native_to_lower_case begin
  ${t0} = -1;
  ${t1} = P + 1;
  ${t2} = Stack[${t1}];
  if (${t2} == -1) goto ${L1};
  goto ${L2};
${L1}:
  E = 4;
  goto ${L3};
${L2}:
  ${t3} = Heap[${t2}];
  ${t0} = H;
  Heap[H] = ${t3};
  H = H + 1;
  ${t4} = ${t2} + 1;
${L4}:
  ${t5} = Heap[${t4}];
  if (${t5} == 0) goto ${L5};
  if (${t5} >= 65) goto ${L6};
  goto ${L7};
${L6}:
  if (${t5} <= 90) goto ${L8};
  goto ${L9};
${L8}:
  ${t6} = ${t5} + 32;
  Heap[H] = ${t6};
  H = H + 1;
  ${t4} = ${t4} + 1;
  goto ${L4};
${L7}: ${L9}:
  Heap[H] = ${t5};
  H = H + 1;
  ${t4} = ${t4} + 1;
  goto ${L4};
${L5}:
  Heap[H] = 0;
  H = H + 1;
${L3}:
  Stack[P] = ${t0};
end

`);
  }

  private lengthString(codeBuilder: CodeTranslator) {
    let t0 = codeBuilder.getNewTemporary(),
      t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel(),
      L3 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`
proc native_cadena_length begin
  ${t0} = 0;
  ${t1} = P + 1;
  ${t2} = Stack[${t1}];
  if(${t2} == -1) goto ${L1};
  goto ${L2};
${L1}:
  E = 4;
  goto ${L3};
${L2}:
  ${t0} = Heap[${t2}];
${L3}:
  Stack[P] = ${t0};
end

`);
  }

  private toChartArray(codeBuilder: CodeTranslator) {
    let t0 = codeBuilder.getNewTemporary(),
      t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t5 = codeBuilder.getNewTemporary(),
      t6 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel(),
      L3 = codeBuilder.getNewLabel(),
      L4 = codeBuilder.getNewLabel(),
      L5 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`
proc native_to_char_array begin
  ${t0} = -1;
  ${t1} = P + 1;
  ${t2} = Stack[${t1}];
  if (${t2} == -1) goto ${L1};
  goto ${L2};
${L1}:
  E = 4;
  goto ${L3};
${L2}:
  ${t3} = Heap[${t2}];
  ${t0} = H;
  Heap[H] = ${t3};
  H = H + 1;
  ${t5} = ${t2} + 1;
${L4}:
  ${t6} = Heap[${t5}];
  if (${t6} == 0) goto ${L5};
  Heap[H] = ${t6};
  H = H + 1;
  ${t5} = ${t5} + 1;
  goto ${L4};
${L5}:
${L3}:
  Stack[P] = ${t0};
end

`);
  }

  private compareStrings(codeBuilder: CodeTranslator) {
    let t0 = codeBuilder.getNewTemporary(),
      t1 = codeBuilder.getNewTemporary(),
      t2 = codeBuilder.getNewTemporary(),
      t3 = codeBuilder.getNewTemporary(),
      t4 = codeBuilder.getNewTemporary(),
      t5 = codeBuilder.getNewTemporary(),
      t6 = codeBuilder.getNewTemporary(),
      t7 = codeBuilder.getNewTemporary(),
      t8 = codeBuilder.getNewTemporary(),
      t9 = codeBuilder.getNewTemporary(),
      t10 = codeBuilder.getNewTemporary(),
      t11 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel(),
      L3 = codeBuilder.getNewLabel(),
      L4 = codeBuilder.getNewLabel(),
      L5 = codeBuilder.getNewLabel(),
      L6 = codeBuilder.getNewLabel(),
      L7 = codeBuilder.getNewLabel(),
      L8 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`
proc native_comparar_cadenas begin
  ${t0} = 0;
  ${t1} = P + 1;
  ${t2} = Stack[${t1}];
  ${t3} = P + 2;
  ${t4} = Stack[${t3}];
  if (${t2} == -1) goto ${L2};
  goto ${L3};
${L2}:
  if (${t4} == -1) goto ${L4};
  goto ${L3};
${L4}:
  ${t0} = 1;
  goto ${L1};
${L3}:
  if (${t2} == -1) goto ${L1};
  goto ${L5};
${L5}:
  if (${t4} == -1) goto ${L1};
  goto ${L6};
${L6}:
  ${t5} = Heap[${t2}];
  ${t6} = Heap[${t4}];
  if (${t5} <> ${t6}) goto ${L1};
  ${t7} = 0;
  ${t2} = ${t2} + 1;
  ${t4} = ${t4} + 1;
${L7}:
  if (${t7} > ${t5}) goto ${L8};
  ${t8} = ${t2} + ${t7};
  ${t9} = ${t4} + ${t7};
  ${t10} = Heap[${t8}];
  ${t11} = Heap[${t9}];
  if (${t10} <> ${t11}) goto ${L1};
  ${t7} = ${t7} + 1;
  goto ${L7};
${L8}:
  ${t0} = 1;
${L1}:
  Stack[P] = ${t0};
end

`);
  }

  public static getInstance(): NativeStringFunctions {
    return NativeStringFunctions._instance;
  }
}
