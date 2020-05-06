/**
  * Name: Parser
  * Author: Ronald Berdúo
  */
%{
  const { default: Ast } = require("../ast/ast");  
  const { default: NodeInfo } = require("../scope/node_info");
  const { default: ImportStm } = require("../ast/statement/import");
  const { default: Print } = require("../ast/statement/print");
  const { default: Identifier } = require("../ast/expression/identifier");
  const { default: Arithmetic } = require("../ast/expression/arithmetic");
  const { default: Relational } = require("../ast/expression/relational");
  const { default: Comparator } = require("../ast/expression/comparator");
  const { default: Cast } = require("../ast/expression/cast");
  const { default: And } = require("../ast/expression/and");
  const { default: Or } = require("../ast/expression/or");
  const { default: Xor } = require("../ast/expression/xor");
  const { default: Not } = require("../ast/expression/not");
  const { default: UMenos } = require("../ast/expression/umenos");
  const { default: Literal } = require("../ast/expression/literal");
  const { default: FunctionStm } = require("../ast/statement/function");
  const { default: ParameterStm } = require("../ast/statement/parameter");
  const { default: BlockStm } = require("../ast/statement/block");
  const { default: IfStm } = require("../ast/statement/if_statement");
  const { default: SubIf } = require("../ast/statement/sub_if");
  const { default: WhileStm } = require("../ast/statement/while");
  const { default: DoWhileStm } = require("../ast/statement/do_while");
  const { default: AccessAttribute } = require("../ast/expression/access_attribute");
  const { StructDeclaration } = require("../ast/expression/struct_declaration");
  const { Structure, Attribute } = require("../ast/statement/structure");
  const {
    VarDeclaration,
    VarDeclarationGlobal,
    VarDeclarationType,
  } = require("../ast/statement/variable_declaration");
%}

%start compilation_unit

%right '='
%right '?' ':'
%left '++' '--'
%left '||'
%left '&&'
%left '^'
%left '!=' '=='
%nonassoc '>=' '>' '<=' '<'
%left '+' '-'
%left '*' '/' '%'
%right '^^'
%right UMINUS NOT
%left '(' ')' '.' '[' ']'

%% /* language grammar */

compilation_unit
  : import_statement global_statements_list EOF {
    return new Ast($2, yy.filename, $1);
  }
  | global_statements_list EOF {
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
  : global_statements_list global_statement {
    $$ = $1;
    if ($2) $$.push($2);
  }
  | global_statement {
    $$ = [];
    if ($1) $$.push($1);
  }
;

global_statement
  : function_statement { $$ = $1; }
  | variable_declaration { $$ = $1; }
  | struct_definition { $$ = $1; }
  | variable_declaration ';' { $$ = $1; }
;

function_statement
  : type IDENTIFIER '(' parameter_list ')' block {
    $$ = new FunctionStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, $2, $4, $6
    );
  }
  | type IDENTIFIER '(' ')' block {
    $$ = new FunctionStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, $2, [], $5
    );
  }
  | 'void' IDENTIFIER '(' parameter_list ')' block {
    $$ = new FunctionStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), yy.typeFactory.getVoid(), $2, $4, $6
    );
  }
  | 'void' IDENTIFIER '(' ')' block {
    $$ = new FunctionStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), yy.typeFactory.getVoid(), $2, [], $5
    );
  }
;

type
  : primitive_type { $$ = $1; }
  | reference_type { $$ = $1; }
  | array_type
;

primitive_type
  : 'integer' { $$ = yy.typeFactory.getInteger(); }
  | 'double'  { $$ = yy.typeFactory.getDouble();  }
  | 'char'    { $$ = yy.typeFactory.getChar();    }
  | 'boolean' { $$ = yy.typeFactory.getBoolean(); }
;

reference_type
  : IDENTIFIER { $$ = yy.typeFactory.createNewStructure(yy.filename, $1); }
;

array_type
  : array_type '[' ']'
  | primitive_type '[' ']'
  | reference_type '[' ']'
;

parameter_list
  : parameter_list ',' parameter { $$ = $1; $$.push($3); }
  | parameter { $$ = [$1]; }
;

parameter
  : type IDENTIFIER {
    $$ = new ParameterStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, $2
    );
  }
;

