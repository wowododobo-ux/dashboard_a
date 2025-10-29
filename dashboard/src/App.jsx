import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import FinancialTrends from './pages/FinancialTrends';
import ProductCustomerAnalysis from './pages/ProductCustomerAnalysis';
import YearComparison from './pages/YearComparison';
import BookToBill from './pages/BookToBill';

function Navigation() {
  const location = useLocation();

  // 在比對頁面時不顯示導航
  if (location.pathname.startsWith('/compare/')) {
    return null;
  }

  return (
    <nav className="navigation">
      <Link
        to="/"
        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
      >
        財務趨勢儀表板
      </Link>
      <Link
        to="/product-customer"
        className={`nav-link ${location.pathname === '/product-customer' ? 'active' : ''}`}
      >
        產品與客戶分析
      </Link>
      <Link
        to="/book-to-bill"
        className={`nav-link ${location.pathname === '/book-to-bill' ? 'active' : ''}`}
      >
        訂單出貨比
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navigation />
        <Routes>
          <Route path="/" element={<FinancialTrends />} />
          <Route path="/product-customer" element={<ProductCustomerAnalysis />} />
          <Route path="/book-to-bill" element={<BookToBill />} />
          <Route path="/compare/:chartId" element={<YearComparison />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
