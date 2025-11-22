import { useEffect, useState } from "react";
import api from "../services/api";

const CoordinadorDashboard = () => {
  const [expedientes, setExpedientes] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("registrado");
  const [justificacion, setJustificacion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cargarExpedientes = async () => {
    try {
      setError("");
      const res = await api.get("/expedientes", {
        params: { estado: estadoFiltro || null }
      });
      setExpedientes(res.data);
    } catch (err) {
      setError("Error al cargar expedientes");
    }
  };

  useEffect(() => {
    cargarExpedientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoFiltro]);

  const aprobar = async (id) => {
    try {
      setMensaje("");
      setError("");
      await api.post(`/expedientes/${id}/aprobar`);
      setMensaje("Expediente aprobado");
      cargarExpedientes();
    } catch (err) {
      setError("Error al aprobar expediente");
    }
  };

  const rechazar = async (id) => {
    if (!justificacion.trim()) {
      setError("Debe ingresar una justificación para el rechazo");
      return;
    }
    try {
      setMensaje("");
      setError("");
      await api.post(`/expedientes/${id}/rechazar`, {
        justificacion
      });
      setJustificacion("");
      setMensaje("Expediente rechazado");
      cargarExpedientes();
    } catch (err) {
      setError("Error al rechazar expediente");
    }
  };

  return (
    <div>
      <h2>Panel Coordinador</h2>
      <p className="text-muted">
        Revisión, aprobación o rechazo de expedientes generados por los técnicos.
      </p>

      <div className="mb-3">
        <label className="form-label me-2">Filtrar por estado:</label>
        <select
          className="form-select d-inline-block w-auto"
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="registrado">Registrado</option>
          <option value="aprobado">Aprobado</option>
          <option value="rechazado">Rechazado</option>
        </select>
      </div>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-sm table-striped">
        <thead>
          <tr>
            <th>Código</th>
            <th>Técnico</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th style={{ width: "260px" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {expedientes.map((exp) => (
            <tr key={exp.id_expediente}>
              <td>{exp.codigo_expediente}</td>
              <td>{exp.tecnico_nombre}</td>
              <td>{new Date(exp.fecha_registro).toLocaleString()}</td>
              <td>{exp.estado}</td>
              <td>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => aprobar(exp.id_expediente)}
                  disabled={exp.estado === "aprobado"}
                >
                  Aprobar
                </button>
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => rechazar(exp.id_expediente)}
                  disabled={exp.estado === "rechazado"}
                >
                  Rechazar
                </button>
              </td>
            </tr>
          ))}
          {expedientes.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">
                No hay expedientes para el filtro seleccionado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="mt-3">
        <h5>Justificación de rechazo</h5>
        <textarea
          className="form-control"
          rows="3"
          value={justificacion}
          onChange={(e) => setJustificacion(e.target.value)}
          placeholder="Describa claramente el motivo del rechazo..."
        />
      </div>
    </div>
  );
};

export default CoordinadorDashboard;