block
  : '{' block_statement '}' {
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

block_statement
  : block_statement statement {
    $$ = $1;
    if ($2) $$.push($2);
  }
  | statement {
    $$ = [];
    if ($1) $$.push($1);
  }
;

statement
  : print_statement { $$ = $1; }
  | if_statement { $$ = $1; }
  | while_statement { $$ = $1; }
  | do_while_statement { $$ = $1; }
  | variable_declaration { $$ = $1; }
  | struct_definition { $$ = $1; }
  | variable_declaration ';' { $$ = $1; }
;

struct_definition
  : 'define' IDENTIFIER 'as' '[' attribute_list ']' {
    $$ = new Structure(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $2, $5
    );
  }
  | 'define' IDENTIFIER 'as' '[' attribute_list ']' ';' {
    $$ = new Structure(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $2, $5
    );
  }
;

struct_declaration
  : 'strc' IDENTIFIER list_cor
  | 'strc' IDENTIFIER '(' ')' {
    $$ = new StructDeclaration(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $2
    );
  }
;

list_cor
  : list_cor '[' ']'
  | '[' ']'
;

attribute_list
  : attribute_list ',' attribute { $$ = $1; $$.push($3); }
  | attribute { $$ = [$1]; }
;

attribute
  : type IDENTIFIER {
    $$ = new Attribute(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, $2
    );
  }
  | type IDENTIFIER '=' expression {
    $$ = new Attribute(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, $2, $4
    );
  }
;

variable_declaration
  : type id_list '=' expression {
    $$ = new VarDeclarationType(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, $2, $4
    );
  }
  | 'var' IDENTIFIER ':=' expression {
    $$ = new VarDeclaration(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), false, $2, $4
    );
  }
  | 'const' IDENTIFIER ':=' expression {
    $$ = new VarDeclaration(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), true, $2, $4
    );
  }
  | 'global' IDENTIFIER ':=' expression {
    $$ = new VarDeclarationGlobal(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $2, $4
    );
  }
  | type id_list {
    $$ = new VarDeclarationType(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, $2
    );
  }
;

id_list
  : id_list ',' IDENTIFIER { $$ = $1; $$.push($3); }
  | IDENTIFIER { $$ = [$1]; }
;

do_while_statement
  : 'do' block 'while' '(' expression ')' {
    $$ = new DoWhileStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $2, $5
    );
  }
  | 'do' block 'while' '(' expression ')' ';' {
    $$ = new DoWhileStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $2, $5
    );
  }
;

while_statement
  : 'while' '(' expression ')' block {
    $$ = new WhileStm(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $3, $5
    );
  }
;

if_statement
  : if_list 'else' block {
    $1.push(new SubIf(
      new NodeInfo(
        yy.filename, @1.first_line, @1.first_column
      ), $3));
    $$ = new IfStm(
        new NodeInfo(yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1), $1
      );
  }
  | if_list {
    $$ = new IfStm(
        new NodeInfo(yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1), $1
      );
  }
;

if_list
  : if_list 'else' 'if' '(' expression ')' block {
    $$ = $1;
    $$.push(new SubIf(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $7, $5));
  }
  | 'if' '(' expression ')' block {
    $$ = [new SubIf(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $5, $3)];
  }
;

print_statement
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
  | expression '||' expression {
    $$ = new Or(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, $3
    );
  }
  | expression '^' expression {
    $$ = new Xor(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, $3
    );
  }
  | '!' expression %prec NOT {
    $$ = new Not(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $2
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
  | expression '==' expression {
    $$ = new Comparator(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, "==", $3
    )
  }
  | expression '!=' expression {
    $$ = new Comparator(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, "!=", $3
    )
  }
  | '(' primitive_type ')' expression {
    $$ = new Cast(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $2, $4
    );
  }
  | '(' expression ')' { $$ = $2; }
  | expression '.' IDENTIFIER {
    $$ = new AccessAttribute(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1, $3
    );
  }
  | '-' expression %prec UMINUS {
    $$ = new UMenos(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $2
    )
  }
  | struct_declaration { $$ = $1; }
  | CHAR_LITERAL {
    $$ = new Literal(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), yy.typeFactory.getChar(), $1
    );
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
    $$ = new Identifier(
      new NodeInfo(
        yy.filename, yylineno + 1, yy.lexer.yylloc.first_column + 1
      ), $1
    );
  }
;