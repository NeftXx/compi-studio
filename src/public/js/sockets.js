var socket = io();

socket.on("translateResult", function (result) {
  document.getElementById("body-errors-table").innerHTML = result.errorsTable;
  var symbols = document.getElementById("body-symbols-table");
  symbols.innerHTML = result.symbolsTable;
  $(document).ready(function () {
    $(".collapsible").collapsible();
  });

  resultC3D.setValue(result.translate);
  if (result.isError) {
    Toast.fire({
      icon: "error",
      title: "Ha ocurrido un error al traducir tu proyecto.",
    });
  } else {
    Toast.fire({
      icon: "success",
      title: "Se ha obtenido la traduccion de tu proyecto exitosamente.",
    });
  }
});

socket.on("optimizedCode", function (result) {});

var btnSendFiles = document.getElementById("btnSendFiles");
btnSendFiles.addEventListener("click", () => {
  var filesData = [];
  for (const prop in buffers) {
    filesData.push({ filename: prop, content: buffers[prop].getValue() });
  }
  socket.emit("filesData", filesData);
});

var btnOptimization = document.getElementById("btnOptimization");
btnOptimization.addEventListener("click", () => {
  socket.emit("optimization", editorCd3.getValue());
});

var btnGetTra = document.getElementById("btnGetTra");
btnGetTra.addEventListener("click", () => {
  editorCd3.setValue(resultC3D.getValue());
});
