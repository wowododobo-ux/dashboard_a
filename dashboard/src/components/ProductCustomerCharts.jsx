import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Cell,
  ZAxis
} from 'recharts';
import html2canvas from 'html2canvas';
import { useResponsive } from '../hooks/useResponsive';
import { CustomLegend } from './CustomLegend';

// 自定義Tooltip組件
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const note = payload[0]?.payload?.註解;

  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '12px',
        border: '2px solid #667eea',
        borderRadius: '6px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        maxWidth: '320px',
        zIndex: 9999,
        position: 'relative'
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
        marginTop: '-12px',
        marginBottom: '10px'
      }}>
        {label}
      </p>
      {payload.map((entry, index) => (
        <p
          key={index}
          style={{ margin: '4px 0', color: entry.color, fontSize: '13px' }}
        >
          <span style={{ fontWeight: '600' }}>{entry.name}:</span>{' '}
          {typeof entry.value === 'number'
            ? entry.name.includes('%')
              ? entry.value.toFixed(1)
              : Math.round(entry.value).toLocaleString('en-US')
            : entry.value}
        </p>
      ))}
      {note && (
        <div
          style={{
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: '2px solid #e67e22',
            backgroundColor: 'rgba(255, 249, 240, 0.95)',
            padding: '10px',
            borderRadius: '4px',
            marginLeft: '-10px',
            marginRight: '-10px',
            marginBottom: '-10px',
          }}
        >
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

// 格式化函數
const formatMoney = (value) => {
  if (value === null || value === undefined) return '';
  return Math.round(value).toLocaleString('en-US');
};

const formatPercent = (value) => {
  if (value === null || value === undefined) return '';
  return `${value.toFixed(1)}`;
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

// 標籤渲染器工廠函數
const createBarLabelRenderer = (chartData, formatter, fontSize = 9) => {
  return (props) => {
    const { x, y, width, height, value, index } = props;
    if (value === null || value === undefined || value === 0) return null;

    const fill = '#fff';
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

// 圖1: 產品別銷售分析
export function ProductSalesChart({ data }) {
  const { isMobile } = useResponsive();
  const products = useMemo(
    () => [...new Set(data.map((item) => item['產品']))],
    [data]
  );

  const chartData = useMemo(() => {
    // 按月份分組數據
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];
      const isForecast = month && month.match(/2025-(10|11|12)/);

      if (!monthMap[month]) {
        monthMap[month] = {
          month,
          註解: item['註解'] || null,
          月份: month,
          isForecast: !!isForecast,
          grossMargin: !isForecast ? item['毛利率(%)'] : null,
          grossMargin_forecast: isForecast ? item['毛利率(%)'] : null,
        };
      }
      monthMap[month][item['產品']] = item['營收(M NTD)'];
    });
    return Object.values(monthMap);
  }, [data]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

  const labelRenderers = useMemo(() =>
    products.map(() => createBarLabelRenderer(chartData, formatMoney)),
    [chartData, products]
  );

  return (
    <ChartContainer title="產品別銷售分析">
      <ResponsiveContainer width="100%" aspect={2.5}>
        <ComposedChart
          data={chartData}
          margin={{ top: 8, right: 10, left: 10, bottom: 2 }}
          barCategoryGap="15%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick chartData={chartData} angle={isMobile ? -45 : 0} isMobile={isMobile} />}
            height={isMobile ? 60 : 40}
          />
          <YAxis yAxisId="left" tick={false} width={0} domain={[0, (dataMax) => dataMax * 1.2]} />
          <YAxis yAxisId="right" tick={false} width={0} domain={[0, (dataMax) => dataMax * 1.2]} />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          {products.map((product, index) => (
            <Bar
              key={product}
              yAxisId="left"
              dataKey={product}
              stackId="a"
              name={product}
              fill={colors[index % colors.length]}
            >
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
              ))}
              <LabelList dataKey={product} content={labelRenderers[index]} />
            </Bar>
          ))}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="grossMargin"
            name="毛利率(%)"
            stroke="#ff7300"
            strokeWidth={2}
            connectNulls
          >
            <LabelList dataKey="grossMargin" position="top" fontSize={10} formatter={formatPercent} />
          </Line>
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="grossMargin_forecast"
            stroke="#ff7300"
            strokeWidth={2}
            strokeDasharray="2 1"
            name="毛利率(%)"
            connectNulls
            legendType="none"
          >
            <LabelList dataKey="grossMargin_forecast" position="top" fontSize={10} formatter={formatPercent} />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// 圖2: 客戶別銷售分析
export function CustomerSalesChart({ data }) {
  const { isMobile } = useResponsive();
  const customers = useMemo(
    () => [...new Set(data.map((item) => item['客戶']))],
    [data]
  );

  const chartData = useMemo(() => {
    // 按月份分組數據
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];
      const isForecast = month && month.match(/2025-(10|11|12)/);

      if (!monthMap[month]) {
        monthMap[month] = {
          month,
          註解: item['註解'] || null,
          月份: month,
          isForecast: !!isForecast,
          revenueShare: !isForecast ? item['營收佔比(%)'] : null,
          revenueShare_forecast: isForecast ? item['營收佔比(%)'] : null,
        };
      }
      monthMap[month][item['客戶']] = item['營收(M NTD)'];
    });
    return Object.values(monthMap);
  }, [data]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

  const labelRenderers = useMemo(() =>
    customers.map(() => createBarLabelRenderer(chartData, formatMoney)),
    [chartData, customers]
  );

  return (
    <ChartContainer title="客戶別銷售分析">
      <ResponsiveContainer width="100%" aspect={2.5}>
        <ComposedChart
          data={chartData}
          margin={{ top: 8, right: 10, left: 10, bottom: 2 }}
          barCategoryGap="15%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick chartData={chartData} angle={isMobile ? -45 : 0} isMobile={isMobile} />}
            height={isMobile ? 60 : 40}
          />
          <YAxis yAxisId="left" tick={false} width={0} domain={[0, (dataMax) => dataMax * 1.2]} />
          <YAxis yAxisId="right" tick={false} width={0} domain={[0, (dataMax) => dataMax * 1.2]} />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          {customers.map((customer, index) => (
            <Bar
              key={customer}
              yAxisId="left"
              dataKey={customer}
              stackId="a"
              name={customer}
              fill={colors[index % colors.length]}
            >
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
              ))}
              <LabelList dataKey={customer} content={labelRenderers[index]} />
            </Bar>
          ))}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenueShare"
            name="營收佔比(%)"
            stroke="#ff7300"
            strokeWidth={2}
            connectNulls
          >
            <LabelList dataKey="revenueShare" position="top" fontSize={10} formatter={formatPercent} />
          </Line>
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenueShare_forecast"
            stroke="#ff7300"
            strokeWidth={2}
            strokeDasharray="2 1"
            name="營收佔比(%)"
            connectNulls
            legendType="none"
          >
            <LabelList dataKey="revenueShare_forecast" position="top" fontSize={10} formatter={formatPercent} />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// 圖3: 產品毛利貢獻
