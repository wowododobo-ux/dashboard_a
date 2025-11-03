import React, { useState, useEffect } from 'react';
import KPICard from './KPICard';
import { textConfig } from '../config/textConfig';
import './KPIPanel.css';

/**
 * KPI 面板組件
 * 顯示指定模組的所有 KPI 卡片
 *
 * @param {Object} props
 * @param {string} props.module - 模組名稱（financial, production, market等）
 * @param {string} props.title - 面板標題（可選）
 */
function KPIPanel({ module, title }) {
  const [kpis, setKpis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, onTarget: 0, offTarget: 0 });

  // 載入 KPI 數據
  useEffect(() => {
    loadKPIs();
  }, [module]);

  const loadKPIs = async () => {
    try {
      const response = await fetch('/kpis.json');
      const data = await response.json();

      const moduleKPIs = data.kpis[module] || [];
      setKpis(moduleKPIs);

      // 計算統計
      const total = moduleKPIs.length;
      const onTarget = moduleKPIs.filter(kpi =>
        kpi.reverseColor ? kpi.current <= kpi.target : kpi.current >= kpi.target
      ).length;
      const offTarget = total - onTarget;

      setStats({ total, onTarget, offTarget });
      setLoading(false);
    } catch (error) {
      console.error('載入 KPI 數據失敗:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="kpi-panel">
        <div className="kpi-panel-loading">{textConfig.common.loading}</div>
      </div>
    );
  }

  if (kpis.length === 0) {
    return (
      <div className="kpi-panel">
        <div className="kpi-panel-empty">暫無 KPI 數據</div>
      </div>
    );
  }

  return (
    <div className="kpi-panel">
      {/* 面板標題和統計 */}
      <div className="kpi-panel-header">
        <div className="kpi-panel-title-section">
          <h3 className="kpi-panel-title">
            {title || '關鍵績效指標'}
          </h3>
          <p className="kpi-panel-subtitle">
            追蹤目標達成情況與日常變化
          </p>
        </div>
        <div className="kpi-panel-stats">
          <div className="kpi-stat">
            <span className="kpi-stat-value">{stats.total}</span>
            <span className="kpi-stat-label">總指標</span>
          </div>
          <div className="kpi-stat kpi-stat-success">
            <span className="kpi-stat-value">{stats.onTarget}</span>
            <span className="kpi-stat-label">達標</span>
          </div>
          <div className="kpi-stat kpi-stat-warning">
            <span className="kpi-stat-value">{stats.offTarget}</span>
            <span className="kpi-stat-label">未達標</span>
          </div>
          <div className="kpi-stat kpi-stat-rate">
            <span className="kpi-stat-value">
              {stats.total > 0 ? ((stats.onTarget / stats.total) * 100).toFixed(0) : 0}%
            </span>
            <span className="kpi-stat-label">達標率</span>
          </div>
        </div>
      </div>

      {/* KPI 卡片網格 */}
      <div className="kpi-grid">
        {kpis.map((kpi) => (
          <KPICard
            key={kpi.id}
            title={kpi.title}
            current={kpi.current}
            target={kpi.target}
            previousDay={kpi.previousDay}
            unit={kpi.unit}
            icon={kpi.icon}
            reverseColor={kpi.reverseColor}
            decimalPlaces={kpi.unit === '件' || kpi.unit === '' ? 0 : 1}
          />
        ))}
      </div>
    </div>
  );
}

export default KPIPanel;
