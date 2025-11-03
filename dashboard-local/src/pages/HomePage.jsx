import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { textConfig } from '../config/textConfig';
import { loadTopKPIData } from '../utils/topKPIParser';
import TopKPICard from '../components/TopKPICard';
import KPIDrillDownModal from '../components/KPIDrillDownModal';
import './HomePage.css';

function HomePage() {
  // Top KPI state
  const [kpiData, setKpiData] = useState([]);
  const [kpiLoading, setKpiLoading] = useState(true);
  const [kpiError, setKpiError] = useState(null);
  const [selectedKPI, setSelectedKPI] = useState(null);

  // Load Top KPI data from Excel
  useEffect(() => {
    const loadKPIs = async () => {
      try {
        setKpiLoading(true);
        const data = await loadTopKPIData();
        setKpiData(data);
        setKpiError(null);
      } catch (error) {
        console.error('Error loading Top KPI data:', error);
        setKpiError(error.message);
      } finally {
        setKpiLoading(false);
      }
    };

    loadKPIs();
  }, []);
  const modules = [
    {
      id: 'financial',
      path: '/financial',
      config: textConfig.moduleCards.financial,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: 'productCustomer',
      path: '/product-customer',
      config: textConfig.moduleCards.productCustomer,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      id: 'bookToBill',
      path: '/book-to-bill',
      config: textConfig.moduleCards.bookToBill,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      id: 'production',
      path: '/production',
      config: textConfig.moduleCards.production,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
    {
      id: 'market',
      path: '/market',
      config: textConfig.moduleCards.market,
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    },
    {
      id: 'supplyChain',
      path: '/supply-chain',
      config: textConfig.moduleCards.supplyChain,
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    },
    {
      id: 'rd',
      path: '/rd',
      config: textConfig.moduleCards.rd,
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    },
    {
      id: 'hr',
      path: '/hr',
      config: textConfig.moduleCards.hr,
      gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
    },
    {
      id: 'risk',
      path: '/risk',
      config: textConfig.moduleCards.risk,
      gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    },
  ];

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">{textConfig.homePage.title}</h1>
          <p className="hero-subtitle">{textConfig.homePage.subtitle}</p>
          <p className="hero-description">{textConfig.homePage.description}</p>
        </div>
      </div>

      {/* Top KPI Cards Section */}
      <div className="home-container">
        <h2 className="modules-title">{textConfig.topKPICards.sectionTitle}</h2>

        {kpiLoading && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.7)', padding: '40px' }}>
            {textConfig.topKPICards.loading}
          </div>
        )}

        {kpiError && (
          <div style={{ textAlign: 'center', color: '#f44336', padding: '40px' }}>
            {textConfig.topKPICards.error}
          </div>
        )}

        {!kpiLoading && !kpiError && kpiData.length > 0 && (
          <div className="top-kpi-grid">
            {kpiData.map((kpi) => (
              <TopKPICard
                key={kpi.id}
                kpi={kpi}
                onClick={() => setSelectedKPI(kpi)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modules Section */}
      <div className="home-container">
        <h2 className="modules-title">{textConfig.homePage.selectModule}</h2>

        <div className="modules-grid">
          {modules.map((module) => (
            <Link
              key={module.id}
              to={module.path}
              className="module-card"
              style={{ '--gradient': module.gradient }}
            >
              <div className="module-card-gradient"></div>
              <div className="module-card-content">
                <div className="module-icon">{module.config.icon}</div>
                <h3 className="module-title">{module.config.title}</h3>
                <p className="module-description">{module.config.description}</p>
              </div>
              <div className="module-card-hover">
                <span>進入分析 →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* KPI Drill-Down Modal */}
      {selectedKPI && (
        <KPIDrillDownModal
          kpi={selectedKPI}
          onClose={() => setSelectedKPI(null)}
        />
      )}
    </div>
  );
}

export default HomePage;
