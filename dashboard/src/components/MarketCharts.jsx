import { useMemo } from 'react';
import {
  ComposedChart,
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  Cell
} from 'recharts';
import { useResponsive } from '../hooks/useResponsive';
import { CustomLegend } from './CustomLegend';

// 自訂Tooltip組件
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
  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
      </div>
      {children}
    </div>
  );
};

// 格式化函數
const formatPercent = (value) => {
  if (value === null || value === undefined) return '';
  return `${value.toFixed(1)}`;
};

// 自訂X軸標籤
const CustomXAxisTick = ({ x, y, payload, angle = 0 }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor={angle !== 0 ? 'end' : 'middle'}
        fill="rgba(255, 255, 255, 0.7)"
        fontSize={11}
        fontWeight="500"
        transform={angle !== 0 ? `rotate(${angle})` : ''}
      >
        {payload.value}
      </text>
    </g>
  );
};

// 圖1: 市場佔有率（按地區）
export function MarketShareChart({ data }) {
  const { chartMargin, xAxisConfig, fontSize } = useResponsive();

  const regions = useMemo(
    () => {
      if (!data || data.length === 0) return [];
      return [...new Set(data.map((item) => item['地區']))];
    },
    [data]
  );

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];
      const region = item['地區'];
      const isForecast = month && month.match(/2025-(10|11|12)/);

      if (!monthMap[month]) {
        monthMap[month] = {
          month,
          isForecast: !!isForecast,
        };
      }

      // 計算每個地區的平均市佔率
      if (!monthMap[month][region]) {
        monthMap[month][region] = [];
      }
      monthMap[month][region].push(item['市場佔有率(%)']);
    });

    // 計算平均值
    return Object.values(monthMap).map(monthData => {
      const result = { month: monthData.month, isForecast: monthData.isForecast };
      regions.forEach(region => {
        if (monthData[region] && monthData[region].length > 0) {
          const avg = monthData[region].reduce((a, b) => a + b, 0) / monthData[region].length;
          result[region] = avg;
        }
      });
      return result;
    });
  }, [data, regions]);

  if (!data || data.length === 0) {
    return <ChartContainer title="市場佔有率趨勢（按地區）"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;
  }

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  return (
    <ChartContainer title="市場佔有率（按地區）">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          margin={chartMargin}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick angle={xAxisConfig.angle} />}
            height={xAxisConfig.height}
            interval={xAxisConfig.interval}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <YAxis
            label={{ value: '市佔率 (%)', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: fontSize.axis } }}
            tick={{ fontSize: fontSize.axis, fill: 'rgba(255, 255, 255, 0.7)' }}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          {regions.map((region, index) => (
            <Bar
              key={region}
              dataKey={region}
              fill={colors[index % colors.length]}
              stackId="a"
            >
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// 圖2: 客戶訂單金額趨勢
export function CustomerOrdersChart({ data }) {
  const { chartMargin, xAxisConfig, fontSize } = useResponsive();

  const customers = useMemo(
    () => {
      if (!data || data.length === 0) return [];
      return [...new Set(data.map((item) => item['客戶']))];
    },
    [data]
  );

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];
      const customer = item['客戶'];
      const isForecast = month && month.match(/2025-(10|11|12)/);

      if (!monthMap[month]) {
        monthMap[month] = {
          month,
          isForecast: !!isForecast,
        };
      }

      monthMap[month][customer] = item['訂單金額(M USD)'];
    });

    return Object.values(monthMap);
  }, [data, customers]);

  if (!data || data.length === 0) {
    return <ChartContainer title="主要客戶訂單金額趨勢"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;
  }

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

  return (
    <ChartContainer title="客戶訂單金額趨勢">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          margin={chartMargin}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick angle={xAxisConfig.angle} />}
            height={xAxisConfig.height}
            interval={xAxisConfig.interval}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <YAxis
            label={{ value: '訂單金額 (M USD)', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: fontSize.axis } }}
            tick={{ fontSize: fontSize.axis, fill: 'rgba(255, 255, 255, 0.7)' }}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          {customers.map((customer, index) => (
            <Bar
              key={customer}
              dataKey={customer}
              fill={colors[index % colors.length]}
              stackId="a"
            >
              {chartData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fillOpacity={entry.isForecast ? 0.25 : 1} />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// 圖3: 客戶滿意度指標
export function CustomerSatisfactionChart({ data }) {
  const { chartMargin, xAxisConfig, fontSize } = useResponsive();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];

      if (!monthMap[month]) {
        monthMap[month] = {
          month,
          overallData: [],
          qualityData: [],
          deliveryData: [],
          supportData: [],
          priceData: [],
        };
      }

      monthMap[month].overallData.push(item['整體滿意度']);
      monthMap[month].qualityData.push(item['產品質量']);
      monthMap[month].deliveryData.push(item['交貨準時']);
      monthMap[month].supportData.push(item['技術支持']);
      monthMap[month].priceData.push(item['價格競爭力']);
    });

    return Object.values(monthMap).map(monthData => {
      const avgOverall = monthData.overallData.reduce((a, b) => a + b, 0) / monthData.overallData.length;
      const avgQuality = monthData.qualityData.reduce((a, b) => a + b, 0) / monthData.qualityData.length;
      const avgDelivery = monthData.deliveryData.reduce((a, b) => a + b, 0) / monthData.deliveryData.length;
      const avgSupport = monthData.supportData.reduce((a, b) => a + b, 0) / monthData.supportData.length;
      const avgPrice = monthData.priceData.reduce((a, b) => a + b, 0) / monthData.priceData.length;

      return {
        month: monthData.month,
        整體滿意度: avgOverall,
        產品質量: avgQuality,
        交貨準時: avgDelivery,
        技術支持: avgSupport,
        價格競爭力: avgPrice,
      };
    });
  }, [data]);

  if (!data || data.length === 0) {
    return <ChartContainer title="客戶滿意度與NPS"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;
  }

  return (
    <ChartContainer title="客戶滿意度指標">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={chartData}
          margin={chartMargin}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick angle={xAxisConfig.angle} />}
            height={xAxisConfig.height}
            interval={xAxisConfig.interval}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <YAxis
            domain={[70, 100]}
            label={{ value: '滿意度分數', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: fontSize.axis } }}
            tick={{ fontSize: fontSize.axis, fill: 'rgba(255, 255, 255, 0.7)' }}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          <Line
            type="monotone"
            dataKey="整體滿意度"
            stroke="#8884d8"
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="產品質量"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ r: 2.5 }}
          />
          <Line
            type="monotone"
            dataKey="交貨準時"
            stroke="#ffc658"
            strokeWidth={2}
            dot={{ r: 2.5 }}
          />
          <Line
            type="monotone"
            dataKey="技術支持"
            stroke="#ff8042"
            strokeWidth={2}
            dot={{ r: 2.5 }}
          />
          <Line
            type="monotone"
            dataKey="價格競爭力"
            stroke="#a4de6c"
            strokeWidth={2}
            dot={{ r: 2.5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
