/**
  * Name: Parser
  * Author: Ronald Berdúo
  */
%{
%}

%left UMINUS

%start compilation_unit

%right '='
%right '?' ':'
%left '||'
%left '&&'
%left '^'
%left '!=' '=='
%nonassoc '>=' '>' '<=' '<'
%left '+' '-'
%left '*' '/' '%'
%left '(' ')'

%% /* language grammar */

compilation_unit
  : statement
;

statement
  : 'print' '(' expression ')'
  | 'print' '(' expression ')' ';'
;

expression
  : STRING_LITERAL {}
  | DOUBLE_LITERAL {}
  | INTEGER_LITERAL {}
  | BOOLEAN_LITERAL {}
  | IDENTIFIER {}
;