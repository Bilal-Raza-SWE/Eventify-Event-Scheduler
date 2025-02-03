import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers,
  FaCalendarAlt,
  FaChartLine,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaBars,
  FaTimes
} from 'react-icons/fa';
 import './AdminDashboard.css';

import DashboardStats from './DashboardStats';
import ActivityFeed from './ActivityFeed';
import QuickActions from './QuickActions';
import SystemHealth from './SystemHealth';

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <button 
        className="mobile-sidebar-toggle"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <main className="dashboard-main">
      
        <div className="dashboard-content">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <>
              <DashboardStats data={dashboardData?.stats} />
              <div className="dashboard-grid">
                <QuickActions />
                <ActivityFeed activities={dashboardData?.activities} />
                 <SystemHealth metrics={dashboardData?.systemMetrics} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;