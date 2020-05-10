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

let buffers = {};

function openBuffer(name, text) {
  buffers[name] = CodeMirror.Doc(text, "jsharp");
  let opt = document.createElement("option");
  opt.appendChild(document.createTextNode(name));
  SELECT_FILE.appendChild(opt);
}

function selectBuffer(editor, name) {
  let buf = buffers[name];
  if (buf) {
    if (buf.getEditor()) buf = buf.linkedDoc({ sharedHist: true });
    let old = editor.swapDoc(buf);
    let linked = old.iterLinkedDocs(function (doc) {
      linked = doc;
    });
    if (linked) {
      for (let name in buffers)
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
  let name = await getNameNewBuffer();
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

let btnNewBuffer = document.getElementById("btnNewBuffer");
btnNewBuffer.addEventListener(
  "click",
  async () => await newBufffer(editorCode)
);

let btnUpFile = document.getElementById("btnUpFile");
btnUpFile.addEventListener("click", async () => {
  const result = await Swal.fire({
    title: "Selecciona tus archivos J#",
    input: "file",
    showCancelButton: true,
    inputAttributes: {
      accept: "*.*",
      multiple: "multiple",
      "aria-label": "Sube tus archivos J#",
    },
  });
  let filesList = result.value;

  if (filesList) {
    const files = [...filesList];
    const length = files.length;
    for (let i = 0; i < length; i++) {
      const reader = new FileReader();
      const name = files[i].name;
      reader.onload = () => {
        openBuffer(name, reader.result);
        selectBuffer(editorCode, name);
        SELECT_FILE.value = name;
        M.FormSelect.init(SELECT_FILE);
      };
      reader.readAsText(files[i]);
    }
    Toast.fire({
      icon: "success",
      title: "¡Tu archivos han sido cargado con éxito!",
    });
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

let btnClearBuffer = document.getElementById("btnClearBuffer");
btnClearBuffer.addEventListener("click", async () => {
  let nameFile = SELECT_FILE.options[SELECT_FILE.selectedIndex].text;
  let buf = buffers[nameFile];
  if (buf) {
    buf.setValue("");
    buf.clearHistory();
  }
});

let btnDeleteBuffer = document.getElementById("btnDeleteBuffer");
btnDeleteBuffer.addEventListener("click", async () => {
  let nameFile = SELECT_FILE.options[SELECT_FILE.selectedIndex].text;
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

let btnClearProject = document.getElementById("btnClearProject");
btnClearProject.addEventListener("click", () => {
  clearProject();
  Toast.fire({
    icon: "success",
    title: "¡Se ha limpiado el proyecto exitosamente!",
  });
});

let btnCreateZip = document.getElementById("btnCreateZip");
btnCreateZip.addEventListener("click", () => {
  let zip = new JSZip();
  for (let key in buffers) {
    zip.file(key, buffers[key].getValue());
  }
  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, "Projecto.zip");
  });
});

function clearProject() {
  buffers = {};
  SELECT_FILE.innerHTML = "";
  init();
}

function init() {
  openBuffer(INIT_FILE, "");
  selectBuffer(editorCode, INIT_FILE);
  M.FormSelect.init(SELECT_FILE);
}

init();
