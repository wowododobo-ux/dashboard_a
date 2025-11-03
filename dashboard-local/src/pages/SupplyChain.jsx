import { useState, useEffect } from 'react';
import { loadSupplyChainData, filterByYear } from '../utils/supplyChainParser';
import {
  MaterialInventoryChart,
  SupplierPerformanceChart,
  SupplierDeliveryChart
} from '../components/SupplyChainCharts';
import { textConfig } from '../config/textConfig';

function SupplyChain() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2024');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const scData = await loadSupplyChainData();
      setData(scData);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <h2>{textConfig.pageHeaders.loadingSupplyChain}</h2>
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

  const getFilteredData = (sheetData) => {
    return filterByYear(sheetData, selectedYear);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>{textConfig.pageHeaders.supplyChain}</h1>
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
        <MaterialInventoryChart data={getFilteredData(data['材料庫存水平'])} />
        <SupplierPerformanceChart data={getFilteredData(data['供應商績效'])} />
        <SupplierDeliveryChart data={getFilteredData(data['供應商績效'])} />
      </div>

      <footer className="dashboard-footer">
        <p>{textConfig.footer.supplyChain}</p>
      </footer>
    </div>
  );
}

export default SupplyChain;
