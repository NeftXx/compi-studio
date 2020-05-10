define Nodo as [
  integer dato,
  Nodo sig
];

define Lista as [
  Nodo inicio,
  integer tam
];

void principal() {
  Lista lista = strc Lista();
  integer contador = 0;
  while(contador < 10) {
    Nodo nuevo = strc Nodo();
    nuevo.dato = (contador + 1) * 10;
    nuevo.sig = lista.inicio;
    lista.inicio = nuevo;
    lista.tam = lista.tam + 1;
    contador = contador + 1;
  }
}
