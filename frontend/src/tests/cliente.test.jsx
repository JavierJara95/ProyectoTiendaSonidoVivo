import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  registrarPedido,
  buscarPedido,
  __limpiarPedidosParaPruebas,
} from '../data/pedidos.js';
import CarritoPage from '../pages/cliente/CarritoPage.jsx';
import PedidoConfirmadoPage from '../pages/cliente/PedidoConfirmadoPage.jsx';
import SeguimientoPedidoPage from '../pages/cliente/SeguimientoPedidoPage.jsx';
import { CarritoProvider, useCarrito } from '../context/CarritoContext.jsx';

const clientePrueba = {
  nombre: 'Cliente de prueba',
  correo: 'cliente@example.com',
  telefono: '912345678',
};

const productoPrueba = {
  codigo: 'TEST-001',
  nombre: 'Guitarra de prueba',
  marca: 'Marca de prueba',
  modelo: 'Modelo de prueba',
  precio: 50000,
  stock: 5,
};

const itemsPrueba = [
  {
    ...productoPrueba,
    cantidad: 2,
    subtotal: 100000,
  },
];

function crearPedido(entrega = { tipo: 'retiro' }) {
  return registrarPedido({
    items: itemsPrueba,
    cliente: clientePrueba,
    entrega,
    total: 100000,
  });
}

function PrepararCarrito({ productos = [], children }) {
  const { agregarProducto } = useCarrito();

  return (
    <>
      {productos.map((producto) => (
        <button
          key={producto.codigo}
          type="button"
          onClick={() => agregarProducto(producto)}
        >
          Cargar {producto.nombre}
        </button>
      ))}
      {children}
    </>
  );
}

function renderConRutas(ruta, pedido = null, productos = []) {
  return render(
    <CarritoProvider>
      <MemoryRouter
        initialEntries={[
          {
            pathname: ruta,
            state: pedido ? { pedido } : null,
          },
        ]}
      >
        <PrepararCarrito productos={productos}>
          <Routes>
            <Route path="/carrito" element={<CarritoPage />} />
            <Route
              path="/pedido-confirmado/:folio"
              element={<PedidoConfirmadoPage />}
            />
            <Route
              path="/seguimiento"
              element={<SeguimientoPedidoPage />}
            />
            <Route path="/catalogo" element={<h1>Catálogo</h1>} />
          </Routes>
        </PrepararCarrito>
      </MemoryRouter>
    </CarritoProvider>
  );
}

function cargarProducto() {
  fireEvent.click(
    screen.getByRole('button', {
      name: 'Cargar Guitarra de prueba',
    })
  );
}

function consultarSeguimiento(folio, correo) {
  fireEvent.change(screen.getByLabelText('Folio del pedido'), {
    target: { value: folio },
  });

  fireEvent.change(screen.getByLabelText('Correo electrónico'), {
    target: { value: correo },
  });

  fireEvent.click(
    screen.getByRole('button', { name: 'Consultar estado' })
  );
}

