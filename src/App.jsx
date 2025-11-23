import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import TecnicoDashboard from "./pages/TecnicoDashboard.jsx";
import CoordinadorDashboard from "./pages/CoordinadorDashboard.jsx";
import ReportesPage from "./pages/ReportesPage.jsx";
import UsuariosPage from "./pages/UsuariosPage.jsx";

const getUser = () => {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
};

const App = () => {
  const user = getUser();

  return (
    <Layout>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<LoginPage />} />

        {/* TÉCNICO */}
        <Route
          path="/tecnico"
          element={
            <ProtectedRoute roles={["tecnico"]}>
              <TecnicoDashboard />
            </ProtectedRoute>
          }
        />

        {/* COORDINADOR */}
        <Route
          path="/coordinador"
          element={
            <ProtectedRoute roles={["coordinador"]}>
              <CoordinadorDashboard />
            </ProtectedRoute>
          }
        />

        {/* REPORTES */}
        <Route
          path="/reportes"
          element={
            <ProtectedRoute roles={["coordinador"]}>
              <ReportesPage />
            </ProtectedRoute>
          }
        />

        {/* USUARIOS – SOLO COORDINADOR */}
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute roles={["coordinador"]}>
              <UsuariosPage />
            </ProtectedRoute>
          }
        />

        {/* RUTA BASE */}
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

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
