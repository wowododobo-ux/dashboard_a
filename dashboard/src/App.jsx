import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, lazy, Suspense } from 'react';
import './App.css';
import { textConfig } from './config/textConfig';
import { useResponsive } from './hooks/useResponsive';

// 使用 React.lazy 進行頁面級別的代碼拆分
// 每個頁面只在訪問時才載入，減少初始載入大小
const HomePage = lazy(() => import('./pages/HomePage'));
const FinancialTrends = lazy(() => import('./pages/FinancialTrends'));
const ProductCustomerAnalysis = lazy(() => import('./pages/ProductCustomerAnalysis'));
const YearComparison = lazy(() => import('./pages/YearComparison'));
const BookToBill = lazy(() => import('./pages/BookToBill'));
const ProductionOperations = lazy(() => import('./pages/ProductionOperations'));
const MarketCustomer = lazy(() => import('./pages/MarketCustomer'));
const SupplyChain = lazy(() => import('./pages/SupplyChain'));
const RDTechnology = lazy(() => import('./pages/RDTechnology'));
const HumanResources = lazy(() => import('./pages/HumanResources'));
const RiskManagement = lazy(() => import('./pages/RiskManagement'));

// 載入中組件
function LoadingFallback() {
  return (
    <div className="loading-container">
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
        <div>{textConfig.common.loading || '載入中...'}</div>
      </div>
    </div>
  );
}

function Navigation() {
  const location = useLocation();
  const { isMobile } = useResponsive();

  // 在比對頁面時不顯示導航
  if (location.pathname.startsWith('/compare/')) {
    return null;
  }

  return (
    <nav className="navigation">
      <div className="nav-logo">
        <Link to="/">
          <img
            src={isMobile ? "/logo-mobile.svg" : "/logo.svg"}
            alt={textConfig.site.logoAlt}
            className="logo-image"
          />
        </Link>
      </div>
      <div className="nav-links">
        <Link
          to="/financial"
          className={`nav-link ${location.pathname === '/financial' ? 'active' : ''}`}
        >
          {textConfig.navigation.financialTrends}
        </Link>
        <Link
          to="/product-customer"
          className={`nav-link ${location.pathname === '/product-customer' ? 'active' : ''}`}
        >
          {textConfig.navigation.productCustomer}
        </Link>
        <Link
          to="/book-to-bill"
          className={`nav-link ${location.pathname === '/book-to-bill' ? 'active' : ''}`}
        >
          {textConfig.navigation.bookToBill}
        </Link>
        <Link
          to="/production"
          className={`nav-link ${location.pathname === '/production' ? 'active' : ''}`}
        >
          {textConfig.navigation.production}
        </Link>
        <Link
          to="/market"
          className={`nav-link ${location.pathname === '/market' ? 'active' : ''}`}
        >
          {textConfig.navigation.market}
        </Link>
        <Link
          to="/supply-chain"
          className={`nav-link ${location.pathname === '/supply-chain' ? 'active' : ''}`}
        >
          {textConfig.navigation.supplyChain}
        </Link>
        <Link
          to="/rd"
          className={`nav-link ${location.pathname === '/rd' ? 'active' : ''}`}
        >
          {textConfig.navigation.rd}
        </Link>
        <Link
          to="/hr"
          className={`nav-link ${location.pathname === '/hr' ? 'active' : ''}`}
        >
          {textConfig.navigation.hr}
        </Link>
        <Link
          to="/risk"
          className={`nav-link ${location.pathname === '/risk' ? 'active' : ''}`}
        >
          {textConfig.navigation.risk}
        </Link>
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="app-wrapper">
      <Navigation />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/financial" element={<FinancialTrends />} />
          <Route path="/product-customer" element={<ProductCustomerAnalysis />} />
          <Route path="/book-to-bill" element={<BookToBill />} />
          <Route path="/production" element={<ProductionOperations />} />
          <Route path="/market" element={<MarketCustomer />} />
          <Route path="/supply-chain" element={<SupplyChain />} />
          <Route path="/rd" element={<RDTechnology />} />
          <Route path="/hr" element={<HumanResources />} />
          <Route path="/risk" element={<RiskManagement />} />
          <Route path="/compare/:chartId" element={<YearComparison />} />
        </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
