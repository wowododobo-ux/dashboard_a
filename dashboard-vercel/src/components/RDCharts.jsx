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
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { useResponsive } from '../hooks/useResponsive';
import { CustomLegend } from './CustomLegend';
import { CustomXAxisTick } from './CustomXAxisTick';

// 自訂Tooltip組件
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

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

// 注意：CustomXAxisTick 已從獨立組件導入，此處的定義已移除

// 圖1: 新製程開發進度
export function ProcessDevelopmentChart({ data }) {
  const { chartMargin, xAxisConfig, fontSize } = useResponsive();
  if (!data || data.length === 0) {
    return <ChartContainer title="新製程技術開發進度"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;
  }

  const projects = useMemo(
    () => [...new Set(data.map((item) => item['專案名稱']))],
    [data]
  );

  const chartData = useMemo(() => {
    const quarterMap = {};
    data.forEach((item) => {
      const quarter = item['季度'];
      const project = item['專案名稱'];

      if (!quarterMap[quarter]) {
        quarterMap[quarter] = { quarter };
      }

      quarterMap[quarter][project] = item['完成進度(%)'];
    });

    return Object.values(quarterMap);
  }, [data, projects]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  return (
    <ChartContainer title="新製程技術開發進度">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={chartData}
          margin={chartMargin}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="quarter"
            tick={<CustomXAxisTick />}
            height={xAxisConfig.height}
            interval={xAxisConfig.interval}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <YAxis
            domain={[0, 100]}
            label={{
              value: '完成進度 (%)',
              angle: -90,
              position: 'insideLeft',
              style: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: fontSize.axis }
            }}
            tick={{ fontSize: fontSize.axis, fill: 'rgba(255, 255, 255, 0.7)' }}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          {projects.map((project, index) => (
            <Line
              key={project}
              type="monotone"
              dataKey={project}
              stroke={colors[index % colors.length]}
              strokeWidth={2.5}
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

// 圖2: 專利申請與授權趨勢
export function PatentTrendChart({ data }) {
  const { chartMargin, xAxisConfig, fontSize } = useResponsive();
  if (!data || data.length === 0) {
    return <ChartContainer title="專利申請與授權數量"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;
  }

  const chartData = useMemo(() => {
    const yearMap = {};
    data.forEach((item) => {
      const year = item['年份'];

      if (!yearMap[year]) {
        yearMap[year] = {
          year,
          申請總數: 0,
          授權總數: 0,
          維持中總數: 0
        };
      }

      yearMap[year].申請總數 += item['申請數量'];
      yearMap[year].授權總數 += item['授權數量'];
      yearMap[year].維持中總數 += item['維持中數量'];
    });

    return Object.values(yearMap);
  }, [data]);

  return (
    <ChartContainer title="專利申請與授權數量">
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart
          data={chartData}
          margin={chartMargin}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="year"
            tick={<CustomXAxisTick />}
            height={xAxisConfig.height}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <YAxis
            yAxisId="left"
            label={{
              value: '年度數量',
              angle: -90,
              position: 'insideLeft',
              style: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: fontSize.axis }
            }}
            tick={{ fontSize: fontSize.axis, fill: 'rgba(255, 255, 255, 0.7)' }}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: '累計維持中',
              angle: 90,
              position: 'insideRight',
              style: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: fontSize.axis }
            }}
            tick={{ fontSize: fontSize.axis, fill: 'rgba(255, 255, 255, 0.7)' }}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          <Bar yAxisId="left" dataKey="申請總數" fill="#8884d8" />
          <Bar yAxisId="left" dataKey="授權總數" fill="#82ca9d" />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="維持中總數"
            stroke="#ff8042"
            strokeWidth={2.5}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// 圖3: 研發投入統計
export function RDInvestmentChart({ data }) {
  const { chartMargin, xAxisConfig, fontSize } = useResponsive();
  if (!data || data.length === 0) {
    return <ChartContainer title="研發投入與人力配置"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;
  }

  return (
    <ChartContainer title="研發投入與人力配置">
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart
          data={data}
          margin={chartMargin}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="年份"
            tick={<CustomXAxisTick />}
            height={xAxisConfig.height}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <YAxis
            yAxisId="left"
            label={{
              value: '研發支出 (M NTD)',
              angle: -90,
              position: 'insideLeft',
              style: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: fontSize.axis }
            }}
            tick={{ fontSize: fontSize.axis, fill: 'rgba(255, 255, 255, 0.7)' }}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: '研發人員數',
              angle: 90,
              position: 'insideRight',
              style: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: fontSize.axis }
            }}
            tick={{ fontSize: fontSize.axis, fill: 'rgba(255, 255, 255, 0.7)' }}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          <Bar yAxisId="left" dataKey="研發支出(M NTD)" fill="#8884d8" />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="研發人員總數"
            stroke="#82ca9d"
            strokeWidth={2.5}
            dot={{ r: 4 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="博士人數"
            stroke="#ffc658"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="碩士人數"
            stroke="#ff8042"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// 圖4: 各技術領域專利分布
export function PatentFieldsChart({ data }) {
  const { chartMargin, xAxisConfig, fontSize } = useResponsive();
  if (!data || data.length === 0) {
    return <ChartContainer title="各技術領域專利分布"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;
  }

  const fields = useMemo(
    () => [...new Set(data.map((item) => item['技術領域']))],
    [data]
  );

  const chartData = useMemo(() => {
    const yearMap = {};
    data.forEach((item) => {
      const year = item['年份'];
      const field = item['技術領域'];

      if (!yearMap[year]) {
        yearMap[year] = { year };
      }

      yearMap[year][field] = item['授權數量'];
    });

    return Object.values(yearMap);
  }, [data, fields]);

  const colors = ['#8884d8', '#82ca9d', '#ffc658'];

  return (
    <ChartContainer title="各技術領域專利授權數量">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={chartData}
          margin={chartMargin}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="year"
            tick={<CustomXAxisTick />}
            height={xAxisConfig.height}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <YAxis
            label={{
              value: '授權數量',
              angle: -90,
              position: 'insideLeft',
              style: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: fontSize.axis }
            }}
            tick={{ fontSize: fontSize.axis, fill: 'rgba(255, 255, 255, 0.7)' }}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          {fields.map((field, index) => (
            <Bar
              key={field}
              dataKey={field}
              fill={colors[index % colors.length]}
              stackId="a"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
