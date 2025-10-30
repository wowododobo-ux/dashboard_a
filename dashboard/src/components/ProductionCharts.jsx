import { useMemo, Fragment } from 'react';
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

// 圖1: 晶圓良率分析（按技術節點）
export function WaferYieldChart({ data }) {
  const { chartMargin, xAxisConfig, fontSize } = useResponsive();
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
            domain={[90, 100]}
            label={{ value: '良率 (%)', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: fontSize.axis } }}
            tick={{ fontSize: fontSize.axis, fill: 'rgba(255, 255, 255, 0.7)' }}
            stroke="rgba(255, 255, 255, 0.3)"
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
              dot={{ r: 2.5 }}
              activeDot={{ r: 4 }}
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
  const { chartMargin, xAxisConfig, fontSize } = useResponsive();
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
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart
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
            domain={[75, 100]}
            label={{ value: '百分比 (%)', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: fontSize.axis } }}
            tick={{ fontSize: fontSize.axis, fill: 'rgba(255, 255, 255, 0.7)' }}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          <Line
            type="monotone"
            dataKey="avgUtilization"
            name="產能利用率(%)"
            stroke="#8884d8"
            strokeWidth={2.5}
            dot={{ r: 3 }}
          >
            <LabelList dataKey="avgUtilization" position="top" fontSize={9} formatter={formatPercent} />
          </Line>
          <Line
            type="monotone"
            dataKey="avgOEE"
            name="OEE(%)"
            stroke="#82ca9d"
            strokeWidth={2.5}
            dot={{ r: 3 }}
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
  const { chartMargin, xAxisConfig, fontSize } = useResponsive();
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
            domain={[90, 105]}
            label={{ value: '达成率 (%)', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: fontSize.axis } }}
            tick={{ fontSize: fontSize.axis, fill: 'rgba(255, 255, 255, 0.7)' }}
            stroke="rgba(255, 255, 255, 0.3)"
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
  const { chartMargin, xAxisConfig, fontSize } = useResponsive();
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
            label={{ value: '缺陷密度 (个/cm²)', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: fontSize.axis } }}
            tick={{ fontSize: fontSize.axis, fill: 'rgba(255, 255, 255, 0.7)' }}
            stroke="rgba(255, 255, 255, 0.3)"
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
              dot={{ r: 2.5 }}
              activeDot={{ r: 4 }}
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
  const { chartMargin, xAxisConfig, fontSize } = useResponsive();
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
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart
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
            label={{ value: 'WIP天数', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: fontSize.axis } }}
            tick={{ fontSize: fontSize.axis, fill: 'rgba(255, 255, 255, 0.7)' }}
            stroke="rgba(255, 255, 255, 0.3)"
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

