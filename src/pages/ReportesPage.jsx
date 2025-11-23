// src/pages/ReportesPage.jsx
import { useEffect, useState } from "react";
import api from "../services/api";

/**
 * Vista de reportes:
 * - Consulta resumen de expedientes en el backend.
 * - Muestra tarjetas de totales (registrados, aprobados, rechazados).
 */
const ReportesPage = () => {
  const [reporte, setReporte] = useState(null);
  const [error, setError] = useState("");

  /**
   * Llama al endpoint de reportes y guarda el resultado.
   */
  const cargarReporte = async () => {
    try {
      setError("");
      const res = await api.get("/reportes");
      setReporte(res.data);
    } catch (err) {
      console.error("Error al obtener reporte:", err);
      setError("Error al obtener reporte");
    }
  };

  // Carga inicial del resumen de estadísticas
  useEffect(() => {
    cargarReporte();
  }, []);

  if (error) {
    return (
      <div className="page">
        <div className="alert alert-danger mt-3">{error}</div>
      </div>
    );
  }

  if (!reporte) {
    return (
      <div className="page">
        <p>Cargando reporte...</p>
      </div>
    );
  }

  return (
    <div className="page page-reportes">
      <h2>Reportes y estadísticas</h2>
      <p className="text-muted">
        Resumen general de expedientes registrados, aprobados y rechazados.
      </p>

      <div className="row g-3 reportes-row">
        <div className="col-12 col-md-4">
          <div className="card stat-card stat-primary">
            <div className="card-body">
              <h5 className="card-title">Total expedientes</h5>
              <p className="card-text stat-number">
                {reporte.total_expedientes ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card stat-card stat-success">
            <div className="card-body">
              <h5 className="card-title">Aprobados</h5>
              <p className="card-text stat-number">
                {reporte.total_aprobados ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card stat-card stat-danger">
            <div className="card-body">
              <h5 className="card-title">Rechazados</h5>
              <p className="card-text stat-number">
                {reporte.total_rechazados ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesPage;
