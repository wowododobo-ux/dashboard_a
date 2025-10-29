import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import {
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import html2canvas from 'html2canvas';
import { extractMonth, isForecast } from '../utils/dataParser';
import { useResponsive } from '../hooks/useResponsive';
import { CustomLegend } from './CustomLegend';
import { legendConfig } from '../config/legendConfig';
import { textConfig } from '../config/textConfig';

// 數值格式化函數
const formatMoney = (value) => {
  if (value === null || value === undefined) return '';
  return Math.round(value).toLocaleString('en-US');
};

const formatPercent = (value) => {
  if (value === null || value === undefined) return '';
  return value.toFixed(1);
};

// 創建一個渲染器工廠函數
const createBarLabelRenderer = (chartData, formatter, fontSize = 10) => {
  return (props) => {
    const { x, y, width, height, value, index } = props;
    if (value === null || value === undefined) return null;

    const isForecast = chartData[index]?.isForecast;
    const fill = isForecast ? '#888' : '#fff';  // 預測值灰色，實際值白色
    const formattedValue = formatter ? formatter(value) : value;

    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        fill={fill}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize}
        fontWeight="bold"
      >
        {formattedValue}
      </text>
    );
  };
};

// 自定義 Tooltip 組件，顯示註解
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  // 獲取第一個 payload 中的註解
  const note = payload[0]?.payload?.註解;

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
          <span style={{ fontWeight: '600' }}>{entry.name}:</span> {
            typeof entry.value === 'number'
              ? (entry.name.includes('%') ? entry.value.toFixed(1) : Math.round(entry.value).toLocaleString('en-US'))
              : entry.value
          }
        </p>
      ))}
      {note && (
        <div style={{
          marginTop: '10px',
          paddingTop: '10px',
          borderTop: '2px solid #e67e22',
          backgroundColor: 'rgba(255, 249, 240, 0.95)',
          padding: '10px',
          borderRadius: '4px',
          marginLeft: '-10px',
          marginRight: '-10px',
          marginBottom: '-10px'
        }}>
          <strong style={{ color: '#d35400', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
            📝 註解
          </strong>
          <p style={{ margin: '0', color: '#333', fontSize: '13px', lineHeight: '1.6', fontWeight: '500' }}>
            {note}
          </p>
        </div>
      )}
    </div>
  );
};

// 自定義X軸標籤組件（帶註解標示）
const CustomXAxisTick = ({ x, y, payload, chartData, angle = 0, isMobile = false }) => {
  const dataPoint = chartData.find(item => item.month === payload.value);
  const hasNote = dataPoint && dataPoint.註解 && dataPoint.註解.trim() !== '';

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor={isMobile && angle !== 0 ? 'end' : 'middle'}
        fill="#666"
        fontSize={11}
        transform={angle !== 0 ? `rotate(${angle})` : ''}
      >
        {payload.value}
      </text>
      {hasNote && !isMobile && (
        <path
          d="M 0,-2 L -4,3 L 4,3 Z"
          fill="#e67e22"
          stroke="#e67e22"
          strokeWidth={0.5}
        />
      )}
    </g>
  );
};

