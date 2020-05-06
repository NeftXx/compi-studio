/**
  * Name: Lexer
  * Author: Ronald Berdúo
  */
EndOfLine             \r|\n|\r\n
Identifier            [a-zA-Z_][_a-zA-Z0-9ñÑ]*
IntegerLiteral        [0-9]+
DoubleLiteral         [0-9]+(\.[0-9]+)
BooleanLiteral        "true"|"false"
NullLiteral           "null"
File                  [a-zA-Z0-9_-]+(\.[A-Za-z0-9]+)+(\.[j])


%x END_OF_LINE_COMMENT
%x TRADITIONAL_COMMENT
%x STRING
%x CHAR

%options case-insensitive

%%
/* Blanks */
\s+                               { /* Ignore blank spaces */ }

/* Comments */
"/*"                              { this.pushState("TRADITIONAL_COMMENT"); }
<TRADITIONAL_COMMENT>"*/"         { this.popState(); }
<TRADITIONAL_COMMENT><<EOF>>      { this.popState(); }
<TRADITIONAL_COMMENT>[^]          { /* Ignore anything */ }
"//"                              { this.pushState("END_OF_LINE_COMMENT"); }
<END_OF_LINE_COMMENT>{EndOfLine}  { this.popState(); }
<END_OF_LINE_COMMENT>.            { /* Ignore */ }

/* Keywords */
"import"                          { return "import"; }
"switch"                          { return "switch"; }
"continue"                        { return "continue"; }
"private"                         { return "private"; }
"define"                          { return "define"; }
"try"                             { return "try"; }
"integer"                         { return "integer"; }
"var"                             { return "var"; }
"case"                            { return "case"; }
"return"                          { return "return"; }
"void"                            { return "void"; }
"as"                              { return "as"; }
"catch"                           { return "catch"; }
"double"                          { return "double"; }
"const"                           { return "const"; }
"if"                              { return "if"; }
"default"                         { return "default"; }
"print"                           { return "print"; }
"for"                             { return "for"; }
"strc"                            { return "strc"; }
"throw"                           { return "throw"; }
"char"                            { return "char"; }
"global"                          { return "global"; }
"else"                            { return "else"; }
"break"                           { return "break"; }
"public"                          { return "public"; }
"while"                           { return "while"; }
"do"                              { return "do"; }
"boolean"                         { return "boolean"; }

/* Literals */
{BooleanLiteral}                  { return "BOOLEAN_LITERAL";   }
{DoubleLiteral}                   { return "DOUBLE_LITERAL";    }
{IntegerLiteral}                  { return "INTEGER_LITERAL";   }
\'                                { stringBuilder.length = 0; this.begin("CHAR");   }
<CHAR>\'                          {
                                    this.popState(); yytext = stringBuilder.join("");
                                    return "CHAR_LITERAL";
                                  }
<CHAR>"\\\'"                      { stringBuilder.push("'");   }
<CHAR>"\\\""                      { stringBuilder.push("\"");   }
<CHAR>"\\\\"                      { stringBuilder.push("\\");   }
<CHAR>"\\n"                       { stringBuilder.push("\n");   }
<CHAR>"\\r"                       { stringBuilder.push("\r");   }
<CHAR>"\\v"                       { stringBuilder.push("\t");   }
<CHAR>\\.                         { stringBuilder.push(yytext); }
<CHAR>{EndOfLine}                 {
                                    this.popState();
                                    return "ILLEGAL_CHARACTER";
                                  }
<CHAR>[^\r\n\"\'\\]+              { stringBuilder.push(yytext); }
\"                                { stringBuilder.length = 0; this.begin("STRING"); }
<STRING>\"                        {
                                    this.popState(); yytext = stringBuilder.join("");
                                    return "STRING_LITERAL";
                                  }
<STRING>"\\\""                    { stringBuilder.push("\"");   }
<STRING>"\\\\"                    { stringBuilder.push("\\");   }
<STRING>"\\n"                     { stringBuilder.push("\n");   }
<STRING>"\\r"                     { stringBuilder.push("\r");   }
<STRING>"\\t"                     { stringBuilder.push("\t");   }
<STRING>\\.                       { stringBuilder.push(yytext); }
<STRING>{EndOfLine}               {
                                    this.popState();
                                    return "ILLEGAL_CHARACTER";
                                  }
<STRING>[^\r\n\"\\]+              { stringBuilder.push(yytext); }

/* File */
{File}                            { return "FILE"; }

/* Names */
{Identifier}                      { return "IDENTIFIER"; }


/* Separators */
"^^"                              { return "^^"; }
"++"                              { return "++"; }
"--"                              { return "--"; }
"!="                              { return "!="; }
"=="                              { return "=="; }
">="                              { return ">="; }
"<="                              { return "<="; }
"&&"                              { return "&&"; }
"||"                              { return "||"; }
":="                              { return ":="; }
"+"                               { return "+"; }
"-"                               { return "-"; }
"*"                               { return "*"; }
"/"                               { return "/"; }
"%"                               { return "%"; }
"="                               { return "="; }
">"                               { return ">"; }
"<"                               { return "<"; }
"?"                               { return "?"; }
":"                               { return ":"; }
"^"                               { return "^"; }
"!"                               { return "!"; }
"("                               { return "("; }
")"                               { return ")"; }
"["                               { return "["; }
"]"                               { return "]"; }
"{"                               { return "{"; }
"}"                               { return "}"; }
","                               { return ","; }
"?"                               { return "?"; }
":"                               { return ":"; }
";"                               { return ";"; }
"."                               { return "."; }

<<EOF>>                           { return "EOF"; }
.                                 { return yytext; }

%%
let stringBuilder = [];