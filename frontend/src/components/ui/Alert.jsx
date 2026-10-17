export default function Alert({ children, kind = "danger" }) {
  return children ? (
    <div
      className={`alert alert-${kind}`}
      role={kind === "danger" ? "alert" : "status"}
    >
      {children}
    </div>
  ) : null;
}
