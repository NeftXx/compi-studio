void principal() {
  /**
    * Funcion factorial: Entrada 5
    */
  print("\n======================= FACTORIAL ======================\n");
  integer numero = 5;
  print("El factorial del numero " + numero + " es: " + factorial(numero));
  print('\n');
  /**
    * Funcion potencia: Entrada: base = 2, exponente = 5.
    */
  print("\n======================= POTENCIA =======================\n");
  integer base = 2;
  integer exponente = 5;
  print("El numero " + base + " elevado a la " + exponente + " potencia es: " + potencia(base, exponente));
  print("\n================= RECURSIVIDAD MULTIPLE =================\n");
  /**
    * Funcion Hanoi, resuelve el problema de La Torres de Hanoi.
    */
  print("\n============ HANOI ============\n");
  integer discos = 3;
  integer origen = 1;
  integer auxiliar = 2;
  integer destino = 3;
  print("Solucion al problema de torres de Hanoi para n = " + discos);
  print('\n');
  hanoi(discos, origen, auxiliar, destino);
  /**
    * Funcion Hoftadter.
    */
  print("\n================= RECURSIVIDAD CRUZADA");
  print("\n===== Generar funciones Hoftadter\n");
  integer i = 0;
  print("\n== Femenina: \n");
  while(i < 10) {
    print(hofstaderFemenina(i));
    print('\n');
    i = i + 1;
  }
  print("\n== Masculina: \n");
  i = 0;
  while (i < 10) {
    print(hofstaderMasculino(i));
    print('\n');
    i = i + 1;
  }

  /**
    * Funciones Par e Impar.
    */
  print("\n===== Determinar la paridad de dos numeros\n");
  integer a = 17;
  integer b = 68;
  integer res = par(a);
  print("== El numero " + a + " es: ");  
  if (res == 1) {
    print("par");
  } else {
    print("impar");
  }
  print('\n');
  res = impar(b);
  print("== El numero " + b + " es: ");
  if (res == 0) {
    print("par");
  } else {
    print("impar");
  }
  print("\n========== RECURSIVIDAD ANIDADA ==========\n");
  integer m = 3;
  integer n = 7;
  print("Funcion de Ackermann (" + m + ", " + n + ") = " + ackermann(m, n));  
}

integer factorial(integer n) {
  if (n <= 0){
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

integer potencia(integer base, integer exp) {
  if (exp == 0) {
    return 1;
  }
  return base * potencia(base, exp - 1);
}

void hanoi(integer discos, integer origen, integer auxiliar, integer destino) {
  if (discos == 1) {
    print("mover disco de " + origen + " a " + destino);
    print('\n');
  } else {
    hanoi(discos - 1, origen, destino, auxiliar);
    print("mover disco de " + origen + " a " + destino);
    print('\n');
    hanoi(discos - 1, auxiliar, origen, destino);
  }
}

integer hofstaderFemenina(integer n) {
  if (n < 0) {
    return 0;
  } else {
    if (n == 0) {
      return 1;
    }
    return n - hofstaderFemenina(n - 1);
  }
}

integer hofstaderMasculino(integer n) {
  if (n < 0) {
    return 0;
  } else {
    if (n == 0) {
      return 0;
    }
    return n - hofstaderMasculino(n - 1);
  }
}

integer par(integer nump) {
  if (nump == 0) {
    return 1;
  }
  return impar(nump - 1);
}

integer impar(integer numi) {
  if (numi == 0) {
    return 0;
  }
  return par(numi - 1);
}

integer ackermann(integer m, integer n) {
  if (m == 0) {
    return n + 1;
  }
	if (n == 0) {
    return ackermann(m - 1, 1);
  }
	return ackermann(m - 1, ackermann(m, n - 1));
}
