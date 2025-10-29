import { useState, useEffect } from 'react';
import { loadRDData } from '../utils/rdParser';
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
        <div className="chart-container">
          <h3 className="chart-title">{textConfig.rdCharts.newProcess}</h3>
          <div style={{ padding: '20px' }}>
            <p>{textConfig.common.dataLoaded}，共 {data['新製程開發進度']?.length || 0} {textConfig.common.recordsCount}</p>
            <p>{textConfig.rdCharts.processTracking}</p>
          </div>
        </div>
        <div className="chart-container">
          <h3 className="chart-title">{textConfig.rdCharts.patents}</h3>
          <div style={{ padding: '20px' }}>
            <p>{textConfig.common.dataLoaded}，共 {data['專利申請與授權']?.length || 0} {textConfig.common.recordsCount}</p>
            <p>{textConfig.rdCharts.patentFields}</p>
          </div>
        </div>
      </div>

      <footer className="dashboard-footer">
        <p>{textConfig.footer.rd}</p>
      </footer>
    </div>
  );
}

export default RDTechnology;
