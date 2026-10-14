
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CatalogoPage from '../pages/cliente/CatalogoPage.jsx';

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

describe('CatalogoPage', () => {
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

  function renderCatalogo() {
    return render(
      <MemoryRouter>
        <CatalogoPage />
      </MemoryRouter>
    );
  }

  it('muestra los productos del catálogo', () => {
    renderCatalogo();

    expect(
      screen.getByRole('heading', {
        name: 'Ver detalle de Guitarra de prueba',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'Ver detalle de Parlante de prueba',
      })
    ).toBeInTheDocument();
  });

  it('filtra los productos por nombre', async () => {
    const usuario = userEvent.setup();
    renderCatalogo();

    await usuario.type(
      screen.getByRole('searchbox', { name: /buscar productos/i }),
      'guitarra'
    );

    expect(
      screen.getByRole('heading', {
        name: 'Ver detalle de Guitarra de prueba',
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', {
        name: 'Ver detalle de Parlante de prueba',
      })
    ).not.toBeInTheDocument();
  });

  it('filtra los productos por categoría', async () => {
    const usuario = userEvent.setup();
    renderCatalogo();

    await usuario.selectOptions(
      screen.getByRole('combobox', { name: /categoría/i }),
      'Audio'
    );

    expect(
      screen.getByRole('heading', {
        name: 'Ver detalle de Parlante de prueba',
      })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', {
        name: 'Ver detalle de Guitarra de prueba',
      })
    ).not.toBeInTheDocument();
  });

  it('muestra un mensaje cuando no hay resultados', async () => {
    const usuario = userEvent.setup();
    renderCatalogo();

    await usuario.type(
      screen.getByRole('searchbox', { name: /buscar productos/i }),
      'producto inexistente'
    );

    expect(
      screen.getByRole('heading', {
        name: 'No encontramos productos',
      })
    ).toBeInTheDocument();
  });

  it('agrega un producto disponible al carrito', async () => {
    const usuario = userEvent.setup();
    renderCatalogo();

    const botones = screen.getAllByRole('button', {
      name: 'Agregar al carrito',
    });

    await usuario.click(botones[0]);

    expect(agregarProducto).toHaveBeenCalledWith(
      expect.objectContaining({
        codigo: 'TEST-001',
      })
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      'Producto agregado al carrito.'
    );
  });

  it('deshabilita el botón de un producto sin stock', () => {
    renderCatalogo();

    expect(
      screen.getByRole('button', { name: 'Sin stock' })
    ).toBeDisabled();
  });
});
