export default function StatCard({
  title,
  value,
  detail,
  Icon,
  accent = false,
}) {
  return (
    <article className={`stat-card ${accent ? "stat-accent" : ""}`}>
      <div className="stat-heading">
        <span>{title}</span>
        {Icon && <Icon size={19} aria-hidden="true" />}
      </div>
      <strong
        className={`stat-value ${String(value).length > 10 ? "value-long" : ""}`}
      >
        {value}
      </strong>
      <small>{detail}</small>
    </article>
  );
}
