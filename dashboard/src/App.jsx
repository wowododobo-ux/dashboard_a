import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import HomePage from './pages/HomePage';
import FinancialTrends from './pages/FinancialTrends';
import ProductCustomerAnalysis from './pages/ProductCustomerAnalysis';
import YearComparison from './pages/YearComparison';
import BookToBill from './pages/BookToBill';
import ProductionOperations from './pages/ProductionOperations';
import MarketCustomer from './pages/MarketCustomer';
import SupplyChain from './pages/SupplyChain';
import RDTechnology from './pages/RDTechnology';
import HumanResources from './pages/HumanResources';
import RiskManagement from './pages/RiskManagement';
import { textConfig } from './config/textConfig';
import { useResponsive } from './hooks/useResponsive';

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
