import { Link } from "react-router-dom";
export default function NotFoundPage() {
  return (
    <div className="not-found">
      <span className="eyebrow">ERROR 404</span>
      <h1>Esta página no está en el repertorio.</h1>
      <p>Revisa la dirección o vuelve al inicio.</p>
      <Link className="btn btn-primary" to="/">
        Ir al inicio
      </Link>
    </div>
  );
}
