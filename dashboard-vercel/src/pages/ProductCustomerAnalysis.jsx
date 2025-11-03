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
import { textConfig } from '../config/textConfig';

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
        <h2>{textConfig.pageHeaders.loadingProductCustomer}</h2>
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
    return filterByYearQuarter(sheetData, selectedYear);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>{textConfig.pageHeaders.productCustomer}</h1>
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
        <ProductSalesChart data={getFilteredData(data['產品別銷售分析'])} />
        <CustomerSalesChart data={getFilteredData(data['客戶別銷售分析'])} />
        <ProductProfitContributionChart data={getFilteredData(data['產品毛利貢獻'])} />
        <CustomerABCChart data={getFilteredData(data['客戶分級分析'])} />
        <ProductMixChart data={getFilteredData(data['產品組合分析'])} />
        <ProductBCGChart data={getFilteredData(data['BCG產品矩陣'])} />
      </div>

      <footer className="dashboard-footer">
        <p>{textConfig.footer.productCustomer}</p>
      </footer>
    </div>
  );
}

export default ProductCustomerAnalysis;
