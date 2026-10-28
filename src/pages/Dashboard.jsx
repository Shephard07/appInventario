import React, { useEffect, useState } from 'react';
import api from '../services/api';
import {
  Package,
  Layers,
  Truck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  TrendingUp,
  PieChart,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalCategorias: 0,
    totalProveedores: 0,
    productosBajoStock: 0,
    movimientosRecientes: [],
    stockPorCategoria: []
  });
  const [loading, setLoading] = useState(true);

  const cargarStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error al cargar datos del dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarStats();
  }, []);

  const totalStockSum = stats.stockPorCategoria.reduce((sum, c) => sum + c.totalStock, 0) || 1;
  const colores = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div>
      {/* Título de la sección */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Dashboard</h4>
          <p className="text-muted mb-0" style={{ fontSize: '0.88rem' }}>
            Métricas ejecutivas de almacén, valorización de inventario y actividad reciente.
          </p>
        </div>
        <button
          onClick={cargarStats}
          className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2 shadow-xs bg-white px-3 py-2 fw-semibold"
          style={{ borderRadius: '8px' }}
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} />
          <span>Sincronizar Datos</span>
        </button>
      </div>

      {/* Tarjetas KPI */}
      <div className="row g-3 mb-4">
        {/* Total Productos */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="kpi-card">
            <div>
              <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                Total Productos
              </div>
              <div className="fs-3 fw-bold text-dark mt-1" style={{ letterSpacing: '-0.02em' }}>
                {stats.totalProductos.toLocaleString()}
              </div>
              <div className="d-flex align-items-center gap-1 mt-1 text-success small fw-semibold">
                <TrendingUp size={14} />
                <span>Activos en almacén</span>
              </div>
            </div>
            <div className="kpi-icon-box" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Package size={24} />
            </div>
          </div>
        </div>

        {/* Categorías */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="kpi-card">
            <div>
              <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                Categorías
              </div>
              <div className="fs-3 fw-bold text-dark mt-1" style={{ letterSpacing: '-0.02em' }}>
                {stats.totalCategorias.toLocaleString()}
              </div>
              <div className="d-flex align-items-center gap-1 mt-1 text-muted small fw-semibold">
                <span>Familias registradas</span>
              </div>
            </div>
            <div className="kpi-icon-box" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
              <Layers size={24} />
            </div>
          </div>
        </div>

        {/* Proveedores */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="kpi-card">
            <div>
              <div className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                Proveedores
              </div>
              <div className="fs-3 fw-bold text-dark mt-1" style={{ letterSpacing: '-0.02em' }}>
                {stats.totalProveedores.toLocaleString()}
              </div>
              <div className="d-flex align-items-center gap-1 mt-1 text-muted small fw-semibold">
                <span>Distribuidores aliados</span>
              </div>
            </div>
            <div className="kpi-icon-box" style={{ backgroundColor: '#faf5ff', color: '#9333ea' }}>
              <Truck size={24} />
            </div>
          </div>
        </div>

        {/* Alertas Stock */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="kpi-card">
            <div>
              <div className="text-danger small fw-bold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                Bajo Stock (Alertas)
              </div>
              <div className="fs-3 fw-bold text-danger mt-1" style={{ letterSpacing: '-0.02em' }}>
                {stats.productosBajoStock}
              </div>
              <div className="d-flex align-items-center gap-1 mt-1 text-danger small fw-semibold">
                <AlertTriangle size={13} />
                <span>Existencia ≤ 5 unidades</span>
              </div>
            </div>
            <div className="kpi-icon-box" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Paneles Inferiores */}
      <div className="row g-4">
        {/* Movimientos Recientes */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
              <div className="d-flex align-items-center gap-2">
                <Clock size={17} className="text-primary" />
                <h6 className="fw-bold mb-0 text-dark">Movimientos Recientes (Kardex)</h6>
              </div>
              <span className="badge bg-light text-secondary border px-2 py-1">
                Últimos registros
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-custom align-middle">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Producto</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.movimientosRecientes.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        No hay movimientos registrados recientemente.
                      </td>
                    </tr>
                  ) : (
                    stats.movimientosRecientes.map((m) => {
                      const fecha = new Date(m.createdAt || m.fecha_hora).toLocaleDateString('es-PE', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      });

                      return (
                        <tr key={m.id}>
                          <td className="text-muted small">{fecha}</td>
                          <td className="fw-bold text-dark">{m.producto?.nombre || 'Producto N/A'}</td>
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
                          <td className="fw-bold">
                            {m.tipo_movimiento === 'Entrada' ? (
                              <span className="text-success d-inline-flex align-items-center gap-1">
                                <ArrowUpRight size={14} /> +{m.cantidad}
                              </span>
                            ) : (
                              <span className="text-danger d-inline-flex align-items-center gap-1">
                                <ArrowDownRight size={14} /> -{m.cantidad}
                              </span>
                            )}
                          </td>
                          <td className="text-secondary small">{m.usuario?.nombre || 'Sistema'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Donut Chart de Stock por Categoría */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3 px-4 d-flex align-items-center gap-2 border-bottom">
              <PieChart size={17} className="text-primary" />
              <h6 className="fw-bold mb-0 text-dark">Stock por Categoría</h6>
            </div>

            <div className="card-body p-4 d-flex flex-column justify-content-between">
              {/* Gráfico Donut SVG */}
              <div className="d-flex justify-content-center my-2">
                <svg width="190" height="190" viewBox="0 0 42 42">
                  <circle
                    cx="21"
                    cy="21"
                    r="15.91549430918954"
                    fill="#ffffff"
                  ></circle>
                  <circle
                    cx="21"
                    cy="21"
                    r="15.91549430918954"
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="5"
                  ></circle>
                  {stats.stockPorCategoria.map((cat, idx) => {
                    const pct = (cat.totalStock / totalStockSum) * 100;
                    const offset = stats.stockPorCategoria
                      .slice(0, idx)
                      .reduce((acc, c) => acc + (c.totalStock / totalStockSum) * 100, 0);
                    return (
                      <circle
                        key={cat.id}
                        cx="21"
                        cy="21"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke={colores[idx % colores.length]}
                        strokeWidth="5"
                        strokeDasharray={`${pct} ${100 - pct}`}
                        strokeDashoffset={-offset}
                        style={{ transition: 'all 0.5s ease' }}
                      ></circle>
                    );
                  })}
                  <text x="50%" y="47%" textAnchor="middle" fontWeight="800" fontSize="5" fill="#0f172a">
                    {stats.stockPorCategoria.reduce((sum, c) => sum + c.totalStock, 0)}
                  </text>
                  <text x="50%" y="60%" textAnchor="middle" fontSize="2.7" fontWeight="600" fill="#64748b">
                    Unidades
                  </text>
                </svg>
              </div>

              {/* Leyenda de Categorías */}
              <div className="mt-3">
                {stats.stockPorCategoria.map((cat, idx) => (
                  <div key={cat.id} className="d-flex justify-content-between align-items-center py-1 border-bottom-dashed" style={{ fontSize: '0.84rem' }}>
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className="rounded-circle"
                        style={{
                          width: '10px',
                          height: '10px',
                          backgroundColor: colores[idx % colores.length],
                          flexShrink: 0
                        }}
                      ></span>
                      <span className="text-secondary fw-semibold">{cat.nombre}</span>
                    </div>
                    <span className="fw-bold text-dark">{cat.totalStock} und</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
