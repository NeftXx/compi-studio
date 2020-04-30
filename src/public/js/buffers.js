const INIT_FILE = "Temporal201504420.j";
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});
const SELECT_FILE = document.getElementById("currentFile");

var buffers = {};

function openBuffer(name, text) {
  buffers[name] = CodeMirror.Doc(text, "jsharp");
  var opt = document.createElement("option");
  opt.appendChild(document.createTextNode(name));
  SELECT_FILE.appendChild(opt);
}

function selectBuffer(editor, name) {
  var buf = buffers[name];
  if (buf) {
    if (buf.getEditor()) buf = buf.linkedDoc({ sharedHist: true });
    var old = editor.swapDoc(buf);
    var linked = old.iterLinkedDocs(function (doc) {
      linked = doc;
    });
    if (linked) {
      for (var name in buffers)
        if (buffers[name] == old) buffers[name] = linked;
      old.unlinkDoc(linked);
    }
    editor.focus();
  }
}

async function getNameNewBuffer() {
  const result = await Swal.fire({
    title: "Escribe el nombre del nuevo archivo.",
    input: "text",
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return "Necesitas escribir algo!";
      }
    },
    footer: "Nota: el nombre no debe contener alguna extension.",
  });
  return result.value;
}

async function newBufffer(editor) {
  var name = await getNameNewBuffer();
  if (name == null) return;
  name = name + ".j";
  if (buffers.hasOwnProperty(name)) {
    await Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Ya hay un archivo con ese nombre.",
    });
    return;
  }
  openBuffer(name, "");
  selectBuffer(editor, name);
  SELECT_FILE.value = name;
  M.FormSelect.init(SELECT_FILE);
  Toast.fire({
    icon: "success",
    title: "¡Tu archivo ha sido creado con éxito!",
  });
}

CodeMirror.on(SELECT_FILE, "change", () => {
  selectBuffer(
    editorCode,
    SELECT_FILE.options[SELECT_FILE.selectedIndex].value
  );
});

openBuffer(INIT_FILE, "");
selectBuffer(editorCode, INIT_FILE);
M.FormSelect.init(SELECT_FILE);

var btnNewBuffer = document.getElementById("btnNewBuffer");
btnNewBuffer.addEventListener(
  "click",
  async () => await newBufffer(editorCode)
);
var btnUpFile = document.getElementById("btnUpFile");
btnUpFile.addEventListener("click", async () => {
  const result = await Swal.fire({
    title: "Selecciona tu archivo J#",
    input: "file",
    showCancelButton: true,
    inputAttributes: {
      accept: "*.*",
      "aria-label": "Sube tu archivo J#",
    },
  });
  let file = result.value;

  if (file) {
    const name = file.name;
    const reader = new FileReader();
    reader.onload = () => {
      Toast.fire({
        icon: "success",
        title: "¡Tu archivo ha sido cargado con éxito!",
      });
      openBuffer(name, reader.result);
      selectBuffer(editorCode, name);
      SELECT_FILE.value = name;
      M.FormSelect.init(SELECT_FILE);
    };
    reader.readAsText(file);
  }
});

async function getWarning(confirmText) {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: confirmText,
    cancelButtonText: "Cancelar",
  });
  return result;
}

var btnClearBuffer = document.getElementById("btnClearBuffer");
btnClearBuffer.addEventListener("click", async () => {
  var nameFile = SELECT_FILE.options[SELECT_FILE.selectedIndex].text;
  var buf = buffers[nameFile];
  if (buf) {
    buf.setValue("");
    buf.clearHistory();
  }
});

var btnDeleteBuffer = document.getElementById("btnDeleteBuffer");
btnDeleteBuffer.addEventListener("click", async () => {
  var nameFile = SELECT_FILE.options[SELECT_FILE.selectedIndex].text;
  if (nameFile !== INIT_FILE) {
    const res = await getWarning("¡Si, deseo borrar el archivo!");
    if (res) {
      delete buffers[nameFile];
      SELECT_FILE.remove(SELECT_FILE.selectedIndex);
      M.FormSelect.init(SELECT_FILE);
      Toast.fire({
        icon: "success",
        title: "¡Tu archivo " + nameFile + " ha sido eliminado con éxito!",
      });
    }
  } else {
    Toast.fire({
      icon: "error",
      title: "¡El archivo " + nameFile + " no se puede eliminar.!",
    });
  }
});
