import { request } from './api';
export function listProducts() { return request('catalogo', '/api/productos'); }
export function getProduct(id) { return request('catalogo', `/api/productos/${id}`); }
export async function getProductByCode(codigo) {
  const products = await listProducts();
  const product = products.find(p => p.codigo.toUpperCase() === codigo.toUpperCase());
  if (!product) throw new Error('Producto no encontrado en catálogo.');
  return product;
}
export async function changeStock(product, quantity) {
  if (!Number.isInteger(quantity) || quantity < 0) throw new Error('El stock no puede ser negativo.');
  const delta = quantity - product.stock;
  if (!delta) return product;
  return request('catalogo', `/api/productos/${product.id}/ajustar-stock`, {
    method: 'PUT', body: { delta },
  });
}
