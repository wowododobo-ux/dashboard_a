import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import './KPIDrillDownModal.css';

/**
 * KPI Drill-Down Modal 組件
 * 顯示詳細的 KPI 分析：12個月趨勢、驅動因素、variance表格、結論
 */
function KPIDrillDownModal({ kpi, onClose }) {
  if (!kpi) return null;

  const {
    名稱,
    名稱英文,
    單位,
    當前值,
    目標值,
    差異百分比,
    狀態,
    趨勢數據,
    關鍵驅動因素,
    結論
  } = kpi;

  // 狀態顏色
  const statusColors = {
    green: '#4caf50',
    amber: '#ff9800',
    red: '#f44336'
  };

  // 準備圖表數據
  const chartData = 趨勢數據.map(d => ({
    月份: d.月份,
    實際值: d.數值,
    目標值: 目標值
  }));

  // 計算 variance table 數據
  const calculateVariance = () => {
    const latest = 趨勢數據[趨勢數據.length - 1];
    const oneMonthAgo = 趨勢數據[趨勢數據.length - 2];
    const threeMonthsAgo = 趨勢數據[趨勢數據.length - 4];
    const sixMonthsAgo = 趨勢數據[趨勢數據.length - 7];

    return [
      {
        期間: '本月 vs 目標',
        實際值: latest.數值.toFixed(2),
        比較值: 目標值.toFixed(2),
        差異: (latest.數值 - 目標值).toFixed(2),
        差異百分比: (((latest.數值 - 目標值) / 目標值) * 100).toFixed(2)
      },
      {
        期間: '本月 vs 上月',
        實際值: latest.數值.toFixed(2),
        比較值: oneMonthAgo.數值.toFixed(2),
        差異: (latest.數值 - oneMonthAgo.數值).toFixed(2),
        差異百分比: (((latest.數值 - oneMonthAgo.數值) / oneMonthAgo.數值) * 100).toFixed(2)
      },
      {
        期間: '本月 vs 3個月前',
        實際值: latest.數值.toFixed(2),
        比較值: threeMonthsAgo.數值.toFixed(2),
        差異: (latest.數值 - threeMonthsAgo.數值).toFixed(2),
        差異百分比: (((latest.數值 - threeMonthsAgo.數值) / threeMonthsAgo.數值) * 100).toFixed(2)
      },
      {
        期間: '本月 vs 6個月前',
        實際值: latest.數值.toFixed(2),
        比較值: sixMonthsAgo.數值.toFixed(2),
        差異: (latest.數值 - sixMonthsAgo.數值).toFixed(2),
        差異百分比: (((latest.數值 - sixMonthsAgo.數值) / sixMonthsAgo.數值) * 100).toFixed(2)
      }
    ];
  };

  const varianceData = calculateVariance();

  return (
    <div className="kpi-modal-overlay" onClick={onClose}>
      <div className="kpi-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>{名稱} ({名稱英文})</h2>
            <div className="modal-header-meta">
              <span className="current-value">
                當前值: <strong>{當前值.toFixed(2)} {單位}</strong>
              </span>
              <span className="target-value">
                目標值: <strong>{目標值.toFixed(2)} {單位}</strong>
              </span>
              <span
                className="status-badge"
                style={{ backgroundColor: statusColors[狀態] }}
              >
                {差異百分比 >= 0 ? '▲' : '▼'} {Math.abs(差異百分比).toFixed(2)}%
              </span>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {/* 趨勢圖表 */}
          <section className="chart-section">
            <h3>12個月趨勢分析</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="月份"
                    stroke="rgba(255,255,255,0.6)"
                    tick={{ fill: 'rgba(255,255,255,0.8)' }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.6)"
                    tick={{ fill: 'rgba(255,255,255,0.8)' }}
                    label={{
                      value: 單位,
                      angle: -90,
                      position: 'insideLeft',
                      fill: 'rgba(255,255,255,0.8)'
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e1e2e',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="實際值"
                    stroke="#667eea"
                    strokeWidth={3}
                    dot={{ fill: '#667eea', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="目標值"
                    stroke="#ff9800"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* 關鍵驅動因素 */}
          <section className="drivers-section">
            <h3>關鍵驅動因素</h3>
            <div className="drivers-grid">
              {關鍵驅動因素.map((driver, index) => (
                <div key={index} className="driver-card">
                  <div className="driver-header">
                    <span className="driver-number">{index + 1}</span>
                    <span className="driver-title">{driver.因素}</span>
                  </div>
                  <div className="driver-impact">
                    <span className={`impact-value ${driver.影響.startsWith('+') ? 'positive' : 'negative'}`}>
                      {driver.影響}
                    </span>
                  </div>
                  <p className="driver-description">{driver.說明}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Variance Table */}
          <section className="variance-section">
            <h3>差異分析表</h3>
            <div className="variance-table-container">
              <table className="variance-table">
                <thead>
                  <tr>
                    <th>比較期間</th>
                    <th>實際值</th>
                    <th>比較值</th>
                    <th>差異</th>
                    <th>差異 %</th>
                  </tr>
                </thead>
                <tbody>
                  {varianceData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.期間}</td>
                      <td>{row.實際值} {單位}</td>
                      <td>{row.比較值} {單位}</td>
                      <td className={parseFloat(row.差異) >= 0 ? 'positive' : 'negative'}>
                        {row.差異} {單位}
                      </td>
                      <td className={parseFloat(row.差異百分比) >= 0 ? 'positive' : 'negative'}>
                        {row.差異百分比 >= 0 ? '+' : ''}{row.差異百分比}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* 結論 */}
          <section className="conclusion-section">
            <h3>分析結論</h3>
            <p className="conclusion-text">{結論}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default KPIDrillDownModal;
