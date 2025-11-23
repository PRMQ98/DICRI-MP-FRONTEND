import Navbar from "./Navbar.jsx";

const Layout = ({ children }) => {
  return (
    <div className="app-root">
      <Navbar />
      {/* Zona principal de la app */}
      <main className="app-main">
        <div className="app-content container">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
