define NodoAVL as [
  integer valor,
  NodoAVL izq,
  NodoAVL der,
  integer altura
];

define ArbolAVL as [
  NodoAVL raiz
];

String getDot(ArbolAVL arbol) {
  return "digraph grafica{\nrankdir=TB;\nnode [shape = record, style=filled, fillcolor=seashell2];\n" + getDotNodosInternos(arbol.raiz) + "}\n";
}

String getDotNodosInternos(NodoAVL nodo) {
  String etiqueta = "";
  if (nodo.izq == null && nodo.der == null) {
    etiqueta = "nodo" + nodo.valor + " [ label =\"" + nodo.valor + "\"];\n";
  } else {
    etiqueta = "nodo" + nodo.valor + " [ label =\"<C0>|" + nodo.valor + "|<C1>\"];\n";
  }

  if (nodo.izq != null) {
    etiqueta = etiqueta + getDotNodosInternos(nodo.izq) +
      "nodo" + nodo.valor + ":C0->nodo" + nodo.izq.valor + "\n";
  }

  if (nodo.der != null) {
    etiqueta = etiqueta + getDotNodosInternos(nodo.der) +
      "nodo" + nodo.valor + ":C1->nodo" + nodo.der.valor + "\n";
  }
  return etiqueta;
}

void insertar(ArbolAVL arbol, integer valor) {
  arbol.raiz = insertar(arbol.raiz, valor);
}

NodoAVL insertar(NodoAVL nodo, integer valor) {
  if (nodo == null) {
    nodo = strc NodoAVL();
    nodo.valor = valor;
  } else if (valor < nodo.valor) {
    nodo.izq = insertar(nodo.izq, valor);
    if (altura(nodo.der) - altura(nodo.izq) == -2) {
      if (valor < nodo.izq.valor) {
        nodo = IzquierdaIzquierda(nodo);
      } else {
        nodo = IzquierdaDerecha(nodo);
      }
    }
  } else if (valor > nodo.valor) {
    nodo.der = insertar(nodo.der, valor);
    if (altura(nodo.der) - altura(nodo.izq) == 2) {
      if (valor > nodo.der.valor) {
        nodo = DerechaDerecha(nodo);
      } else {
        nodo = DerechaIzquierda(nodo);
      }
    }
  } else {
    print("No se permiten los valores duplicados: \"" + valor + "\".\n");
  }
  nodo.altura = mayor(altura(nodo.izq), altura(nodo.der)) + 1;
  return nodo;
}

integer altura(NodoAVL nodo) {
  if (nodo == null) {
    return -1;
  }
  return nodo.altura;
}

integer mayor(integer n1, integer n2) {
  if (n1 > n2) {
    return n1;
  }
  return n2;
}

NodoAVL IzquierdaIzquierda(NodoAVL n1) {
  NodoAVL n2 = n1.izq;
  n1.izq = n2.der;
  n2.der = n1;
  n1.altura = mayor(altura(n1.izq), altura(n1.der)) + 1;
  n2.altura = mayor(altura(n2.izq), n1.altura) + 1;
  return n2;
}

NodoAVL DerechaDerecha(NodoAVL n1) {
  NodoAVL n2 = n1.der;
  n1.der = n2.izq;
  n2.izq = n1;
  n1.altura = mayor(altura(n1.izq), altura(n1.der)) + 1;
  n1.altura = mayor(altura(n2.der), n1.altura) + 1;
  return n2;
}

NodoAVL IzquierdaDerecha(NodoAVL n1) {
  n1.izq = DerechaDerecha(n1.izq);
  return IzquierdaIzquierda(n1);
}

NodoAVL DerechaIzquierda(NodoAVL n1) {
  n1.der = IzquierdaIzquierda(n1.der);
  return DerechaDerecha(n1);
}

void principal() {  
  ArbolAVL arbol_numeros = strc ArbolAVL();
  insertar(arbol_numeros, 12);
  insertar(arbol_numeros, 5);
  insertar(arbol_numeros, 26);
  insertar(arbol_numeros, 33);
  insertar(arbol_numeros, 59);
  insertar(arbol_numeros, 27);
  insertar(arbol_numeros, 15);
  insertar(arbol_numeros, 47);
  insertar(arbol_numeros, 74);
  insertar(arbol_numeros, 84);
  insertar(arbol_numeros, 88);
  insertar(arbol_numeros, 90);
  insertar(arbol_numeros, 124);
  insertar(arbol_numeros, 612);
  insertar(arbol_numeros, 613);
  print(getDot(arbol_numeros));
}