export function ProductProfitContributionChart({ data }) {
  const { isMobile } = useResponsive();
  const products = useMemo(
    () => [...new Set(data.map((item) => item['產品']))],
    [data]
  );

  const chartData = useMemo(() => {
    // 按月份分組數據
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];
      const isForecast = month && month.match(/2025-(10|11|12)/);

      if (!monthMap[month]) {
        monthMap[month] = {
          month,
          註解: item['註解'] || null,
          月份: month,
          isForecast: !!isForecast,
        };
      }
      monthMap[month][item['產品']] = item['毛利貢獻(M NTD)'];
    });
    return Object.values(monthMap);
  }, [data]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

  const labelRenderers = useMemo(() =>
    products.map(() => createBarLabelRenderer(chartData, formatMoney)),
    [chartData, products]
  );

  return (
    <ChartContainer title="產品毛利貢獻分析">
      <ResponsiveContainer width="100%" aspect={2.5}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 10, left: 10, bottom: 2 }}
          barCategoryGap="15%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick chartData={chartData} angle={isMobile ? -45 : 0} isMobile={isMobile} />}
            height={isMobile ? 60 : 40}
          />
          <YAxis tick={false} width={0} domain={[0, (dataMax) => dataMax * 1.2]} />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          {products.map((product, index) => (
            <Bar
              key={product}
              dataKey={product}
              stackId="a"
              name={product}
              fill={colors[index % colors.length]}
            >
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
              ))}
              <LabelList dataKey={product} content={labelRenderers[index]} />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// 圖4: 客戶分級分析
