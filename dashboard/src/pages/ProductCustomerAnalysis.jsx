import { useState, useEffect } from 'react';
import { loadProductCustomerData, filterByYearQuarter } from '../utils/productCustomerParser';
import {
  ProductSalesChart,
  CustomerSalesChart,
  ProductProfitContributionChart,
  CustomerABCChart,
  ProductMixChart,
  ProductBCGChart
} from '../components/ProductCustomerCharts';

function ProductCustomerAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2024');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const excelData = await loadProductCustomerData();
      setData(excelData);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <h2>載入產品與客戶分析資料中...</h2>
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
    return filterByYearQuarter(sheetData, selectedYear);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>產品與客戶銷售獲利分析</h1>
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
        <ProductSalesChart data={getFilteredData(data['產品別銷售分析'])} />
        <CustomerSalesChart data={getFilteredData(data['客戶別銷售分析'])} />
        <ProductProfitContributionChart data={getFilteredData(data['產品毛利貢獻'])} />
        <CustomerABCChart data={getFilteredData(data['客戶分級分析'])} />
        <ProductMixChart data={getFilteredData(data['產品組合分析'])} />
        <ProductBCGChart data={getFilteredData(data['BCG產品矩陣'])} />
      </div>

      <footer className="dashboard-footer">
        <p>註：2025年10月之後為預測資料 | 金額單位：百萬新台幣 (M NTD) | 資料範圍：2022/01-2025/12</p>
      </footer>
    </div>
  );
}

export default ProductCustomerAnalysis;
