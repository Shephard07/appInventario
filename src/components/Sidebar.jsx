import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Truck,
  ArrowLeftRight,
  Users,
  Settings,
  Database,
  Circle
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { path: '/', label: 'Inicio (Dashboard)', icon: LayoutDashboard },
    { path: '/productos', label: 'Productos', icon: Package },
    { path: '/categorias', label: 'Categorías', icon: Layers },
    { path: '/proveedores', label: 'Proveedores', icon: Truck },
    { path: '/kardex', label: 'Kardex / Movimientos', icon: ArrowLeftRight },
    { path: '/usuarios', label: 'Usuarios', icon: Users },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-badge">S</div>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 800, letterSpacing: '0.04em', color: '#ffffff' }}>
            SENATI
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
            Sistema de Inventario
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <ul className="sidebar-menu">
        <li style={{ padding: '0.5rem 0.75rem 0.25rem', fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Módulos Principales
        </li>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.path} className="sidebar-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                end={item.path === '/'}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          );
        })}

        <li style={{ padding: '1.25rem 0.75rem 0.25rem', fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Sistema
        </li>
        <li className="sidebar-item">
          <div className="sidebar-link" style={{ cursor: 'pointer', opacity: 0.75 }}>
            <Settings size={18} />
            <span>Configuración</span>
          </div>
        </li>
      </ul>

      {/* Footer Status */}
      <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            <Database size={13} className="text-primary" /> MySQL Laragon
          </span>
          <span className="d-flex align-items-center gap-1" style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
            <Circle size={8} fill="#10b981" /> En línea
          </span>
        </div>
        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
          bdinventario • v1.0.0
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
