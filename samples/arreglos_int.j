integer particion(integer[] arreglo, integer bajo, integer alto) {
  integer pivote = arreglo[alto];
  integer i = (bajo - 1);
  for (integer j = bajo; j < alto; j = j + 1) {
    if (arreglo[j] <= pivote) {
      i = i + 1;
      integer temp = arreglo[i];
      arreglo[i] = arreglo[j];
      arreglo[j] = temp;
    }
  }
  integer temp = arreglo[i + 1];
  arreglo[i + 1] = arreglo[alto];
  arreglo[alto] = temp;
  return i + 1;
}

void quickSort(integer[] arreglo, integer bajo, integer alto) {
  if (bajo < alto) {
    integer pi = particion(arreglo, bajo, alto);
    quickSort(arreglo, bajo, pi - 1);
    quickSort(arreglo, pi + 1, alto);
  }
}

void imprimirArreglo(integer[] arreglo, integer length) {
  for (integer i = 0; i < length; i = i + 1) {
    print(arreglo[i]);
  }
  print('\n');
}

void principal() {
  print("=========== Analizando Quicksort ===========\n");
  integer[] arreglo = {2, 1, 3, 5, 4};
  integer[] arreglo_ordenado = {1, 2, 3, 4, 5};
  quickSort(arreglo, 0, 4);
  boolean iguales = true;
  integer size = arreglo_ordenado.length;
  for (integer i = 0; i < size; i = i + 1) {
    if (arreglo[i] != arreglo_ordenado[i]) {
      iguales = false;
    }
  }
  // 1 2 3 4 5
  imprimirArreglo(arreglo, size);
  if (iguales) {
    print("Done.\n");
  } else {
    print("RIP. \n");
  }
}