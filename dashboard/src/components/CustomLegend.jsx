import React from 'react';
import './CustomLegend.css';

export const CustomLegend = ({ payload, customOrder }) => {
  if (!payload || payload.length === 0) return null;

  // 如果有自訂順序，按照指定順序排列
  const orderedPayload = customOrder
    ? customOrder
        .map(name => payload.find(item => item.value === name || item.dataKey === name))
        .filter(Boolean)
    : payload;

  return (
    <div className="custom-legend">
      {orderedPayload.map((entry, index) => (
        <div key={`legend-${index}`} className="legend-item">
          <div
            className="legend-icon"
            style={{
              backgroundColor: entry.color,
              ...(entry.type === 'line' && {
                height: '3px',
                width: '20px',
                borderRadius: '0',
              }),
            }}
          />
          <span className="legend-text">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};
