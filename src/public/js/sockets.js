var socket = io();

const errorTable = document.getElementById("body-errors-table");
const symbols = document.getElementById("body-symbols-table");
const astVisor = document.getElementById("ast-visor");
var viz = new Viz();

function createMermaid(text) {
  var div = document.createElement("div");
  div.setAttribute("class", "card");
  astVisor.appendChild(div);
  viz
    .renderSVGElement(text)
    .then(function (element) {
      div.appendChild(element);
    })
    .catch((error) => {
      viz = new Viz();
      console.error(error);
    });
}

socket.on("translateResult", function (result) {
  errorTable.innerHTML = result.errorsTable;
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

socket.on("astgraphsResult", function (result) {
  astVisor.innerHTML = "";
  errorTable.innerHTML = result.errorsTable;
  result.astGraphs.forEach((element) => {
    createMermaid(element);
  });
});

socket.on("optimizedCode", function (result) {});

var btnAst = document.getElementById("btnAst");
btnAst.addEventListener("click", () => {
  var filesData = [];
  for (const prop in buffers) {
    filesData.push({ filename: prop, content: buffers[prop].getValue() });
  }
  socket.emit("astgraphs", filesData);
});

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
