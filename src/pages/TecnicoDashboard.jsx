import { useEffect, useState } from "react";
import api from "../services/api";

/**
 * Panel del técnico:
 * - Crea expedientes nuevos.
 * - Registra indicios asociados a un expediente existente.
 * - Muestra listado de expedientes propios con su estado.
 */
const TecnicoDashboard = () => {
  const [codigo, setCodigo] = useState("");
  const [expedientes, setExpedientes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const [indicio, setIndicio] = useState({
    id_expediente: "",
    descripcion: "",
    color: "",
    tamano: "",
    peso: "",
    ubicacion: ""
  });

  /**
   * Recupera expedientes desde el backend.
   * El técnico ve su listado para seleccionar en el formulario de indicios.
   */
  const cargarExpedientes = async () => {
    try {
      setCargando(true);
      const res = await api.get("/expedientes");
      setExpedientes(res.data);
    } catch (err) {
      console.error("Error al cargar expedientes (técnico):", err);
      setError("Error al cargar expedientes");
    } finally {
      setCargando(false);
    }
  };

  // Carga inicial de expedientes al montar el componente
  useEffect(() => {
    cargarExpedientes();
  }, []);

  /**
   * Envía el código para crear un nuevo expediente.
   */
  const crearExpediente = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      const res = await api.post("/expedientes", {
        codigo_expediente: codigo
      });
      setMensaje(`Expediente creado: ID ${res.data.id_expediente}`);
      setCodigo("");
      cargarExpedientes();
    } catch (err) {
      console.error("Error al crear expediente:", err);
      setError(err.response?.data?.message || "Error al crear expediente");
    }
  };

  /**
   * Crea un indicio asociado a un expediente ya existente.
   */
  const crearIndicio = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!indicio.id_expediente || !indicio.descripcion) {
      setError("Debe seleccionar expediente y agregar descripción");
      return;
    }

    try {
      await api.post("/indicios", indicio);
      setMensaje("Indicio registrado correctamente");
      setIndicio({
        ...indicio,
        descripcion: "",
        color: "",
        tamano: "",
        peso: "",
        ubicacion: ""
      });
    } catch (err) {
      console.error("Error al registrar indicio:", err);
      setError(err.response?.data?.message || "Error al registrar indicio");
    }
  };

  /**
   * Componente visual reutilizable para mostrar el estado del expediente.
   */
  const renderEstadoPill = (estado) => (
    <span className={`status-pill status-${estado}`}>{estado}</span>
  );

  return (
    <div>
      <h2 className="page-title">Panel Técnico</h2>
      <p className="page-subtitle">
        Registro de expedientes e indicios recolectados en escena.
      </p>

      <div className="row g-3 mb-4">
        {/* Crear expediente */}
        <div className="col-lg-6">
          <div className="dicri-card">
            <div className="dicri-card-header">Nuevo expediente</div>
            <div className="dicri-card-body">
              <form onSubmit={crearExpediente}>
                <div className="mb-2">
                  <label className="form-label">Código de expediente</label>
                  <input
                    className="form-control"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="Ej. MP-DICRI-2025-0001"
                    required
                  />
                </div>
                <button className="btn btn-primary" type="submit">
                  Guardar expediente
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Registrar indicio */}
        <div className="col-lg-6">
          <div className="dicri-card">
            <div className="dicri-card-header">Registrar indicio</div>
            <div className="dicri-card-body">
              <form onSubmit={crearIndicio}>
                <div className="mb-2">
                  <label className="form-label">Expediente</label>
                  <select
                    className="form-select"
                    value={indicio.id_expediente}
                    onChange={(e) =>
                      setIndicio({ ...indicio, id_expediente: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleccione...</option>
                    {expedientes.map((exp) => (
                      <option
                        key={exp.id_expediente}
                        value={exp.id_expediente}
                      >
                        {exp.codigo_expediente} ({exp.estado})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-2">
                  <label className="form-label">Descripción</label>
                  <input
                    className="form-control"
                    value={indicio.descripcion}
                    onChange={(e) =>
                      setIndicio({ ...indicio, descripcion: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label className="form-label">Color</label>
                    <input
                      className="form-control"
                      value={indicio.color}
                      onChange={(e) =>
                        setIndicio({ ...indicio, color: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label className="form-label">Tamaño</label>
                    <input
                      className="form-control"
                      value={indicio.tamano}
                      onChange={(e) =>
                        setIndicio({ ...indicio, tamano: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label className="form-label">Peso</label>
                    <input
                      className="form-control"
                      value={indicio.peso}
                      onChange={(e) =>
                        setIndicio({ ...indicio, peso: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <label className="form-label">Ubicación</label>
                    <input
                      className="form-control"
                      value={indicio.ubicacion}
                      onChange={(e) =>
                        setIndicio({ ...indicio, ubicacion: e.target.value })
                      }
                    />
                  </div>
                </div>

                <button className="btn btn-secondary mt-2" type="submit">
                  Guardar indicio
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <hr className="section-divider" />

      <h4 className="section-title">Expedientes registrados</h4>
      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <div className="dicri-card dicri-card-table">
          <table className="table table-sm dicri-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Fecha</th>
                <th>Técnico</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {expedientes.map((exp) => (
                <tr key={exp.id_expediente}>
                  <td className="table-code">{exp.codigo_expediente}</td>
                  <td>{new Date(exp.fecha_registro).toLocaleString()}</td>
                  <td>{exp.tecnico_nombre}</td>
                  <td>{renderEstadoPill(exp.estado)}</td>
                </tr>
              ))}
              {expedientes.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    Aún no hay expedientes registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TecnicoDashboard;
