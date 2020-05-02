var socket = io();

socket.on("translateResult", function (result) {
  document.getElementById("body-errors-table").innerHTML = result.errorsTable;
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

var btnSendFiles = document.getElementById("btnSendFiles");
btnSendFiles.addEventListener("click", () => {
  var filesData = [];
  for (const prop in buffers) {
    filesData.push({ filename: prop, content: buffers[prop].getValue() });
  }
  socket.emit("filesData", filesData);
});
