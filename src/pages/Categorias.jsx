import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    id: null,
    nombre: '',
    descripcion: ''
  });
  const [errorForm, setErrorForm] = useState('');

  // Paginación visual
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categorias');
      setCategorias(res.data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cat = null) => {
    setErrorForm('');
    if (cat) {
      setForm({
        id: cat.id,
        nombre: cat.nombre,
        descripcion: cat.descripcion || ''
      });
    } else {
      setForm({ id: null, nombre: '', descripcion: '' });
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
        await api.put(`/categorias/${form.id}`, form);
      } else {
        await api.post('/categorias', form);
      }
      handleCloseModal();
      cargarCategorias();
    } catch (err) {
      setErrorForm(err.response?.data?.error || 'Error al guardar categoría');
    }
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de eliminar la categoría "${nombre}"?`)) {
      try {
        await api.delete(`/categorias/${id}`);
        cargarCategorias();
      } catch (err) {
        alert(err.response?.data?.error || 'Error al eliminar categoría');
      }
    }
  };

  const filtradas = categorias.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalPaginas = Math.ceil(filtradas.length / elementosPorPagina) || 1;
  const indexInicio = (paginaActual - 1) * elementosPorPagina;
  const paginadas = filtradas.slice(indexInicio, indexInicio + elementosPorPagina);

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Categorías</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
            Clasificación jerárquica para la organización del catálogo comercial.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary d-inline-flex align-items-center gap-2 shadow-sm px-3 py-2 fw-semibold"
          style={{ borderRadius: '8px' }}
        >
          <Plus size={18} />
          <span>+ Nueva Categoría</span>
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
                  placeholder="Buscar por Nombre de Categoría..."
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    setPaginaActual(1);
                  }}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 text-md-end text-muted small">
              Total categorías: <strong className="text-dark">{filtradas.length}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
          <div className="d-flex align-items-center gap-2">
            <Layers size={18} className="text-primary" />
            <h6 className="fw-bold mb-0 text-dark">Lista de Categorías</h6>
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
                <th>Descripción</th>
                <th style={{ width: '150px', textAlign: 'center' }}>Cant. Productos</th>
                <th style={{ width: '200px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginadas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    {loading ? 'Cargando categorías...' : 'No hay categorías registradas.'}
                  </td>
                </tr>
              ) : (
                paginadas.map((cat) => (
                  <tr key={cat.id}>
                    <td>
                      <span className="badge-id">
                        {String(cat.id).padStart(3, '0')}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{cat.nombre}</div>
                    </td>
                    <td>
                      <div className="text-muted small text-truncate" style={{ maxWidth: '380px' }}>
                        {cat.descripcion || '-'}
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 fw-bold">
                        {cat.cantidadProductos || 0}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-wrapper">
                        <button
                          onClick={() => handleOpenModal(cat)}
                          className="btn-action btn-action-edit"
                          title="Editar categoría"
                        >
                          <Edit size={14} />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id, cat.nombre)}
                          className="btn-action btn-action-delete"
                          title="Eliminar categoría"
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
            Mostrando {filtradas.length === 0 ? 0 : indexInicio + 1}-
            {Math.min(indexInicio + elementosPorPagina, filtradas.length)} de{' '}
            {filtradas.length} categorías
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
                    <Layers size={18} />
                  </div>
                  <h5 className="modal-title fw-bold text-dark mb-0">
                    {form.id ? 'Editar Categoría' : 'Nueva Categoría'}
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
                    <label className="form-label small fw-bold text-secondary">Nombre de la Categoría *</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Ej. Periféricos, Componentes, etc."
                      required
                    />
                  </div>

                  <div className="mb-0">
                    <label className="form-label small fw-bold text-secondary">Descripción</label>
                    <textarea
                      name="descripcion"
                      rows="3"
                      className="form-control"
                      value={form.descripcion}
                      onChange={handleChange}
                      placeholder="Breve detalle sobre los artículos pertenecientes..."
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer bg-light px-4 py-3 border-top">
                  <button type="button" className="btn btn-outline-secondary px-3" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary px-4 fw-semibold">
                    {form.id ? 'Guardar Cambios' : 'Crear Categoría'}
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

export default Categorias;
