import React from 'react';
import { FaUsers, FaCalendarCheck, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import './DashboardStats.css';

const DashboardStats = ({ data }) => {
  const stats = [
    {
      title: 'Total Users',
      value: data?.totalUsers || 0,
      icon: <FaUsers />,
      color: '#4CAF50',
      increase: '+12%'
    },
    {
      title: 'Active Events',
      value: data?.activeEvents || 0,
      icon: <FaCalendarCheck />,
      color: '#2196F3',
      increase: '+5%'
    },
    {
      title: 'Total Events',
      value: data?.totalEvents || 0,
      icon: <FaCalendarAlt />,
      color: '#9C27B0',
      increase: '+8%'
    },
    {
      title: 'Monthly Revenue',
      value: data?.monthlyRevenue || '$0',
      icon: <FaChartLine />,
      color: '#F44336',
      increase: '+15%'
    }
  ];

  return (
    <div className="dashboard-stats">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: stat.color }}>
            {stat.icon}
          </div>
          <div className="stat-info">
            <h3>{stat.title}</h3>
            <div className="stat-value">
              <span className="value">{stat.value}</span>
              <span className="increase">{stat.increase}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;