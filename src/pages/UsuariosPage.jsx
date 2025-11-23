import { useEffect, useState } from "react";
import api from "../services/api";

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    id_usuario: null,
    nombre: "",
    usuario: "",
    password: "",
    rol: "tecnico"
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
      rol: "tecnico"
    });
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      if (form.id_usuario) {
        // actualizar (sin password)
        await api.put(`/usuarios/${form.id_usuario}`, {
          nombre: form.nombre,
          usuario: form.usuario,
          rol: form.rol
        });

        // si el que se actualiza es el usuario logueado, actualizamos localStorage
        if (currentUser && currentUser.id_usuario === form.id_usuario) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...currentUser,
              nombre: form.nombre,
              usuario: form.usuario,
              rol: form.rol
            })
          );
        }

        setMensaje("Usuario actualizado correctamente");
      } else {
        // crear
        await api.post("/usuarios", {
          nombre: form.nombre,
          usuario: form.usuario,
          password: form.password,
          rol: form.rol
        });
        setMensaje("Usuario creado correctamente");
      }

      resetForm();
      cargarUsuarios();
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al guardar el usuario"
      );
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
      rol: u.rol
    });
  };

  const cambiarEstado = async (u) => {
    setMensaje("");
    setError("");

    try {
      await api.patch(`/usuarios/${u.id_usuario}/estado`, {
        activo: !u.activo
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
      setError(
        err.response?.data?.message || "Error al eliminar usuario"
      );
    }
  };

  const esMismoUsuario = (u) =>
    currentUser && currentUser.id_usuario === u.id_usuario;

  return (
    <div>
      <h2>Gestión de usuarios</h2>
      <p className="text-muted">
        Solo el coordinador puede crear, editar, activar/inactivar o eliminar
        usuarios. No es posible desactivar o eliminar al usuario coordinador que
        está actualmente logueado.
      </p>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-md-4">
          <div className="card mb-3 shadow-sm">
            <div className="card-header">
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

                <div className="mb-2">
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
                  {form.id_usuario ? "Actualizar" : "Crear"}
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

        <div className="col-md-8">
          <h5>Usuarios registrados</h5>
          <table className="table table-sm table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th style={{ width: "220px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id_usuario}>
                  <td>{u.nombre}</td>
                  <td>{u.usuario}</td>
                  <td>{u.rol}</td>
                  <td>{u.activo ? "Activo" : "Inactivo"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => editarUsuario(u)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-sm btn-outline-warning me-1"
                      onClick={() => cambiarEstado(u)}
                      disabled={esMismoUsuario(u)}
                    >
                      {u.activo ? "Desactivar" : "Activar"}
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminarUsuario(u)}
                      disabled={esMismoUsuario(u)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsuariosPage;
