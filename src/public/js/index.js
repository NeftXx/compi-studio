$(document).ready(function () {
  $("ul.tabs").tabs({
    swipeable: false,
    responsiveThreshold: Infinity,
  });
});

var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  mode: "jsharp",
  tabSize: 2,
  theme: "eclipse",
  lineNumbers: true,
  lineWrapping: true,
  styleActiveLine: true,
  styleActiveSelected: true,
  styleSelectedText: true,
  autoCloseBrackets: true,
  matchBrackets: true,
  showCursorWhenSelecting: true,
});

var editorCd3 = CodeMirror.fromTextArea(document.getElementById("editor-cd3"), {
  mode: "cd3",
  tabSize: 2,
  theme: "eclipse",
  lineNumbers: true,
  lineWrapping: true,
  styleActiveLine: true,
  styleActiveSelected: true,
  styleSelectedText: true,
  autoCloseBrackets: true,
  matchBrackets: true,
  showCursorWhenSelecting: true,
});

var console = CodeMirror.fromTextArea(document.getElementById("console"), {
  mode: "console",
  theme: "darcula",
  lineNumbers: true,
  lineWrapping: true,
  styleActiveLine: true,
  readOnly: "nocursor",
});
