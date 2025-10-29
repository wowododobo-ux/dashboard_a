import { useState, useEffect } from 'react';
import { loadProductionData, filterByYear } from '../utils/productionParser';
import {
  WaferYieldChart,
  CapacityOEEChart,
  CycleTimeChart,
  DefectDensityChart,
  WIPInventoryChart
} from '../components/ProductionCharts';
import { textConfig } from '../config/textConfig';

function ProductionOperations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2024');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const productionData = await loadProductionData();
      setData(productionData);
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
    return filterByYear(sheetData, selectedYear);
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

      <div className="dashboard-grid">
        <WaferYieldChart data={getFilteredData(data['晶圓良率分析'])} />
        <CapacityOEEChart data={getFilteredData(data['產能利用率與OEE'])} />
        <CycleTimeChart data={getFilteredData(data['生產週期與交貨'])} />
        <DefectDensityChart data={getFilteredData(data['缺陷密度分析'])} />
        <WIPInventoryChart data={getFilteredData(data['WIP庫存水平'])} />
      </div>

      <footer className="dashboard-footer">
        <p>{textConfig.footer.production}</p>
      </footer>
    </div>
  );
}

export default ProductionOperations;
