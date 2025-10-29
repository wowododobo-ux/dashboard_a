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
        fill="#666"
        fontSize={11}
        transform={angle !== 0 ? `rotate(${angle})` : ''}
      >
        {payload.value}
      </text>
    </g>
  );
};

// 圖1: 關鍵材料庫存天數
export function MaterialInventoryChart({ data }) {
  const { isMobile } = useResponsive();
  if (!data || data.length === 0) return <ChartContainer title="關鍵材料庫存天數"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;

  const materials = useMemo(
    () => [...new Set(data.map((item) => item['材料名稱']))],
    [data]
  );

  const chartData = useMemo(() => {
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];
      const material = item['材料名稱'];

      if (!monthMap[month]) {
        monthMap[month] = { month };
      }

      monthMap[month][material] = item['庫存天數'];
    });

    return Object.values(monthMap);
  }, [data, materials]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d084d8'];

  return (
    <ChartContainer title="關鍵材料庫存天數">
      <ResponsiveContainer width="100%" aspect={2.5}>
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 10, left: 10, bottom: 2 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick angle={isMobile ? -45 : 0} />}
            height={isMobile ? 60 : 40}
          />
          <YAxis
            label={{ value: '庫存天數', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          {materials.map((material, index) => (
            <Line
              key={material}
              type="monotone"
              dataKey={material}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// 圖2: 供應商綜合評分趨勢
export function SupplierPerformanceChart({ data }) {
  const { isMobile } = useResponsive();
  if (!data || data.length === 0) return <ChartContainer title="供應商綜合評分趨勢"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;

  const suppliers = useMemo(
    () => [...new Set(data.map((item) => item['供應商']))],
    [data]
  );

  const chartData = useMemo(() => {
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];
      const supplier = item['供應商'];

      if (!monthMap[month]) {
        monthMap[month] = { month };
      }

      monthMap[month][supplier] = item['綜合評分'];
    });

    return Object.values(monthMap);
  }, [data, suppliers]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

  return (
    <ChartContainer title="供應商綜合評分趨勢">
      <ResponsiveContainer width="100%" aspect={2.5}>
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 10, left: 10, bottom: 2 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick angle={isMobile ? -45 : 0} />}
            height={isMobile ? 60 : 40}
          />
          <YAxis
            domain={[70, 100]}
            label={{ value: '綜合評分', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          {suppliers.map((supplier, index) => (
            <Line
              key={supplier}
              type="monotone"
              dataKey={supplier}
              stroke={colors[index % colors.length]}
              strokeWidth={2.5}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// 圖3: 供應商準時交貨率
export function SupplierDeliveryChart({ data }) {
  const { isMobile } = useResponsive();
  if (!data || data.length === 0) return <ChartContainer title="供應商準時交貨率與質量合格率"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;

  const chartData = useMemo(() => {
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];

      if (!monthMap[month]) {
        monthMap[month] = {
          month,
          onTimeData: [],
          qualityData: [],
        };
      }

      monthMap[month].onTimeData.push(item['準時交貨率(%)']);
      monthMap[month].qualityData.push(item['質量合格率(%)']);
    });

    return Object.values(monthMap).map(monthData => {
      const avgOnTime = monthData.onTimeData.reduce((a, b) => a + b, 0) / monthData.onTimeData.length;
      const avgQuality = monthData.qualityData.reduce((a, b) => a + b, 0) / monthData.qualityData.length;

      return {
        month: monthData.month,
        avgOnTime,
        avgQuality,
      };
    });
  }, [data]);

  return (
    <ChartContainer title="供應商準時交貨率與質量合格率">
      <ResponsiveContainer width="100%" aspect={2.5}>
        <ComposedChart
          data={chartData}
          margin={{ top: 8, right: 10, left: 10, bottom: 2 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick angle={isMobile ? -45 : 0} />}
            height={isMobile ? 60 : 40}
          />
          <YAxis
            domain={[80, 100]}
            label={{ value: '百分比 (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          <Line
            type="monotone"
            dataKey="avgOnTime"
            name="平均準時交貨率(%)"
            stroke="#8884d8"
            strokeWidth={2.5}
            dot={{ r: 4 }}
          >
            <LabelList dataKey="avgOnTime" position="top" fontSize={9} formatter={formatPercent} />
          </Line>
          <Line
            type="monotone"
            dataKey="avgQuality"
            name="平均質量合格率(%)"
            stroke="#82ca9d"
            strokeWidth={2.5}
            dot={{ r: 4 }}
          >
            <LabelList dataKey="avgQuality" position="bottom" fontSize={9} formatter={formatPercent} />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
