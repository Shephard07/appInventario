import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Formulario
  const [form, setForm] = useState({
    id: null,
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    categoria_id: '',
    proveedor_id: ''
  });
  const [errorForm, setErrorForm] = useState('');

  // Paginación visual (5 por página como en la captura)
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resProd, resCat, resProv] = await Promise.all([
        api.get('/productos'),
        api.get('/categorias'),
        api.get('/proveedores')
      ]);
      setProductos(resProd.data);
      setCategorias(resCat.data);
      setProveedores(resProv.data);
    } catch (err) {
      console.error('Error al cargar datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (producto = null) => {
    setErrorForm('');
    if (producto) {
      setForm({
        id: producto.id,
        nombre: producto.nombre,
        descripcion: producto.descripcion || '',
        precio: producto.precio,
        stock: producto.stock,
        categoria_id: producto.categoria_id || '',
        proveedor_id: producto.proveedor_id || ''
      });
    } else {
      setForm({
        id: null,
        nombre: '',
        descripcion: '',
        precio: '',
        stock: 0,
        categoria_id: categorias[0]?.id || '',
        proveedor_id: proveedores[0]?.id || ''
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
    if (!form.categoria_id) {
      setErrorForm('Debe seleccionar una categoría obligatoria.');
      return;
    }

    try {
      if (form.id) {
        await api.put(`/productos/${form.id}`, form);
      } else {
        await api.post('/productos', form);
      }
      handleCloseModal();
      cargarDatos();
    } catch (err) {
      setErrorForm(err.response?.data?.error || 'Error al guardar el producto');
    }
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Está seguro de eliminar el producto "${nombre}"?`)) {
      try {
        await api.delete(`/productos/${id}`);
        cargarDatos();
      } catch (err) {
        alert(err.response?.data?.error || 'Error al eliminar producto');
      }
    }
  };

  // Filtrado
  const productosFiltrados = productos.filter((p) => {
    const q = busqueda.toLowerCase();
    const nombre = p.nombre ? p.nombre.toLowerCase() : '';
    const cat = p.categoria?.nombre ? p.categoria.nombre.toLowerCase() : '';
    const coincideTexto = nombre.includes(q) || cat.includes(q);

    if (filtroCategoria) {
      return coincideTexto && String(p.categoria_id) === String(filtroCategoria);
    }
    return coincideTexto;
  });

  // Cálculo de paginación
  const totalPaginas = Math.ceil(productosFiltrados.length / elementosPorPagina) || 1;
  const indexInicio = (paginaActual - 1) * elementosPorPagina;
  const productosPaginados = productosFiltrados.slice(indexInicio, indexInicio + elementosPorPagina);

  return (
    <div>
      {/* Encabezado */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Productos</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
            Gestiona el inventario de artículos disponibles para venta y almacenamiento.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn btn-primary d-inline-flex align-items-center gap-2 shadow-sm px-3 py-2 fw-semibold"
          style={{ borderRadius: '8px' }}
        >
          <Plus size={18} />
          <span>+ Nuevo Producto</span>
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-5">
              <div className="search-box-container">
                <Search size={16} className="search-box-icon" />
                <input
                  type="text"
                  className="search-box-input"
                  placeholder="Buscar por Nombre o Categoría..."
                  value={busqueda}
                  onChange={(e) => {
                    setBusqueda(e.target.value);
                    setPaginaActual(1);
                  }}
                />
              </div>
            </div>
            <div className="col-12 col-md-4">
              <select
                className="form-select form-select-sm"
                style={{ borderRadius: '8px', padding: '0.6rem 0.85rem' }}
                value={filtroCategoria}
                onChange={(e) => {
                  setFiltroCategoria(e.target.value);
                  setPaginaActual(1);
                }}
              >
                <option value="">Todas las Categorías</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-3 text-md-end text-muted small">
              Total encontrados: <strong className="text-dark">{productosFiltrados.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
          <div className="d-flex align-items-center gap-2">
            <Package size={18} className="text-primary" />
            <h6 className="fw-bold mb-0 text-dark">Lista de Productos</h6>
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
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th style={{ width: '200px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosPaginados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    {loading ? 'Cargando catálogo...' : 'No se encontraron productos registrados.'}
                  </td>
                </tr>
              ) : (
                productosPaginados.map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <span className="badge-id">
                        {String(prod.id).padStart(3, '0')}
                      </span>
                    </td>
                    <td>
                      <div className="fw-bold text-dark">{prod.nombre}</div>
                      {prod.descripcion && (
                        <div className="text-muted small text-truncate" style={{ maxWidth: '300px' }}>
                          {prod.descripcion}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge bg-light text-secondary border px-2 py-1 fw-semibold" style={{ fontSize: '0.8rem' }}>
                        {prod.categoria?.nombre || 'Sin categoría'}
                      </span>
                    </td>
                    <td>
                      <span className="fw-bold text-dark" style={{ fontSize: '0.92rem' }}>
                        S/ {Number(prod.precio).toFixed(2)}
                      </span>
                    </td>
                    <td>
                      {prod.stock <= 5 ? (
                        <span className="badge bg-danger-subtle text-danger border border-danger-subtle d-inline-flex align-items-center gap-1 fw-semibold px-2 py-1">
                          <AlertTriangle size={13} /> {prod.stock} (Bajo)
                        </span>
                      ) : (
                        <span className="badge bg-success-subtle text-success border border-success-subtle fw-semibold px-2 py-1">
                          {prod.stock} und
                        </span>
                      )}
                    </td>
                    {/* ACCIONES ALINEADAS Y CON BOTONES ESTILIZADOS */}
                    <td>
                      <div className="action-buttons-wrapper">
                        <button
                          onClick={() => handleOpenModal(prod)}
                          className="btn-action btn-action-edit"
                          title="Editar producto"
                        >
                          <Edit size={14} />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDelete(prod.id, prod.nombre)}
                          className="btn-action btn-action-delete"
                          title="Eliminar producto"
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

        {/* Paginador inferior idéntico a las capturas */}
        <div className="card-footer bg-white py-3 px-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 border-top">
          <small className="text-muted">
            Mostrando {productosFiltrados.length === 0 ? 0 : indexInicio + 1}-
            {Math.min(indexInicio + elementosPorPagina, productosFiltrados.length)} de{' '}
            {productosFiltrados.length} productos
          </small>

          <div className="pagination-custom">
            <button
              className="page-btn"
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
              title="Anterior"
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
              title="Siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Crear / Editar Producto */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '14px', overflow: 'hidden' }}>
              <div className="modal-header bg-light py-3 px-4 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 bg-primary-subtle text-primary rounded-3">
                    <Package size={18} />
                  </div>
                  <h5 className="modal-title fw-bold text-dark mb-0">
                    {form.id ? 'Editar Producto' : 'Nuevo Producto'}
                  </h5>
                </div>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  {errorForm && (
                    <div className="alert alert-danger py-2 small mb-3" role="alert">
                      {errorForm}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Nombre del Producto *</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Ej. Mouse Logitech G203"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">
                      Categoría * <span className="text-primary fw-normal">(Relación dinámica)</span>
                    </label>
                    <select
                      name="categoria_id"
                      className="form-select"
                      value={form.categoria_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Seleccionar Categoría --</option>
                      {categorias.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Proveedor</label>
                    <select
                      name="proveedor_id"
                      className="form-select"
                      value={form.proveedor_id}
                      onChange={handleChange}
                    >
                      <option value="">-- Seleccionar Proveedor --</option>
                      {proveedores.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.razon_social}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold text-secondary">Precio Unitario (S/) *</label>
                      <input
                        type="number"
                        step="0.01"
                        name="precio"
                        className="form-control"
                        value={form.precio}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold text-secondary">Stock Inicial</label>
                      <input
                        type="number"
                        name="stock"
                        className="form-control"
                        value={form.stock}
                        onChange={handleChange}
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-0">
                    <label className="form-label small fw-bold text-secondary">Descripción Técnica</label>
                    <textarea
                      name="descripcion"
                      rows="2"
                      className="form-control"
                      value={form.descripcion}
                      onChange={handleChange}
                      placeholder="Detalles del modelo, conectividad, garantía..."
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer bg-light px-4 py-3 border-top">
                  <button type="button" className="btn btn-outline-secondary px-3" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary px-4 fw-semibold">
                    {form.id ? 'Guardar Cambios' : 'Registrar Producto'}
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

export default Productos;
