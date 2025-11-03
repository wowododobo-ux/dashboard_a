import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useResponsive } from '../hooks/useResponsive';
import { CustomLegend } from './CustomLegend';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '12px', border: '2px solid #667eea', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,0.25)', maxWidth: '320px', zIndex: 9999 }}>
      <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#fff', backgroundColor: '#667eea', padding: '6px 10px', borderRadius: '4px', fontSize: '14px', marginLeft: '-12px', marginRight: '-12px', marginTop: '-12px', marginBottom: '10px' }}>{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ margin: '4px 0', color: entry.color, fontSize: '13px' }}>
          <span style={{ fontWeight: '600' }}>{entry.name}:</span> {typeof entry.value === 'number' ? Math.round(entry.value).toLocaleString('en-US') : entry.value}
        </p>
      ))}
    </div>
  );
};

const ChartContainer = ({ title, children }) => (<div className="chart-container"><div className="chart-header"><h3 className="chart-title">{title}</h3></div>{children}</div>);
const CustomXAxisTick = ({ x, y, payload, angle = 0 }) => (<g transform={`translate(${x},${y})`}><text x={0} y={0} dy={16} textAnchor={angle !== 0 ? 'end' : 'middle'} fill="rgba(255, 255, 255, 0.7)" fontSize={11} fontWeight="500" transform={angle !== 0 ? `rotate(${angle})` : ''}>{payload.value}</text></g>);

// 圖1: 營運風險等級統計
export function RiskLevelChart({ data }) {
  const { chartMargin, xAxisConfig, fontSize } = useResponsive();
  if (!data || data.length === 0) return <ChartContainer title="營運風險等級統計"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;
  const chartData = useMemo(() => {
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];
      const level = item['風險等級'];
      if (!monthMap[month]) monthMap[month] = { month, 低: 0, 中: 0, 高: 0, 極高: 0 };
      if (level) monthMap[month][level] = (monthMap[month][level] || 0) + 1;
    });
    return Object.values(monthMap);
  }, [data]);
  return (
    <ChartContainer title="營運風險等級統計">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={chartMargin}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick angle={xAxisConfig.angle} />}
            height={xAxisConfig.height}
            interval={xAxisConfig.interval}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <YAxis
            label={{ value: '風險數量', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: fontSize.axis } }}
            tick={{ fontSize: fontSize.axis, fill: 'rgba(255, 255, 255, 0.7)' }}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          <Bar dataKey="低" stackId="a" fill="#82ca9d" />
          <Bar dataKey="中" stackId="a" fill="#ffc658" />
          <Bar dataKey="高" stackId="a" fill="#ff8042" />
          <Bar dataKey="極高" stackId="a" fill="#d03030" />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// 圖2: EHS績效達成率
export function EHSPerformanceChart({ data }) {
  const { chartMargin, xAxisConfig, fontSize } = useResponsive();
  if (!data || data.length === 0) return <ChartContainer title="EHS績效達成率趨勢"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;
  const chartData = useMemo(() => {
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];
      if (!monthMap[month]) monthMap[month] = { month, achievementData: [] };
      monthMap[month].achievementData.push(item['達成率(%)']);
    });
    return Object.values(monthMap).map(monthData => {
      const avgAchievement = monthData.achievementData.reduce((a, b) => a + b, 0) / monthData.achievementData.length;
      return { month: monthData.month, avgAchievement };
    });
  }, [data]);
  return (
    <ChartContainer title="EHS績效達成率趨勢">
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData} margin={chartMargin}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick angle={xAxisConfig.angle} />}
            height={xAxisConfig.height}
            interval={xAxisConfig.interval}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <YAxis
            domain={[85, 105]}
            label={{ value: '達成率 (%)', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: fontSize.axis } }}
            tick={{ fontSize: fontSize.axis, fill: 'rgba(255, 255, 255, 0.7)' }}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          <Line type="monotone" dataKey="avgAchievement" name="平均達成率(%)" stroke="#82ca9d" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// 圖3: 事故數量統計
export function AccidentStatsChart({ data }) {
  const { chartMargin, xAxisConfig, fontSize } = useResponsive();
  if (!data || data.length === 0) return <ChartContainer title="月度事故數量統計"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;
  const chartData = useMemo(() => {
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];
      if (!monthMap[month]) monthMap[month] = { month, accidentCount: 0 };
      monthMap[month].accidentCount += item['事故數'] || 0;
    });
    return Object.values(monthMap);
  }, [data]);
  return (
    <ChartContainer title="月度事故數量統計">
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={chartMargin}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis
            dataKey="month"
            tick={<CustomXAxisTick angle={xAxisConfig.angle} />}
            height={xAxisConfig.height}
            interval={xAxisConfig.interval}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <YAxis
            label={{ value: '事故數量', angle: -90, position: 'insideLeft', style: { fill: 'rgba(255, 255, 255, 0.7)', fontSize: fontSize.axis } }}
            tick={{ fontSize: fontSize.axis, fill: 'rgba(255, 255, 255, 0.7)' }}
            stroke="rgba(255, 255, 255, 0.3)"
          />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          <Bar dataKey="accidentCount" name="事故數量" fill="#ff8042">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.accidentCount === 0 ? '#82ca9d' : entry.accidentCount < 5 ? '#ffc658' : '#ff8042'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
