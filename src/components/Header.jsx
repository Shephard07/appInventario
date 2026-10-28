import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Sparkles } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const titulos = {
    '/': 'Dashboard Principal',
    '/productos': 'Catálogo de Productos',
    '/categorias': 'Líneas y Categorías',
    '/proveedores': 'Directorio de Proveedores',
    '/kardex': 'Kardex y Control de Movimientos',
    '/usuarios': 'Gestión de Personal y Cuentas'
  };

  const tituloActual = titulos[location.pathname] || 'Panel Administrativo';

  return (
    <header className="top-navbar">
      <div className="d-flex align-items-center gap-3">
        <div>
          <h5 className="mb-0 fw-bold" style={{ fontSize: '1.1rem', color: '#0f172a' }}>
            {tituloActual}
          </h5>
          <span className="text-muted" style={{ fontSize: '0.78rem' }}>
            SENATI Seminario Fullstack • Lab #9
          </span>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        {/* Chip de estado de la API */}
        <div className="d-none d-md-flex align-items-center gap-2 px-3 py-1 bg-light border rounded-pill">
          <Sparkles size={14} className="text-primary" />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>
            API: localhost:3000
          </span>
        </div>

        {/* Campana de Notificaciones */}
        <button
          className="btn btn-light rounded-circle p-2 position-relative border"
          style={{ width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Notificaciones de Stock"
        >
          <Bell size={17} className="text-secondary" />
          <span
            className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"
            style={{ width: '9px', height: '9px' }}
          ></span>
        </button>

        {/* Perfil Usuario */}
        <div className="d-flex align-items-center gap-2 ps-2 border-start">
          <div
            className="rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm"
            style={{
              width: '38px',
              height: '38px',
              background: 'linear-gradient(135deg, #0052cc 0%, #0066ff 100%)',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            GB
          </div>
          <div className="d-none d-sm-block text-start">
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              Giancarlos B.
            </div>
            <div style={{ fontSize: '0.73rem', color: '#64748b', fontWeight: 500 }}>
              Docente / Administrador
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
