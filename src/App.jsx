import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import TecnicoDashboard from "./pages/TecnicoDashboard.jsx";
import CoordinadorDashboard from "./pages/CoordinadorDashboard.jsx";
import ReportesPage from "./pages/ReportesPage.jsx";
import UsuariosPage from "./pages/UsuariosPage.jsx";

/**
 * Obtiene el usuario autenticado desde localStorage.
 * Se usa solo para decidir la redirección de la ruta raíz "/".
 */
const getUser = () => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
};

const App = () => {
  const user = getUser();

  return (
    <Layout>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard técnico */}
        <Route
          path="/tecnico"
          element={
            <ProtectedRoute roles={["tecnico"]}>
              <TecnicoDashboard />
            </ProtectedRoute>
          }
        />

        {/* Dashboard coordinador */}
        <Route
          path="/coordinador"
          element={
            <ProtectedRoute roles={["coordinador"]}>
              <CoordinadorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Reportes (solo coordinador) */}
        <Route
          path="/reportes"
          element={
            <ProtectedRoute roles={["coordinador"]}>
              <ReportesPage />
            </ProtectedRoute>
          }
        />

        {/* Gestión de usuarios (solo coordinador) */}
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute roles={["coordinador"]}>
              <UsuariosPage />
            </ProtectedRoute>
          }
        />

        {/* Ruta base: redirige según rol o a login */}
        <Route
          path="/"
          element={
            user ? (
              user.rol === "tecnico" ? (
                <Navigate to="/tecnico" replace />
              ) : (
                <Navigate to="/coordinador" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Fallback 404 → redirige a raíz */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