// 圖表容器樣式
const ChartContainer = ({ title, children, onClick }) => {
  const chartRef = useRef(null);
  const buttonRef = useRef(null);
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // 處理右鍵點擊
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    setShowButton(true);
  }, []);

  // 處理點擊圖卡
  const handleClick = useCallback((e) => {
    // 如果點擊的是按鈕，不觸發圖卡點擊
    if (buttonRef.current && buttonRef.current.contains(e.target)) {
      return;
    }
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  // 點擊其他地方隱藏按鈕
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (chartRef.current && !chartRef.current.contains(e.target)) {
        setShowButton(false);
      }
    };

    if (showButton) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showButton]);

  const handleCopy = async () => {
    if (!chartRef.current || copying) return;

    try {
      setCopying(true);

      // 暫時隱藏複製按鈕
      if (buttonRef.current) {
        buttonRef.current.style.visibility = 'hidden';
      }

      // 等待一小段時間確保DOM更新
      await new Promise(resolve => setTimeout(resolve, 10));

      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });

      // 恢復顯示複製按鈕
      if (buttonRef.current) {
        buttonRef.current.style.visibility = 'visible';
      }

      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
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

      // 確保按鈕恢復顯示
      if (buttonRef.current) {
        buttonRef.current.style.visibility = 'visible';
      }
    }
  };

  return (
    <div
      className="chart-container"
      ref={chartRef}
      onContextMenu={handleContextMenu}
      onClick={handleClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
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

// 圖一：合併營收淨額與銷貨毛利率
export const Chart1 = ({ data, onClick }) => {
  const { chartHeight, fontSize, isMobile } = useResponsive();
  if (!data) return <div>載入中...</div>;

  // 直接從數據中提取欄位名稱（使用 Excel 實際欄位）
  const col1 = 'CS';
  const col2 = 'Si';
  const col3 = '其它';
  const col4 = '銷貨毛利率(%)';

  const chartData = useMemo(() => data.map(item => {
    const isForecastValue = isForecast(item['是否為預測']);
    return {
      month: item['月份'],
      [col1]: item[col1],
      [col2]: item[col2],
      [col3]: item[col3],
      [`${col4}`]: !isForecastValue ? item[col4] : null,
      [`${col4}_forecast`]: isForecastValue ? item[col4] : null,
      isForecast: isForecastValue,
      註解: item['註解'] || null,
    };
  }), [data, col1, col2, col3, col4]);

  const labelRenderer1 = useMemo(() => createBarLabelRenderer(chartData, formatMoney, 9), [chartData]);
  const labelRenderer2 = useMemo(() => createBarLabelRenderer(chartData, formatMoney, 9), [chartData]);
  const labelRenderer3 = useMemo(() => createBarLabelRenderer(chartData, formatMoney, 9), [chartData]);

  return (
    <ChartContainer title={textConfig.financialCharts.chart1} onClick={onClick}>
      <ResponsiveContainer width="100%" aspect={2.5}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 10, left: 10, bottom: 2 }} barCategoryGap="15%">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick chartData={chartData} angle={isMobile ? -45 : 0} isMobile={isMobile} />}
            height={isMobile ? 60 : 40}
            padding={{ left: 0, right: 0 }}
          />
          <YAxis yAxisId="left" fontSize={fontSize.axis} tick={false} width={0} domain={[0, dataMax => dataMax * 1.2]} />
          <YAxis yAxisId="right" orientation="right" fontSize={fontSize.axis} tick={false} width={0} domain={[0, dataMax => dataMax * 1.2]} />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend customOrder={legendConfig.chart1} />} />
          <Bar yAxisId="left" dataKey={col1} stackId="revenue" fill="#8884d8" name={col1}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
            ))}
            <LabelList dataKey={col1} content={labelRenderer1} />
          </Bar>
          <Bar yAxisId="left" dataKey={col2} stackId="revenue" fill="#82ca9d" name={col2}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
            ))}
            <LabelList dataKey={col2} content={labelRenderer2} />
          </Bar>
          <Bar yAxisId="left" dataKey={col3} stackId="revenue" fill="#ffc658" name={col3}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
            ))}
            <LabelList dataKey={col3} content={labelRenderer3} />
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey={col4} stroke="#ff7300" strokeWidth={2} name={col4} connectNulls>
            <LabelList dataKey={col4} position="top" fontSize={10} formatter={formatPercent} />
          </Line>
          <Line yAxisId="right" type="monotone" dataKey={`${col4}_forecast`} stroke="#ff7300" strokeWidth={2} strokeDasharray="2 1" name={col4} connectNulls legendType="none">
            <LabelList dataKey={`${col4}_forecast`} position="top" fontSize={10} formatter={formatPercent} />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// 圖二：銷貨退回與折讓
