import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ClienteModule from '../pages/cliente/ClienteModule.jsx';

describe('Entrada integrable del módulo cliente', () => {
  it('funciona montado bajo la ruta /cliente/* del router común', () => {
    render(
      <MemoryRouter initialEntries={['/cliente/catalogo']}>
        <Routes>
          <Route path="/cliente/*" element={<ClienteModule />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: 'Nuestro catálogo' })
    ).toBeInTheDocument();
  });

  it('navega al detalle sin salir del prefijo /cliente', async () => {
    const usuario = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/cliente/catalogo']}>
        <Routes>
          <Route path="/cliente/*" element={<ClienteModule />} />
        </Routes>
      </MemoryRouter>
    );

    await usuario.click(screen.getAllByRole('link', { name: 'Ver detalle del producto' })[0]);

    expect(
      screen.getByRole('heading', { name: 'Guitarra Acústica Folk' })
    ).toBeInTheDocument();
    expect(screen.getByText('Código: GA001')).toBeInTheDocument();
  });

  it('redirige la entrada /cliente al catálogo del módulo', () => {
    render(
      <MemoryRouter initialEntries={['/cliente']}>
        <Routes>
          <Route path="/cliente/*" element={<ClienteModule />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: 'Nuestro catálogo' })
    ).toBeInTheDocument();
  });
});
