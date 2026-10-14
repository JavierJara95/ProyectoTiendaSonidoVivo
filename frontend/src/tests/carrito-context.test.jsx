import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  CarritoProvider,
  useCarrito,
} from '../context/CarritoContext.jsx';

function crearWrapper() {
  return function Wrapper({ children }) {
    return <CarritoProvider>{children}</CarritoProvider>;
  };
}

const productoPrueba = {
  codigo: 'TEST-001',
  nombre: 'Producto de prueba',
  marca: 'Marca de prueba',
  modelo: 'Modelo de prueba',
  precio: 10000,
  stock: 3,
};

describe('CarritoContext', () => {
  it('comienza con el carrito vacío', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: crearWrapper(),
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalUnidades).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('agrega un producto al carrito', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: crearWrapper(),
    });

    let respuesta;

    act(() => {
      respuesta = result.current.agregarProducto(productoPrueba);
    });

    expect(respuesta.ok).toBe(true);
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].cantidad).toBe(1);
    expect(result.current.totalUnidades).toBe(1);
    expect(result.current.total).toBe(10000);
  });

  it('no permite agregar un producto sin stock', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: crearWrapper(),
    });

    let respuesta;

    act(() => {
      respuesta = result.current.agregarProducto({
        ...productoPrueba,
        stock: 0,
      });
    });

    expect(respuesta.ok).toBe(false);
    expect(respuesta.mensaje).toBe(
      'Este producto no tiene stock disponible.'
    );
    expect(result.current.items).toHaveLength(0);
  });

  it('no permite superar el stock al agregar el mismo producto', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: crearWrapper(),
    });

    act(() => {
      result.current.agregarProducto(productoPrueba);
    });

    act(() => {
      result.current.agregarProducto(productoPrueba);
    });

    act(() => {
      result.current.agregarProducto(productoPrueba);
    });

    let respuesta;

    act(() => {
      respuesta = result.current.agregarProducto(productoPrueba);
    });

    expect(result.current.items[0].cantidad).toBe(3);
    expect(respuesta.ok).toBe(false);
    expect(respuesta.mensaje).toBe('Alcanzaste el stock disponible.');
    expect(result.current.total).toBe(30000);
  });

  it('aumenta la cantidad al agregar nuevamente un producto', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: crearWrapper(),
    });

    act(() => {
      result.current.agregarProducto(productoPrueba);
    });

    act(() => {
      result.current.agregarProducto(productoPrueba);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].cantidad).toBe(2);
    expect(result.current.totalUnidades).toBe(2);
    expect(result.current.total).toBe(20000);
  });

  it('limita la cantidad solicitada al stock disponible', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: crearWrapper(),
    });

    act(() => {
      result.current.agregarProducto(productoPrueba);
    });

    act(() => {
      result.current.cambiarCantidad('TEST-001', 10);
    });

    expect(result.current.items[0].cantidad).toBe(3);
    expect(result.current.total).toBe(30000);
  });

  it('ignora una cantidad vacía y conserva la cantidad actual', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: crearWrapper(),
    });

    act(() => {
      result.current.agregarProducto(productoPrueba);
    });

    act(() => {
      result.current.cambiarCantidad('TEST-001', '');
    });

    expect(result.current.items[0].cantidad).toBe(1);
  });

  it.each([null, undefined])(
    'ignora la cantidad %s',
    (cantidad) => {
      const { result } = renderHook(() => useCarrito(), {
        wrapper: crearWrapper(),
      });

      act(() => {
        result.current.agregarProducto(productoPrueba);
      });

      act(() => {
        result.current.cambiarCantidad('TEST-001', cantidad);
      });

      expect(result.current.items[0].cantidad).toBe(1);
    }
  );

  it.each([0, -1, 1.5, 'texto'])(
    'rechaza la cantidad inválida %s',
    (cantidad) => {
      const { result } = renderHook(() => useCarrito(), {
        wrapper: crearWrapper(),
      });

      act(() => {
        result.current.agregarProducto(productoPrueba);
      });

      act(() => {
        result.current.cambiarCantidad('TEST-001', cantidad);
      });

      expect(result.current.items[0].cantidad).toBe(1);
    }
  );

  it('no modifica el carrito si el código no existe al cambiar cantidad', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: crearWrapper(),
    });

    act(() => {
      result.current.agregarProducto(productoPrueba);
    });

    act(() => {
      result.current.cambiarCantidad('NO-EXISTE', 2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].cantidad).toBe(1);
  });

  it('eliminar un producto inexistente conserva los productos existentes', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: crearWrapper(),
    });

    act(() => {
      result.current.agregarProducto(productoPrueba);
    });

    act(() => {
      result.current.eliminarProducto('NO-EXISTE');
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].codigo).toBe('TEST-001');
  });

  it('elimina un producto del carrito', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: crearWrapper(),
    });

    act(() => {
      result.current.agregarProducto(productoPrueba);
    });

    act(() => {
      result.current.eliminarProducto('TEST-001');
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalUnidades).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('vacía todos los productos del carrito', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: crearWrapper(),
    });

    act(() => {
      result.current.agregarProducto(productoPrueba);
    });

    act(() => {
      result.current.agregarProducto({
        ...productoPrueba,
        codigo: 'TEST-002',
      });
    });

    act(() => {
      result.current.vaciarCarrito();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalUnidades).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('ignora los productos con precio no numérico al calcular el total', () => {
    const { result } = renderHook(() => useCarrito(), {
      wrapper: crearWrapper(),
    });

    act(() => {
      result.current.agregarProducto(productoPrueba);
    });

    act(() => {
      result.current.agregarProducto({
        ...productoPrueba,
        codigo: 'TEST-002',
        precio: 'precio inválido',
      });
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.total).toBe(10000);
  });

  it('lanza un error al usar useCarrito fuera del proveedor', () => {
    expect(() => renderHook(() => useCarrito())).toThrow(
      'useCarrito debe utilizarse dentro de CarritoProvider.'
    );
  });
});