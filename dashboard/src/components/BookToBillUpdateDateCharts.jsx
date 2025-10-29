import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import html2canvas from 'html2canvas';
import { extractDayFromDate } from '../utils/bookToBillParser';

// 圖表容器組件
const ChartContainer = ({ title, children }) => {
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const chartRef = useRef(null);
  const buttonRef = useRef(null);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    setShowButton(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        chartRef.current &&
        !chartRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowButton(false);
      }
    };

    if (showButton) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showButton]);

  const handleCopy = useCallback(async () => {
    if (!chartRef.current || copying) return;

    setCopying(true);
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
            setShowButton(false);
          }, 2000);
        } catch (err) {
          console.error('複製失敗:', err);
          alert('複製失敗，請重試');
        } finally {
          setCopying(false);
        }
      });
    } catch (err) {
      console.error('生成圖片失敗:', err);
      alert('生成圖片失敗，請重試');
      setCopying(false);
    }
  }, [copying]);

  return (
    <div
      className="chart-container"
      ref={chartRef}
      onContextMenu={handleContextMenu}
    >
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        {showButton && (
          <button
            ref={buttonRef}
            className={`copy-button ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            disabled={copying}
            title="複製圖表為圖片"
          >
            {copying ? '複製中...' : copied ? '✓ 已複製' : '📋 複製'}
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

// 自訂 Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '12px',
      border: '2px solid #667eea',
      borderRadius: '6px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
      maxWidth: '320px',
      zIndex: 9999,
      position: 'relative'
    }}>
      <p style={{
        margin: '0 0 10px 0',
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#667eea',
        padding: '6px 10px',
        borderRadius: '4px',
        fontSize: '14px',
        marginLeft: '-12px',
        marginRight: '-12px',
        marginTop: '-12px',
        marginBottom: '10px'
      }}>
        {label}
      </p>
      {payload.map((entry, index) => (
        <p key={index} style={{ margin: '4px 0', color: entry.color, fontSize: '13px' }}>
          <span style={{ fontWeight: '600' }}>{entry.name}：</span>
          {typeof entry.value === 'number'
            ? entry.name.includes('比值')
              ? entry.value.toFixed(2)
              : Math.round(entry.value).toLocaleString('en-US')
            : entry.value}
        </p>
      ))}
    </div>
  );
};

// 實際出貨值（長條圖）+ 比值的1日、10日、20日折線
export function ShipmentWithN6RatiosByDate({ matrixDataWithDates }) {
  const [selectedOffset, setSelectedOffset] = useState(1);

  const chartData = useMemo(() => {
    if (!matrixDataWithDates || matrixDataWithDates.length === 0) return [];

    // 按目標月份分組
    const targetMonthMap = {};

    matrixDataWithDates.forEach(row => {
      const updateDate = row['更新日期'];
      const day = extractDayFromDate(updateDate);

      for (let offset = 1; offset <= 6; offset++) {
        const targetMonth = row[`+${offset}月目標`];
        const ratio = row[`+${offset}月比值`];
        const shipmentAmount = row[`+${offset}月出貨金額`];

        if (!targetMonthMap[targetMonth]) {
          targetMonthMap[targetMonth] = {
            targetMonth,
            shipmentAmount,
            day01: {},
            day10: {},
            day20: {}
          };
        }

        const dayKey = `day${day}`;
        if (!targetMonthMap[targetMonth][dayKey][`+${offset}月比值`]) {
          targetMonthMap[targetMonth][dayKey][`+${offset}月比值`] = [];
        }
        targetMonthMap[targetMonth][dayKey][`+${offset}月比值`].push(ratio);
      }
    });

    // 轉換為圖表數據格式
    return Object.keys(targetMonthMap)
      .sort()
      .map(targetMonth => {
        const data = targetMonthMap[targetMonth];
        const result = {
          targetMonth,
          出貨金額: data.shipmentAmount
        };

        // 計算每個更新日期的平均比值
        for (let offset = 1; offset <= 6; offset++) {
          ['01', '10', '20'].forEach(day => {
            const dayKey = `day${day}`;
            const ratios = data[dayKey][`+${offset}月比值`];
            if (ratios && ratios.length > 0) {
              const avg = ratios.reduce((sum, r) => sum + r, 0) / ratios.length;
              result[`${day}日+${offset}月比值`] = parseFloat(avg.toFixed(2));
            } else {
              result[`${day}日+${offset}月比值`] = null;
            }
          });
        }

        return result;
      });
  }, [matrixDataWithDates]);

  const offsetColors = {
    1: { day01: '#ffcdd2', day10: '#f44336', day20: '#b71c1c' },
    2: { day01: '#ffe0b2', day10: '#ff9800', day20: '#e65100' },
    3: { day01: '#fff9c4', day10: '#ffc107', day20: '#f57f17' },
    4: { day01: '#c8e6c9', day10: '#4caf50', day20: '#1b5e20' },
    5: { day01: '#bbdefb', day10: '#2196f3', day20: '#0d47a1' },
    6: { day01: '#e1bee7', day10: '#9c27b0', day20: '#4a148c' }
  };

  const currentColors = offsetColors[selectedOffset];

  return (
    <ChartContainer title={`實際出貨金額 + +${selectedOffset}月比值（1日、10日、20日）`}>
      <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '13px', color: '#333' }}>
          選擇要顯示的偏移月份：
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4, 5, 6].map(offset => (
            <button
              key={offset}
              onClick={() => setSelectedOffset(offset)}
              style={{
                padding: '6px 12px',
                backgroundColor: selectedOffset === offset ? offsetColors[offset].day10 : '#e0e0e0',
                color: selectedOffset === offset ? '#fff' : '#666',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: selectedOffset === offset ? 'bold' : 'normal',
                transition: 'all 0.2s'
              }}
            >
              +{offset}月
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 10, left: 10, bottom: 60 }}>
          <CartesianGrid strokeDasharray="2 1" />
          <XAxis dataKey="targetMonth" angle={-45} textAnchor="end" height={80} fontSize={10} />
          <YAxis yAxisId="left" domain={[0, dataMax => Math.max(dataMax * 1.2, 2)]} />
          <YAxis yAxisId="right" orientation="right" domain={[0, dataMax => dataMax * 1.2]} />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend wrapperStyle={{ fontSize: '11px' }} />

          <ReferenceLine yAxisId="left" y={1} stroke="#ff7300" strokeDasharray="3 3" label={{ value: '平衡點 (1.0)', fontSize: 10, fill: '#ff7300' }} />

          {/* 長條圖：歷史出貨金額 */}
          <Bar yAxisId="right" dataKey="出貨金額" fill="#82ca9d" name="歷史出貨金額(M NTD)" barSize={30} opacity={0.4} />

          {/* 3條折線：1日、10日、20日的比值 */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey={`01日+${selectedOffset}月比值`}
            stroke={currentColors.day01}
            strokeWidth={3}
            dot={{ r: 4 }}
            name={`1日 +${selectedOffset}月比值`}
            connectNulls
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey={`10日+${selectedOffset}月比值`}
            stroke={currentColors.day10}
            strokeWidth={3}
            dot={{ r: 4 }}
            name={`10日 +${selectedOffset}月比值`}
            connectNulls
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey={`20日+${selectedOffset}月比值`}
            stroke={currentColors.day20}
            strokeWidth={3}
            dot={{ r: 4 }}
            name={`20日 +${selectedOffset}月比值`}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
