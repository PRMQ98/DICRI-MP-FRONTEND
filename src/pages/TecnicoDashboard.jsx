import { useEffect, useState } from "react";
import api from "../services/api";

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

  const cargarExpedientes = async () => {
    try {
      setCargando(true);
      const res = await api.get("/expedientes");
      setExpedientes(res.data);
    } catch (err) {
      setError("Error al cargar expedientes");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarExpedientes();
  }, []);

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
      setError(err.response?.data?.message || "Error al crear expediente");
    }
  };

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
      setError(err.response?.data?.message || "Error al registrar indicio");
    }
  };

  return (
    <div>
      <h2>Panel Técnico</h2>
      <p className="text-muted">
        Registro de expedientes e indicios recolectados en escena.
      </p>

      <div className="row">
        {/* Crear expediente */}
        <div className="col-md-6">
          <div className="card mb-3 shadow-sm">
            <div className="card-header">Nuevo expediente</div>
            <div className="card-body">
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
        <div className="col-md-6">
          <div className="card mb-3 shadow-sm">
            <div className="card-header">Registrar indicio</div>
            <div className="card-body">
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

      <hr />

      <h4>Expedientes registrados</h4>
      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <table className="table table-sm table-striped">
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
                <td>{exp.codigo_expediente}</td>
                <td>{new Date(exp.fecha_registro).toLocaleString()}</td>
                <td>{exp.tecnico_nombre}</td>
                <td>{exp.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TecnicoDashboard;
