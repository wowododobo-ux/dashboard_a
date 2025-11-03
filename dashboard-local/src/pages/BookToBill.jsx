import { useState, useEffect } from 'react';
import { loadBookToBillData, filterByYear } from '../utils/bookToBillParser';
import { BookToBillHeatmap } from '../components/HeatmapChart';
import { ShipmentWithN6RatiosByDate } from '../components/BookToBillUpdateDateCharts';
import { textConfig } from '../config/textConfig';

function BookToBill() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2025');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const excelData = await loadBookToBillData();
      setData(excelData);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <h2>{textConfig.pageHeaders.loadingBookToBill}</h2>
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
        <h1>{textConfig.pageHeaders.bookToBill}</h1>
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
        <BookToBillHeatmap data={getFilteredData(data['矩陣比值'])} />

        <ShipmentWithN6RatiosByDate matrixDataWithDates={getFilteredData(data['矩陣比值_更新日期'])} />
      </div>

      <footer className="dashboard-footer">
        <p>
          {textConfig.footer.bookToBill}
        </p>
      </footer>
    </div>
  );
}

export default BookToBill;
