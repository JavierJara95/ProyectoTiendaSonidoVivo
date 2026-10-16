
import { beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import {
  registrarPedido,
  buscarPedido,
  __limpiarPedidosParaPruebas,
} from '../data/pedidos.js';
import CarritoPage from '../pages/cliente/CarritoPage.jsx';
import PedidoConfirmadoPage from '../pages/cliente/PedidoConfirmadoPage.jsx';
import SeguimientoPedidoPage from '../pages/cliente/SeguimientoPedidoPage.jsx';
import { CarritoProvider } from '../context/CarritoContext.jsx';

const clientePrueba = {
  nombre: 'Cliente de prueba',
  correo: 'cliente@example.com',
  telefono: '912345678',
};

const itemsPrueba = [
  {
    codigo: 'TEST-001',
    nombre: 'Guitarra de prueba',
    marca: 'Marca de prueba',
    modelo: 'Modelo de prueba',
    precio: 50000,
    cantidad: 1,
    stock: 5,
  },
];

function crearPedido(entrega = { tipo: 'retiro' }) {
  return registrarPedido({
    items: itemsPrueba,
    cliente: clientePrueba,
    entrega,
    total: 50000,
  });
}

function renderConRutas(ruta) {
  return render(
    <CarritoProvider>
      <MemoryRouter initialEntries={[ruta]}>
        <Routes>
          <Route path="/carrito" element={<CarritoPage />} />
          <Route
            path="/pedido-confirmado"
            element={<PedidoConfirmadoPage />}
          />
          <Route path="/seguimiento" element={<SeguimientoPedidoPage />} />
        </Routes>
      </MemoryRouter>
    </CarritoProvider>
  );
}

describe('Flujo de pedidos del cliente', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    sessionStorage.clear();
    __limpiarPedidosParaPruebas();
  });

  it('muestra la página del carrito', () => {
    renderConRutas('/carrito');
    expect(document.body.textContent.length).toBeGreaterThan(0);
  });

  it('registra un pedido con retiro en tienda y genera un folio', () => {
    const resultado = crearPedido({ tipo: 'retiro' });

    expect(resultado.ok).toBe(true);
    expect(resultado.pedido.folio).toMatch(/^SV-/);
    expect(buscarPedido(resultado.pedido.folio, clientePrueba.correo))
      .not.toBeNull();
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

  it('renderiza la página de seguimiento del pedido', () => {
    renderConRutas('/seguimiento');
    expect(document.body.textContent.length).toBeGreaterThan(0);
  });
});