export const Chart2 = ({ data, onClick }) => {
  const { chartHeight, fontSize, isMobile } = useResponsive();
  if (!data) return <div>載入中...</div>;

  const col1 = '銷貨退回與折讓(M NTD)';
  const col2 = '佔合併營收總額比重(%)';

  const chartData = useMemo(() => data.map(item => {
    const isForecastValue = isForecast(item['是否為預測']);
    return {
      month: item['月份'],
      [col1]: item[col1],
      [`${col2}`]: !isForecastValue ? item[col2] : null,
      [`${col2}_forecast`]: isForecastValue ? item[col2] : null,
      isForecast: isForecastValue,
      註解: item['註解'] || null,
    };
  }), [data, col1, col2]);

  const labelRenderer = useMemo(() => createBarLabelRenderer(chartData, formatMoney, 10), [chartData]);

  return (
    <ChartContainer title={textConfig.financialCharts.chart2} onClick={onClick}>
      <ResponsiveContainer width="100%" aspect={2.5}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 10, left: 10, bottom: 2 }} barCategoryGap="15%" barGap={0}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick chartData={chartData} angle={isMobile ? -45 : 0} isMobile={isMobile} />}
            height={isMobile ? 60 : 40}
          />
          <YAxis yAxisId="left" fontSize={fontSize.axis} tick={false} width={0} domain={[0, dataMax => dataMax * 1.2]} />
          <YAxis yAxisId="right" orientation="right" fontSize={fontSize.axis} tick={false} width={0} domain={[0, dataMax => dataMax * 1.2]} />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend customOrder={legendConfig.chart2} />} />
          <Bar yAxisId="left" dataKey={col1} fill="#8884d8" name={col1} maxBarSize={500}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
            ))}
            <LabelList dataKey={col1} content={labelRenderer} />
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey={col2} stroke="#ff7300" strokeWidth={2} name={col2} connectNulls>
            <LabelList dataKey={col2} position="top" fontSize={10} formatter={formatPercent} />
          </Line>
          <Line yAxisId="right" type="monotone" dataKey={`${col2}_forecast`} stroke="#ff7300" strokeWidth={2} strokeDasharray="2 1" name={col2} connectNulls legendType="none">
            <LabelList dataKey={`${col2}_forecast`} position="top" fontSize={10} formatter={formatPercent} />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// 圖三：營業毛利與營業毛利率
export const Chart3 = ({ data, onClick }) => {
  const { chartHeight, fontSize, isMobile } = useResponsive();
  if (!data) return <div>載入中...</div>;

  const col1 = '營業毛利(M NTD)';
  const col2 = '營業毛利率(%)';

  const chartData = useMemo(() => data.map(item => {
    const isForecastValue = isForecast(item['是否為預測']);
    return {
      month: item['月份'],
      [col1]: item[col1],
      [`${col2}`]: !isForecastValue ? item[col2] : null,
      [`${col2}_forecast`]: isForecastValue ? item[col2] : null,
      isForecast: isForecastValue,
      註解: item['註解'] || null,
    };
  }), [data, col1, col2]);

  const labelRenderer = useMemo(() => createBarLabelRenderer(chartData, formatMoney, 10), [chartData]);

  return (
    <ChartContainer title={textConfig.financialCharts.chart3} onClick={onClick}>
      <ResponsiveContainer width="100%" aspect={2.5}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 10, left: 10, bottom: 2 }} barCategoryGap="15%">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick chartData={chartData} angle={isMobile ? -45 : 0} isMobile={isMobile} />}
            height={isMobile ? 60 : 40}
            padding={{ left: 0, right: 0 }}
          />
          <YAxis yAxisId="left" fontSize={fontSize.axis} tick={false} width={0} domain={[0, dataMax => dataMax * 1.2]} />
          <YAxis yAxisId="right" orientation="right" fontSize={fontSize.axis} tick={false} width={0} domain={[0, dataMax => dataMax * 1.2]} />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend customOrder={legendConfig.chart3} />} />
          <Bar yAxisId="left" dataKey={col1} fill="#82ca9d" name={col1}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
            ))}
            <LabelList dataKey={col1} content={labelRenderer} />
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey={col2} stroke="#ff7300" strokeWidth={2} name={col2} connectNulls>
            <LabelList dataKey={col2} position="top" fontSize={10} formatter={formatPercent} />
          </Line>
          <Line yAxisId="right" type="monotone" dataKey={`${col2}_forecast`} stroke="#ff7300" strokeWidth={2} strokeDasharray="2 1" name={col2} connectNulls legendType="none">
            <LabelList dataKey={`${col2}_forecast`} position="top" fontSize={10} formatter={formatPercent} />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// 圖四：存貨與跌價損失
