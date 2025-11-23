import Navbar from "./Navbar.jsx";

/**
 * Layout principal de la aplicación.
 * Renderiza la barra de navegación fija arriba y una zona de contenido
 * centralizada donde se inyectan las páginas (children) mediante React Router.
 */
const Layout = ({ children }) => {
  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main">
        <div className="app-content container">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
