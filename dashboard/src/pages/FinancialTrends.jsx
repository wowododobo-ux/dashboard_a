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
} from '../components/Charts';

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
        <h2>載入財務資料中...</h2>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="error-container">
        <h2>無法載入資料</h2>
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
        <h1>財務趨勢儀表板</h1>
        <div className="year-selector">
          <label>選擇年度：</label>
          <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="all">全部 (2022-2025)</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
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
        <p>註：2025年10-12月為預測資料 | 金額單位：百萬新台幣 (M NTD) | 資料範圍：2022/01-2025/12</p>
      </footer>
    </div>
  );
}

export default FinancialTrends;
