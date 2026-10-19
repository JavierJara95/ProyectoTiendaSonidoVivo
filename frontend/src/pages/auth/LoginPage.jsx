import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, AudioLines, ShieldCheck } from "../../components/ui/Icons";
import { useAuth } from "../../context/AuthContext";
import { homeByRole } from "../../utils/constants";
import { validateLogin } from "../../utils/validaciones";
import Brand from "../../components/common/Brand";
import FormField from "../../components/ui/FormField";
import Alert from "../../components/ui/Alert";
import { DEMO_PASSWORD } from "../../data/demo";
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const change = (event) =>
    setValues({ ...values, [event.target.name]: event.target.value });
  async function submit(event) {
    event.preventDefault();
    const validation = validateLogin(values);
    setErrors(validation);
    setMessage("");
    if (Object.keys(validation).length) return;
    setBusy(true);
    try {
      const user = await login(values.email, values.password);
      const from = location.state?.from?.pathname;
      const allowed = from?.startsWith("/admin")
        ? user.rol === "admin"
        : from?.startsWith("/vendedor")
          ? ["admin", "vendedor"].includes(user.rol)
          : from?.startsWith("/cliente") || from === "/tienda";
      navigate(allowed ? from : homeByRole[user.rol], { replace: true });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-shell">
      <section className="auth-story">
        <Brand light />
        <div className="auth-story-content">
          <span className="auth-pill">11 AÑOS CONECTANDO CON LA MÚSICA</span>
          <h1>
            El ritmo de
            <br />
            tu tienda.
            <br />
            <em>En tus manos.</em>
          </h1>
          <p>
            Un espacio para gestionar, conectar y hacer que la música llegue más
            lejos.
          </p>
          <div className="auth-wave" aria-hidden="true">
            {[
              34, 65, 100, 51, 125, 83, 140, 73, 112, 45, 90, 56, 120, 64, 38,
            ].map((height, index) => (
              <i key={index} style={{ height }} />
            ))}
          </div>
        </div>
        <p className="auth-story-footer">
          VIÑA DEL MAR, CHILE <AudioLines size={21} />
        </p>
      </section>
      <section className="auth-form-area">
        <div className="auth-mobile-brand">
          <Brand />
        </div>
        <div className="auth-form-card">
          <span className="eyebrow">BIENVENIDO A SONIDO VIVO</span>
          <h2>Qué bueno verte.</h2>
          <p className="muted">Ingresa a tu cuenta para continuar.</p>
          <Alert>{message}</Alert>
          <form onSubmit={submit} noValidate>
            <fieldset disabled={busy}>
              <FormField
                id="email"
                name="email"
                label="Correo electrónico"
                type="email"
                autoComplete="username"
                placeholder="tu@correo.cl"
                value={values.email}
                onChange={change}
                error={errors.email}
              />
              <FormField
                id="password"
                name="password"
                label="Contraseña"
                type="password"
                autoComplete="current-password"
                placeholder="Ingresa tu contraseña"
                value={values.password}
                onChange={change}
                error={errors.password}
              />
              <button
                className="btn btn-primary w-100 auth-submit"
                type="submit"
              >
                {busy ? "Ingresando…" : "Iniciar sesión"}
                <ArrowRight size={18} />
              </button>
            </fieldset>
          </form>
          <p className="auth-switch">
            ¿Primera vez aquí? <Link to="/registro">Crea tu cuenta</Link>
          </p>
          <details className="demo-access">
            <summary>Accesos de prueba</summary>
            <p>
              Contraseña: <code>{DEMO_PASSWORD}</code>
            </p>
            <div className="demo-buttons">
              {[
                ["Administrador", "admin"],
                ["Vendedor", "vendedor"],
                ["Cliente", "cliente"],
              ].map(([label, role]) => (
                <button
                  className="btn btn-sm btn-light"
                  type="button"
                  key={role}
                  disabled={busy}
                  onClick={() => {
                    setValues({
                      email: `${role}@sonidovivo.cl`,
                      password: DEMO_PASSWORD,
                    });
                    setMessage("");
                    setErrors({});
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </details>
          <div className="auth-bottom">
            <ShieldCheck size={15} />
            <span>Tu espacio, con acceso según tu rol.</span>
          </div>
        </div>
        <small className="auth-copyright">
          © {new Date().getFullYear()} Sonido Vivo · La música empieza aquí.
        </small>
      </section>
    </div>
  );
}
