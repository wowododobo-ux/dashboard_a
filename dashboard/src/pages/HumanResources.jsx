import { useState, useEffect } from 'react';
import { loadHRData, filterByYear } from '../utils/hrParser';
import {
  EmployeeRetentionChart,
  KeyTalentRetentionChart,
  EmployeePerformanceChart
} from '../components/HRCharts';
import { textConfig } from '../config/textConfig';

function HumanResources() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2024');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const hrData = await loadHRData();
      setData(hrData);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <h2>{textConfig.pageHeaders.loadingHR}</h2>
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
        <h1>{textConfig.pageHeaders.hr}</h1>
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
        <EmployeeRetentionChart data={getFilteredData(data['員工保留率'])} />
        <KeyTalentRetentionChart data={getFilteredData(data['員工保留率'])} />
        <EmployeePerformanceChart data={getFilteredData(data['員工績效指標'])} />
      </div>

      <footer className="dashboard-footer">
        <p>{textConfig.footer.hr}</p>
      </footer>
    </div>
  );
}

export default HumanResources;
