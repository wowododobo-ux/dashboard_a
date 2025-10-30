import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { textConfig } from '../config/textConfig';
import { useResponsive } from '../hooks/useResponsive';

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
          alert(textConfig.common.copyFailed);
        } finally {
          setCopying(false);
        }
      });
    } catch (err) {
      console.error('生成圖片失敗:', err);
      alert(textConfig.common.generateImageFailed);
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
            title={textConfig.common.copyChartTooltip}
          >
            {copying ? textConfig.common.copying : copied ? textConfig.common.copied : textConfig.common.copy}
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

// 根據比值獲取顏色
const getColorByRatio = (ratio) => {
  if (ratio >= 1.3) return '#d32f2f'; // 深紅 - 訂單非常強勁
  if (ratio >= 1.15) return '#f44336'; // 紅色 - 訂單強勁
  if (ratio >= 1.05) return '#ff9800'; // 橙色 - 訂單偏強
  if (ratio >= 0.95) return '#4caf50'; // 綠色 - 平衡
  if (ratio >= 0.85) return '#2196f3'; // 藍色 - 訂單偏弱
  if (ratio >= 0.7) return '#1976d2'; // 深藍 - 訂單較弱
  return '#0d47a1'; // 極深藍 - 訂單很弱
};

// 熱力圖組件
export function BookToBillHeatmap({ data }) {
  const { isMobile, isTablet, windowWidth } = useResponsive();
  const [hoveredCell, setHoveredCell] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map(item => ({
      baseMonth: item['基準月份'],
      month1: { ratio: item['+1月比值'], target: item['+1月目標'], orderAmount: item['+1月訂單金額'] },
      month2: { ratio: item['+2月比值'], target: item['+2月目標'], orderAmount: item['+2月訂單金額'] },
      month3: { ratio: item['+3月比值'], target: item['+3月目標'], orderAmount: item['+3月訂單金額'] },
      month4: { ratio: item['+4月比值'], target: item['+4月目標'], orderAmount: item['+4月訂單金額'] },
      month5: { ratio: item['+5月比值'], target: item['+5月目標'], orderAmount: item['+5月訂單金額'] },
      month6: { ratio: item['+6月比值'], target: item['+6月目標'], orderAmount: item['+6月訂單金額'] },
      note: item['註解'] || ''
    }));
  }, [data]);

  // 根據螢幕寬度計算單元格尺寸
  const dimensions = useMemo(() => {
    let cellWidth, cellHeight, leftMargin, fontSize;

    if (isMobile) {
      // 手機：計算可用寬度並均分給6個單元格
      const availableWidth = Math.min(windowWidth - 60, 320); // 留出左右邊距
      cellWidth = Math.floor((availableWidth - 70) / 6); // 70px for left margin
      cellHeight = 28;
      leftMargin = 70;
      fontSize = 9;
    } else if (isTablet) {
      cellWidth = 50;
      cellHeight = 30;
      leftMargin = 85;
      fontSize = 10;
    } else {
      cellWidth = 60;
      cellHeight = 30;
      leftMargin = 100;
      fontSize = 11;
    }

    return { cellWidth, cellHeight, leftMargin, fontSize };
  }, [isMobile, isTablet, windowWidth]);

  const handleMouseEnter = (e, baseMonth, monthOffset, data) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredCell({
      baseMonth,
      monthOffset,
      ...data
    });
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  if (chartData.length === 0) {
    return <div>{textConfig.common.noData}</div>;
  }

  const { cellWidth, cellHeight, leftMargin, fontSize } = dimensions;
  const topMargin = isMobile ? 35 : 50;
  const chartWidth = leftMargin + cellWidth * 6 + 20;
  const chartHeight = topMargin + cellHeight * chartData.length + 50;

  return (
    <ChartContainer title={textConfig.bookToBillCharts.heatmap}>
      <div style={{ position: 'relative', overflow: 'auto', padding: '20px' }}>
        <svg width={chartWidth} height={chartHeight}>
          {/* X軸標籤 */}
          {[
            textConfig.monthOffset.plus1,
            textConfig.monthOffset.plus2,
            textConfig.monthOffset.plus3,
            textConfig.monthOffset.plus4,
            textConfig.monthOffset.plus5,
            textConfig.monthOffset.plus6
          ].map((label, i) => (
            <text
              key={i}
              x={leftMargin + i * cellWidth + cellWidth / 2}
              y={topMargin - 15}
              textAnchor="middle"
              fontSize={isMobile ? 10 : 12}
              fill="rgba(255, 255, 255, 0.7)"
              fontWeight="bold"
            >
              {label}
            </text>
          ))}

          {/* Y軸標籤和熱力圖單元格 */}
          {chartData.map((row, rowIndex) => (
            <g key={rowIndex}>
              {/* Y軸標籤 */}
              <text
                x={leftMargin - 10}
                y={topMargin + rowIndex * cellHeight + cellHeight / 2}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={isMobile ? 9 : 11}
                fill="rgba(255, 255, 255, 0.7)"
              >
                {row.baseMonth}
              </text>

              {/* 熱力圖單元格 */}
              {[row.month1, row.month2, row.month3, row.month4, row.month5, row.month6].map((monthData, colIndex) => (
                <g key={colIndex}>
                  <rect
                    x={leftMargin + colIndex * cellWidth}
                    y={topMargin + rowIndex * cellHeight}
                    width={cellWidth}
                    height={cellHeight}
                    fill={getColorByRatio(monthData.ratio)}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeWidth={2}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => handleMouseEnter(e, row.baseMonth, colIndex + 1, monthData)}
                    onMouseLeave={handleMouseLeave}
                  />
                  <text
                    x={leftMargin + colIndex * cellWidth + cellWidth / 2}
                    y={topMargin + rowIndex * cellHeight + cellHeight / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={fontSize}
                    fill="#fff"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    {monthData.ratio.toFixed(2)}
                  </text>
                </g>
              ))}
            </g>
          ))}
        </svg>

        {/* 圖例 */}
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{textConfig.heatmapLegend.title}</span>
          {[
            { color: '#d32f2f', label: textConfig.heatmapLegend.veryStrong },
            { color: '#f44336', label: textConfig.heatmapLegend.strong },
            { color: '#ff9800', label: textConfig.heatmapLegend.aboveAverage },
            { color: '#4caf50', label: textConfig.heatmapLegend.balanced },
            { color: '#2196f3', label: textConfig.heatmapLegend.belowAverage },
            { color: '#1976d2', label: textConfig.heatmapLegend.weak },
            { color: '#0d47a1', label: textConfig.heatmapLegend.veryWeak }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: item.color, border: '1px solid #ccc' }}></div>
              <span style={{ fontSize: '12px' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {hoveredCell && (
          <div
            style={{
              position: 'fixed',
              left: tooltipPos.x,
              top: tooltipPos.y,
              transform: 'translate(-50%, -100%)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '12px',
              border: '2px solid #667eea',
              borderRadius: '6px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
              zIndex: 9999,
              pointerEvents: 'none',
              minWidth: '200px'
            }}
          >
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
              marginTop: '-12px'
            }}>
              {hoveredCell.baseMonth} → +{hoveredCell.monthOffset}月
            </p>
            <p style={{ margin: '4px 0', fontSize: '13px', color: '#333' }}>
              <span style={{ fontWeight: '600' }}>{textConfig.tooltip.targetMonth}：</span>{hoveredCell.target}
            </p>
            <p style={{ margin: '4px 0', fontSize: '13px', color: '#333' }}>
              <span style={{ fontWeight: '600' }}>{textConfig.tooltip.orderAmount}：</span>
              <span style={{ color: '#4caf50', fontWeight: 'bold' }}>
                {Math.round(hoveredCell.orderAmount).toLocaleString('en-US')} M NTD
              </span>
            </p>
            <p style={{ margin: '4px 0', fontSize: '13px', color: '#333' }}>
              <span style={{ fontWeight: '600' }}>{textConfig.tooltip.ratio}：</span>
              <span style={{ color: getColorByRatio(hoveredCell.ratio), fontWeight: 'bold' }}>
                {hoveredCell.ratio.toFixed(2)}
              </span>
            </p>
          </div>
        )}
      </div>
    </ChartContainer>
  );
}
