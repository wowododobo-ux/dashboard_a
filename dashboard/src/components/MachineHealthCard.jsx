import { textConfig } from '../config/textConfig';

/**
 * 機台健康度預測卡片
 * 顯示高風險機台和預測性維護建議
 */
function MachineHealthCard({ machines = [] }) {
  // 篩選出高風險機台 (健康度 < 85%)
  const highRiskMachines = machines.filter(m => m.healthScore < 85);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '12px',
      padding: '20px',
      color: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      minHeight: '200px'
    }}>
      {/* 標題 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '15px'
      }}>
        <span style={{ fontSize: '24px' }}>🔧</span>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
          機台健康預測
        </h3>
      </div>

      {/* 高風險機台數量 */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <span style={{
          fontSize: '14px',
          opacity: 0.9
        }}>
          高風險:
        </span>
        <span style={{
          fontSize: '32px',
          fontWeight: 'bold',
          lineHeight: '1'
        }}>
          {highRiskMachines.length}
        </span>
        <span style={{
          fontSize: '18px',
          opacity: 0.9
        }}>
          台
        </span>
      </div>

      {/* 高風險機台列表 */}
      {highRiskMachines.length > 0 ? (
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '15px'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            {highRiskMachines.map((machine, index) => (
              <div key={machine.id} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '14px'
              }}>
                <span style={{ fontWeight: '600' }}>{machine.id}</span>
                <span style={{
                  background: machine.healthScore < 80
                    ? 'rgba(244,67,54,0.3)'
                    : 'rgba(255,152,0,0.3)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '13px'
                }}>
                  {machine.healthScore}%
                </span>
                {index < highRiskMachines.length - 1 && (
                  <span style={{ opacity: 0.5, margin: '0 5px' }}>|</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(76,175,80,0.2)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '15px',
          textAlign: 'center',
          fontSize: '14px'
        }}>
          ✓ 所有機台狀態良好
        </div>
      )}

      {/* 維護建議 */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        fontSize: '13px',
        opacity: 0.9,
        lineHeight: '1.5'
      }}>
        <span>💡</span>
        <div>
          {highRiskMachines.length > 0 ? (
            <>
              <strong>24小時內預測性維護建議</strong>
              <div style={{ marginTop: '5px', fontSize: '12px', opacity: 0.8 }}>
                建議優先檢查：
                {highRiskMachines
                  .sort((a, b) => a.healthScore - b.healthScore)
                  .slice(0, 3)
                  .map(m => m.id)
                  .join(', ')}
              </div>
            </>
          ) : (
            <span>無需緊急維護，請繼續定期保養</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MachineHealthCard;
