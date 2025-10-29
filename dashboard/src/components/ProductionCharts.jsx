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

// 自定义Tooltip组件
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

// 图表容器组件（复用原有组件）
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

// 格式化函数
const formatPercent = (value) => {
  if (value === null || value === undefined) return '';
  return `${value.toFixed(1)}`;
};

// 自定义X轴标签
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

// 圖1: 晶圓良率分析（按技術節點）
export function WaferYieldChart({ data }) {
  const { isMobile } = useResponsive();
  if (!data || data.length === 0) return <ChartContainer title="晶圓良率分析（按技術節點）"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;

  const techNodes = useMemo(
    () => [...new Set(data.map((item) => item['技術節點']))],
    [data]
  );

  const chartData = useMemo(() => {
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];
      const node = item['技術節點'];
      const isForecast = month && month.match(/2025-(10|11|12)/);

      if (!monthMap[month]) {
        monthMap[month] = {
          month,
          isForecast: !!isForecast,
        };
      }

      // 計算每個技術節點的平均良率
      if (!monthMap[month][node]) {
        monthMap[month][node] = [];
      }
      monthMap[month][node].push(item['良率(%)']);
    });

    // 計算平均值
    return Object.values(monthMap).map(monthData => {
      const result = { month: monthData.month, isForecast: monthData.isForecast };
      techNodes.forEach(node => {
        if (monthData[node] && monthData[node].length > 0) {
          const avg = monthData[node].reduce((a, b) => a + b, 0) / monthData[node].length;
          result[node] = avg;
        }
      });
      return result;
    });
  }, [data, techNodes]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

  return (
    <ChartContainer title="晶圓良率分析（按技術節點）">
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
            domain={[90, 100]}
            label={{ value: '良率 (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          {techNodes.map((node, index) => (
            <Line
              key={node}
              type="monotone"
              dataKey={node}
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

// 圖2: 產能利用率與OEE
export function CapacityOEEChart({ data }) {
  const { isMobile } = useResponsive();
  if (!data || data.length === 0) return <ChartContainer title="產能利用率與設備效率(OEE)"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;

  const chartData = useMemo(() => {
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];

      if (!monthMap[month]) {
        monthMap[month] = {
          month,
          utilizationData: [],
          oeeData: [],
        };
      }

      monthMap[month].utilizationData.push(item['產能利用率(%)']);
      monthMap[month].oeeData.push(item['OEE(%)']);
    });

    return Object.values(monthMap).map(monthData => {
      const avgUtilization = monthData.utilizationData.reduce((a, b) => a + b, 0) / monthData.utilizationData.length;
      const avgOEE = monthData.oeeData.reduce((a, b) => a + b, 0) / monthData.oeeData.length;

      return {
        month: monthData.month,
        avgUtilization,
        avgOEE,
      };
    });
  }, [data]);

  return (
    <ChartContainer title="產能利用率與設備效率(OEE)">
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
            domain={[75, 100]}
            label={{ value: '百分比 (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          <Line
            type="monotone"
            dataKey="avgUtilization"
            name="產能利用率(%)"
            stroke="#8884d8"
            strokeWidth={2.5}
            dot={{ r: 4 }}
          >
            <LabelList dataKey="avgUtilization" position="top" fontSize={9} formatter={formatPercent} />
          </Line>
          <Line
            type="monotone"
            dataKey="avgOEE"
            name="OEE(%)"
            stroke="#82ca9d"
            strokeWidth={2.5}
            dot={{ r: 4 }}
          >
            <LabelList dataKey="avgOEE" position="bottom" fontSize={9} formatter={formatPercent} />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// 圖3: 生產週期時間達成率
export function CycleTimeChart({ data }) {
  const { isMobile } = useResponsive();
  if (!data || data.length === 0) return <ChartContainer title="生產週期時間達成率"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;

  const productTypes = useMemo(
    () => [...new Set(data.map((item) => item['產品類型']))],
    [data]
  );

  const chartData = useMemo(() => {
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];
      const product = item['產品類型'];

      if (!monthMap[month]) {
        monthMap[month] = { month };
      }

      if (!monthMap[month][product]) {
        monthMap[month][product] = [];
      }
      monthMap[month][product].push(item['達成率(%)']);
    });

    return Object.values(monthMap).map(monthData => {
      const result = { month: monthData.month };
      productTypes.forEach(product => {
        if (monthData[product] && monthData[product].length > 0) {
          const avg = monthData[product].reduce((a, b) => a + b, 0) / monthData[product].length;
          result[product] = avg;
        }
      });
      return result;
    });
  }, [data, productTypes]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

  return (
    <ChartContainer title="生產週期時間達成率">
      <ResponsiveContainer width="100%" aspect={2.5}>
        <BarChart
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
            domain={[90, 105]}
            label={{ value: '达成率 (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          {productTypes.map((product, index) => (
            <Bar
              key={product}
              dataKey={product}
              fill={colors[index % colors.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// 圖4: 缺陷密度趨勢（按技術節點）
export function DefectDensityChart({ data }) {
  const { isMobile } = useResponsive();
  if (!data || data.length === 0) return <ChartContainer title="缺陷密度趨勢（按技術節點）"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;

  const techNodes = useMemo(
    () => [...new Set(data.map((item) => item['技術節點']))],
    [data]
  );

  const chartData = useMemo(() => {
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];
      const node = item['技術節點'];

      if (!monthMap[month]) {
        monthMap[month] = { month };
      }

      monthMap[month][node] = item['缺陷密度(個/cm²)'];
    });

    return Object.values(monthMap);
  }, [data, techNodes]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

  return (
    <ChartContainer title="缺陷密度趨勢（按技術節點）">
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
            label={{ value: '缺陷密度 (个/cm²)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          {techNodes.map((node, index) => (
            <Line
              key={node}
              type="monotone"
              dataKey={node}
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

// 圖5: WIP庫存天數
export function WIPInventoryChart({ data }) {
  const { isMobile } = useResponsive();
  if (!data || data.length === 0) return <ChartContainer title="WIP庫存天數"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;

  const productionLines = useMemo(
    () => [...new Set(data.map((item) => item['產線']))],
    [data]
  );

  const chartData = useMemo(() => {
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];
      const line = item['產線'];

      if (!monthMap[month]) {
        monthMap[month] = { month, targetDays: item['目標天數'] };
      }

      monthMap[month][line] = item['WIP天數'];
    });

    return Object.values(monthMap);
  }, [data, productionLines]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  return (
    <ChartContainer title="WIP庫存天數">
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
            label={{ value: 'WIP天数', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          {productionLines.map((line, index) => (
            <Bar
              key={line}
              dataKey={line}
              fill={colors[index % colors.length]}
            />
          ))}
          <Line
            type="monotone"
            dataKey="targetDays"
            name="目標天數"
            stroke="#ff0000"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
