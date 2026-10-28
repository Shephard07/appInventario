import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  User,
  Power,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    id: null,
    nombre: '',
    email: '',
    password: '',
    rol: 'Almacenero',
    estado: 'Activo'
  });
  const [errorForm, setErrorForm] = useState('');

  // Paginación visual
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const res = await api.get('/usuarios');
      setUsuarios(res.data);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user = null) => {
    setErrorForm('');
    if (user) {
      setForm({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        password: '',
        rol: user.rol || 'Almacenero',
        estado: user.estado || 'Activo'
      });
    } else {
      setForm({
        id: null,
        nombre: '',
        email: '',
        password: '',
        rol: 'Almacenero',
        estado: 'Activo'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrorForm('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await api.put(`/usuarios/${form.id}`, form);
      } else {
        await api.post('/usuarios', form);
      }
      handleCloseModal();
      cargarUsuarios();
    } catch (err) {
      setErrorForm(err.response?.data?.error || 'Error al guardar usuario');
    }
  };

  const handleToggleEstado = async (user) => {
    const nuevoEstado = user.estado === 'Activo' ? 'Inactivo' : 'Activo';
    try {
      await api.put(`/usuarios/${user.id}`, {
        ...user,
        estado: nuevoEstado
      });
      cargarUsuarios();
    } catch (err) {
      alert('Error al actualizar estado');
    }
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Seguro que deseas eliminar al usuario "${nombre}"?`)) {
      try {
        await api.delete(`/usuarios/${id}`);
        cargarUsuarios();
      } catch (err) {
        alert(err.response?.data?.error || 'Error al eliminar');
      }
    }
  };

  const filtrados = usuarios.filter((u) => {
    const q = busqueda.toLowerCase();
    const nom = u.nombre ? u.nombre.toLowerCase() : '';
    const em = u.email ? u.email.toLowerCase() : '';
    return nom.includes(q) || em.includes(q);
  });

  const totalPaginas = Math.ceil(filtrados.length / elementosPorPagina) || 1;
  const indexInicio = (paginaActual - 1) * elementosPorPagina;
  const paginados = filtrados.slice(indexInicio, indexInicio + elementosPorPagina);

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Usuarios</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
            Control de cuentas, roles de acceso y personal autorizado en el panel administrativo.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary d-inline-flex align-items-center gap-2 shadow-sm px-3 py-2 fw-semibold"
          style={{ borderRadius: '8px' }}
        >
          <Plus size={18} />
          <span>+ Nuevo Usuario</span>
        </button>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-6">
              <div className="search-box-container">
                <Search size={16} className="search-box-icon" />
                <input
                  type="text"
                  className="search-box-input"
                  placeholder="Buscar por Nombre o Correo..."
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    setPaginaActual(1);
                  }}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 text-md-end text-muted small">
              Total usuarios: <strong className="text-dark">{filtrados.length}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
          <div className="d-flex align-items-center gap-2">
            <User size={18} className="text-primary" />
            <h6 className="fw-bold mb-0 text-dark">Lista de Usuarios</h6>
          </div>
          <span className="badge bg-light text-secondary border px-2 py-1">
            Página {paginaActual} de {totalPaginas}
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-custom align-middle">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th>Nombre</th>
                <th>Correo Electrónico</th>
                <th>Rol</th>
                <th>Estado</th>
                <th style={{ width: '230px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    {loading ? 'Cargando cuentas...' : 'No hay usuarios registrados.'}
                  </td>
                </tr>
              ) : (
                paginados.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <span className="badge-id">
                        {String(u.id).padStart(3, '0')}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-primary fw-bold"
                          style={{ width: '32px', height: '32px', backgroundColor: '#eff6ff', fontSize: '0.8rem' }}
                        >
                          {u.nombre.charAt(0)}
                        </div>
                        <div className="fw-bold text-dark">{u.nombre}</div>
                      </div>
                    </td>
                    <td>
                      <span className="text-secondary small">{u.email}</span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border d-inline-flex align-items-center gap-1 px-2 py-1 fw-semibold">
                        <Shield size={12} className="text-primary" />
                        {u.rol}
                      </span>
                    </td>
                    <td>
                      <span
                        className={
                          u.estado === 'Activo'
                            ? 'badge bg-success-subtle text-success border border-success-subtle px-2 py-1'
                            : 'badge bg-secondary-subtle text-secondary px-2 py-1'
                        }
                      >
                        {u.estado}
                      </span>
                    </td>
                    {/* BOTONES DE ACCIÓN ESPACIADOS Y ORDENADOS */}
                    <td>
                      <div className="action-buttons-wrapper">
                        <button
                          onClick={() => handleOpenModal(u)}
                          className="btn-action btn-action-edit"
                          title="Editar usuario"
                        >
                          <Edit size={13} />
                          <span>Editar</span>
                        </button>

                        <button
                          onClick={() => handleToggleEstado(u)}
                          className={`btn-action ${
                            u.estado === 'Activo' ? 'btn-action-toggle-off' : 'btn-action-toggle-on'
                          }`}
                          title={u.estado === 'Activo' ? 'Desactivar acceso' : 'Activar acceso'}
                        >
                          <Power size={13} />
                          <span>{u.estado === 'Activo' ? 'Desactivar' : 'Activar'}</span>
                        </button>

                        <button
                          onClick={() => handleDelete(u.id, u.nombre)}
                          className="btn-action btn-action-delete p-2"
                          title="Eliminar usuario"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card-footer bg-white py-3 px-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 border-top">
          <small className="text-muted">
            Mostrando {filtrados.length === 0 ? 0 : indexInicio + 1}-
            {Math.min(indexInicio + elementosPorPagina, filtrados.length)} de{' '}
            {filtrados.length} usuarios
          </small>

          <div className="pagination-custom">
            <button
              className="page-btn"
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`page-btn ${paginaActual === num ? 'active' : ''}`}
                onClick={() => setPaginaActual(num)}
              >
                {num}
              </button>
            ))}
            <button
              className="page-btn"
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '14px', overflow: 'hidden' }}>
              <div className="modal-header bg-light py-3 px-4 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 bg-primary-subtle text-primary rounded-3">
                    <User size={18} />
                  </div>
                  <h5 className="modal-title fw-bold text-dark mb-0">
                    {form.id ? 'Editar Usuario' : 'Nuevo Usuario'}
                  </h5>
                </div>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  {errorForm && (
                    <div className="alert alert-danger py-2 small mb-3">
                      {errorForm}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Nombre Completo *</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Ej. Marco Antonio Ruiz"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Correo Electrónico *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="mruiz@inventario.com"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">
                      {form.id ? 'Nueva Contraseña (dejar en blanco para conservar actual)' : 'Contraseña Inicial'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={form.password}
                      onChange={handleChange}
                      placeholder={form.id ? 'Dejar en blanco para no modificar' : 'password123 (por defecto)'}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold text-secondary">Rol *</label>
                      <select
                        name="rol"
                        className="form-select"
                        value={form.rol}
                        onChange={handleChange}
                        required
                      >
                        <option value="Administrador">Administrador</option>
                        <option value="Almacenero">Almacenero</option>
                        <option value="Supervisor">Supervisor</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold text-secondary">Estado *</label>
                      <select
                        name="estado"
                        className="form-select"
                        value={form.estado}
                        onChange={handleChange}
                      >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light px-4 py-3 border-top">
                  <button type="button" className="btn btn-outline-secondary px-3" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary px-4 fw-semibold">
                    {form.id ? 'Guardar Cambios' : 'Crear Usuario'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
