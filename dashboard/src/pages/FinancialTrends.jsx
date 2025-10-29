import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadExcelData, filterByYear } from '../utils/dataParser';
import {
  Chart1,
  Chart2,
  Chart3,
  Chart4,
  Chart5,
  Chart6,
  Chart7,
  Chart8,
  Chart9
} from '../components/FinancialCharts';
import { textConfig } from '../config/textConfig';

function FinancialTrends() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2025');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const excelData = await loadExcelData();
      setData(excelData);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <h2>{textConfig.pageHeaders.loadingFinancial}</h2>
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
        <h1>{textConfig.pageHeaders.financialTrends}</h1>
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
        <Chart1 data={getFilteredData(data['圖1_合併營收與毛利率'])} onClick={() => navigate('/compare/chart1')} />
        <Chart2 data={getFilteredData(data['圖2_銷貨退回與折讓'])} onClick={() => navigate('/compare/chart2')} />
        <Chart3 data={getFilteredData(data['圖3_營業毛利'])} onClick={() => navigate('/compare/chart3')} />
        <Chart4 data={getFilteredData(data['圖4_存貨跌價損失'])} onClick={() => navigate('/compare/chart4')} />
        <Chart5 data={getFilteredData(data['圖5_閒置產能損失'])} onClick={() => navigate('/compare/chart5')} />
        <Chart6 data={getFilteredData(data['圖6_營業費用'])} onClick={() => navigate('/compare/chart6')} />
        <Chart7 data={getFilteredData(data['圖7_營業利益'])} onClick={() => navigate('/compare/chart7')} />
        <Chart8 data={getFilteredData(data['圖8_EBITDA'])} onClick={() => navigate('/compare/chart8')} />
        <Chart9 data={getFilteredData(data['圖9_稅後淨利'])} onClick={() => navigate('/compare/chart9')} />
      </div>

      <footer className="dashboard-footer">
        <p>{textConfig.footer.financialTrends}</p>
      </footer>
    </div>
  );
}

export default FinancialTrends;
