import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  AlertCircle,
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Calendar,
  UserCheck
} from 'lucide-react';

const Movimientos = () => {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [detalleMov, setDetalleMov] = useState(null);

  // Formulario
  const [form, setForm] = useState({
    producto_id: '',
    usuario_id: '',
    tipo_movimiento: 'Entrada',
    cantidad: 1,
    observaciones: ''
  });
  const [errorForm, setErrorForm] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // Paginación visual
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resMov, resProd, resUser] = await Promise.all([
        api.get('/movimientos'),
        api.get('/productos'),
        api.get('/usuarios')
      ]);
      setMovimientos(resMov.data);
      setProductos(resProd.data);
      setUsuarios(resUser.data);
    } catch (err) {
      console.error('Error al cargar datos del Kardex:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setErrorForm('');
    setMensajeExito('');
    setForm({
      producto_id: productos[0]?.id || '',
      usuario_id: usuarios[0]?.id || '',
      tipo_movimiento: 'Entrada',
      cantidad: 1,
      observaciones: ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrorForm('');
    setMensajeExito('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorForm('');
    setMensajeExito('');

    if (!form.producto_id) {
      setErrorForm('Debe seleccionar un producto.');
      return;
    }

    const cant = parseInt(form.cantidad, 10);
    if (!cant || cant <= 0) {
      setErrorForm('La cantidad debe ser un número entero mayor a cero.');
      return;
    }

    try {
      const res = await api.post('/movimientos', form);
      setMensajeExito(res.data.message || 'Movimiento registrado con éxito.');
      setTimeout(() => {
        handleCloseModal();
        cargarDatos();
      }, 1000);
    } catch (err) {
      setErrorForm(err.response?.data?.error || 'Error al procesar la transacción.');
    }
  };

  const productoSeleccionado = productos.find((p) => String(p.id) === String(form.producto_id));

  const filtrados = movimientos.filter((m) => {
    const q = busqueda.toLowerCase();
    const prod = m.producto?.nombre ? m.producto.nombre.toLowerCase() : '';
    const user = m.usuario?.nombre ? m.usuario.nombre.toLowerCase() : '';
    const tipo = m.tipo_movimiento ? m.tipo_movimiento.toLowerCase() : '';
    const coincideTexto = prod.includes(q) || user.includes(q) || tipo.includes(q);

    if (filtroTipo) {
      return coincideTexto && m.tipo_movimiento === filtroTipo;
    }
    return coincideTexto;
  });

  const totalPaginas = Math.ceil(filtrados.length / elementosPorPagina) || 1;
  const indexInicio = (paginaActual - 1) * elementosPorPagina;
  const paginados = filtrados.slice(indexInicio, indexInicio + elementosPorPagina);

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Kardex / Movimientos</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
            Registro cronológico y atómico de entradas y salidas con actualización en tiempo real del stock.
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="btn btn-primary d-inline-flex align-items-center gap-2 shadow-sm px-3 py-2 fw-semibold"
          style={{ borderRadius: '8px' }}
        >
          <Plus size={18} />
          <span>+ Registrar Movimiento</span>
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
                  placeholder="Buscar por producto, tipo o responsable..."
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
                value={filtroTipo}
                onChange={(e) => {
                  setFiltroTipo(e.target.value);
                  setPaginaActual(1);
                }}
              >
                <option value="">Todos los tipos (Entrada / Salida / Ajuste)</option>
                <option value="Entrada">Solo Entradas</option>
                <option value="Salida">Solo Salidas</option>
                <option value="Ajuste">Solo Ajustes</option>
              </select>
            </div>
            <div className="col-12 col-md-3 text-md-end text-muted small">
              Total movimientos: <strong className="text-dark">{filtrados.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Movimientos */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
          <div className="d-flex align-items-center gap-2">
            <ArrowLeftRight size={18} className="text-primary" />
            <h6 className="fw-bold mb-0 text-dark">Lista de Movimientos (Kardex)</h6>
          </div>
          <span className="badge bg-light text-secondary border px-2 py-1">
            Página {paginaActual} de {totalPaginas}
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-custom align-middle">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>ID</th>
                <th>Fecha / Hora</th>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Cantidad</th>
                <th>Usuario</th>
                <th style={{ width: '130px', textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginados.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    {loading ? 'Cargando transacciones...' : 'No hay transacciones registradas.'}
                  </td>
                </tr>
              ) : (
                paginados.map((m) => {
                  const fecha = new Date(m.createdAt || m.fecha_hora).toLocaleString('es-PE', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={m.id}>
                      <td>
                        <span className="badge-id">
                          {String(m.id).padStart(3, '0')}
                        </span>
                      </td>
                      <td>
                        <span className="text-muted small d-inline-flex align-items-center gap-1">
                          <Calendar size={13} /> {fecha}
                        </span>
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{m.producto?.nombre || 'Producto N/A'}</div>
                      </td>
                      <td>
                        <span
                          className={
                            m.tipo_movimiento === 'Entrada'
                              ? 'badge-entrada'
                              : m.tipo_movimiento === 'Salida'
                              ? 'badge-salida'
                              : 'badge-ajuste'
                          }
                        >
                          {m.tipo_movimiento}
                        </span>
                      </td>
                      <td>
                        {m.tipo_movimiento === 'Entrada' ? (
                          <span className="fw-bold text-success d-inline-flex align-items-center gap-1" style={{ fontSize: '0.95rem' }}>
                            <ArrowUpRight size={15} /> +{m.cantidad}
                          </span>
                        ) : m.tipo_movimiento === 'Salida' ? (
                          <span className="fw-bold text-danger d-inline-flex align-items-center gap-1" style={{ fontSize: '0.95rem' }}>
                            <ArrowDownRight size={15} /> -{m.cantidad}
                          </span>
                        ) : (
                          <span className="fw-bold text-warning-emphasis">
                            {m.cantidad}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className="text-secondary small d-inline-flex align-items-center gap-1">
                          <UserCheck size={13} className="text-muted" />
                          {m.usuario?.nombre || 'Sistema'}
                        </span>
                      </td>
                      {/* BOTÓN DE ACCIÓN ALINEADO */}
                      <td>
                        <div className="action-buttons-wrapper">
                          <button
                            onClick={() => setDetalleMov(m)}
                            className="btn-action btn-action-view"
                            title="Ver detalles del movimiento"
                          >
                            <Eye size={14} />
                            <span>Ver</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="card-footer bg-white py-3 px-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 border-top">
          <small className="text-muted">
            Mostrando {filtrados.length === 0 ? 0 : indexInicio + 1}-
            {Math.min(indexInicio + elementosPorPagina, filtrados.length)} de{' '}
            {filtrados.length} movimientos
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

      {/* Modal Registrar Movimiento */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '14px', overflow: 'hidden' }}>
              <div className="modal-header bg-light py-3 px-4 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 bg-primary-subtle text-primary rounded-3">
                    <ArrowLeftRight size={18} />
                  </div>
                  <h5 className="modal-title fw-bold text-dark mb-0">Registrar Movimiento de Kardex</h5>
                </div>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  {errorForm && (
                    <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                      <AlertCircle size={16} />
                      <div>{errorForm}</div>
                    </div>
                  )}
                  {mensajeExito && (
                    <div className="alert alert-success py-2 small mb-3">
                      {mensajeExito}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Producto Seleccionado *</label>
                    <select
                      name="producto_id"
                      className="form-select"
                      value={form.producto_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Seleccionar Producto --</option>
                      {productos.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} (Stock actual: {p.stock})
                        </option>
                      ))}
                    </select>
                    {productoSeleccionado && (
                      <div className="small text-muted mt-1">
                        Stock disponible: <strong className="text-dark">{productoSeleccionado.stock} unidades</strong>
                      </div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold text-secondary">Tipo de Movimiento *</label>
                      <select
                        name="tipo_movimiento"
                        className="form-select"
                        value={form.tipo_movimiento}
                        onChange={handleChange}
                        required
                      >
                        <option value="Entrada">Entrada (+ Suma Stock)</option>
                        <option value="Salida">Salida (- Resta Stock)</option>
                        <option value="Ajuste">Ajuste (= Fija Stock)</option>
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold text-secondary">Cantidad *</label>
                      <input
                        type="number"
                        name="cantidad"
                        className="form-control"
                        value={form.cantidad}
                        onChange={handleChange}
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">Usuario Responsable</label>
                    <select
                      name="usuario_id"
                      className="form-select"
                      value={form.usuario_id}
                      onChange={handleChange}
                    >
                      <option value="">-- Seleccionar Usuario --</option>
                      {usuarios.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nombre} ({u.rol})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-0">
                    <label className="form-label small fw-bold text-secondary">Observaciones / Motivo</label>
                    <textarea
                      name="observaciones"
                      rows="2"
                      className="form-control"
                      value={form.observaciones}
                      onChange={handleChange}
                      placeholder="Ej. Ingreso por compra a proveedor, entrega para ventas..."
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer bg-light px-4 py-3 border-top">
                  <button type="button" className="btn btn-outline-secondary px-3" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary px-4 fw-semibold">
                    Confirmar Transacción
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detalle */}
      {detalleMov && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '14px', overflow: 'hidden' }}>
              <div className="modal-header bg-light py-3 px-4 border-bottom">
                <h5 className="modal-title fw-bold text-dark mb-0">Detalle del Movimiento #{detalleMov.id}</h5>
                <button type="button" className="btn-close" onClick={() => setDetalleMov(null)}></button>
              </div>
              <div className="modal-body p-4">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between px-0 py-2">
                    <span className="text-muted">Producto:</span>
                    <span className="fw-bold">{detalleMov.producto?.nombre}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0 py-2">
                    <span className="text-muted">Tipo de Movimiento:</span>
                    <span className="fw-bold">{detalleMov.tipo_movimiento}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0 py-2">
                    <span className="text-muted">Cantidad:</span>
                    <span className="fw-bold">{detalleMov.cantidad} unidades</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0 py-2">
                    <span className="text-muted">Fecha y Hora:</span>
                    <span>{new Date(detalleMov.createdAt || detalleMov.fecha_hora).toLocaleString('es-PE')}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between px-0 py-2">
                    <span className="text-muted">Responsable:</span>
                    <span>{detalleMov.usuario?.nombre || 'Sistema'} ({detalleMov.usuario?.rol || 'N/A'})</span>
                  </li>
                  <li className="list-group-item px-0 py-2 border-0">
                    <span className="text-muted d-block mb-1">Observaciones:</span>
                    <div className="bg-light p-2 rounded small text-secondary">
                      {detalleMov.observaciones || 'Sin observaciones registradas.'}
                    </div>
                  </li>
                </ul>
              </div>
              <div className="modal-footer bg-light px-4 py-2">
                <button type="button" className="btn btn-secondary px-3" onClick={() => setDetalleMov(null)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movimientos;
