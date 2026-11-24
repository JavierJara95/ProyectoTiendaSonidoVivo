// Servidor REST simulado para pruebas unitarias: NO realiza peticiones reales ni altera MySQL.
import { vi } from 'vitest';
import { DEMO_PASSWORD, demoUsers } from '../data/demo';
import productsFixture from '../data/admin/productos.json';
import { KEYS } from '../utils/constants';

let state;
const response = (status, data) => ({ ok: status >= 200 && status < 300, status,
  text: async () => data == null ? '' : JSON.stringify(data) });
const err = (status, mensaje) => response(status, { mensaje });
const activeSession = () => {
  try { const s = JSON.parse(sessionStorage.getItem(KEYS.session) || 'null');
    return s?.expiresAt > Date.now() ? s.user : null;
  } catch { return null; }
};
export function getMockState() { return state; }
export function installMockBackend({ users = demoUsers, products = productsFixture, orders = [] } = {}) {
  state = { users: users.map(u => ({...u})), products: products.map((p,i) => ({id: p.id || i + 1, ...p})), orders: orders.map(o => ({...o})), credentials: new Map() };
  globalThis.fetch = vi.fn(async (url, opts = {}) => {
    const u = new URL(String(url)); const path = u.pathname;
    const method = (opts.method || 'GET').toUpperCase();
    let body = {};
    try { body = opts.body ? JSON.parse(opts.body) : {}; } catch { return err(400,'JSON inválido'); }
    const current = activeSession();
    if (path === '/api/auth/login' && method === 'POST') {
      const who = state.users.find(x => x.email.toLowerCase() === String(body.email || '').trim().toLowerCase());
      if (!who || (state.credentials.get(who.email) || DEMO_PASSWORD) !== body.password) return err(401,'Correo o contraseña incorrectos');
      if (!who.activo) return err(403,'Cuenta inactiva');
      return response(200, { token: 'JWT_SIMULADO_SOLO_TEST', expiresAt: Date.now() + 3600000, user: who });
    }
    if (path === '/api/auth/register' && method === 'POST') {
      const email = String(body.email || '').trim().toLowerCase();
      if (state.users.some(x => x.email.toLowerCase() === email)) return err(409,'Ya existe una cuenta con ese correo');
      const who = { id: String(state.users.length+1), nombre: body.nombre, email, rol:'cliente', activo:true };
      state.users.push(who); state.credentials.set(email, body.password);
      return response(201, who);
    }
    if (path === '/api/auth/me') return current ? response(200, current) : err(401,'No autorizado');
    if (path.startsWith('/api/usuarios')) {
      if (current?.rol !== 'admin') return err(current ? 403 : 401,'No tienes permiso');
      if (path === '/api/usuarios' && method === 'GET') return response(200,state.users);
      if (path === '/api/usuarios' && method === 'POST') {
        const email = body.email.trim().toLowerCase();
        if (state.users.some(x => x.email.toLowerCase() === email)) return err(409,'Ya existe una cuenta con ese correo');
        const who={id:String(state.users.length+1),nombre:body.nombre,email,rol:body.rol,activo:true};
        state.users.push(who);state.credentials.set(email,body.password);return response(201,who);
      }
      const m=path.match(/^\/api\/usuarios\/([^/]+)(?:\/(estado))?$/);const who=state.users.find(x=>String(x.id)===m?.[1]);
      if (!who) return err(404,'Usuario no encontrado');
      if (m[2] === 'estado' && method === 'PATCH') {
        if (who.id === current.id && body.activo === false) return err(400,'No puedes desactivar tu propia cuenta');
        who.activo=body.activo;return response(200,who);
      }
      if (method === 'PUT') {
        if(who.id===current.id && body.rol!=='admin')return err(400,'No puedes quitarte el rol de administrador');
        Object.assign(who,{nombre:body.nombre,email:body.email,rol:body.rol,activo:body.activo ?? who.activo});
        if(body.password)state.credentials.set(who.email,body.password);return response(200,who);
      }
    }
    if (path === '/api/productos' && method === 'GET') return response(200,state.products);
    const productMatch=path.match(/^\/api\/productos\/(\d+)(?:\/ajustar-stock)?$/);
    if(productMatch){const product=state.products.find(x=>String(x.id)===productMatch[1]);if(!product)return err(404,'Producto no encontrado');
      if(method==='PUT' && path.endsWith('/ajustar-stock')){product.stock+=body.delta;return response(200,product);}
      return response(200,product);
    }
    if(path === '/api/pedidos' && method === 'GET')return response(200,state.orders);
    if(path === '/api/pedidos' && method === 'POST')return response(201,{id:99,folio:'SV-TEST',fechaCreacion:new Date().toISOString(),estadoDescripcion:'En preparación',items:[],total:0,clienteNombre:body.cliente.nombre,clienteCorreo:body.cliente.correo,entrega:body.entrega});
    if(path.startsWith('/api/pedidos/') && path.endsWith('/estado') && method==='PUT'){
      const id=Number(path.split('/')[3]);const order=state.orders.find(x=>x.id===id);if(!order)return err(404,'Pedido no encontrado');
      order.estadoDescripcion=({EN_PREPARACION:'En preparación',DESPACHADO:'Despachado',ENTREGADO:'Entregado'})[body.estado];
      order.entrega={...order.entrega,numeroSeguimiento:body.numeroSeguimiento||''};return response(200,order);
    }
    if(path.startsWith('/api/seguimiento/')){
      const folio=decodeURIComponent(path.split('/').pop());const order=state.orders.find(x=>x.folio===folio);
      return order?response(200,order):err(404,'No encontramos un pedido con ese folio');
    }
    return err(404,`Endpoint no simulado: ${method} ${path}`);
  });
  return state;
}
