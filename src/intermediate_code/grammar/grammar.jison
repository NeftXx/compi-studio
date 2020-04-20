%left UMINUS

%start compilation_unit

%% /* language grammar */

compilation_unit
  : var_declaration_list global_statement_block
;

global_statement_block
  : global_statement_block method_declaration
  | global_statement_block statement
  | method_declaration
  | statement
;

var_declaration_list
  : var_declaration_list var_declaration ';'
  | var_declaration ';'
;

var_declaration
  : var_declaration_list ',' ID
  | var_declaration_list ',' ID '[' ']'
  | 'var' ID
  | 'var' ID '[' ']'
;

method_declaration
  : 'proc' ID 'begin' statement_block 'end'
;

statement_block
  : statement_block statement
  | statement
;

statement
  : assigment
  | print_statement
  | destiny_of_jump
  | method_invocation
  | inconditional_jump
  | conditional_jump_if
;

assigment
  : ID '=' arit_exp
  | ID '[' value ']' '=' value
  | ID '[' value ']' '=' value
;

arit_exp
  : value arit_op value
  | value arit_op minus
  | minus arit_op value
  | minus arit_op minus
  | value
  | access_structure
  | minus
;

minus
  : '-' value %prec UMINUS
;

value
  : ID
  | NUMBER
;

access_structure
  : ID '[' value ']'
  | ID '[' value ']'
;

destiny_of_jump
  : LABEL ':'
;

inconditional_jump
  : 'goto' LABEL ';'
;

conditional_jump_if
  : 'if' '(' rel_exp ')' 'goto' LABEL ';'
;

rel_exp
  : value rel_op value
  | value rel_op minus
  | minus rel_op minus
  | minus rel_op value
;

method_invocation
  : 'call' ID ';'
;

print_statement
  : 'print' '(' DOUBLE_QUOTE '%' CHAR_TERMINAL DOUBLE_QUOTE ',' print_value ')' ';'
;

print_value
  : value
  | minus
;

arit_op
  : '+'
  | '-'
  | '*'
  | '/'
  | '%'
;

rel_op
  : '<' 
  | '>' 
  | '<='
  | '>='
  | '=='
  | '!='
;