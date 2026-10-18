function PageHeader({ titulo, descripcion }) {
  return (
    <div className="page-header mb-4">
      <h1 className="mb-2">
        {titulo}
      </h1>

      <p className="text-muted mb-0">
        {descripcion}
      </p>
    </div>
  )
}

export default PageHeader