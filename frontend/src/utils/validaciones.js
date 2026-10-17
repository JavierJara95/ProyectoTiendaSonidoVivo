import { ROLES } from "./constants";
export const normalizeEmail = (value = "") => value.trim().toLowerCase();
export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export function validateLogin({ email, password }) {
  const errors = {};
  if (!isEmail(normalizeEmail(email)))
    errors.email = "Ingresa un correo electrónico válido.";
  if (!password) errors.password = "Ingresa tu contraseña.";
  return errors;
}
export function validateUser(values, { requirePassword = true } = {}) {
  const errors = {};
  if (!values.nombre?.trim() || values.nombre.trim().length < 2)
    errors.nombre = "El nombre debe tener al menos 2 caracteres.";
  if (!isEmail(normalizeEmail(values.email)))
    errors.email = "Ingresa un correo electrónico válido.";
  if (!ROLES.includes(values.rol)) errors.rol = "Selecciona un rol válido.";
  if (requirePassword || values.password) {
    if (
      !values.password ||
      values.password.length < 8 ||
      !/[A-Z]/.test(values.password) ||
      !/[a-z]/.test(values.password) ||
      !/[0-9]/.test(values.password)
    ) {
      errors.password =
        "Usa al menos 8 caracteres, una mayúscula, una minúscula y un número.";
    }
  }
  return errors;
}
export function validateRegistration(values) {
  const errors = validateUser({ ...values, rol: "cliente" });
  if (values.confirmPassword !== values.password)
    errors.confirmPassword = "Las contraseñas no coinciden.";
  if (!values.acceptTerms)
    errors.acceptTerms = "Debes aceptar las condiciones de uso.";
  return errors;
}
export function assertValid(errors) {
  if (Object.keys(errors).length) throw new Error(Object.values(errors)[0]);
}