export const Chart4 = ({ data, onClick }) => {
  const { chartHeight, fontSize, isMobile } = useResponsive();
  if (!data) return <div>載入中...</div>;

  const col1 = '存貨與跌價損失(M NTD)';
  const col2 = '庫存損失率(%)';

  const chartData = useMemo(() => data.map(item => {
    const isForecastValue = isForecast(item['是否為預測']);
    return {
      month: item['月份'],
      [col1]: item[col1],
      [`${col2}`]: !isForecastValue ? item[col2] : null,
      [`${col2}_forecast`]: isForecastValue ? item[col2] : null,
      isForecast: isForecastValue,
      註解: item['註解'] || null,
    };
  }), [data, col1, col2]);

  const labelRenderer = useMemo(() => createBarLabelRenderer(chartData, formatMoney, 10), [chartData]);

  return (
    <ChartContainer title={textConfig.financialCharts.chart4} onClick={onClick}>
      <ResponsiveContainer width="100%" aspect={2.5}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 10, left: 10, bottom: 2 }} barCategoryGap="15%">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick chartData={chartData} angle={isMobile ? -45 : 0} isMobile={isMobile} />}
            height={isMobile ? 60 : 40}
            padding={{ left: 0, right: 0 }}
          />
          <YAxis yAxisId="left" fontSize={fontSize.axis} tick={false} width={0} domain={[0, dataMax => dataMax * 1.2]} />
          <YAxis yAxisId="right" orientation="right" fontSize={fontSize.axis} tick={false} width={0} domain={[0, dataMax => dataMax * 1.2]} />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend customOrder={legendConfig.chart4} />} />
          <Bar yAxisId="left" dataKey={col1} fill="#ff6b6b" name={col1}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
            ))}
            <LabelList dataKey={col1} content={labelRenderer} />
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey={col2} stroke="#ff7300" strokeWidth={2} name={col2} connectNulls>
            <LabelList dataKey={col2} position="top" fontSize={10} formatter={formatPercent} />
          </Line>
          <Line yAxisId="right" type="monotone" dataKey={`${col2}_forecast`} stroke="#ff7300" strokeWidth={2} strokeDasharray="2 1" name={col2} connectNulls legendType="none">
            <LabelList dataKey={`${col2}_forecast`} position="top" fontSize={10} formatter={formatPercent} />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// 圖五：閒置產能損失
export const Chart5 = ({ data, onClick }) => {
  const { chartHeight, fontSize, isMobile } = useResponsive();
  if (!data) return <div>載入中...</div>;

  const col1 = '閒置產能損失(M NTD)';

  const chartData = useMemo(() => data.map(item => {
    const isForecastValue = isForecast(item['是否為預測']);
    return {
      month: item['月份'],
      [col1]: item[col1],
      isForecast: isForecastValue,
      註解: item['註解'] || null,
    };
  }), [data, col1]);

  const labelRenderer = useMemo(() => createBarLabelRenderer(chartData, formatMoney, 10), [chartData]);

  return (
    <ChartContainer title={textConfig.financialCharts.chart5} onClick={onClick}>
      <ResponsiveContainer width="100%" aspect={2.5}>
        <BarChart data={chartData} margin={{ top: 8, right: 10, left: 10, bottom: 2 }} barCategoryGap="15%">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick chartData={chartData} angle={isMobile ? -45 : 0} isMobile={isMobile} />}
            height={isMobile ? 60 : 40}
            padding={{ left: 0, right: 0 }}
          />
          <YAxis fontSize={fontSize.axis} tick={false} width={0} domain={[0, dataMax => dataMax * 1.2]} />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend customOrder={legendConfig.chart5} />} />
          <Bar dataKey={col1} fill="#9b59b6" name={col1}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
            ))}
            <LabelList dataKey={col1} content={labelRenderer} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// 圖六：營業費用
