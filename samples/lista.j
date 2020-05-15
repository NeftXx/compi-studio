define Nodo as [
  integer dato,
  Nodo sig
];

define Lista as [
  Nodo inicio,
  integer tam
];

void insertar(Lista lista, integer dato) {
  Nodo nuevo = strc Nodo();
  nuevo.dato = dato;
  nuevo.sig = lista.inicio;
  lista.inicio = nuevo;
}

void imprimirLista(Lista lista) {
  Nodo temp = lista.inicio;
  while(temp != null) {
    print(temp.dato);
    print(" -> ");
    temp = temp.sig;
  }
  print("null\n");
}

void principal() {
  print("================= LISTA SIMPLE =================\n");
  Lista lista = strc Lista();
  insertar(lista, 10);
  insertar(lista, 20);
  insertar(lista, 30);
  insertar(lista, 1);
  insertar(lista, 40);
  insertar(lista, 56);
  // 56 -> 40 -> 1 -> 30 -> 20 -> 10
  imprimirLista(lista);
}