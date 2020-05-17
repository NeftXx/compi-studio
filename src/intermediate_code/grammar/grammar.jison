%{
  const { default: Ast } = require("../ast/ast");
  const { default: VarDeclaration } = require("../ast/variable/var_declaration");
  const { default: MethodDeclaration } = require("../ast/method/method_declaration");
  const { default: VarAssigment } = require("../ast/variable/var_assigment");
  const { default: StructureAssigment } = require("../ast/variable/structure_assigment");
  const { default: ArithmeticExp } = require("../ast/expression/arithmetic_exp");
  const { default: Minus } = require("../ast/expression/minus");
  const { default: Identifier } = require("../ast/expression/identifier");
  const { default: NumberExp } = require("../ast/expression/number_exp");
  const { default: AccessStructure } = require("../ast/expression/access_structure");
  const { default: DestinyJump } = require("../ast/jump/destiny_of_jump");
  const { default: InconditionalJump } = require("../ast/jump/inconditional_jump");
  const { default: ConditionalJumpIf } = require("../ast/jump/conditional_jump_if");
  const { default: RelationalExp } = require("../ast/expression/relational_exp");
  const { default: MethodInvocation } = require("../ast/expression/relational_exp");
  const { default: Print } = require("../ast/print");
%}

%left UMINUS

%start compilation_unit

%% /* language grammar */

compilation_unit
  : var_declaration_list global_statement_block EOF {
    return new Ast($1.concat($2));
  }
;

global_statement_block
  : global_statement_block method_declaration { $$ = $1; $$.push($2); }
  | global_statement_block statement { $$ = $1; $$.push($2); }
  | method_declaration { $$ = [$1] }
  | statement { $$ = [$1]; }
;

var_declaration_list
  : var_declaration_list var_declaration ';' { $$ = $1.concat($2); }
  | var_declaration ';' { $$ = []; $$ = $$.concat($1); }
;

var_declaration
  : var_declaration ',' ID {
    $$ = $1;    
    $$.push(new VarDeclaration(@3.first_line, @3.first_column, $3, false));
  }
  | var_declaration ',' ID '[' ']' {
    $$ = $1;    
    $$.push(new VarDeclaration(@3.first_line, @3.first_column, $3, true));
  }
  | 'var' ID {
    $$ = [];
    $$.push(new VarDeclaration(@2.first_line, @2.first_column, $2, false));
  }
  | 'var' ID '[' ']' {
    $$ = [];
    $$.push(new VarDeclaration(@2.first_line, @2.first_column, $2, true));
  }
;

method_declaration
  : 'proc' ID 'begin' statement_block 'end' {
    $$ = new MethodDeclaration(@2.first_line, @2.first_column, $2, $4);
  }
;

statement_block
  : statement_block statement { $$ = $1; $$.push($2); }
  | statement { $$ = [$1]; }
;

statement
  : assigment { $$ = $1; }
  | print_statement { $$ = $1; }
  | destiny_of_jump { $$ = $1; }
  | method_invocation { $$ = $1; }
  | inconditional_jump { $$ = $1; }
  | conditional_jump_if { $$ = $1; }
;

assigment
  : ID '=' arit_exp ';' {
    $$ = new VarAssigment(@1.first_line, @1.first_column, $1, $3);
  }
  | ID '[' value ']' '=' value ';' {    
    $$ = new StructureAssigment(@1.first_line, @1.first_column, $1, $3, $6);
  }
  | ID '[' value ']' '=' minus ';' {    
    $$ = new StructureAssigment(@1.first_line, @1.first_column, $1, $3, $6);
  }
;

arit_exp
  : value arit_op value {
    $$ = new ArithmeticExp(@2.first_line, @2.first_column, $1, $2, $3);
  }
  | value arit_op minus {
    $$ = new ArithmeticExp(@2.first_line, @2.first_column, $1, $2, $3);
  }
  | minus arit_op value {
    $$ = new ArithmeticExp(@2.first_line, @2.first_column, $1, $2, $3);
  }
  | minus arit_op minus {
    $$ = new ArithmeticExp(@2.first_line, @2.first_column, $1, $2, $3);
  }
  | value { $$ = $1; }
  | access_structure { $$ = $1; }
  | minus { $$ = $1; }
;

minus
  : '-' value %prec UMINUS {
    $$ = new Minus(@1.first_line, @1.first_column, $2);
  }
;

value
  : ID {
    $$ = new Identifier(@1.first_line, @1.first_column, $1);
  }
  | NUMBER {
    $$ = new NumberExp(@1.first_line, @1.first_column, Number($1));
  }
;

access_structure
  : ID '[' value ']' {
    $$ = new AccessStructure(@1.first_line, @1.first_column, $1, $3);
  }
;

destiny_of_jump
  : LABEL ':' {
    $$ = new DestinyJump(@1.first_line, @1.first_column, $1);
  }
;

inconditional_jump
  : 'goto' LABEL ';' {
    $$ = new InconditionalJump(@2.first_line, @2.first_column, $2);
  }
;

conditional_jump_if
  : 'if' '(' rel_exp ')' 'goto' LABEL ';' {
    $$ = new ConditionalJumpIf(@1.first_line, @1.first_column, $3, $6);
  }
;

rel_exp
  : value rel_op value {
    $$ = new RelationalExp(@2.first_line, @2.first_column, $1, $2, $3);
  }
  | value rel_op minus {
    $$ = new RelationalExp(@2.first_line, @2.first_column, $1, $2, $3);
  }
  | minus rel_op minus {
    $$ = new RelationalExp(@2.first_line, @2.first_column, $1, $2, $3);
  }
  | minus rel_op value {
    $$ = new RelationalExp(@2.first_line, @2.first_column, $1, $2, $3);
  }
;

method_invocation
  : 'call' ID ';' {
    $$ = new MethodInvocation(@2.first_line, @2.first_column, $2);
  }
;

print_statement
  : 'print' '(' DOUBLE_QUOTE '%' CHAR_TERMINAL DOUBLE_QUOTE ',' print_value ')' ';' {  
    $$ = new Print(@1.first_line, @1.first_column, $5.toLowerCase(), $8);
  }
;

print_value
  : value { $$ = $1; }
  | minus { $$ = $1; }
;

arit_op
  : '+' { $$ = "+"; }
  | '-' { $$ = "-"; }
  | '*' { $$ = "*"; }
  | '/' { $$ = "/"; }
  | '%' { $$ = "%"; }
;

rel_op
  : '<'  { $$ = "<";  }
  | '>'  { $$ = ">";  }
  | '<=' { $$ = "<="; }
  | '>=' { $$ = ">="; }
  | '==' { $$ = "=="; }
  | '<>' { $$ = "<>"; }
;