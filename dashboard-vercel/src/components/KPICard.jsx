import React from 'react';
import { textConfig } from '../config/textConfig';
import './KPICard.css';

/**
 * KPI 目標對比卡片組件
 *
 * @param {Object} props
 * @param {string} props.title - KPI 標題
 * @param {number} props.current - 當前值
 * @param {number} props.target - 目標值
 * @param {number} props.previousDay - 昨日值（用於計算變化）
 * @param {string} props.unit - 單位（%, M, 件等）
 * @param {string} props.icon - 圖標（emoji）
 * @param {boolean} props.reverseColor - 是否反轉顏色邏輯（例如：成本越低越好）
 * @param {number} props.decimalPlaces - 小數位數（默認 1）
 */
function KPICard({
  title,
  current,
  target,
  previousDay,
  unit = '%',
  icon = '📊',
  reverseColor = false,
  decimalPlaces = 1
}) {
  // 計算差距
  const gap = current - target;
  const gapPercent = target !== 0 ? ((gap / target) * 100) : 0;

  // 計算較昨日變化
  const dayChange = previousDay !== undefined ? current - previousDay : null;
  const dayChangePercent = previousDay !== 0 && previousDay !== undefined
    ? ((dayChange / previousDay) * 100)
    : null;

  // 判斷趨勢方向
  const getTrend = () => {
    if (dayChange === null || Math.abs(dayChange) < 0.01) return 'stable';
    return dayChange > 0 ? 'up' : 'down';
  };

  const trend = getTrend();

  // 判斷是否達標
  const isOnTarget = reverseColor
    ? current <= target  // 成本類指標：越低越好
    : current >= target; // 一般指標：越高越好

  // 判斷趨勢是否良好
  const isTrendGood = reverseColor
    ? trend === 'down' || trend === 'stable'
    : trend === 'up' || trend === 'stable';

  // 獲取趨勢圖標
  const getTrendIcon = () => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  // 格式化數字
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '-';
    return num.toFixed(decimalPlaces);
  };

  return (
    <div className={`kpi-card ${isOnTarget ? 'on-target' : 'off-target'}`}>
      {/* 頂部圖標和標題 */}
      <div className="kpi-header">
        <span className="kpi-icon">{icon}</span>
        <h4 className="kpi-title">{title}</h4>
      </div>

      {/* 當前值和趨勢 */}
      <div className="kpi-current-section">
        <div className="kpi-current-value">
          {formatNumber(current)}
          <span className="kpi-unit">{unit}</span>
        </div>
        {trend !== 'stable' && (
          <span className={`kpi-trend ${isTrendGood ? 'trend-good' : 'trend-bad'}`}>
            {getTrendIcon()}
          </span>
        )}
      </div>

      {/* 目標和差距 */}
      <div className="kpi-metrics">
        <div className="kpi-metric">
          <span className="kpi-metric-label">{textConfig.kpi.target}:</span>
          <span className="kpi-metric-value target-value">
            {formatNumber(target)}{unit}
          </span>
        </div>
        <div className="kpi-metric-divider">|</div>
        <div className="kpi-metric">
          <span className="kpi-metric-label">{textConfig.kpi.gap}:</span>
          <span className={`kpi-metric-value gap-value ${gap >= 0 ? 'positive' : 'negative'}`}>
            {gap >= 0 ? '+' : ''}{formatNumber(gap)}{unit}
          </span>
        </div>
      </div>

      {/* 較昨日變化 */}
      {dayChange !== null && (
        <div className="kpi-day-change">
          <span className="kpi-change-label">{textConfig.kpi.vsYesterday}:</span>
          <span className={`kpi-change-value ${isTrendGood ? 'positive-change' : 'negative-change'}`}>
            {dayChange >= 0 ? '+' : ''}{formatNumber(dayChange)}{unit}
            {dayChangePercent !== null && (
              <span className="kpi-change-percent">
                ({dayChangePercent >= 0 ? '+' : ''}{formatNumber(dayChangePercent)}%)
              </span>
            )}
          </span>
        </div>
      )}

      {/* 達標狀態標籤 */}
      <div className={`kpi-status-badge ${isOnTarget ? 'status-success' : 'status-warning'}`}>
        {isOnTarget ? textConfig.kpi.onTarget : textConfig.kpi.offTarget}
      </div>
    </div>
  );
}

export default KPICard;
