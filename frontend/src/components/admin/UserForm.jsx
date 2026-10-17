import { useState } from "react";
import { createUser, updateUser } from "../../services/usuariosService";
import { validateUser } from "../../utils/validaciones";
import { ROLE_LABELS, ROLES } from "../../utils/constants";
import Modal from "../ui/Modal";
import FormField from "../ui/FormField";
import Alert from "../ui/Alert";
export default function UserForm({ user, onClose, onSaved }) {
  const [values, setValues] = useState({
    nombre: user?.nombre || "",
    email: user?.email || "",
    rol: user?.rol || "cliente",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const change = (event) =>
    setValues({ ...values, [event.target.name]: event.target.value });
  async function submit(event) {
    event.preventDefault();
    const validation = validateUser(values, { requirePassword: !user });
    setErrors(validation);
    setMessage("");
    if (Object.keys(validation).length) return;
    setBusy(true);
    try {
      if (user) await updateUser(user.id, values);
      else await createUser(values);
      onSaved(user ? "Usuario actualizado." : "Usuario creado.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={user ? "Editar usuario" : "Crear usuario"}
      onClose={onClose}
      busy={busy}
    >
      <Alert>{message}</Alert>
      <form onSubmit={submit} noValidate>
        <fieldset disabled={busy}>
          <FormField
            id="user-nombre"
            name="nombre"
            label="Nombre completo"
            value={values.nombre}
            onChange={change}
            error={errors.nombre}
            autoFocus
          />
          <FormField
            id="user-email"
            name="email"
            label="Correo electrónico"
            type="email"
            value={values.email}
            onChange={change}
            error={errors.email}
          />
          <div className="mb-3">
            <label htmlFor="user-rol" className="form-label">
              Rol
            </label>
            <select
              id="user-rol"
              name="rol"
              className="form-select"
              value={values.rol}
              onChange={change}
            >
              {ROLES.map((rol) => (
                <option value={rol} key={rol}>
                  {ROLE_LABELS[rol]}
                </option>
              ))}
            </select>
          </div>
          <FormField
            id="user-password"
            name="password"
            label={user ? "Nueva contraseña (opcional)" : "Contraseña inicial"}
            type="password"
            autoComplete="new-password"
            value={values.password}
            onChange={change}
            error={errors.password}
            hint={
              user
                ? "Déjala vacía para mantener la actual."
                : "Mínimo 8 caracteres, mayúscula, minúscula y número."
            }
          />
          <div className="dialog-actions">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {busy ? "Guardando…" : "Guardar usuario"}
            </button>
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}
