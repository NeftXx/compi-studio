var divCode = document.getElementById("code");
var divResultC3D = document.getElementById("resultC3D");
var divEditorCD3 = document.getElementById("editor-cd3");
var divConsole = document.getElementById("console");

// CONFIGURACION DE EDITORES
var editorCode = CodeMirror.fromTextArea(divCode, {
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
editorCode.setSize(null, 450);

var resultC3D = CodeMirror.fromTextArea(divResultC3D, {
  mode: "cd3",
  tabSize: 2,
  theme: "darcula",
  lineNumbers: true,
  lineWrapping: true,
  styleActiveLine: true,
  styleActiveSelected: true,
  styleSelectedText: true,
  autoCloseBrackets: true,
  matchBrackets: true,
  showCursorWhenSelecting: true,
});
resultC3D.setSize(null, 450);

var editorCd3 = CodeMirror.fromTextArea(divEditorCD3, {
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
editorCd3.setSize(null, 450);

var editorConsole = CodeMirror.fromTextArea(divConsole, {
  mode: "console",
  theme: "darcula",
  lineNumbers: true,
  lineWrapping: true,
  styleActiveLine: true,
});
editorConsole.setSize(null, 350);

// BOTONES DE DESCARGA
function saveTextAsFile(textToWrite, fileNameToSaveAs) {
  var textFileAsBlob = new Blob([textToWrite], { type: "text/plain" });
  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null) {
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }
  downloadLink.click();
}

var btnDownload = document.getElementById("btnDownloadJSharp");
btnDownload.addEventListener("click", () => {
  var text = editorCode.getValue();
  var sel = document.getElementById("currentFile");
  var nameFile = sel.options[sel.selectedIndex].text;
  saveTextAsFile(text, nameFile);
});

btnDownload = document.getElementById("btnDownloadC3D");
btnDownload.addEventListener("click", () => {
  var text = resultC3D.getValue();
  saveTextAsFile(text, "traduccion.txt");
});

btnDownload = document.getElementById("btnDownloadTranslate");
btnDownload.addEventListener("click", () => {
  var text = editorCd3.getValue();
  saveTextAsFile(text, "traduccion.txt");
});
var btnClearTranslate = document.getElementById("btnClearTranslate");
btnClearTranslate.addEventListener("click", () => {
  document.getElementById("body-errors-table").innerHTML = "";
  document.getElementById("body-symbols-table").innerHTML = "";
  resultC3D.setValue("");
});
