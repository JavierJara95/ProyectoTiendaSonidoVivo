import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Brand from "../../components/common/Brand";
import FormField from "../../components/ui/FormField";
import Alert from "../../components/ui/Alert";
import { validateRegistration } from "../../utils/validaciones";
import { registerUser } from "../../services/usuariosService";
export default function RegistroPage() {
  const [values, setValues] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const change = (event) =>
    setValues({
      ...values,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value,
    });
  async function submit(event) {
    event.preventDefault();
    const validation = validateRegistration(values);
    setErrors(validation);
    setMessage("");
    if (Object.keys(validation).length) return;
    setBusy(true);
    try {
      await registerUser(values);
      setSuccess(true);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="register-shell">
      <header>
        <Brand />
        <Link to="/login">
          <ArrowLeft size={16} /> Volver al inicio
        </Link>
      </header>
      <section className="register-card">
        {success ? (
          <div className="success-state">
            <CheckCircle2 size={48} />
            <h1>Tu cuenta está lista.</h1>
            <p>Ya puedes iniciar sesión y acceder a tu espacio de cliente.</p>
            <Link className="btn btn-primary" to="/login">
              Ir a iniciar sesión <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <>
            <span className="eyebrow">TU PRÓXIMA HISTORIA MUSICAL</span>
            <h1>Crea tu cuenta.</h1>
            <p className="muted">Únete a Sonido Vivo como cliente.</p>
            <Alert>{message}</Alert>
            <form onSubmit={submit} noValidate>
              <fieldset disabled={busy}>
                <FormField
                  id="nombre"
                  name="nombre"
                  label="Nombre completo"
                  autoComplete="name"
                  value={values.nombre}
                  onChange={change}
                  error={errors.nombre}
                />
                <FormField
                  id="email"
                  name="email"
                  label="Correo electrónico"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={change}
                  error={errors.email}
                />
                <FormField
                  id="password"
                  name="password"
                  label="Contraseña"
                  type="password"
                  autoComplete="new-password"
                  value={values.password}
                  onChange={change}
                  error={errors.password}
                  hint="Mínimo 8 caracteres, mayúscula, minúscula y número."
                />
                <FormField
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirmar contraseña"
                  type="password"
                  autoComplete="new-password"
                  value={values.confirmPassword}
                  onChange={change}
                  error={errors.confirmPassword}
                />
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    checked={values.acceptTerms}
                    onChange={change}
                    aria-invalid={Boolean(errors.acceptTerms)}
                    aria-describedby={
                      errors.acceptTerms ? "terms-error" : undefined
                    }
                  />
                  <label className="form-check-label" htmlFor="acceptTerms">
                    Acepto usar mi cuenta para gestionar mis compras en Sonido
                    Vivo.
                  </label>
                  {errors.acceptTerms && (
                    <div id="terms-error" className="text-danger small mt-1">
                      {errors.acceptTerms}
                    </div>
                  )}
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  {busy ? "Creando cuenta…" : "Crear cuenta"}
                  <ArrowRight size={17} />
                </button>
              </fieldset>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
