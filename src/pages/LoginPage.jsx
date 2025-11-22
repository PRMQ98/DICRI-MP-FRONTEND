import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const LoginPage = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { usuario, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.usuario));

      if (res.data.usuario.rol === "tecnico") {
        navigate("/tecnico");
      } else if (res.data.usuario.rol === "coordinador") {
        navigate("/coordinador");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-4">
        <h2 className="mt-5 mb-3 text-center">Ingreso DICRI</h2>
        <div className="card shadow-sm">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Usuario</label>
                <input
                  type="text"
                  className="form-control"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <button type="submit" className="btn btn-primary w-100">
                Ingresar
              </button>
            </form>
          </div>
        </div>
        <p className="text-muted mt-3 text-center" style={{ fontSize: "0.8rem" }}>
          Acceso restringido al personal autorizado de la DICRI.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