export const Chart6 = ({ data, onClick }) => {
  const { chartHeight, fontSize, isMobile } = useResponsive();
  if (!data) return <div>載入中...</div>;

  const col1 = '研發費用(M NTD)';
  const col2 = '管理費用(M NTD)';
  const col3 = '銷售費用(M NTD)';
  const col4 = '營業費用率(%)';

  const chartData = useMemo(() => data.map(item => {
    const isForecastValue = isForecast(item['是否為預測']);
    return {
      month: item['月份'],
      [col1]: item[col1],
      [col2]: item[col2],
      [col3]: item[col3],
      [`${col4}`]: !isForecastValue ? item[col4] : null,
      [`${col4}_forecast`]: isForecastValue ? item[col4] : null,
      isForecast: isForecastValue,
      註解: item['註解'] || null,
    };
  }), [data, col1, col2, col3, col4]);

  const labelRenderer1 = useMemo(() => createBarLabelRenderer(chartData, formatMoney, 9), [chartData]);
  const labelRenderer2 = useMemo(() => createBarLabelRenderer(chartData, formatMoney, 9), [chartData]);
  const labelRenderer3 = useMemo(() => createBarLabelRenderer(chartData, formatMoney, 9), [chartData]);

  return (
    <ChartContainer title={textConfig.financialCharts.chart6} onClick={onClick}>
      <ResponsiveContainer width="100%" aspect={2.5}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 10, left: 10, bottom: 2 }} barCategoryGap="15%">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick chartData={chartData} angle={isMobile ? -45 : 0} isMobile={isMobile} />}
            height={isMobile ? 60 : 40}
            padding={{ left: 0, right: 0 }}
          />
          <YAxis yAxisId="left" fontSize={fontSize.axis} tick={false} width={0} domain={[0, dataMax => dataMax * 1.2]} />
          <YAxis yAxisId="right" orientation="right" fontSize={fontSize.axis} tick={false} width={0} domain={[0, dataMax => dataMax * 1.2]} />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend customOrder={legendConfig.chart6} />} />
          <Bar yAxisId="left" dataKey={col1} stackId="expense" fill="#3498db" name={col1}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
            ))}
            <LabelList dataKey={col1} content={labelRenderer1} />
          </Bar>
          <Bar yAxisId="left" dataKey={col2} stackId="expense" fill="#2ecc71" name={col2}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
            ))}
            <LabelList dataKey={col2} content={labelRenderer2} />
          </Bar>
          <Bar yAxisId="left" dataKey={col3} stackId="expense" fill="#f39c12" name={col3}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
            ))}
            <LabelList dataKey={col3} content={labelRenderer3} />
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey={col4} stroke="#ff7300" strokeWidth={2} name={col4} connectNulls>
            <LabelList dataKey={col4} position="top" fontSize={10} formatter={formatPercent} />
          </Line>
          <Line yAxisId="right" type="monotone" dataKey={`${col4}_forecast`} stroke="#ff7300" strokeWidth={2} strokeDasharray="2 1" name={col4} connectNulls legendType="none">
            <LabelList dataKey={`${col4}_forecast`} position="top" fontSize={10} formatter={formatPercent} />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// 圖七：營業利益
export const Chart7 = ({ data, onClick }) => {
  const { chartHeight, fontSize, isMobile } = useResponsive();
  if (!data) return <div>載入中...</div>;

  const col1 = '營業利益(M NTD)';
  const col2 = '營業利益率(%)';

  const chartData = useMemo(() => data.map(item => {
    const isForecastValue = isForecast(item['是否為預測']);
    return {
      month: item['月份'],
      [col1]: item[col1],
      [`${col2}`]: !isForecastValue ? item[col2] : null,
      [`${col2}_forecast`]: isForecastValue ? item[col2] : null,
      isForecast: isForecastValue,
      註解: item['註解'] || null,
    };
  }), [data, col1, col2]);

  const labelRenderer = useMemo(() => createBarLabelRenderer(chartData, formatMoney, 10), [chartData]);

  return (
    <ChartContainer title={textConfig.financialCharts.chart7} onClick={onClick}>
      <ResponsiveContainer width="100%" aspect={2.5}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 10, left: 10, bottom: 2 }} barCategoryGap="15%">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick chartData={chartData} angle={isMobile ? -45 : 0} isMobile={isMobile} />}
            height={isMobile ? 60 : 40}
            padding={{ left: 0, right: 0 }}
          />
          <YAxis yAxisId="left" fontSize={fontSize.axis} tick={false} width={0} domain={[0, dataMax => dataMax * 1.2]} />
          <YAxis yAxisId="right" orientation="right" fontSize={fontSize.axis} tick={false} width={0} domain={[0, dataMax => dataMax * 1.2]} />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend customOrder={legendConfig.chart7} />} />
          <Bar yAxisId="left" dataKey={col1} fill="#27ae60" name={col1}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
            ))}
            <LabelList dataKey={col1} content={labelRenderer} />
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey={col2} stroke="#ff7300" strokeWidth={2} name={col2} connectNulls>
            <LabelList dataKey={col2} position="top" fontSize={10} formatter={formatPercent} />
          </Line>
          <Line yAxisId="right" type="monotone" dataKey={`${col2}_forecast`} stroke="#ff7300" strokeWidth={2} strokeDasharray="2 1" name={col2} connectNulls legendType="none">
            <LabelList dataKey={`${col2}_forecast`} position="top" fontSize={10} formatter={formatPercent} />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// 圖八：EBITDA
