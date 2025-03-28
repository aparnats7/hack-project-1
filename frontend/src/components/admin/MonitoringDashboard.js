import { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { useApi } from '../../hooks/useApi';
import { adminAPI } from '../../services/api';
import './MonitoringDashboard.css';

const MonitoringDashboard = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const { data: metrics, loading, error, execute: fetchMetrics } = useApi(adminAPI.getMetrics);
  const { data: systemStatus, execute: fetchSystemStatus } = useApi(adminAPI.getSystemStatus);

  useEffect(() => {
    fetchMetrics({ timeRange });
    fetchSystemStatus();
    const interval = setInterval(() => {
      fetchMetrics({ timeRange });
      fetchSystemStatus();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [timeRange, fetchMetrics, fetchSystemStatus]);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">Error loading dashboard: {error.message}</div>;
  }

  return (
    <div className="monitoring-dashboard">
      <div className="dashboard-header">
        <h2>System Monitoring Dashboard</h2>
        <div className="time-range-selector">
          <button
            className={timeRange === '1h' ? 'active' : ''}
            onClick={() => setTimeRange('1h')}
          >
            1 Hour
          </button>
          <button
            className={timeRange === '24h' ? 'active' : ''}
            onClick={() => setTimeRange('24h')}
          >
            24 Hours
          </button>
          <button
            className={timeRange === '7d' ? 'active' : ''}
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </button>
        </div>
      </div>

      <div className="system-status">
        <h3>System Status</h3>
        <div className="status-grid">
          <div className="status-card">
            <h4>CPU Usage</h4>
            <div className="status-value">
              {systemStatus?.cpu_percent}%
            </div>
          </div>
          <div className="status-card">
            <h4>Memory Usage</h4>
            <div className="status-value">
              {systemStatus?.memory_percent}%
            </div>
          </div>
          <div className="status-card">
            <h4>Active Users</h4>
            <div className="status-value">
              {metrics?.active_users}
            </div>
          </div>
          <div className="status-card">
            <h4>Documents Processed</h4>
            <div className="status-value">
              {metrics?.documents_processed}
            </div>
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>API Requests</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics?.api_requests}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#8884d8"
                name="Requests"
              />
              <Line
                type="monotone"
                dataKey="errors"
                stroke="#ff4444"
                name="Errors"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="metric-card">
          <h3>Document Processing</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics?.document_processing}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="count"
                fill="#82ca9d"
                name="Documents"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="metric-card">
          <h3>Cache Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics?.cache_performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="hits"
                stroke="#82ca9d"
                name="Cache Hits"
              />
              <Line
                type="monotone"
                dataKey="misses"
                stroke="#ffc658"
                name="Cache Misses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="metric-card">
          <h3>Database Operations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics?.db_operations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="operation" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="count"
                fill="#8884d8"
                name="Operations"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="alerts-section">
        <h3>Recent Alerts</h3>
        <div className="alerts-list">
          {metrics?.alerts.map((alert, index) => (
            <div
              key={index}
              className={`alert-item ${alert.severity}`}
            >
              <span className="alert-time">{alert.timestamp}</span>
              <span className="alert-message">{alert.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard; 