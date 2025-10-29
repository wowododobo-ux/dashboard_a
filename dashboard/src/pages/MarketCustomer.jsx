import { useState, useEffect } from 'react';
import { loadMarketData, filterByYear } from '../utils/marketParser';
import {
  MarketShareChart,
  CustomerOrdersChart,
  CustomerSatisfactionChart
} from '../components/MarketCharts';
import { textConfig } from '../config/textConfig';

function MarketCustomer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2024');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const marketData = await loadMarketData();
      setData(marketData);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <h2>{textConfig.pageHeaders.loadingMarket}</h2>
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
        <h1>{textConfig.pageHeaders.market}</h1>
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
        <MarketShareChart data={getFilteredData(data['市場佔有率'])} />
        <CustomerOrdersChart data={getFilteredData(data['客戶訂單狀態'])} />
        <CustomerSatisfactionChart data={getFilteredData(data['客戶滿意度'])} />
      </div>

      <footer className="dashboard-footer">
        <p>{textConfig.footer.market}</p>
      </footer>
    </div>
  );
}

export default MarketCustomer;
