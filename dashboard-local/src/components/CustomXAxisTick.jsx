import { useResponsive } from '../hooks/useResponsive';

/**
 * 自訂 X 軸標籤組件 - 根據螢幕大小自動調整角度和樣式
 */
export function CustomXAxisTick({ x, y, payload }) {
  const { xAxisConfig, fontSize } = useResponsive();

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor={xAxisConfig.angle !== 0 ? 'end' : 'middle'}
        fill="rgba(255, 255, 255, 0.7)"
        fontSize={fontSize.axis}
        fontWeight="500"
        transform={xAxisConfig.angle !== 0 ? `rotate(${xAxisConfig.angle})` : ''}
      >
        {payload.value}
      </text>
    </g>
  );
}

/**
 * 創建 X 軸配置 - 簡化圖表組件中的 XAxis 設定
 */
export function getXAxisProps(dataKey = 'month') {
  return {
    dataKey,
    tick: <CustomXAxisTick />,
    stroke: 'rgba(255, 255, 255, 0.2)',
    tickLine: { stroke: 'rgba(255, 255, 255, 0.2)' }
  };
}