export function CustomerABCChart({ data }) {
  const { isMobile } = useResponsive();
  const customers = useMemo(
    () => [...new Set(data.map((item) => item['客戶']))],
    [data]
  );

  const chartData = useMemo(() => {
    // 按月份分組數據
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];
      const isForecast = month && month.match(/2025-(10|11|12)/);

      if (!monthMap[month]) {
        monthMap[month] = {
          month,
          註解: item['註解'] || null,
          月份: month,
          isForecast: !!isForecast,
        };
      }
      monthMap[month][item['客戶']] = item['營收(M NTD)'];
      // 儲存客戶等級資訊
      if (!monthMap[month].grades) {
        monthMap[month].grades = {};
      }
      monthMap[month].grades[item['客戶']] = item['分級'];
    });
    return Object.values(monthMap);
  }, [data]);

  // 按客戶等級分配顏色
  const getColorByCustomer = (customer) => {
    // 從第一個月份的資料中獲取客戶等級
    const firstMonth = data.find(item => item['客戶'] === customer);
    if (!firstMonth) return '#8884d8';

    const grade = firstMonth['分級'];
    if (grade === 'A') return '#ff4d4f';
    if (grade === 'B') return '#ffa940';
    return '#52c41a';
  };

  const labelRenderers = useMemo(() =>
    customers.map(() => createBarLabelRenderer(chartData, formatMoney)),
    [chartData, customers]
  );

  return (
    <ChartContainer title="客戶分級分析 (ABC分類)">
      <ResponsiveContainer width="100%" aspect={2.5}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 10, left: 10, bottom: 2 }}
          barCategoryGap="15%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick chartData={chartData} angle={isMobile ? -45 : 0} isMobile={isMobile} />}
            height={isMobile ? 60 : 40}
          />
          <YAxis tick={false} width={0} domain={[0, (dataMax) => dataMax * 1.2]} />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          {customers.map((customer, index) => (
            <Bar
              key={customer}
              dataKey={customer}
              stackId="a"
              name={customer}
              fill={getColorByCustomer(customer)}
            >
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
              ))}
              <LabelList dataKey={customer} content={labelRenderers[index]} />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// 圖5: 產品組合分析
export function ProductMixChart({ data }) {
  const { isMobile } = useResponsive();
  const chartData = useMemo(() => {
    return data.map((item) => {
      const month = item['月份'];
      const isForecast = month && month.match(/2025-(10|11|12)/);
      return {
        month,
        highMargin: item['高毛利產品營收(M NTD)'],
        midMargin: item['中毛利產品營收(M NTD)'],
        lowMargin: item['低毛利產品營收(M NTD)'],
        avgMargin: !isForecast ? item['平均毛利率(%)'] : null,
        avgMargin_forecast: isForecast ? item['平均毛利率(%)'] : null,
        註解: item['註解'] || null,
        月份: month,
        isForecast: !!isForecast,
      };
    });
  }, [data]);

  const labelRenderer1 = useMemo(() => createBarLabelRenderer(chartData, formatMoney), [chartData]);
  const labelRenderer2 = useMemo(() => createBarLabelRenderer(chartData, formatMoney), [chartData]);
  const labelRenderer3 = useMemo(() => createBarLabelRenderer(chartData, formatMoney), [chartData]);

  return (
    <ChartContainer title="產品組合分析">
      <ResponsiveContainer width="100%" aspect={2.5}>
        <ComposedChart
          data={chartData}
          margin={{ top: 8, right: 10, left: 10, bottom: 2 }}
          barCategoryGap="15%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick chartData={chartData} angle={isMobile ? -45 : 0} isMobile={isMobile} />}
            height={isMobile ? 60 : 40}
          />
          <YAxis yAxisId="left" tick={false} width={0} domain={[0, (dataMax) => dataMax * 1.2]} />
          <YAxis yAxisId="right" tick={false} width={0} domain={[0, (dataMax) => dataMax * 1.2]} />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          <Bar
            yAxisId="left"
            dataKey="highMargin"
            stackId="a"
            name="高毛利產品營收"
            fill="#52c41a"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
            ))}
            <LabelList dataKey="highMargin" content={labelRenderer1} />
          </Bar>
          <Bar
            yAxisId="left"
            dataKey="midMargin"
            stackId="a"
            name="中毛利產品營收"
            fill="#ffa940"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
            ))}
            <LabelList dataKey="midMargin" content={labelRenderer2} />
          </Bar>
          <Bar
            yAxisId="left"
            dataKey="lowMargin"
            stackId="a"
            name="低毛利產品營收"
            fill="#ff4d4f"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
            ))}
            <LabelList dataKey="lowMargin" content={labelRenderer3} />
          </Bar>
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgMargin"
            name="平均毛利率(%)"
            stroke="#1890ff"
            strokeWidth={2}
            connectNulls
          >
            <LabelList dataKey="avgMargin" position="top" fontSize={10} formatter={formatPercent} />
          </Line>
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgMargin_forecast"
            stroke="#1890ff"
            strokeWidth={2}
            strokeDasharray="2 1"
            name="平均毛利率(%)"
            connectNulls
            legendType="none"
          >
            <LabelList dataKey="avgMargin_forecast" position="top" fontSize={10} formatter={formatPercent} />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// 圖6: BCG產品矩陣
