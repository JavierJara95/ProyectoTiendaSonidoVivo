import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

// children contiene la página que se muestra entre la barra superior y el pie.
export default function Layout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container py-4 flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
}
