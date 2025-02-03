import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { 
  FaUsers, 
  FaChartLine, 
  FaCalendarAlt, 
  FaClock 
} from 'react-icons/fa';
import './UserAnalytics.css';

const UserAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    userGrowth: [],
    engagementMetrics: [],
    deviceStats: [],
    timeDistribution: [],
    loading: true,
    error: null
  });

  const [timeRange, setTimeRange] = useState('30days');

  useEffect(() => {
    fetchAnalyticsData(timeRange);
  }, [timeRange]);

  const fetchAnalyticsData = async (range) => {
    try {
      const response = await fetch(`/api/admin/analytics/users?range=${range}`);
      const data = await response.json();
      
      setAnalyticsData({
        ...data,
        loading: false,
        error: null
      });
    } catch (error) {
      setAnalyticsData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch analytics data'
      }));
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const KeyMetrics = () => {
    const metrics = [
      {
        icon: <FaUsers />,
        title: 'Total Users',
        value: analyticsData.totalUsers || 0,
        change: '+12%',
        color: '#0088FE'
      },
      {
        icon: <FaChartLine />,
        title: 'Active Users',
        value: analyticsData.activeUsers || 0,
        change: '+8%',
        color: '#00C49F'
      },
      {
        icon: <FaCalendarAlt />,
        title: 'New Users (This Month)',
        value: analyticsData.newUsers || 0,
        change: '+15%',
        color: '#FFBB28'
      },
      {
        icon: <FaClock />,
        title: 'Average Session Duration',
        value: analyticsData.avgSessionDuration || '0:00',
        change: '+5%',
        color: '#FF8042'
      }
    ];

    return (
      <div className="key-metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-icon" style={{ backgroundColor: `${metric.color}15`, color: metric.color }}>
              {metric.icon}
            </div>
            <div className="metric-info">
              <h3>{metric.title}</h3>
              <div className="metric-value">
                <span>{metric.value}</span>
                <span className="metric-change">{metric.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const UserGrowthChart = () => (
    <div className="chart-container">
      <h3>User Growth Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={analyticsData.userGrowth}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="totalUsers" 
            stroke="#0088FE" 
            strokeWidth={2}
            name="Total Users"
          />
          <Line 
            type="monotone" 
            dataKey="activeUsers" 
            stroke="#00C49F" 
            strokeWidth={2}
            name="Active Users"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const EngagementChart = () => (
    <div className="chart-container">
      <h3>User Engagement Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={analyticsData.engagementMetrics}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#0088FE" name="Users" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const DeviceUsageChart = () => (
    <div className="chart-container">
      <h3>Device Usage Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={analyticsData.deviceStats}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {analyticsData.deviceStats.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  if (analyticsData.loading) {
    return <div className="loading-spinner">Loading analytics data...</div>;
  }

  if (analyticsData.error) {
    return <div className="error-message">{analyticsData.error}</div>;
  }

  return (
    <div className="user-analytics">
      <div className="analytics-header">
        <h2>User Analytics Dashboard</h2>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="time-range-select"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      <KeyMetrics />

      <div className="charts-grid">
        <UserGrowthChart />
        <EngagementChart />
        <DeviceUsageChart />
      </div>
    </div>
  );
};

export default UserAnalytics;