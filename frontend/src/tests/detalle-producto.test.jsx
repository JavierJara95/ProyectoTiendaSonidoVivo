import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DetalleProductoPage from '../pages/cliente/DetalleProductoPage.jsx';

vi.mock('../data/productos.json', () => ({
  default: [
    {
      codigo: 'TEST-001',
      categoria: 'Instrumentos',
      nombre: 'Guitarra de prueba',
      marca: 'Marca A',
      modelo: 'Modelo A',
      stock: 3,
      precio: 10000,
      descripcion: 'Producto utilizado en pruebas.',
    },
    {
      codigo: 'TEST-002',
      categoria: 'Audio',
      nombre: 'Parlante de prueba',
      marca: 'Marca B',
      modelo: 'Modelo B',
      stock: 0,
      precio: 20000,
      descripcion: 'Producto utilizado en pruebas.',
    },
  ],
}));

vi.mock('../context/CarritoContext.jsx', () => ({
  useCarrito: vi.fn(),
}));

import { useCarrito } from '../context/CarritoContext.jsx';

describe('DetalleProductoPage', () => {
  const agregarProducto = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    agregarProducto.mockReturnValue({
      ok: true,
      mensaje: 'Producto agregado al carrito.',
    });

    useCarrito.mockReturnValue({
      agregarProducto,
      totalUnidades: 0,
    });
  });

  function renderDetalle(codigo = 'TEST-001') {
    return render(
      <MemoryRouter initialEntries={[`/producto/${codigo}`]}>
        <Routes>
          <Route
            path="/producto/:codigo"
            element={<DetalleProductoPage />}
          />
        </Routes>
      </MemoryRouter>
    );
  }

  it('muestra los datos del producto seleccionado', () => {
    renderDetalle();

    expect(
      screen.getByRole('heading', { name: 'Guitarra de prueba' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('TEST-001', { selector: 'dd' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Marca A', { selector: 'dd' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Modelo A', { selector: 'dd' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Producto utilizado en pruebas.')
    ).toBeInTheDocument();

    expect(screen.getByText('$10.000')).toBeInTheDocument();
    expect(screen.getByText(/unidades/)).toBeInTheDocument();
  });

  it('permite agregar un producto disponible al carrito', async () => {
    const user = userEvent.setup();
    renderDetalle();

    await user.click(
      screen.getByRole('button', { name: 'Agregar al carrito' })
    );

    expect(agregarProducto).toHaveBeenCalledWith(
      expect.objectContaining({ codigo: 'TEST-001' })
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      'Producto agregado al carrito.'
    );
  });

  it('deshabilita la compra de un producto sin stock', () => {
    renderDetalle('TEST-002');

    expect(
      screen.getByRole('heading', { name: 'Parlante de prueba' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Sin stock' })
    ).toBeDisabled();

    expect(agregarProducto).not.toHaveBeenCalled();
  });

  it('muestra un mensaje si el producto no existe', () => {
    renderDetalle('NO-EXISTE');

    expect(
      screen.getByRole('heading', { name: 'Producto no encontrado' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: 'Volver al catálogo' })
    ).toHaveAttribute('href', '/catalogo');
  });
});