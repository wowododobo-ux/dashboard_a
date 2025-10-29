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
  LabelList
} from 'recharts';
import { useResponsive } from '../hooks/useResponsive';
import { CustomLegend } from './CustomLegend';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;
  const note = payload[0]?.payload?.註解;
  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '12px', border: '2px solid #667eea', borderRadius: '6px', boxShadow: '0 4px 16px rgba(0,0,0,0.25)', maxWidth: '320px', zIndex: 9999 }}>
      <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#fff', backgroundColor: '#667eea', padding: '6px 10px', borderRadius: '4px', fontSize: '14px', marginLeft: '-12px', marginRight: '-12px', marginTop: '-12px', marginBottom: '10px' }}>{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ margin: '4px 0', color: entry.color, fontSize: '13px' }}>
          <span style={{ fontWeight: '600' }}>{entry.name}:</span>{' '}
          {typeof entry.value === 'number' ? entry.name.includes('%') ? entry.value.toFixed(1) : Math.round(entry.value).toLocaleString('en-US') : entry.value}
        </p>
      ))}
      {note && <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '2px solid #e67e22', backgroundColor: 'rgba(255, 249, 240, 0.95)', padding: '10px', borderRadius: '4px', marginLeft: '-10px', marginRight: '-10px', marginBottom: '-10px' }}><strong style={{ color: '#d35400', fontSize: '13px', display: 'block', marginBottom: '6px' }}>📝 註解</strong><p style={{ margin: '0', color: '#333', fontSize: '13px', lineHeight: '1.6', fontWeight: '500' }}>{note}</p></div>}
    </div>
  );
};

const ChartContainer = ({ title, children }) => (<div className="chart-container"><div className="chart-header"><h3 className="chart-title">{title}</h3></div>{children}</div>);
const formatPercent = (value) => value === null || value === undefined ? '' : `${value.toFixed(1)}`;
const CustomXAxisTick = ({ x, y, payload, angle = 0 }) => (<g transform={`translate(${x},${y})`}><text x={0} y={0} dy={16} textAnchor={angle !== 0 ? 'end' : 'middle'} fill="#666" fontSize={11} transform={angle !== 0 ? `rotate(${angle})` : ''}>{payload.value}</text></g>);

// 圖1: 員工保留率（按部門）
export function EmployeeRetentionChart({ data }) {
  const { isMobile } = useResponsive();
  if (!data || data.length === 0) return <ChartContainer title="員工保留率（按部門）"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;
  const departments = useMemo(() => [...new Set(data.map((item) => item['部門']))], [data]);
  const chartData = useMemo(() => {
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];
      const dept = item['部門'];
      if (!monthMap[month]) monthMap[month] = { month };
      monthMap[month][dept] = item['保留率(%)'];
    });
    return Object.values(monthMap);
  }, [data, departments]);
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];
  return (
    <ChartContainer title="員工保留率（按部門）">
      <ResponsiveContainer width="100%" aspect={2.5}>
        <LineChart data={chartData} margin={{ top: 8, right: 10, left: 10, bottom: 2 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={<CustomXAxisTick angle={isMobile ? -45 : 0} />} height={isMobile ? 60 : 40} />
          <YAxis domain={[85, 100]} label={{ value: '保留率 (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          {departments.map((dept, index) => (
            <Line key={dept} type="monotone" dataKey={dept} stroke={colors[index % colors.length]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} connectNulls />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// 圖2: 關鍵人才保留率
export function KeyTalentRetentionChart({ data }) {
  const { isMobile } = useResponsive();
  if (!data || data.length === 0) return <ChartContainer title="員工保留率 vs 關鍵人才保留率"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;
  const chartData = useMemo(() => {
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];
      if (!monthMap[month]) monthMap[month] = { month, retentionData: [], keyTalentData: [] };
      monthMap[month].retentionData.push(item['保留率(%)']);
      monthMap[month].keyTalentData.push(item['關鍵人才保留率(%)']);
    });
    return Object.values(monthMap).map(monthData => {
      const avgRetention = monthData.retentionData.reduce((a, b) => a + b, 0) / monthData.retentionData.length;
      const avgKeyTalent = monthData.keyTalentData.reduce((a, b) => a + b, 0) / monthData.keyTalentData.length;
      return { month: monthData.month, avgRetention, avgKeyTalent };
    });
  }, [data]);
  return (
    <ChartContainer title="員工保留率 vs 關鍵人才保留率">
      <ResponsiveContainer width="100%" aspect={2.5}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 10, left: 10, bottom: 2 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={<CustomXAxisTick angle={isMobile ? -45 : 0} />} height={isMobile ? 60 : 40} />
          <YAxis domain={[85, 100]} label={{ value: '保留率 (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          <Line type="monotone" dataKey="avgRetention" name="平均保留率(%)" stroke="#8884d8" strokeWidth={2.5} dot={{ r: 4 }}><LabelList dataKey="avgRetention" position="top" fontSize={9} formatter={formatPercent} /></Line>
          <Line type="monotone" dataKey="avgKeyTalent" name="關鍵人才保留率(%)" stroke="#ff8042" strokeWidth={2.5} dot={{ r: 4 }}><LabelList dataKey="avgKeyTalent" position="bottom" fontSize={9} formatter={formatPercent} /></Line>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

// 圖3: 員工績效分數
export function EmployeePerformanceChart({ data }) {
  const { isMobile } = useResponsive();
  if (!data || data.length === 0) return <ChartContainer title="員工績效分數與培訓完成率"><div style={{ padding: '20px', textAlign: 'center' }}>暫無資料</div></ChartContainer>;
  const chartData = useMemo(() => {
    const monthMap = {};
    data.forEach((item) => {
      const month = item['月份'];
      if (!monthMap[month]) monthMap[month] = { month, perfData: [], trainData: [] };
      monthMap[month].perfData.push(item['平均績效分數']);
      monthMap[month].trainData.push(item['培訓完成率(%)']);
    });
    return Object.values(monthMap).map(monthData => {
      const avgPerf = monthData.perfData.reduce((a, b) => a + b, 0) / monthData.perfData.length;
      const avgTrain = monthData.trainData.reduce((a, b) => a + b, 0) / monthData.trainData.length;
      return { month: monthData.month, avgPerf, avgTrain };
    });
  }, [data]);
  return (
    <ChartContainer title="員工績效分數與培訓完成率">
      <ResponsiveContainer width="100%" aspect={2.5}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 10, left: 10, bottom: 2 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={<CustomXAxisTick angle={isMobile ? -45 : 0} />} height={isMobile ? 60 : 40} />
          <YAxis yAxisId="left" domain={[70, 95]} label={{ value: '績效分數', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" domain={[75, 100]} label={{ value: '培訓完成率(%)', angle: 90, position: 'insideRight' }} />
          <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
          <Legend content={<CustomLegend />} />
          <Bar yAxisId="left" dataKey="avgPerf" name="平均績效分數" fill="#8884d8" />
          <Line yAxisId="right" type="monotone" dataKey="avgTrain" name="培訓完成率(%)" stroke="#82ca9d" strokeWidth={2.5} dot={{ r: 4 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
