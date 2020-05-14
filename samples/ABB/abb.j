define NodoABB as [
  integer valor,
  NodoABB izq,
  NodoABB der
];

define ABB as [
  NodoABB raiz
];


void insertarNodo(NodoABB nodo, integer val) {
  if (val < nodo.valor) {
    if (nodo.izq == null) {
      nodo.izq = strc NodoABB();
      nodo.izq.valor = val;
    } else {
      insertarNodo(nodo.izq, val);
    }
  } else if (val > nodo.valor) {
    if (nodo.der == null) {
      nodo.der = strc NodoABB();
      nodo.der.valor = val;
    } else {
      insertarNodo(nodo.der, val);
    }
  } else {
    print("No se permiten los valores duplicados: \"" + val + "\".\n");
  }
}

void insertarNodo(ABB arbol, integer val) {
  if (arbol.raiz == null) {
    arbol.raiz = strc NodoABB();
    arbol.raiz.valor = val;
  } else {
    insertarNodo(arbol.raiz, val);
  }
}

void inorden(ABB arbol) {
  print("InOrden:\n");
  inorden(arbol.raiz);
  print('\n');
}

void inorden(NodoABB nodo) {
  if (nodo == null) {
    return;
  }
  inorden(nodo.izq);
  print(nodo.valor + ",");
  inorden(nodo.der);
}

void preorden(ABB arbol) {
  print("PreOrden:\n");
  preorden(arbol.raiz);
  print('\n');
}

void preorden(NodoABB nodo) {
  if (nodo == null) {
    return;
  }
  print(nodo.valor + ",");
  preorden(nodo.izq);
  preorden(nodo.der);
}

void postorden(ABB arbol) {
  print("PostOrden:\n");
  postorden(arbol.raiz);
  print('\n');
}

void postorden(NodoABB nodo) {
  if (nodo == null) {
    return;
  }
  postorden(nodo.izq);
  postorden(nodo.der);
  print(nodo.valor + ",");
}

NodoABB elemento_minimo(NodoABB raiz) {
  if (raiz.izq == null) {
    return raiz;
  }
  return elemento_minimo(raiz.izq);
}

NodoABB eliminar(NodoABB raiz, integer valor) {
  if (raiz == null) {
    return null;
  }

  if (raiz.valor > valor) {
    raiz.izq = eliminar(raiz.izq, valor);
  } else if (raiz.valor < valor) {
    raiz.der = eliminar(raiz.der, valor);
  } else {
    if (raiz.izq != null && raiz.der != null) {
      NodoABB temp = raiz;
      NodoABB minNodeForRight = elemento_minimo(temp.der);
      raiz.valor = minNodeForRight.valor;
      eliminar(raiz.der, minNodeForRight.valor);
    } else if (raiz.izq != null) {
      raiz = raiz.izq;
    } else if (raiz.der != null) {
      raiz = raiz.der;
    } else {
      raiz = null;
    }
  }
  return raiz;
}

void principal() {
  ABB abb = strc ABB();
  insertarNodo(abb, 12);
  insertarNodo(abb, 5);
  insertarNodo(abb, 26);
  insertarNodo(abb, 33);
  insertarNodo(abb, 59);
  insertarNodo(abb, 27);
  insertarNodo(abb, 15);
  inorden(abb);
  preorden(abb);
  postorden(abb);
}