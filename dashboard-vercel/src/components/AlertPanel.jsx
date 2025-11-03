import { useState, useEffect } from 'react';
import { textConfig } from '../config/textConfig';
import './AlertPanel.css';

function AlertPanel({ onAlertClick }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, critical, warning
  const [isExpanded, setIsExpanded] = useState(true);

  // 載入警報數據
  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const response = await fetch('/alerts.json');
      const data = await response.json();
      // 按時間倒序排序（最新的在前）
      const sortedAlerts = data.alerts.sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
      );
      setAlerts(sortedAlerts);
      setLoading(false);
    } catch (error) {
      console.error('載入警報數據失敗:', error);
      setLoading(false);
    }
  };

  // 確認警報
  const acknowledgeAlert = (alertId) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId
          ? {
              ...alert,
              status: 'acknowledged',
              acknowledgedBy: '當前使用者',
              acknowledgedAt: new Date().toISOString()
            }
          : alert
      )
    );
  };

  // 解決警報
  const resolveAlert = (alertId) => {
    setAlerts(prevAlerts =>
      prevAlerts.map(alert =>
        alert.id === alertId
          ? {
              ...alert,
              status: 'resolved',
              resolvedAt: new Date().toISOString()
            }
          : alert
      )
    );
  };

  // 過濾警報
  const getFilteredAlerts = () => {
    let filtered = alerts;

    if (filter === 'pending') {
      filtered = alerts.filter(a => a.status === 'pending');
    } else if (filter === 'critical') {
      filtered = alerts.filter(a => a.severity === 'critical');
    } else if (filter === 'warning') {
      filtered = alerts.filter(a => a.severity === 'warning');
    }

    return filtered;
  };

  // 計算統計數據
  const getStats = () => {
    return {
      total: alerts.length,
      critical: alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length,
      warning: alerts.filter(a => a.severity === 'warning' && a.status !== 'resolved').length,
      pending: alerts.filter(a => a.status === 'pending').length,
      acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
      resolved: alerts.filter(a => a.status === 'resolved').length
    };
  };

  // 格式化時間
  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000 / 60); // 分鐘差

    if (diff < 1) return '剛剛';
    if (diff < 60) return `${diff}分鐘前`;
    if (diff < 60 * 24) return `${Math.floor(diff / 60)}小時前`;
    return `${Math.floor(diff / 60 / 24)}天前`;
  };

  // 獲取模組中文名稱
  const getModuleName = (moduleId) => {
    const moduleMap = {
      financial: '財務',
      production: '生產',
      market: '市場',
      supplyChain: '供應鏈',
      rd: '研發',
      hr: '人資',
      risk: '風險',
      productCustomer: '產品客戶',
      bookToBill: '訂單出貨'
    };
    return moduleMap[moduleId] || moduleId;
  };

  const filteredAlerts = getFilteredAlerts();
  const stats = getStats();

  if (loading) {
    return (
      <div className="alert-panel">
        <div className="alert-loading">{textConfig.common.loading}</div>
      </div>
    );
  }

  return (
    <div className={`alert-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* 標題欄 */}
      <div className="alert-header">
        <div className="alert-header-left">
          <h3 className="alert-title">
            🚨 {textConfig.alerts.title}
          </h3>
          <div className="alert-stats">
            <span className="stat-badge stat-critical">
              {stats.critical} 緊急
            </span>
            <span className="stat-badge stat-warning">
              {stats.warning} 警告
            </span>
            <span className="stat-badge stat-pending">
              {stats.pending} 待處理
            </span>
          </div>
        </div>
        <button
          className="alert-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? '收起' : '展開'}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {/* 展開的內容 */}
      {isExpanded && (
        <>
          {/* 過濾器 */}
          <div className="alert-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              全部 ({alerts.length})
            </button>
            <button
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              待處理 ({stats.pending})
            </button>
            <button
              className={`filter-btn ${filter === 'critical' ? 'active' : ''}`}
              onClick={() => setFilter('critical')}
            >
              緊急 ({stats.critical})
            </button>
            <button
              className={`filter-btn ${filter === 'warning' ? 'active' : ''}`}
              onClick={() => setFilter('warning')}
            >
              警告 ({stats.warning})
            </button>
          </div>

          {/* 警報列表 */}
          <div className="alert-list">
            {filteredAlerts.length === 0 ? (
              <div className="alert-empty">
                {textConfig.alerts.noAlerts}
              </div>
            ) : (
              filteredAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`alert-item severity-${alert.severity} status-${alert.status}`}
                  onClick={() => onAlertClick && onAlertClick(alert)}
                >
                  {/* 嚴重程度指示條 */}
                  <div className="alert-severity-bar"></div>

                  {/* 警報內容 */}
                  <div className="alert-content">
                    {/* 標題行 */}
                    <div className="alert-header-row">
                      <div className="alert-meta">
                        <span className="alert-id">{alert.id}</span>
                        <span className="alert-module">{getModuleName(alert.module)}</span>
                        <span className="alert-time">{formatTime(alert.timestamp)}</span>
                      </div>
                      <div className="alert-status-badge">
                        {alert.status === 'pending' && '待處理'}
                        {alert.status === 'acknowledged' && '已確認'}
                        {alert.status === 'resolved' && '已解決'}
                      </div>
                    </div>

                    {/* 警報標題 */}
                    <div className="alert-title-text">{alert.title}</div>

                    {/* 警報描述 */}
                    <div className="alert-description">{alert.description}</div>

                    {/* 數值顯示 */}
                    <div className="alert-metrics">
                      <span className="metric-current">
                        當前值: <strong>{alert.value}{alert.unit}</strong>
                      </span>
                      <span className="metric-threshold">
                        閾值: {alert.threshold}{alert.unit}
                      </span>
                    </div>

                    {/* 操作按鈕 */}
                    <div className="alert-actions">
                      {alert.status === 'pending' && (
                        <button
                          className="alert-btn btn-acknowledge"
                          onClick={(e) => {
                            e.stopPropagation();
                            acknowledgeAlert(alert.id);
                          }}
                        >
                          ✓ 確認
                        </button>
                      )}
                      {alert.status === 'acknowledged' && (
                        <button
                          className="alert-btn btn-resolve"
                          onClick={(e) => {
                            e.stopPropagation();
                            resolveAlert(alert.id);
                          }}
                        >
                          ✓ 解決
                        </button>
                      )}
                      <button
                        className="alert-btn btn-view"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAlertClick && onAlertClick(alert);
                        }}
                      >
                        → 查看詳情
                      </button>
                    </div>

                    {/* 確認資訊 */}
                    {alert.acknowledgedBy && (
                      <div className="alert-acknowledged-info">
                        已由 {alert.acknowledgedBy} 確認於 {formatTime(alert.acknowledgedAt)}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AlertPanel;
