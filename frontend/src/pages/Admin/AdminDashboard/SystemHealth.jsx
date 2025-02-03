import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { FaServer, FaDatabase, FaExclamationTriangle } from 'react-icons/fa';
import './SystemHealth.css';

const SystemHealth = ({ metrics }) => {
  const responseTimeData = metrics?.responseTime?.map(data => ({
    time: new Date(data.timestamp).toLocaleTimeString(),
    value: data.value
  })) || [];

  const getStatusColor = (status) => {
    return {
      'healthy': '#4CAF50',
      'warning': '#FF9800',
      'critical': '#F44336'
    }[status] || '#757575';
  };

  const systemStatuses = [
    {
      icon: <FaServer />,
      name: 'Server Status',
      status: metrics?.serverStatus || 'healthy',
      value: '99.9% Uptime'
    },
    {
      icon: <FaDatabase />,
      name: 'Database Status',
      status: metrics?.dbStatus || 'healthy',
      value: '45ms Latency'
    },
    {
      icon: <FaExclamationTriangle />,
      name: 'Error Rate',
      status: metrics?.errorRate > 2 ? 'warning' : 'healthy',
      value: `${metrics?.errorRate || 0}%`
    }
  ];

  return (
    <div className="system-health-card">
      <div className="card-header">
        <h3>System Health</h3>
        <button className="refresh-btn">Refresh</button>
      </div>

      <div className="status-indicators">
        {systemStatuses.map((item, index) => (
          <div key={index} className="status-item">
            <div 
              className="status-icon"
              style={{ 
                color: getStatusColor(item.status),
                backgroundColor: `${getStatusColor(item.status)}15`
              }}
            >
              {item.icon}
            </div>
            <div className="status-info">
              <h4>{item.name}</h4>
              <div className="status-value">
                <span 
                  className="status-dot"
                  style={{ backgroundColor: getStatusColor(item.status) }}
                ></span>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="response-time-chart">
        <h4>Server Response Time</h4>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={responseTimeData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              width={30}
              unit="ms"
            />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#2196F3" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="system-alerts">
        <h4>Recent Alerts</h4>
        {metrics?.alerts?.length > 0 ? (
          <div className="alerts-list">
            {metrics.alerts.map((alert, index) => (
              <div 
                key={index} 
                className={`alert-item ${alert.severity}`}
              >
                <span className="alert-icon">⚠️</span>
                <span className="alert-message">{alert.message}</span>
                <span className="alert-time">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-alerts">No active alerts</p>
        )}
      </div>
    </div>
  );
};

export default SystemHealth;