export const ROLES = ["admin", "vendedor", "cliente"];
export const ROLE_LABELS = {
  admin: "Administrador",
  vendedor: "Vendedor",
  cliente: "Cliente",
};
export const KEYS = {
  users: "sonido-vivo:v1:usuarios",
  products: "sonido-vivo:v1:productos",
  orders: "sonido-vivo:v1:pedidos",
  session: "sonido-vivo:v1:sesion",
};
export const homeByRole = {
  admin: "/admin",
  vendedor: "/vendedor/pedidos",
  cliente: "/cliente/catalogo",
};
