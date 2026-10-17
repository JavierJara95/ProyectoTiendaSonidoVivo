export default function FormField({ id, label, error, hint, ...props }) {
  return (
    <div className="mb-3">
      <label className="form-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`form-control ${error ? "is-invalid" : ""}`}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        {...props}
      />
      {error && (
        <div id={`${id}-error`} className="invalid-feedback">
          {error}
        </div>
      )}
      {hint && !error && (
        <small id={`${id}-hint`} className="form-text">
          {hint}
        </small>
      )}
    </div>
  );
}
