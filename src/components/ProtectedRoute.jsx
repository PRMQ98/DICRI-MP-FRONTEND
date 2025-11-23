import { Navigate } from "react-router-dom";

/**
 * Ruta protegida por autenticación y, opcionalmente, por rol.
 *
 * - Verifica que exista un usuario en localStorage.
 * - Si se define `roles`, valida que el rol del usuario esté incluido.
 * - Si no cumple, redirige a /login o a / según corresponda.
 */
const ProtectedRoute = ({ children, roles }) => {
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  // Sin sesión → se fuerza login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Con sesión pero sin rol autorizado → se devuelve a raíz
  if (roles && !roles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  // Caso válido → se muestra el contenido protegido
  return children;
};

export default ProtectedRoute;