export function ProductBCGChart({ data }) {
  const chartData = useMemo(() => {
    // 為每個月份的產品創建數據點
    return data.map((item) => ({
      product: item['產品'],
      month: item['月份'],
      revenue: item['營收(M NTD)'],
      grossMarginRate: item['毛利率(%)'],
      grossProfit: item['毛利額(M NTD)'],
      註解: item['註解'] || null,
    }));
  }, [data]);

  const products = useMemo(
    () => [...new Set(data.map((item) => item['產品']))],
    [data]
  );

  const colors = ['#ff4d4f', '#ffa940', '#52c41a', '#1890ff', '#722ed1'];

  // 為不同產品創建散點數據
  const scatterDataByProduct = useMemo(() => {
    return products.map((product, index) => {
      const productData = chartData.filter((item) => item.product === product);
      return {
        product,
        data: productData,
        color: colors[index % colors.length],
      };
    });
  }, [chartData, products, colors]);

  // 自定義散點標籤
  const renderCustomLabel = (props) => {
    const { cx, cy, payload } = props;
    if (!payload || !payload.product) return null;
    return (
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fill="#666"
        fontSize={10}
        fontWeight="bold"
      >
        {payload.product}
      </text>
    );
  };

  // 自定義Tooltip
  const BCGTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;

    const data = payload[0].payload;

    return (
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '12px',
          border: '2px solid #667eea',
          borderRadius: '6px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          maxWidth: '320px',
          zIndex: 9999,
          position: 'relative'
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
          marginTop: '-12px',
          marginBottom: '10px'
        }}>
          {data.product} ({data.month})
        </p>
        <p style={{ margin: '4px 0', color: '#1890ff', fontSize: '13px' }}>
          <span style={{ fontWeight: '600' }}>營收：</span>
          {Math.round(data.revenue).toLocaleString('en-US')} M NTD
        </p>
        <p style={{ margin: '4px 0', color: '#52c41a', fontSize: '13px' }}>
          <span style={{ fontWeight: '600' }}>毛利率：</span>
          {data.grossMarginRate.toFixed(1)}%
        </p>
        <p style={{ margin: '4px 0', color: '#722ed1', fontSize: '13px' }}>
          <span style={{ fontWeight: '600' }}>毛利額：</span>
          {Math.round(data.grossProfit).toLocaleString('en-US')} M NTD
        </p>
        {data.註解 && (
          <div
            style={{
              marginTop: '10px',
              paddingTop: '10px',
              borderTop: '2px solid #e67e22',
              backgroundColor: 'rgba(255, 249, 240, 0.95)',
              padding: '10px',
              borderRadius: '4px',
              marginLeft: '-10px',
              marginRight: '-10px',
              marginBottom: '-10px',
            }}
          >
            <strong style={{ color: '#d35400', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
              📝 註解
            </strong>
            <p style={{ margin: '0', color: '#333', fontSize: '13px', lineHeight: '1.6', fontWeight: '500' }}>
              {data.註解}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <ChartContainer title="BCG產品矩陣分析">
      <ResponsiveContainer width="100%" aspect={2.5}>
        <ScatterChart margin={{ top: 20, right: 30, left: 50, bottom: 30 }}>
          <CartesianGrid strokeDasharray="2 1" />
          <XAxis
            type="number"
            dataKey="revenue"
            name="營收"
            unit=" M"
            tick={{ fontSize: 11 }}
            label={{
              value: '營收 (M NTD)',
              position: 'insideBottom',
              offset: -10,
              style: { fontSize: 12, fontWeight: 'bold' },
            }}
          />
          <YAxis
            type="number"
            dataKey="grossMarginRate"
            name="毛利率"
            unit="%"
            tick={{ fontSize: 11 }}
            label={{
              value: '毛利率 (%)',
              angle: -90,
              position: 'insideLeft',
              offset: 10,
              style: { fontSize: 12, fontWeight: 'bold' },
            }}
          />
          <ZAxis type="number" dataKey="grossProfit" range={[100, 1000]} name="毛利額" />
          <Tooltip content={<BCGTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          {scatterDataByProduct.map((item, index) => (
            <Scatter
              key={index}
              name={item.product}
              data={item.data}
              fill={item.color}
              shape="circle"
            >
              <LabelList content={renderCustomLabel} />
            </Scatter>
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
