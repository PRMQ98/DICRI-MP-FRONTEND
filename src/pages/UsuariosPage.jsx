// src/pages/UsuariosPage.jsx
import { useEffect, useState } from "react";
import api from "../services/api";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    id_usuario: null,
    nombre: "",
    usuario: "",
    password: "",
    rol: "tecnico",
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const cargarUsuarios = async () => {
    try {
      const res = await api.get("/usuarios");
      setUsuarios(res.data);
    } catch (err) {
      setError("Error al cargar usuarios");
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const resetForm = () => {
    setForm({
      id_usuario: null,
      nombre: "",
      usuario: "",
      password: "",
      rol: "tecnico",
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      if (form.id_usuario) {
        // Actualizar
        await api.put(`/usuarios/${form.id_usuario}`, {
          nombre: form.nombre,
          usuario: form.usuario,
          rol: form.rol,
        });

        // Si el usuario editado es el que está logueado, actualizar localStorage
        if (currentUser && currentUser.id_usuario === form.id_usuario) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...currentUser,
              nombre: form.nombre,
              usuario: form.usuario,
              rol: form.rol,
            })
          );
        }

        setMensaje("Usuario actualizado correctamente");
      } else {
        // Crear
        await api.post("/usuarios", {
          nombre: form.nombre,
          usuario: form.usuario,
          password: form.password,
          rol: form.rol,
        });

        setMensaje("Usuario creado correctamente");
      }

      resetForm();
      cargarUsuarios();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar el usuario");
    }
  };

  const editarUsuario = (u) => {
    setMensaje("");
    setError("");
    setForm({
      id_usuario: u.id_usuario,
      nombre: u.nombre,
      usuario: u.usuario,
      password: "",
      rol: u.rol,
    });
  };

  const cambiarEstado = async (u) => {
    setMensaje("");
    setError("");

    try {
      await api.patch(`/usuarios/${u.id_usuario}/estado`, {
        activo: !u.activo,
      });
      setMensaje("Estado actualizado");
      cargarUsuarios();
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al cambiar estado del usuario"
      );
    }
  };

  const eliminarUsuario = async (u) => {
    if (!window.confirm(`¿Eliminar al usuario ${u.usuario}?`)) return;

    setMensaje("");
    setError("");

    try {
      await api.delete(`/usuarios/${u.id_usuario}`);
      setMensaje("Usuario eliminado");
      cargarUsuarios();
    } catch (err) {
      setError(err.response?.data?.message || "Error al eliminar usuario");
    }
  };

  const esMismoUsuario = (u) =>
    currentUser && currentUser.id_usuario === u.id_usuario;

  return (
    <div className="page page-usuarios">
      <h2 className="page-title">Gestión de usuarios</h2>
      <p className="text-muted page-subtitle">
        Solo el coordinador puede crear, editar, activar/inactivar o eliminar
        usuarios. No es posible desactivar o eliminar al usuario coordinador que
        está actualmente logueado.
      </p>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 usuarios-layout">
        {/* Formulario */}
        <div className="col-12 col-lg-4">
          <div className="card usuarios-form-card dicri-card">
            <div className="card-header usuarios-form-header">
              {form.id_usuario ? "Editar usuario" : "Nuevo usuario"}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Usuario</label>
                  <input
                    type="text"
                    name="usuario"
                    className="form-control"
                    value={form.usuario}
                    onChange={handleChange}
                    required
                  />
                </div>

                {!form.id_usuario && (
                  <div className="mb-2">
                    <label className="form-label">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={form.password}
                      onChange={handleChange}
                      required={!form.id_usuario}
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Rol</label>
                  <select
                    name="rol"
                    className="form-select"
                    value={form.rol}
                    onChange={handleChange}
                  >
                    <option value="tecnico">Técnico</option>
                    <option value="coordinador">Coordinador</option>
                  </select>
                </div>

                <button className="btn btn-primary w-100" type="submit">
                  {form.id_usuario ? "Actualizar usuario" : "Crear usuario"}
                </button>

                {form.id_usuario && (
                  <button
                    type="button"
                    className="btn btn-secondary w-100 mt-2"
                    onClick={resetForm}
                  >
                    Cancelar edición
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="col-12 col-lg-8">
          <div className="card usuarios-table-card dicri-card dicri-card-table">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="section-title mb-0">Usuarios registrados</h5>
                <span className="badge bg-light text-muted small">
                  Total: {usuarios.length}
                </span>
              </div>

              <div className="table-responsive">
                <table className="table table-sm dicri-table mb-0">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Usuario</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th className="text-end acciones-header">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u.id_usuario}>
                        <td>{u.nombre}</td>
                        <td>{u.usuario}</td>
                        <td>{u.rol}</td>
                        <td>
                          <span
                            className={`status-pill ${
                              u.activo ? "status-aprobado" : "status-rechazado"
                            }`}
                          >
                            {u.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="acciones-cell">
                          {/* AQUÍ van los botones en fila, controlados por CSS */}
                          <div className="acciones-wrapper">
                            <button
                              className="btn btn-outline-primary btn-chip"
                              onClick={() => editarUsuario(u)}
                            >
                              Editar
                            </button>

                            <button
                              className="btn btn-outline-warning btn-chip"
                              onClick={() => cambiarEstado(u)}
                              disabled={esMismoUsuario(u)}
                            >
                              {u.activo ? "Desactivar" : "Activar"}
                            </button>

                            <button
                              className="btn btn-outline-danger btn-chip"
                              onClick={() => eliminarUsuario(u)}
                              disabled={esMismoUsuario(u)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {usuarios.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-4">
                          No hay usuarios registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuariosPage;