describe('Flujo de pedidos del cliente', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    sessionStorage.clear();
    __limpiarPedidosParaPruebas();
  });

  it('muestra el mensaje cuando el carrito está vacío', () => {
    renderConRutas('/carrito');

    expect(
      screen.getByRole('heading', { name: 'Tu carrito está vacío' })
    ).toBeTruthy();

    expect(
      screen.getByRole('link', { name: 'Ir al catálogo' })
    ).toBeTruthy();
  });

  it('muestra el producto, el precio y el resumen del carrito', () => {
    renderConRutas('/carrito', null, [productoPrueba]);
    cargarProducto();

    expect(screen.getByText('Guitarra de prueba')).toBeTruthy();
    expect(screen.getAllByText(/50\.000/).length).toBeGreaterThan(0);
    expect(screen.getByText('Resumen de compra')).toBeTruthy();
  });

  it('permite cambiar la cantidad de un producto', () => {
    renderConRutas('/carrito', null, [productoPrueba]);
    cargarProducto();

    fireEvent.change(screen.getByLabelText('Cantidad'), {
      target: { value: '3' },
    });

    expect(screen.getByLabelText('Cantidad').value).toBe('3');
  });

  it('permite quitar un producto del carrito', () => {
    renderConRutas('/carrito', null, [productoPrueba]);
    cargarProducto();

    fireEvent.click(screen.getByRole('button', { name: 'Quitar' }));

    expect(
      screen.getByRole('heading', { name: 'Tu carrito está vacío' })
    ).toBeTruthy();
  });

  it('permite vaciar el carrito', () => {
    renderConRutas('/carrito', null, [productoPrueba]);
    cargarProducto();

    fireEvent.click(screen.getByRole('button', { name: 'Vaciar carrito' }));

    expect(
      screen.getByRole('heading', { name: 'Tu carrito está vacío' })
    ).toBeTruthy();
  });

  it('muestra errores si se confirma sin completar los datos obligatorios', () => {
    renderConRutas('/carrito', null, [productoPrueba]);
    cargarProducto();

    fireEvent.click(
      screen.getByRole('button', { name: 'Confirmar pedido' })
    );

    expect(screen.getByText('Ingresa tu nombre.')).toBeTruthy();
    expect(
      screen.getByText('Ingresa un correo electrónico válido.')
    ).toBeTruthy();
    expect(screen.getByText('Ingresa un teléfono válido.')).toBeTruthy();
    expect(
      screen.getByText('Ingresa la dirección de despacho.')
    ).toBeTruthy();
  });

  it('registra un pedido con retiro en tienda y genera un folio', () => {
    const resultado = crearPedido();

    expect(resultado.ok).toBe(true);
    expect(resultado.pedido.folio).toMatch(/^SV-/);
    expect(
      buscarPedido(resultado.pedido.folio, clientePrueba.correo)
    ).not.toBeNull();
  });

  it('registra un pedido con despacho por Chilexpress', () => {
    const resultado = crearPedido({
      tipo: 'despacho',
      empresa: 'Chilexpress',
      direccion: 'Av. de prueba 123',
    });

    expect(resultado.ok).toBe(true);
    expect(resultado.pedido.entrega.empresa).toBe('Chilexpress');
  });

  it('rechaza registrar un pedido sin productos', () => {
    const resultado = registrarPedido({
      items: [],
      cliente: clientePrueba,
      entrega: { tipo: 'retiro' },
      total: 0,
    });

    expect(resultado.ok).toBe(false);
  });

  it('muestra la página de seguimiento sin resultados iniciales', () => {
    renderConRutas('/seguimiento');

    expect(
      screen.getByRole('heading', { name: 'Seguimiento de pedido' })
    ).toBeTruthy();

    expect(
      screen.getByRole('heading', { name: 'Buscar mi pedido' })
    ).toBeTruthy();

    expect(
      screen.queryByText('Pedido encontrado')
    ).toBeNull();
  });

  it('muestra un error cuando el pedido no existe', () => {
    renderConRutas('/seguimiento');

    consultarSeguimiento('SV-NO-EXISTE', 'cliente@example.com');

    expect(
      screen.getByRole('alert').textContent
    ).toContain('No encontramos un pedido');
  });

  it('muestra un error cuando el correo no coincide', () => {
    const pedido = crearPedido().pedido;
    renderConRutas('/seguimiento');

    consultarSeguimiento(pedido.folio, 'otro@example.com');

    expect(
      screen.getByRole('alert').textContent
    ).toContain('No encontramos un pedido');
  });

  it('muestra el estado y los datos de un pedido encontrado', () => {
    const pedido = crearPedido().pedido;
    renderConRutas('/seguimiento');

    consultarSeguimiento(pedido.folio, clientePrueba.correo);

    expect(screen.getByText('Pedido encontrado')).toBeTruthy();
    expect(screen.getByText(pedido.folio)).toBeTruthy();
    expect(screen.getByText(pedido.estado)).toBeTruthy();
    expect(screen.getByText('Cliente de prueba')).toBeTruthy();
    expect(screen.getByText('retiro')).toBeTruthy();
  });

  it('muestra la empresa transportista para pedidos con despacho a domicilio', () => {
    const pedido = crearPedido({
      tipo: 'Despacho a domicilio',
      transportista: 'Chilexpress',
    }).pedido;

    renderConRutas('/seguimiento');
    consultarSeguimiento(pedido.folio, clientePrueba.correo);

    expect(screen.getByText('Chilexpress')).toBeTruthy();
  });

  it('muestra los productos y el total del pedido en el seguimiento', () => {
    const pedido = crearPedido().pedido;
    renderConRutas('/seguimiento');

    consultarSeguimiento(pedido.folio, clientePrueba.correo);

    expect(screen.getByRole('heading', { name: 'Productos' })).toBeTruthy();
    expect(screen.getByText(/Guitarra de prueba × 2/)).toBeTruthy();
    expect(screen.getAllByText(/100\.000/).length).toBeGreaterThan(0);
  });

  it('incluye enlaces para volver al catálogo y al carrito', () => {
    renderConRutas('/seguimiento');

    expect(
      screen.getByRole('link', { name: 'Volver al catálogo' })
    ).toBeTruthy();

    expect(
      screen.getByRole('link', { name: 'Ir al carrito' })
    ).toBeTruthy();
  });

  it('muestra la confirmación y el folio del pedido', () => {
    const pedido = crearPedido().pedido;
    renderConRutas(`/pedido-confirmado/${pedido.folio}`, pedido);

    expect(
      screen.getByRole('heading', { name: '¡Pedido registrado!' })
    ).toBeTruthy();

    expect(screen.getByText(pedido.folio)).toBeTruthy();
    expect(screen.getByText('Resumen')).toBeTruthy();
  });

  it('muestra los datos del cliente y el total del pedido', () => {
    const pedido = crearPedido().pedido;
    renderConRutas(`/pedido-confirmado/${pedido.folio}`, pedido);

    expect(screen.getByText('Cliente de prueba')).toBeTruthy();
    expect(screen.getByText('cliente@example.com')).toBeTruthy();
    expect(screen.getByText(/100\.000/)).toBeTruthy();
    expect(screen.getByText(/2\s*unidades/)).toBeTruthy();
  });

  it('muestra la empresa transportista cuando existe', () => {
    const pedido = crearPedido({
      tipo: 'despacho',
      transportista: 'Chilexpress',
    }).pedido;

    renderConRutas(`/pedido-confirmado/${pedido.folio}`, pedido);

    expect(screen.getByText('Chilexpress')).toBeTruthy();
  });

  it('oculta el resumen si no se recibe un pedido', () => {
    renderConRutas('/pedido-confirmado/SV-PRUEBA');

    expect(
      screen.getByRole('heading', { name: '¡Pedido registrado!' })
    ).toBeTruthy();

    expect(screen.queryByText('Resumen')).toBeNull();
  });

  it('oculta el resumen si el folio no coincide con el pedido recibido', () => {
    const pedido = crearPedido().pedido;
    renderConRutas('/pedido-confirmado/SV-OTRO-FOLIO', pedido);

    expect(screen.queryByText('Resumen')).toBeNull();
  });

  it('incluye enlaces para seguir el pedido y volver al catálogo', () => {
    const pedido = crearPedido().pedido;
    renderConRutas(`/pedido-confirmado/${pedido.folio}`, pedido);

    expect(
      screen.getByRole('link', { name: 'Seguir mi pedido' })
    ).toBeTruthy();

    expect(
      screen.getByRole('link', { name: 'Volver al catálogo' })
    ).toBeTruthy();
  });
});