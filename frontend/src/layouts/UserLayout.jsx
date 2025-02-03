import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaCalendarAlt, 
  FaTicketAlt, 
  FaBookmark,
  FaUser,
  FaBell,
  FaSignOutAlt 
} from 'react-icons/fa';
import './UserLayout.css';

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      title: 'Dashboard',
      path: '/user/dashboard',
      icon: <FaHome />
    },
    {
      title: 'My Events',
      path: '/user/events',
      icon: <FaCalendarAlt />
    },
    {
      title: 'My Tickets',
      path: '/user/tickets',
      icon: <FaTicketAlt />
    },
    {
      title: 'Bookmarks',
      path: '/user/bookmarks',
      icon: <FaBookmark />
    },
    {
      title: 'Profile',
      path: '/user/profile',
      icon: <FaUser />
    }
  ];

  return (
    <div className="user-layout">
      <aside className="user-sidebar">
        <div className="sidebar-header">
          <h2>EventHub</h2>
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

        <button className="logout-btn" onClick={() => navigate('/login')}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </aside>

      <main className="user-main">
        <header className="user-header">
          <div className="search-bar">
            <input 
              type="search" 
              placeholder="Search events..."
              className="search-input"
            />
          </div>

          <div className="header-actions">
            <button className="notification-btn">
              <FaBell />
              <span className="notification-badge">2</span>
            </button>
            <div className="user-profile">
              <img src="/default-avatar.png" alt="User" />
              <span>User</span>
            </div>
          </div>
        </header>

        <div className="user-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default UserLayout;