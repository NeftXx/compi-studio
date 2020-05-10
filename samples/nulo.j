define Nodo as [
  integer dato,
  Nodo sig
];

void principal() {
  Nodo nuevo = strc Nodo();
  if (nuevo == null) {
    print("HOLA es nulo");
  } else {
    print("No es nulo")
  }
}