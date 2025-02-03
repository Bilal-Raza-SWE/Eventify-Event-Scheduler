import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  FaServer, 
  FaDatabase, 
  FaUsers, 
  FaExclamationTriangle,
  FaMemory,
  FaMicrochip,
  FaNetworkWired,
  FaClock
} from 'react-icons/fa';
import './SystemHealth.css';

const SystemHealth = () => {
  const [metrics, setMetrics] = useState({
    serverStatus: 'healthy',
    dbStatus: 'healthy',
    activeUsers: 0,
    errorRate: 0,
    responseTime: [],
    cpuUsage: [],
    memoryUsage: [],
    networkTraffic: [],
    alerts: []
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`/api/admin/system-health?timeframe=${selectedTimeframe}`);
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching system metrics:', error);
      }
    };

    // Initial fetch
    fetchMetrics();

    const interval = setInterval(fetchMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [selectedTimeframe]);

  const getStatusColor = (status) => {
    return {
      healthy: '#10B981',
      warning: '#F59E0B',
      critical: '#EF4444'
    }[status] || '#6B7280';
  };

  return (
    <div className="system-health">
      <div className="page-header">
        <h2>System Health Dashboard</h2>
        <select 
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className="timeframe-select"
        >
          <option value="1h">Last Hour</option>
          <option value="6h">Last 6 Hours</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
        </select>
      </div>

      <div className="status-grid">
        <div className={`status-card ${metrics.serverStatus}`}>
          <FaServer className="status-icon" />
          <div className="status-info">
            <h3>Server Status</h3>
            <p>{metrics.serverStatus === 'healthy' ? 'Operating Normally' : 'Issues Detected'}</p>
            <div className="status-indicator">
              <span 
                className="status-dot"
                style={{ backgroundColor: getStatusColor(metrics.serverStatus) }}
              ></span>
              {metrics.serverUptime && (
                <span className="uptime">Uptime: {metrics.serverUptime}</span>
              )}
            </div>
          </div>
        </div>

        <div className={`status-card ${metrics.dbStatus}`}>
          <FaDatabase className="status-icon" />
          <div className="status-info">
            <h3>Database Status</h3>
            <p>Response Time: {metrics.dbResponseTime}ms</p>
            <div className="status-indicator">
              <span 
                className="status-dot"
                style={{ backgroundColor: getStatusColor(metrics.dbStatus) }}
              ></span>
              <span>Connections: {metrics.dbConnections}</span>
            </div>
          </div>
        </div>

        <div className="status-card">
          <FaUsers className="status-icon" />
          <div className="status-info">
            <h3>Active Users</h3>
            <p>{metrics.activeUsers} users online</p>
            <div className="status-indicator">
              <span className="trend-indicator">
                {metrics.userTrend > 0 ? '↑' : '↓'} {Math.abs(metrics.userTrend)}%
              </span>
            </div>
          </div>
        </div>

        <div className={`status-card ${metrics.errorRate > 2 ? 'warning' : 'healthy'}`}>
          <FaExclamationTriangle className="status-icon" />
          <div className="status-info">
            <h3>Error Rate</h3>
            <p>{metrics.errorRate}% of requests</p>
            <div className="status-indicator">
              <span 
                className="status-dot"
                style={{ 
                  backgroundColor: getStatusColor(
                    metrics.errorRate > 5 ? 'critical' : 
                    metrics.errorRate > 2 ? 'warning' : 'healthy'
                  )
                }}
              ></span>
            </div>
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <h3><FaMicrochip /> CPU Usage</h3>
            <span className="current-value">{metrics.currentCpuUsage}%</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={metrics.cpuUsage}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#0EA5E9" 
                fill="#0EA5E9" 
                fillOpacity={0.1} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3><FaMemory /> Memory Usage</h3>
            <span className="current-value">{metrics.currentMemoryUsage}%</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={metrics.memoryUsage}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8B5CF6" 
                fill="#8B5CF6" 
                fillOpacity={0.1} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3><FaClock /> Response Time</h3>
            <span className="current-value">{metrics.currentResponseTime}ms</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={metrics.responseTime}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <h3><FaNetworkWired /> Network Traffic</h3>
            <span className="current-value">{metrics.currentNetworkTraffic} MB/s</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={metrics.networkTraffic}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#F59E0B" 
                fill="#F59E0B" 
                fillOpacity={0.1} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="alerts-section">
        <h3>System Alerts</h3>
        <div className="alerts-list">
          {metrics.alerts.length > 0 ? (
            metrics.alerts.map((alert, index) => (
              <div 
                key={index} 
                className={`alert-item ${alert.severity}`}
              >
                <div className="alert-icon">
                  <FaExclamationTriangle />
                </div>
                <div className="alert-content">
                  <h4>{alert.title}</h4>
                  <p>{alert.message}</p>
                  <span className="alert-time">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>
                <button className="acknowledge-btn">
                  Acknowledge
                </button>
              </div>
            ))
          ) : (
            <div className="no-alerts">
              No active alerts at this time
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;