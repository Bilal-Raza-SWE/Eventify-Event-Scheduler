import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaChartLine, 
  FaUsers, 
  FaCalendarAlt, 
  FaServer,
  FaSignOutAlt,
  FaBell
} from 'react-icons/fa';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: <FaChartLine />
    },
    {
      title: 'User Management',
      path: '/admin/users',
      icon: <FaUsers />
    },
    {
      title: 'Event Management',
      path: '/admin/events',
      icon: <FaCalendarAlt />
    },
    {
      title: 'System Health',
      path: '/admin/system-health',
      icon: <FaServer />
    }
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className={`admin-layout ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>EventHub Admin</h2>
          <button 
            className="collapse-btn"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            {isSidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <span>{item.title}</span>
            </button>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="search-bar">
            <input 
              type="search" 
              placeholder="Search..."
              className="search-input"
            />
          </div>

          <div className="header-actions">
            <button className="notification-btn">
              <FaBell />
              <span className="notification-badge">3</span>
            </button>
            <div className="admin-profile">
              <img src="/admin-avatar.jpg" alt="Admin" />
              <span>Admin Name</span>
            </div>
          </div>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;