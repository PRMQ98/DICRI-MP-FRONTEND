import { useEffect, useState } from "react";
import api from "../services/api";

const ReportesPage = () => {
  const [reporte, setReporte] = useState(null);
  const [error, setError] = useState("");

  const cargarReporte = async () => {
    try {
      setError("");
      const res = await api.get("/reportes");
      setReporte(res.data);
    } catch (err) {
      setError("Error al obtener reporte");
    }
  };

  useEffect(() => {
    cargarReporte();
  }, []);

  if (error) return <div className="alert alert-danger mt-3">{error}</div>;
  if (!reporte) return <p>Cargando reporte...</p>;

  return (
    <div>
      <h2>Reportes y estadísticas</h2>
      <p className="text-muted">
        Resumen general de expedientes registrados, aprobados y rechazados.
      </p>

      <div className="row">
        <div className="col-md-4">
          <div className="card text-bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Total expedientes</h5>
              <p className="card-text display-6">
                {reporte.total_expedientes ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Aprobados</h5>
              <p className="card-text display-6">
                {reporte.total_aprobados ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-danger mb-3">
            <div className="card-body">
              <h5 className="card-title">Rechazados</h5>
              <p className="card-text display-6">
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
