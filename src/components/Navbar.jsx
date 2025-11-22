import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          DICRI Evidencias
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {user && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {user.rol === "tecnico" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/tecnico">
                    Expedientes
                  </Link>
                </li>
              )}

              {user.rol === "coordinador" && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/coordinador">
                      Revisión
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/reportes">
                      Reportes
                    </Link>
                  </li>
                </>
              )}
            </ul>
          )}

          <span className="navbar-text ms-auto">
            {user ? (
              <>
                {user.nombre} ({user.rol}){" "}
                <button
                  className="btn btn-sm btn-outline-light ms-2"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link className="btn btn-sm btn-outline-light" to="/login">
                Iniciar sesión
              </Link>
            )}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
