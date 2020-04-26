/**
  * Name: Parser
  * Author: Ronald Berdúo
  */
%{
  const { default: Ast } = require("../ast/ast");
  const { default: NodeInfo } = require("../scope/node_info");
  const { default: Print } = require("../ast/statement/print");
  const { default: Literal } = require("../ast/expression/literal");
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
  : global_statement EOF {
    return new Ast($1);
  }
;

global_statement
  : global_statement statement { $$ = $1; $$.push($2); }
  | statement { $$ = [$1]; }
;

statement
  : 'print' '(' expression ')' {
    $$ = new Print(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $3
    );
  }
  | 'print' '(' expression ')' ';' {
    $$ = new Print(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $3
    );
  }
;

expression
  : STRING_LITERAL {
    $$ = new Literal(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), yy.typeFactory.getString(), $1
    );
  }
  | DOUBLE_LITERAL {
    $$ = new Literal(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), yy.typeFactory.getDouble(), Number($1)
    );
  }
  | INTEGER_LITERAL {
    $$ = new Literal(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), yy.typeFactory.getInteger(), Number($1)
    );
  }
  | BOOLEAN_LITERAL {
    $$ = new Literal(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), yy.typeFactory.getBoolean(), $1.toLowerCase() === "true"
    );
  }
  | IDENTIFIER {
  }
;