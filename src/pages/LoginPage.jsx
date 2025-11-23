import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

/**
 * Pantalla de login:
 * - Envía credenciales al backend.
 * - Guarda token y datos básicos del usuario en localStorage.
 * - Redirige según el rol.
 */
const LoginPage = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * Maneja el envío del formulario de login.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { usuario, password });

      // Persistencia de sesión mínima: token + usuario
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.usuario));

      // Navegación basada en rol para separar flujos
      if (res.data.usuario.rol === "tecnico") {
        navigate("/tecnico");
      } else if (res.data.usuario.rol === "coordinador") {
        navigate("/coordinador");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Ingreso DICRI</h1>
        <p className="login-subtitle">
          Acceso al sistema de evidencias. Solo personal autorizado.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
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

          <button type="submit" className="btn btn-primary w-100 login-button">
            Ingresar
          </button>
        </form>

        <p className="login-footer">
          Acceso restringido al personal autorizado de la DICRI.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
