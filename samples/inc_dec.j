define Nodo as [
  integer numero = 99
];

void principal() {
  integer id = 90;
  print(id++); // 90
  print('\n');
  print(id); // 91
  Nodo nodo = strc Nodo();
  print(nodo.numero++); // 99
  print('\n');
  print(nodo.numero); // 100
  integer[] arreglo = strc integer[9];
  arreglo[6] = nodo.numero--; // 100
  arreglo[7] = id; // 91
  // 100 + 91 = 191
  print(arreglo[6]-- + arreglo[7]++);
  print('\n');
  // 99
  print(arreglo[6]);
  print('\n');
  // 92
  print(arreglo[7]);
}