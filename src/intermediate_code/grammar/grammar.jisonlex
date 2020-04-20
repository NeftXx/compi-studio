number        [0-9]+("."[0-9]+)?
char_terminal "c"|"i"|"d"
label         "L"[0-9]+
id            [a-zA-Z][_a-zA-Z0-9ñÑ]+

%options case-insensitive

%%
\s+                                   /* skip whitespace */
\n                                    /* skip newline */
[#][*][^*]*[*]+([^*#][^*]*[*]+)*[#]   /* skip long commentar */
"#".*                                 /* skip comment */
"\""                                  { return 'DOUBLE_QUOTE' }
"!="                                  { return "<>";            }
"=="                                  { return "==";            }
">="                                  { return ">=";            }
"<="                                  { return "<=";            }
">"                                   { return ">";             }
"<"                                   { return "<";             }
"+"                                   { return "+";             }
"-"                                   { return "-";             }
"*"                                   { return "*";             }
"/"                                   { return "/";             }
"%"                                   { return "%";             }
":"                                   { return ":";             }
","                                   { return ",";             }
"["                                   { return "[";             }
"]"                                   { return "]";             }
"("                                   { return "(";             }
")"                                   { return ")";             }
"{"                                   { return "{";             }
"}"                                   { return "}";             }
"="                                   { return "=";             }
"var"                                 { return "var";           }
"proc"                                { return "proc";          }
"begin"                               { return "begin";         }
"end"                                 { return "end";           }
"call"                                { return "call";          }
"print"                               { return "print";         }
"goto"                                { return "goto";          }
"if"                                  { return "if";            }
{number}                              { return "NUMBER";        }
{label}                               { return "LABEL";         }
{id}                                  { return "ID";            }
{char_terminal}                       { return "CHAR_TERMINAL"; }
<<EOF>>                               { return "EOF";           }
