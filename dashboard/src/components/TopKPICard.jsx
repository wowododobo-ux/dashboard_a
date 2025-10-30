import { LineChart, Line, ResponsiveContainer } from 'recharts';
import './TopKPICard.css';

/**
 * Top KPI 卡片組件
 * 顯示核心 KPI：大數字、目標、差異、迷你趨勢線、狀態徽章
 */
function TopKPICard({ kpi, onClick }) {
  const {
    名稱,
    名稱英文,
    單位,
    當前值,
    目標值,
    差異百分比,
    狀態,
    趨勢數據
  } = kpi;

  // 格式化數字顯示
  const formatValue = (value) => {
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toFixed(1);
  };

  // 狀態顏色映射
  const statusColors = {
    green: '#4caf50',
    amber: '#ff9800',
    red: '#f44336'
  };

  // 狀態標籤
  const statusLabels = {
    green: '達標',
    amber: '警示',
    red: '未達標'
  };

  // 準備 sparkline 數據
  const sparklineData = 趨勢數據.map(d => ({
    value: d.數值
  }));

  // 判斷趨勢方向
  const trendDirection = 趨勢數據[趨勢數據.length - 1].數值 > 趨勢數據[0].數值 ? 'up' : 'down';

  return (
    <div
      className={`top-kpi-card status-${狀態}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      {/* 標題區 */}
      <div className="kpi-header">
        <div className="kpi-title">
          <h3>{名稱}</h3>
          <span className="kpi-title-en">{名稱英文}</span>
        </div>
        <div
          className="kpi-status-badge"
          style={{ backgroundColor: statusColors[狀態] }}
        >
          {statusLabels[狀態]}
        </div>
      </div>

      {/* 主要數值區 */}
      <div className="kpi-main-value">
        <div className="kpi-value">
          <span className="value-number">{formatValue(當前值)}</span>
          <span className="value-unit">{單位}</span>
        </div>
        <div className="kpi-target">
          <span className="target-label">目標：</span>
          <span className="target-value">{formatValue(目標值)} {單位}</span>
        </div>
      </div>

      {/* 差異與趨勢區 */}
      <div className="kpi-delta-trend">
        <div className="kpi-delta">
          <span
            className={`delta-value ${差異百分比 >= 0 ? 'positive' : 'negative'}`}
          >
            {差異百分比 >= 0 ? '▲' : '▼'} {Math.abs(差異百分比).toFixed(2)}%
          </span>
          <span className="delta-label">較目標</span>
        </div>

        {/* Sparkline 迷你趨勢線 */}
        <div className="kpi-sparkline">
          <ResponsiveContainer width="100%" height={40}>
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={statusColors[狀態]}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <span className={`trend-direction ${trendDirection}`}>
            {trendDirection === 'up' ? '↗' : '↘'}
          </span>
        </div>
      </div>

      {/* 點擊提示 */}
      <div className="kpi-click-hint">
        點擊查看詳情 →
      </div>
    </div>
  );
}

export default TopKPICard;
