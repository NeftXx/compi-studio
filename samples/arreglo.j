integer[] arreglo = strc integer[9];

void principal() {
  integer contador = 0;
  while(contador < 9) {
    arreglo[contador] = contador * 10;
    contador = contador + 1;
  }
  contador = 0;
  while(contador < 9) {
    print(arreglo[contador]);
    contador = contador + 1;
  }
}
