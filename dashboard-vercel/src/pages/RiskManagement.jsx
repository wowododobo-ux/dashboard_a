import { useState, useEffect } from 'react';
import { loadRiskData, filterByYear } from '../utils/riskParser';
import {
  RiskLevelChart,
  EHSPerformanceChart,
  AccidentStatsChart
} from '../components/RiskCharts';
import { textConfig } from '../config/textConfig';

function RiskManagement() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2024');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const riskData = await loadRiskData();
      setData(riskData);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <h2>{textConfig.pageHeaders.loadingRisk}</h2>
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
        <h1>{textConfig.pageHeaders.risk}</h1>
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
        <RiskLevelChart data={getFilteredData(data['營運風險指標'])} />
        <EHSPerformanceChart data={getFilteredData(data['EHS績效'])} />
        <AccidentStatsChart data={getFilteredData(data['EHS績效'])} />
      </div>

      <footer className="dashboard-footer">
        <p>{textConfig.footer.risk}</p>
      </footer>
    </div>
  );
}

export default RiskManagement;
