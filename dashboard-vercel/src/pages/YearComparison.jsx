import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { loadExcelData } from '../utils/dataParser';
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

// 圖表配置映射
const chartConfig = {
  'chart1': {
    title: '合併營收淨額與銷貨毛利率',
    sheetName: '圖1_合併營收與毛利率',
    Component: Chart1
  },
  'chart2': {
    title: '銷貨退回與折讓',
    sheetName: '圖2_銷貨退回與折讓',
    Component: Chart2
  },
  'chart3': {
    title: '營業毛利與營業毛利率',
    sheetName: '圖3_營業毛利',
    Component: Chart3
  },
  'chart4': {
    title: '存貨與跌價損失',
    sheetName: '圖4_存貨跌價損失',
    Component: Chart4
  },
  'chart5': {
    title: '閒置產能損失',
    sheetName: '圖5_閒置產能損失',
    Component: Chart5
  },
  'chart6': {
    title: '營業費用與營業費用率',
    sheetName: '圖6_營業費用',
    Component: Chart6
  },
  'chart7': {
    title: '營業利益與營業利益率',
    sheetName: '圖7_營業利益',
    Component: Chart7
  },
  'chart8': {
    title: 'EBITDA與EBITDA率',
    sheetName: '圖8_EBITDA',
    Component: Chart8
  },
  'chart9': {
    title: '稅後淨利與稅後淨利率',
    sheetName: '圖9_稅後淨利',
    Component: Chart9
  }
};

function YearComparison() {
  const { chartId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <h2>載入資料中...</h2>
      </div>
    );
  }

  if (!data || !chartConfig[chartId]) {
    return (
      <div className="error-container">
        <h2>無法載入資料或圖表不存在</h2>
        <Link to="/" className="back-link">返回首頁</Link>
      </div>
    );
  }

  const config = chartConfig[chartId];
  const ChartComponent = config.Component;
  const sheetData = data[config.sheetName];

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%' }}>
          <button
            onClick={() => navigate('/')}
            className="back-button"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ← 返回
          </button>
          <h1>{config.title} - 年度比對</h1>
        </div>
      </header>

      <div className="year-comparison-grid">
        <ChartComponent data={sheetData} />
      </div>

      <footer className="dashboard-footer">
        <p>註：2025年10-12月為預測資料 | 金額單位：百萬新台幣 (M NTD) | 資料範圍：2022/01-2025/12</p>
      </footer>
    </div>
  );
}

export default YearComparison;
