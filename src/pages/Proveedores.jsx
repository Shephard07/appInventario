import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  User,
  Truck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    id: null,
    razon_social: '',
    contacto: '',
    telefono: '',
    email: ''
  });
  const [errorForm, setErrorForm] = useState('');

  // Paginación visual
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      const res = await api.get('/proveedores');
      setProveedores(res.data);
    } catch (err) {
      console.error('Error al cargar proveedores:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (prov = null) => {
    setErrorForm('');
    if (prov) {
      setForm({
        id: prov.id,
        razon_social: prov.razon_social,
        contacto: prov.contacto || '',
        telefono: prov.telefono || '',
        email: prov.email || ''
      });
    } else {
      setForm({
        id: null,
        razon_social: '',
        contacto: '',
        telefono: '',
        email: ''
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
        await api.put(`/proveedores/${form.id}`, form);
      } else {
        await api.post('/proveedores', form);
      }
      handleCloseModal();
      cargarProveedores();
    } catch (err) {
      setErrorForm(err.response?.data?.error || 'Error al guardar proveedor');
    }
  };

  const handleDelete = async (id, razon) => {
    if (window.confirm(`¿Está seguro de eliminar el proveedor "${razon}"?`)) {
      try {
        await api.delete(`/proveedores/${id}`);
        cargarProveedores();
      } catch (err) {
        alert(err.response?.data?.error || 'Error al eliminar proveedor');
      }
    }
  };

  const filtrados = proveedores.filter((p) => {
    const q = busqueda.toLowerCase();
    const rs = p.razon_social ? p.razon_social.toLowerCase() : '';
    const ct = p.contacto ? p.contacto.toLowerCase() : '';
    return rs.includes(q) || ct.includes(q);
  });

  const totalPaginas = Math.ceil(filtrados.length / elementosPorPagina) || 1;
  const indexInicio = (paginaActual - 1) * elementosPorPagina;
  const paginados = filtrados.slice(indexInicio, indexInicio + elementosPorPagina);

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Proveedores</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
            Empresas y distribuidoras comerciales que abastecen el inventario del negocio.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary d-inline-flex align-items-center gap-2 shadow-sm px-3 py-2 fw-semibold"
          style={{ borderRadius: '8px' }}
        >
          <Plus size={18} />
          <span>+ Nuevo Proveedor</span>
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
                  placeholder="Buscar por Razón Social o Contacto..."
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    setPaginaActual(1);
                  }}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 text-md-end text-muted small">
              Total proveedores: <strong className="text-dark">{filtrados.length}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
          <div className="d-flex align-items-center gap-2">
            <Truck size={18} className="text-primary" />
            <h6 className="fw-bold mb-0 text-dark">Lista de Proveedores</h6>
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
                <th>Razón Social</th>
                <th>Contacto</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th style={{ width: '200px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    {loading ? 'Cargando proveedores...' : 'No hay proveedores registrados.'}
                  </td>
                </tr>
              ) : (
                paginados.map((prov) => (
                  <tr key={prov.id}>
                    <td>
                      <span className="badge-id">
                        {String(prov.id).padStart(3, '0')}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{prov.razon_social}</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2 text-secondary">
                        <User size={14} className="text-muted" />
                        <span>{prov.contacto || '-'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2 text-secondary">
                        <Phone size={14} className="text-muted" />
                        <span>{prov.telefono || '-'}</span>
                      </div>
                    </td>
                    <td>
                      {prov.email ? (
                        <div className="d-flex align-items-center gap-2 text-primary">
                          <Mail size={14} />
                          <span style={{ fontSize: '0.88rem' }}>{prov.email}</span>
                        </div>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons-wrapper">
                        <button
                          onClick={() => handleOpenModal(prov)}
                          className="btn-action btn-action-edit"
                          title="Editar proveedor"
                        >
                          <Edit size={14} />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDelete(prov.id, prov.razon_social)}
                          className="btn-action btn-action-delete"
                          title="Eliminar proveedor"
                        >
                          <Trash2 size={14} />
                          <span>Eliminar</span>
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
            {filtrados.length} proveedores
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
                    <Truck size={18} />
                  </div>
                  <h5 className="modal-title fw-bold text-dark mb-0">
                    {form.id ? 'Editar Proveedor' : 'Nuevo Proveedor'}
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
                    <label className="form-label small fw-bold text-secondary">Razón Social *</label>
                    <input
                      type="text"
                      name="razon_social"
                      className="form-control"
                      value={form.razon_social}
                      onChange={handleChange}
                      placeholder="Ej. Logitech Perú S.A.C."
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Nombre de Contacto</label>
                    <input
                      type="text"
                      name="contacto"
                      className="form-control"
                      value={form.contacto}
                      onChange={handleChange}
                      placeholder="Ej. Carlos Mendoza"
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold text-secondary">Teléfono</label>
                      <input
                        type="text"
                        name="telefono"
                        className="form-control"
                        value={form.telefono}
                        onChange={handleChange}
                        placeholder="Ej. 987 654 321"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold text-secondary">Correo Electrónico</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="ventas@proveedor.pe"
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light px-4 py-3 border-top">
                  <button type="button" className="btn btn-outline-secondary px-3" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary px-4 fw-semibold">
                    {form.id ? 'Guardar Cambios' : 'Registrar Proveedor'}
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

export default Proveedores;
