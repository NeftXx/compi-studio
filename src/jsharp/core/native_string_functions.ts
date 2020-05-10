import CodeTranslator from "../scope/code_builder";

export default class NativeStringFunctions {
  public static readonly _instance: NativeStringFunctions = new NativeStringFunctions();

  private constructor() {}

  public generete(codeBuilder: CodeTranslator) {
    this.toChartArray(codeBuilder);
    this.lengthString(codeBuilder);
    this.toLowerCase(codeBuilder);
    this.toUpperCase(codeBuilder);
    this.charAt(codeBuilder);
    this.compareStrings(codeBuilder);
    this.concatStringString(codeBuilder);
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
      t11 = codeBuilder.getNewTemporary(),
      t12 = codeBuilder.getNewTemporary();
    let L1 = codeBuilder.getNewLabel(),
      L2 = codeBuilder.getNewLabel(),
      L3 = codeBuilder.getNewLabel(),
      L4 = codeBuilder.getNewLabel(),
      L5 = codeBuilder.getNewLabel(),
      L6 = codeBuilder.getNewLabel(),
      L7 = codeBuilder.getNewLabel();
    codeBuilder.setTranslatedCode(`
proc native_comparar_cadenas begin
  ${t0} = 0;
  ${t1} = P + 1;
  ${t2} = Stack[${t1}];
  ${t3} = P + 2;
  ${t4} = Stack[${t3}];
  ${t5} = Heap[${t2}];
  ${t6} = Heap[${t4}];
  if (${t5} == ${t6}) goto ${L1};
  goto ${L2};
${L1}:
  ${t0} = 1;
  ${t7} = ${t2} + 1;
  ${t8} = ${t4} + 1;
  ${t9} = 0;
${L3}:  
  if (${t9} == ${t5}) goto ${L4};
  goto ${L5};
${L4}:
  ${t10} = Heap[${t7}];
  ${t11} = Heap[${t8}];
  if (${t10} == ${t11}) goto ${L6};
  goto ${L7};
${L6}:
  ${t7} = ${t7} + 1;
  ${t8} = ${t8} + 1;
  ${t9} = ${t9} + 1;
  goto ${L3};
${L7}:
  ${t0} = 0;
${L5}:
${L2}:
  Stack[P] = ${t0};
end

`);
  }

  private concatStringString(codeBuilder: CodeTranslator) {
    codeBuilder.setTranslatedCode("");
  }

  public static getInstance(): NativeStringFunctions {
    return NativeStringFunctions._instance;
  }
}
