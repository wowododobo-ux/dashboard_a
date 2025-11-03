import { useState, useEffect } from 'react';
import { loadRDData } from '../utils/rdParser';
import {
  ProcessDevelopmentChart,
  PatentTrendChart,
  RDInvestmentChart,
  PatentFieldsChart
} from '../components/RDCharts';
import { textConfig } from '../config/textConfig';

function RDTechnology() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const rdData = await loadRDData();
      setData(rdData);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <h2>{textConfig.pageHeaders.loadingRD}</h2>
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

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>{textConfig.pageHeaders.rd}</h1>
      </header>

      <div className="dashboard-grid">
        <ProcessDevelopmentChart data={data['新製程開發進度']} />
        <PatentTrendChart data={data['專利申請與授權']} />
        <PatentFieldsChart data={data['專利申請與授權']} />
        <RDInvestmentChart data={data['研發投入統計']} />
      </div>

      <footer className="dashboard-footer">
        <p>{textConfig.footer.rd}</p>
      </footer>
    </div>
  );
}

export default RDTechnology;