export const Chart8 = ({ data, onClick }) => {
  const { chartHeight, fontSize, isMobile } = useResponsive();
  if (!data) return <div>載入中...</div>;

  const col1 = 'EBITDA(M NTD)';
  const col2 = 'EBITDA率(%)';

  const chartData = useMemo(() => data.map(item => {
    const isForecastValue = isForecast(item['是否為預測']);
    return {
      month: item['月份'],
      [col1]: item[col1],
      [`${col2}`]: !isForecastValue ? item[col2] : null,
      [`${col2}_forecast`]: isForecastValue ? item[col2] : null,
      isForecast: isForecastValue,
      註解: item['註解'] || null,
    };
  }), [data, col1, col2]);

  const labelRenderer = useMemo(() => createBarLabelRenderer(chartData, formatMoney, 10), [chartData]);

  return (
    <ChartContainer title={textConfig.financialCharts.chart8} onClick={onClick}>
      <ResponsiveContainer width="100%" aspect={2.5}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 10, left: 10, bottom: 2 }} barCategoryGap="15%">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick chartData={chartData} angle={isMobile ? -45 : 0} isMobile={isMobile} />}
            height={isMobile ? 60 : 40}
            padding={{ left: 0, right: 0 }}
          />
          <YAxis yAxisId="left" fontSize={fontSize.axis} tick={false} width={0} domain={[0, dataMax => dataMax * 1.2]} />
          <YAxis yAxisId="right" orientation="right" fontSize={fontSize.axis} tick={false} width={0} domain={[0, dataMax => dataMax * 1.2]} />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend customOrder={legendConfig.chart8} />} />
          <Bar yAxisId="left" dataKey={col1} fill="#16a085" name={col1}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
            ))}
            <LabelList dataKey={col1} content={labelRenderer} />
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey={col2} stroke="#ff7300" strokeWidth={2} name={col2} connectNulls>
            <LabelList dataKey={col2} position="top" fontSize={10} formatter={formatPercent} />
          </Line>
          <Line yAxisId="right" type="monotone" dataKey={`${col2}_forecast`} stroke="#ff7300" strokeWidth={2} strokeDasharray="2 1" name={col2} connectNulls legendType="none">
            <LabelList dataKey={`${col2}_forecast`} position="top" fontSize={10} formatter={formatPercent} />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

// 圖九：稅後淨利
export const Chart9 = ({ data, onClick }) => {
  const { chartHeight, fontSize, isMobile } = useResponsive();
  if (!data) return <div>載入中...</div>;

  const col1 = '稅後淨利(M NTD)';
  const col2 = '稅後淨利率(%)';

  const chartData = useMemo(() => data.map(item => {
    const isForecastValue = isForecast(item['是否為預測']);
    return {
      month: item['月份'],
      [col1]: item[col1],
      [`${col2}`]: !isForecastValue ? item[col2] : null,
      [`${col2}_forecast`]: isForecastValue ? item[col2] : null,
      isForecast: isForecastValue,
      註解: item['註解'] || null,
    };
  }), [data, col1, col2]);

  const labelRenderer = useMemo(() => createBarLabelRenderer(chartData, formatMoney, 10), [chartData]);

  return (
    <ChartContainer title={textConfig.financialCharts.chart9} onClick={onClick}>
      <ResponsiveContainer width="100%" aspect={2.5}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 10, left: 10, bottom: 2 }} barCategoryGap="15%">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick chartData={chartData} angle={isMobile ? -45 : 0} isMobile={isMobile} />}
            height={isMobile ? 60 : 40}
            padding={{ left: 0, right: 0 }}
          />
          <YAxis yAxisId="left" fontSize={fontSize.axis} tick={false} width={0} domain={[0, dataMax => dataMax * 1.2]} />
          <YAxis yAxisId="right" orientation="right" fontSize={fontSize.axis} tick={false} width={0} domain={[0, dataMax => dataMax * 1.2]} />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend customOrder={legendConfig.chart9} />} />
          <Bar yAxisId="left" dataKey={col1} fill="#2980b9" name={col1}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
            ))}
            <LabelList dataKey={col1} content={labelRenderer} />
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey={col2} stroke="#ff7300" strokeWidth={2} name={col2} connectNulls>
            <LabelList dataKey={col2} position="top" fontSize={10} formatter={formatPercent} />
          </Line>
          <Line yAxisId="right" type="monotone" dataKey={`${col2}_forecast`} stroke="#ff7300" strokeWidth={2} strokeDasharray="2 1" name={col2} connectNulls legendType="none">
            <LabelList dataKey={`${col2}_forecast`} position="top" fontSize={10} formatter={formatPercent} />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
