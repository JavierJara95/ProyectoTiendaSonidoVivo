
import { createContext, useContext, useMemo, useState } from 'react';

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [items, setItems] = useState([]);

  function agregarProducto(producto) {
    const stock = Number(producto.stock) || 0;

    if (stock <= 0) {
      return {
        ok: false,
        mensaje: 'Este producto no tiene stock disponible.',
      };
    }

    const existente = items.find(
      (item) => item.codigo === producto.codigo
    );

    if (existente && existente.cantidad >= stock) {
      return {
        ok: false,
        mensaje: 'Alcanzaste el stock disponible.',
      };
    }

    setItems((actuales) => {
      const encontrado = actuales.find(
        (item) => item.codigo === producto.codigo
      );

      if (encontrado) {
        if (encontrado.cantidad >= stock) return actuales;

        return actuales.map((item) =>
          item.codigo === producto.codigo
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...actuales, { ...producto, cantidad: 1 }];
    });

    return {
      ok: true,
      mensaje: 'Producto agregado al carrito.',
    };
  }

  function cambiarCantidad(codigo, cantidadSolicitada) {
    // Si el campo está vacío, conservamos la cantidad actual.
    if (
      cantidadSolicitada === '' ||
      cantidadSolicitada === null ||
      cantidadSolicitada === undefined
    ) {
      return;
    }

    const cantidad = Number(cantidadSolicitada);

    // Solo permitimos cantidades enteras positivas.
    if (!Number.isInteger(cantidad) || cantidad < 1) {
      return;
    }

    setItems((actuales) =>
      actuales.map((item) => {
        if (item.codigo !== codigo) return item;

        const stock = Number(item.stock) || 0;

        if (stock < 1) return item;

        return {
          ...item,
          cantidad: Math.min(cantidad, stock),
        };
      })
    );
  }

  function eliminarProducto(codigo) {
    setItems((actuales) =>
      actuales.filter((item) => item.codigo !== codigo)
    );
  }

  function vaciarCarrito() {
    setItems([]);
  }

  const totalUnidades = items.reduce(
    (suma, item) => suma + item.cantidad,
    0
  );

  const total = items.reduce((suma, item) => {
    const precio = Number(item.precio);

    if (!Number.isFinite(precio)) return suma;

    return suma + precio * item.cantidad;
  }, 0);

  const valor = useMemo(
    () => ({
      items,
      totalUnidades,
      total,
      agregarProducto,
      cambiarCantidad,
      eliminarProducto,
      vaciarCarrito,
    }),
    [items, totalUnidades, total]
  );

  return (
    <CarritoContext.Provider value={valor}>
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const contexto = useContext(CarritoContext);

  if (!contexto) {
    throw new Error(
      'useCarrito debe utilizarse dentro de CarritoProvider.'
    );
  }

  return contexto;
}
