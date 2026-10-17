export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3">
      <div className="container">
        <p className="mb-1">© {new Date().getFullYear()} Sonido Vivo</p>
        <small>Tienda de instrumentos musicales · Viña del Mar</small>
      </div>
    </footer>
  );
}
