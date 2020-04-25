var socket = io();


socket.on("translateResult", function (result) {
  document.getElementById("body-errors-table").innerHTML = result.errorsTable;
  document.getElementById("body-symbols-table").innerHTML = result.symbolsTable;
  resultC3D.setValue(result.translate);
});

var btnSendFiles = document.getElementById("btnSendFiles");
btnSendFiles.addEventListener("click", () => {
  var filesData = [];
  for (const prop in buffers) {
    filesData.push({ filename: prop, content: buffers[prop].getValue() })
  }
  socket.emit("filesData", filesData);
}); 