import { useState, useEffect } from 'react';
import { loadProductionData, filterByYear } from '../utils/productionParser';
import { loadScheduleData } from '../utils/scheduleParser';
import {
  loadProductYieldData,
  groupByAreaAndProduct,
  prepareTableData,
  getLatestMonth
} from '../utils/productYieldParser';
import {
  loadMachineHealthData,
  formatForHealthCard
} from '../utils/machineHealthParser';
import {
  WaferYieldChart,
  CapacityOEEChart,
  CycleTimeChart,
  DefectDensityChart,
  WIPInventoryChart,
  ProductionScheduleChart,
  ProductYieldByAreaChart,
  ProductYieldTable
} from '../components/ProductionCharts';
import KPIPanel from '../components/KPIPanel';
import MachineHealthCard from '../components/MachineHealthCard';
import { textConfig } from '../config/textConfig';

function ProductionOperations() {
  const [data, setData] = useState(null);
  const [scheduleData, setScheduleData] = useState(null);
  const [productYieldData, setProductYieldData] = useState(null);
  const [machineHealthData, setMachineHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [groupBy, setGroupBy] = useState('overall'); // overall, productLine, area
  const [selectedValue, setSelectedValue] = useState('all'); // all, 5nm, 7nm, A區, B區...
  const [selectedMonth, setSelectedMonth] = useState(null); // for product yield

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const productionData = await loadProductionData();
      const scheduleDataLoaded = await loadScheduleData();
      const yieldDataLoaded = await loadProductYieldData();
      const machineHealthDataLoaded = await loadMachineHealthData();

      setData(productionData);
      setScheduleData(scheduleDataLoaded);
      setProductYieldData(yieldDataLoaded);
      setMachineHealthData(machineHealthDataLoaded);

      // Set default month to latest month from product yield data
      if (yieldDataLoaded && yieldDataLoaded['產品別良率明細']) {
        const latestMonth = getLatestMonth(yieldDataLoaded['產品別良率明細']);
        setSelectedMonth(latestMonth);
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <h2>{textConfig.pageHeaders.loadingProduction}</h2>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="error-container">
        <h2>{textConfig.common.error}</h2>
      </div>
    );
  }

  // 根據選擇的年度篩選資料
  const getFilteredData = (sheetData) => {
    const filtered = filterByYear(sheetData, selectedYear);
    console.log('篩選數據:', {
      原始長度: sheetData?.length,
      篩選後長度: filtered?.length,
      選擇年度: selectedYear
    });
    return filtered;
  };

  // 獲取排程圖表數據
  const getScheduleChartData = () => {
    if (!scheduleData) {
      console.log('❌ scheduleData 為空');
      return [];
    }

    let rawData;
    if (groupBy === 'overall') {
      rawData = scheduleData['整體數據'] || [];
    } else if (groupBy === 'productLine') {
      rawData = scheduleData['按產品線'] || [];
    } else {
      rawData = scheduleData['按生產區域'] || [];
    }

    console.log('原始數據:', {
      groupBy,
      rawDataLength: rawData.length,
      rawDataSample: rawData.slice(0, 3)
    });

    // 暫時不使用年度篩選，直接返回所有數據
    // const filtered = getFilteredData(rawData);
    const filtered = rawData;

    console.log('排程圖表數據:', {
      groupBy,
      selectedValue,
      selectedYear,
      原始數據長度: rawData?.length,
      篩選後數據長度: filtered?.length,
      數據樣本: filtered?.slice(0, 2)
    });

    return filtered;
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>{textConfig.pageHeaders.production}</h1>
        <div className="year-selector">
          <label>{textConfig.yearSelector.label}</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="all">{textConfig.yearSelector.all}</option>
            <option value="2025">{textConfig.yearSelector.year2025}</option>
            <option value="2024">{textConfig.yearSelector.year2024}</option>
            <option value="2023">{textConfig.yearSelector.year2023}</option>
            <option value="2022">{textConfig.yearSelector.year2022}</option>
          </select>
        </div>
      </header>

      {/* KPI 目標對比卡片 */}
      <KPIPanel module="production" title="生產營運關鍵指標" />

      {/* 機台健康度預測卡片 */}
      {machineHealthData && machineHealthData['機台健康度明細'] && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <MachineHealthCard
            machines={formatForHealthCard(machineHealthData['機台健康度明細'])}
          />
          {/* 預留位置給未來的設備狀態分布卡片 */}
        </div>
      )}

      <div className="dashboard-grid">
        <WaferYieldChart data={getFilteredData(data['晶圓良率分析'])} />
        <CapacityOEEChart data={getFilteredData(data['產能利用率與OEE'])} />
        <CycleTimeChart data={getFilteredData(data['生產週期與交貨'])} />
        <DefectDensityChart data={getFilteredData(data['缺陷密度分析'])} />
        <WIPInventoryChart data={getFilteredData(data['WIP庫存水平'])} />
      </div>

      {/* 生產排程達成率區塊 */}
      {scheduleData && (
        <div style={{ marginTop: '20px' }}>
          <div style={{
            background: '#252944',
            padding: '15px 20px',
            borderRadius: '10px',
            marginBottom: '12px',
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>
              {textConfig.productionCharts.productionSchedule}
            </h3>

            {/* 調試按鈕 */}
            <button
              onClick={() => {
                console.log('=== 調試信息 ===');
                console.log('scheduleData:', scheduleData);
                console.log('整體數據長度:', scheduleData?.['整體數據']?.length);
                console.log('按產品線長度:', scheduleData?.['按產品線']?.length);
                console.log('按生產區域長度:', scheduleData?.['按生產區域']?.length);
                console.log('selectedYear:', selectedYear);
                console.log('groupBy:', groupBy);
                console.log('selectedValue:', selectedValue);
                const chartData = getScheduleChartData();
                console.log('圖表數據:', chartData);
              }}
              style={{
                padding: '6px 12px',
                background: '#667eea',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              🐛 調試
            </button>

            {/* 分組方式選擇器 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                分組方式：
              </label>
              <select
                value={groupBy}
                onChange={(e) => {
                  setGroupBy(e.target.value);
                  setSelectedValue('all');
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '5px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '14px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="overall">整體數據</option>
                <option value="productLine">按產品線</option>
                <option value="area">按生產區域</option>
              </select>
            </div>

            {/* 具體選項選擇器 */}
            {groupBy === 'productLine' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                  產品線：
                </label>
                <select
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '5px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '14px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">全部</option>
                  <option value="5nm">5nm製程</option>
                  <option value="7nm">7nm製程</option>
                  <option value="12nm">12nm製程</option>
                  <option value="16nm">16nm製程</option>
                </select>
              </div>
            )}

            {groupBy === 'area' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                  生產區域：
                </label>
                <select
                  value={selectedValue}
                  onChange={(e) => setSelectedValue(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '5px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '14px',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">全部</option>
                  <option value="A區">A區</option>
                  <option value="B區">B區</option>
                  <option value="C區">C區</option>
                </select>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '12px' }}>
            <ProductionScheduleChart
              data={getScheduleChartData()}
              groupBy={groupBy}
              selectedValue={selectedValue}
            />
          </div>
        </div>
      )}

      {/* 產品別良率分析區塊 */}
      {productYieldData && productYieldData['產品別良率明細'] && (
        <div style={{ marginTop: '20px' }}>
          <div style={{
            background: '#252944',
            padding: '15px 20px',
            borderRadius: '10px',
            marginBottom: '12px',
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <h3 style={{ margin: 0, color: 'white', fontSize: '18px' }}>
              {textConfig.productionCharts.productYieldByArea}
            </h3>

            {/* 月份選擇器 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                選擇月份：
              </label>
              <select
                value={selectedMonth || ''}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '5px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '14px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                {/* 生成月份選項 */}
                {Array.from(new Set(productYieldData['產品別良率明細'].map(d => d.月份)))
                  .sort()
                  .reverse()
                  .slice(0, 12)
                  .map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
              </select>
            </div>
          </div>

          {/* 分組長條圖 */}
          <div style={{ marginBottom: '12px' }}>
            <ProductYieldByAreaChart
              data={groupByAreaAndProduct(productYieldData['產品別良率明細'], selectedMonth)}
              month={selectedMonth}
            />
          </div>

          {/* 數據表格 */}
          <div style={{ marginBottom: '12px' }}>
            <ProductYieldTable
              data={prepareTableData(productYieldData['產品別良率明細'], selectedMonth)}
              month={selectedMonth}
            />
          </div>
        </div>
      )}

      <footer className="dashboard-footer">
        <p>{textConfig.footer.production}</p>
      </footer>
    </div>
  );
}

export default ProductionOperations;
