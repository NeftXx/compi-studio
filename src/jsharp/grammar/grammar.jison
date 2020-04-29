/**
  * Name: Parser
  * Author: Ronald Berdúo
  */
%{
  const { default: Ast } = require("../ast/ast");  
  const { default: NodeInfo } = require("../scope/node_info");
  const { default: ImportStm } = require("../ast/statement/import");
  const { default: Print } = require("../ast/statement/print");
  const { default: Arithmetic } = require("../ast/expression/arithmetic");
  const { default: Relational } = require("../ast/expression/relational");
  const { default: And } = require("../ast/expression/and");
  const { default: UMenos } = require("../ast/expression/umenos");
  const { default: Literal } = require("../ast/expression/literal");
  const { default: FunctionStm } = require("../ast/statement/function");
  const { default: ParameterStm } = require("../ast/statement/parameter");
  const { default: BlockStm } = require("../ast/statement/block");
%}

%start compilation_unit

%right '='
%right '?' ':'
%left '++' '--'
%left '||'
%left '&&'
%left '!=' '=='
%nonassoc '>=' '>' '<=' '<'
%left '+' '-'
%left '*' '/' '%'
%right '^^'
%right UMINUS '!'
%left '(' ')' '[' ']'

%% /* language grammar */

compilation_unit
  : import_statement global_statement EOF {
    return new Ast($2, yy.filename, $1);
  }
  | global_statement EOF {
    return new Ast($1, yy.filename);
  }
;

import_statement
  : 'import' file_list {
    $$ = new ImportStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $2
    );
  }
  | 'import' file_list ';' {
    $$ = new ImportStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $2
    );
  }
;

file_list
  : file_list ',' FILE { $$ = $1; $$.push($3); }
  | FILE { $$ = [$1]; }
;

global_statements_list
  : global_statements_list global_statement { $$ = $1; $$.push($2); }
  | global_statement { $$ = [$1]; }
;

global_statement
  : function_statement
;

function_statement
  : visibility type IDENTIFIER '(' parameter_list ')' block_statement {
    $$ = new FunctionStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $2, $3, $5, $7
    );
  }
  | visibility type IDENTIFIER '(' ')' block_statement {
    $$ = new FunctionStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $2, $3, [], $6
    );
  }
  | visibility 'void' IDENTIFIER '(' parameter_list ')' block_statement {
    $$ = new FunctionStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), yy.typeFactory.getVoid(), $3, $5, $7
    );
  }
  | visibility 'void' IDENTIFIER '(' ')' block_statement {
    $$ = new FunctionStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), yy.typeFactory.getVoid(), $3, [], $6
    );
  }
  | type IDENTIFIER '(' parameter_list ')' block_statement {
    $$ = new FunctionStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, $2, $4, $6
    );
  }
  | type IDENTIFIER '(' ')' block_statement {
    $$ = new FunctionStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, $2, [], $5
    );
  }
  | 'void' IDENTIFIER '(' parameter_list ')' block_statement {
    $$ = new FunctionStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), yy.typeFactory.getVoid(), $2, $4, $6
    );
  }
  | 'void' IDENTIFIER '(' ')' block_statement {
    $$ = new FunctionStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), yy.typeFactory.getVoid(), $2, [], $5
    );
  }
;

visibility
  : 'public'
  | 'private'
;

type
  : primitive_type { $$ = $1; }
  | reference_type { $$ = $1; }
;

primitive_type
  : 'integer' { $$ = yy.typeFactory.getInteger(); }
  | 'double'  { $$ = yy.typeFactory.getDouble();  }
  | 'char'    { $$ = yy.typeFactory.getChar();    }
  | 'boolean' { $$ = yy.typeFactory.getBoolean(); }
;

reference_type
  : ID
;

array_type
  : array_type '[' ']'
  | primitive_type '[' ']'
  | ID '[' ']'
;

parameter_list
  : parameter_list parameter { $$ = $1; $$.push($2); }
  | parameter { $$ = [$1]; }
;

parameter
  : type ID {
    $$ = new ParameterStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, $2
    );
  }
;

block_statement
  : '{' block '}' {
    $$ = new BlockStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $2
    );
  }
  | '{' '}' {
    $$ = new BlockStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), []
    );
  }
;

block
  : block statement { $$ = $1; $$.push($2); }
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
  : expression '&&' expression {
    $$ = new And(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, $3
    );
  }
  | expression '^^' expression {
    $$ = new Arithmetic(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, "^^", $3
    );
  }
  | expression '+' expression {
    $$ = new Arithmetic(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, "+", $3
    );
  }
  | expression '-' expression {
    $$ = new Arithmetic(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, "-", $3
    );
  }
  | expression '*' expression {
    $$ = new Arithmetic(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, "*", $3
    );
  }
  | expression '/' expression {
    $$ = new Arithmetic(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, "/", $3
    );
  }
  | expression '%' expression {
    $$ = new Arithmetic(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, "%", $3
    );
  }
  | expression '>' expression {
    $$ = new Relational(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, ">", $3
    )
  }
  | expression '>=' expression {
    $$ = new Relational(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, ">=", $3
    )
  }
  | expression '<' expression {
    $$ = new Relational(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, "<", $3
    )
  }
  | expression '<=' expression {
    $$ = new Relational(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, "<=", $3
    )
  }
  | '(' expression ')' { $$ = $2; }
  | '-' expression %prec UMINUS {
    $$ = new UMenos(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $2
    )
  }
  | STRING_LITERAL {
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