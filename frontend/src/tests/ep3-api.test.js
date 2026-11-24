import { describe, it, expect, vi, afterEach } from 'vitest';
import { request, sessionToken } from '../services/api';
import { createOrder } from '../services/pedidosService';
import { calculateReport } from '../services/reportesService';
import { KEYS } from '../utils/constants';

afterEach(() => vi.unstubAllGlobals());

function loginFalso(rol = 'cliente') {
  sessionStorage.setItem(KEYS.session, JSON.stringify({
    token: 'TOKEN_SOLO_PARA_TEST', expiresAt: Date.now() + 60_000,
    user: { id: 3, nombre: 'Cliente prueba', email: 'test@ejemplo.cl', rol, activo: true },
  }));
}
const ok = (value) => ({ ok: true, status: 200, text: async () => JSON.stringify(value) });

describe('EP3: conexión REST y sesión JWT (fetch simulado, no pruebas E2E)', () => {
  it('envía Bearer JWT al microservicio de catálogo', async () => {
    loginFalso();
    const fetchMock = vi.fn().mockResolvedValue(ok([{ id: 1, codigo: 'GA001' }]));
    vi.stubGlobal('fetch', fetchMock);
    const productos = await request('catalogo', '/api/productos');
    expect(productos[0].codigo).toBe('GA001');
    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8081/api/productos');
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer TOKEN_SOLO_PARA_TEST');
  });
  it('envía cantidades sin precios al endpoint de pedidos', async () => {
    loginFalso();
    const fetchMock = vi.fn().mockResolvedValue(ok({ id: 1, folio: 'SV-TEST' }));
    vi.stubGlobal('fetch', fetchMock);
    await createOrder({ items: [{ id: 5, codigo: 'GE001', cantidad: 2, precio: 999 }],
      cliente: { nombre: 'Cliente Prueba', correo: 'test@ejemplo.cl', telefono: '987654321' },
      entrega: { tipo: 'Retiro en tienda' }, total: 99999 });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(fetchMock.mock.calls[0][0]).toBe('http://localhost:8082/api/pedidos');
    expect(body.items).toEqual([{ productoId: 5, codigo: 'GE001', cantidad: 2 }]);
    expect(JSON.stringify(body)).not.toContain('precio');
  });
  it('elimina sesión caducada localmente', () => {
    loginFalso();
    const s = JSON.parse(sessionStorage.getItem(KEYS.session));
    s.expiresAt = Date.now() - 1000;
    sessionStorage.setItem(KEYS.session, JSON.stringify(s));
    expect(sessionToken()).toBeNull();
    expect(sessionStorage.getItem(KEYS.session)).toBeNull();
  });
  it('rechaza token inválido ante respuesta 401 y limpia sesión', async () => {
    loginFalso();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false, status: 401, text: async () => JSON.stringify({ mensaje: 'Token inválido' }),
    }));
    await expect(request('auth', '/api/auth/me')).rejects.toThrow('Token inválido');
    expect(sessionToken()).toBeNull();
  });
  it('reporta pedidos confirmados sin presentarlos como pagos cobrados', () => {
    const report = calculateReport([
      { id: 1, fecha: '2026-11-24T12:00:00', estadoStock: 'CONFIRMADO', total: 5000,
        items: [{ codigo: 'GA001', cantidad: 1, precioUnitario: 5000 }] },
      { id: 2, fecha: '2026-11-24T13:00:00', estadoStock: 'INCIDENCIA', total: 9999, items: [] },
    ], [{ codigo: 'GA001', nombre: 'Guitarra', stock: 2, precio: 5000, categoria: 'Guitarras' }]);
    expect(report.saleCount).toBe(1);
    expect(report.revenue).toBe(5000);
    expect(report.orders).toHaveLength(2);
  });
});