// 圖6: 生產排程達成率
export function ProductionScheduleChart({ data, groupBy = 'overall', selectedValue = 'all' }) {
  const { isMobile } = useResponsive();

  if (!data || data.length === 0) {
    return (
      <ChartContainer title="生產排程達成率">
        <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
          暫無資料
        </div>
      </ChartContainer>
    );
  }

  // 根據 groupBy 和 selectedValue 篩選數據
  let filteredData = data;
  if (groupBy === 'productLine' && selectedValue !== 'all') {
    filteredData = data.filter(item => item.產品線 === selectedValue);
  } else if (groupBy === 'area' && selectedValue !== 'all') {
    filteredData = data.filter(item => item.生產區域 === selectedValue);
  }

  // 聚合數據（按週）
  const chartData = useMemo(() => {
    const weekMap = new Map();

    filteredData.forEach(item => {
      const week = item.週次;
      if (!weekMap.has(week)) {
        weekMap.set(week, {
          週次: week,
          年份: item.年份,
          週數: item.週數,
          計畫產量: 0,
          實際產量: 0,
          註解: ''
        });
      }

      const weekData = weekMap.get(week);
      weekData.計畫產量 += item.計畫產量 || 0;
      weekData.實際產量 += item.實際產量 || 0;

      // 保留第一個非空註解
      if (item.註解 && !weekData.註解) {
        weekData.註解 = item.註解;
      }
    });

    // 計算達成率並排序
    const result = Array.from(weekMap.values()).map(item => ({
      ...item,
      達成率: item.計畫產量 > 0
        ? parseFloat((item.實際產量 / item.計畫產量 * 100).toFixed(1))
        : 0,
      差異: item.實際產量 - item.計畫產量
    }));

    result.sort((a, b) => {
      if (a.年份 !== b.年份) return a.年份 - b.年份;
      return a.週數 - b.週數;
    });

    return result;
  }, [filteredData]);

  // 取最近52週的數據（一年）
  const displayData = useMemo(() => {
    return chartData.slice(-52);
  }, [chartData]);

  // 計算統計信息
  const stats = useMemo(() => {
    if (displayData.length === 0) return null;

    const achievements = displayData.map(item => item.達成率);
    const avgAchievement = achievements.reduce((sum, val) => sum + val, 0) / achievements.length;
    const totalPlanned = displayData.reduce((sum, item) => sum + item.計畫產量, 0);
    const totalActual = displayData.reduce((sum, item) => sum + item.實際產量, 0);
    const overallAchievement = totalPlanned > 0 ? (totalActual / totalPlanned * 100) : 0;

    return {
      avgAchievement: avgAchievement.toFixed(1),
      overallAchievement: overallAchievement.toFixed(1),
      totalPlanned: totalPlanned.toLocaleString('en-US'),
      totalActual: totalActual.toLocaleString('en-US')
    };
  }, [displayData]);

  return (
    <ChartContainer title="生產排程達成率（最近52週）">
      {stats && (
        <div style={{
          display: 'flex',
          gap: '20px',
          padding: '10px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '6px',
          marginBottom: '15px',
          flexWrap: 'wrap',
          fontSize: '13px'
        }}>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>總計畫產量：</span>
            <strong style={{ color: '#8884d8' }}>{stats.totalPlanned}</strong> 片
          </div>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>總實際產量：</span>
            <strong style={{ color: '#82ca9d' }}>{stats.totalActual}</strong> 片
          </div>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>整體達成率：</span>
            <strong style={{
              color: parseFloat(stats.overallAchievement) >= 100 ? '#4caf50' : '#ff9800'
            }}>
              {stats.overallAchievement}%
            </strong>
          </div>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>平均達成率：</span>
            <strong style={{
              color: parseFloat(stats.avgAchievement) >= 100 ? '#4caf50' : '#ff9800'
            }}>
              {stats.avgAchievement}%
            </strong>
          </div>
        </div>
      )}

      <ResponsiveContainer width="100%" aspect={isMobile ? 1.5 : 2.5}>
        <ComposedChart
          data={displayData}
          margin={{ top: 8, right: 15, left: 5, bottom: 2 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="週次"
            tick={<CustomXAxisTick angle={-45} />}
            height={60}
            interval="preserveStartEnd"
          />
          <YAxis
            yAxisId="left"
            label={{
              value: '產量 (片)',
              angle: -90,
              position: 'insideLeft',
              style: { fill: 'rgba(255,255,255,0.7)', fontSize: 12 }
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: '達成率 (%)',
              angle: 90,
              position: 'insideRight',
              style: { fill: 'rgba(255,255,255,0.7)', fontSize: 12 }
            }}
            domain={[80, 110]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: isMobile ? '11px' : '13px' }}
            content={<CustomLegend />}
          />
          <Bar
            yAxisId="left"
            dataKey="計畫產量"
            fill="#8884d8"
            name="計畫產量 (片)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            yAxisId="left"
            dataKey="實際產量"
            fill="#82ca9d"
            name="實際產量 (片)"
            radius={[4, 4, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="達成率"
            stroke="#ffc658"
            strokeWidth={2}
            name="達成率 (%)"
            dot={{ fill: '#ffc658', r: 3 }}
          />
          {/* 100% 目標線 */}
          <Line
            yAxisId="right"
            type="monotone"
            data={displayData.map(item => ({ ...item, 目標: 100 }))}
            dataKey="目標"
            stroke="#ff4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="目標 100%"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// 圖7: 產品別良率分析 - 分組長條圖
export function ProductYieldByAreaChart({ data, month }) {
  const { isMobile } = useResponsive();

  if (!data || data.length === 0) {
    return (
      <ChartContainer title="產品別良率分析 - 按生產區域">
        <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
          暫無資料
        </div>
      </ChartContainer>
    );
  }

  const productLines = ['5nm', '7nm', '12nm', '16nm'];
  const colors = {
    '5nm': '#8884d8',
    '7nm': '#82ca9d',
    '12nm': '#ffc658',
    '16nm': '#ff8042'
  };

  return (
    <ChartContainer title={`產品別良率分析 - 按生產區域 (${month || '最新月份'})`}>
      <ResponsiveContainer width="100%" aspect={isMobile ? 1.5 : 2.5}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="生產區域"
            tick={{ fontSize: isMobile ? 11 : 13 }}
          />
          <YAxis
            label={{
              value: '良率 (%)',
              angle: -90,
              position: 'insideLeft',
              style: { fill: 'rgba(255,255,255,0.7)', fontSize: 12 }
            }}
            domain={[85, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: isMobile ? '11px' : '13px' }}
            content={<CustomLegend />}
          />
          {productLines.map((line) => (
            <Bar
              key={line}
              dataKey={line}
              fill={colors[line]}
              name={`${line} 良率 (%)`}
              radius={[4, 4, 0, 0]}
            >
              <LabelList
                dataKey={line}
                position="top"
                formatter={(value) => value ? `${value}%` : ''}
                style={{ fill: 'rgba(255,255,255,0.8)', fontSize: 10 }}
              />
            </Bar>
          ))}
          {/* 目標線 */}
          <Line
            type="monotone"
            dataKey={() => 95}
            stroke="#ff4444"
            strokeWidth={2}
            strokeDasharray="5 5"
            name="整體目標 95%"
            dot={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// 產品別良率分析 - 數據表格
export function ProductYieldTable({ data, month }) {
  if (!data || data.length === 0) {
    return (
      <div style={{
        background: '#252944',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{ color: 'white', marginBottom: '15px' }}>
          產品別良率數據表 ({month || '最新月份'})
        </h3>
        <div style={{ padding: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
          暫無資料
        </div>
      </div>
    );
  }

  const areas = ['A區', 'B區', 'C區'];

  return (
    <div style={{
      background: '#252944',
      borderRadius: '12px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      overflowX: 'auto'
    }}>
      <h3 style={{ color: 'white', marginBottom: '15px', fontSize: '18px' }}>
        產品別良率數據表 ({month || '最新月份'})
      </h3>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '13px',
        minWidth: '800px'
      }}>
        <thead>
          <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.2)' }}>
            <th style={{
              padding: '12px 8px',
              textAlign: 'left',
              color: 'rgba(255,255,255,0.9)',
              fontWeight: '600'
            }}>
              產品線
            </th>
            {areas.map(area => (
              <th key={area} colSpan={2} style={{
                padding: '12px 8px',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.9)',
                fontWeight: '600',
                borderLeft: '1px solid rgba(255,255,255,0.1)'
              }}>
                {area}
              </th>
            ))}
            <th colSpan={2} style={{
              padding: '12px 8px',
              textAlign: 'center',
              color: 'rgba(255,255,255,0.9)',
              fontWeight: '600',
              borderLeft: '1px solid rgba(255,255,255,0.1)'
            }}>
              平均
            </th>
          </tr>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <th style={{ padding: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}></th>
            {[...areas, '平均'].map((area, idx) => (
              <Fragment key={area}>
                <th style={{
                  padding: '8px 4px',
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '11px',
                  borderLeft: idx === 0 ? 'none' : (idx % areas.length === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none')
                }}>
                  良率
                </th>
                <th style={{
                  padding: '8px 4px',
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '11px'
                }}>
                  良品/總數
                </th>
              </Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={row.產品線} style={{
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              background: rowIdx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'
            }}>
              <td style={{
                padding: '12px 8px',
                color: 'white',
                fontWeight: '500'
              }}>
                {row.產品線}
              </td>
              {[...areas, '平均'].map((area, idx) => {
                const cellData = row[area] || row['平均'];
                if (!cellData) return (
                  <Fragment key={area}>
                    <td colSpan={2} style={{ padding: '12px 8px', textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                      -
                    </td>
                  </Fragment>
                );

                const isOnTarget = cellData.達標;

                return (
                  <Fragment key={area}>
                    <td style={{
                      padding: '12px 4px',
                      textAlign: 'center',
                      color: isOnTarget ? '#4caf50' : '#ff9800',
                      fontWeight: '600',
                      borderLeft: idx === 0 ? 'none' : (idx % areas.length === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none')
                    }}>
                      {cellData.良率}%
                      {isOnTarget ? ' ✓' : ' ⚠'}
                    </td>
                    <td style={{
                      padding: '12px 4px',
                      textAlign: 'center',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '12px'
                    }}>
                      {cellData.良品數}/{cellData.總產出}
                    </td>
                  </Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{
        marginTop: '15px',
        padding: '10px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '6px',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.6)'
      }}>
        <div style={{ marginBottom: '5px' }}>
          <span style={{ color: '#4caf50' }}>✓ 達標</span>：良率 ≥ 目標良率
          <span style={{ marginLeft: '20px', color: '#ff9800' }}>⚠ 未達標</span>：良率 &lt; 目標良率
        </div>
        <div>
          目標良率：5nm: 95% | 7nm: 96% | 12nm: 97.5% | 16nm: 98%
        </div>
      </div>
    </div>
  );
}
