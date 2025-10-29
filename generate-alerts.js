// 生成實時警報數據
// 警報數據會根據各模組的指標生成異常提醒

import fs from 'fs';

// 警報嚴重程度
const SEVERITY = {
  CRITICAL: 'critical',    // 緊急：紅色
  WARNING: 'warning',      // 警告：橙色
  INFO: 'info'            // 資訊：黃色
};

// 警報狀態
const STATUS = {
  PENDING: 'pending',           // 待處理
  ACKNOWLEDGED: 'acknowledged', // 已確認
  RESOLVED: 'resolved'          // 已解決
};

// 模組類型
const MODULES = {
  FINANCIAL: 'financial',
  PRODUCTION: 'production',
  MARKET: 'market',
  SUPPLY_CHAIN: 'supplyChain',
  RD: 'rd',
  HR: 'hr',
  RISK: 'risk',
  PRODUCT_CUSTOMER: 'productCustomer',
  BOOK_TO_BILL: 'bookToBill'
};

// 生成警報數據
function generateAlerts() {
  const alerts = [];
  let alertId = 1;

  // 當前時間基準
  const now = new Date('2025-10-30T14:30:00');

  // 財務模組警報
  alerts.push({
    id: `ALT-${String(alertId++).padStart(4, '0')}`,
    timestamp: new Date(now - 15 * 60 * 1000).toISOString(), // 15分鐘前
    module: MODULES.FINANCIAL,
    type: '毛利率下降',
    severity: SEVERITY.WARNING,
    title: '毛利率低於目標',
    description: '2025年10月毛利率為 38.2%，低於目標值 40%',
    value: 38.2,
    threshold: 40,
    unit: '%',
    status: STATUS.PENDING,
    chartId: 'chart1',
    relatedData: {
      period: '2025-10',
      metric: '銷貨毛利率'
    }
  });

  alerts.push({
    id: `ALT-${String(alertId++).padStart(4, '0')}`,
    timestamp: new Date(now - 45 * 60 * 1000).toISOString(), // 45分鐘前
    module: MODULES.FINANCIAL,
    type: '營業費用異常',
    severity: SEVERITY.CRITICAL,
    title: '營業費用率超標',
    description: '2025年10月營業費用率達 22.5%，超過預警線 20%',
    value: 22.5,
    threshold: 20,
    unit: '%',
    status: STATUS.PENDING,
    chartId: 'chart6',
    relatedData: {
      period: '2025-10',
      metric: '營業費用率'
    }
  });

  alerts.push({
    id: `ALT-${String(alertId++).padStart(4, '0')}`,
    timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(), // 2小時前
    module: MODULES.FINANCIAL,
    type: '存貨跌價',
    severity: SEVERITY.WARNING,
    title: '存貨跌價損失增加',
    description: '存貨跌價損失增加 15%，需注意庫存管理',
    value: 15,
    threshold: 10,
    unit: '%',
    status: STATUS.ACKNOWLEDGED,
    chartId: 'chart4',
    acknowledgedBy: '財務部-張經理',
    acknowledgedAt: new Date(now - 1.5 * 60 * 60 * 1000).toISOString(),
    relatedData: {
      period: '2025-10',
      metric: '跌價損失率'
    }
  });

  // 生產模組警報
  alerts.push({
    id: `ALT-${String(alertId++).padStart(4, '0')}`,
    timestamp: new Date(now - 30 * 60 * 1000).toISOString(), // 30分鐘前
    module: MODULES.PRODUCTION,
    type: '良率下降',
    severity: SEVERITY.CRITICAL,
    title: '3nm製程良率低於目標',
    description: '3nm製程良率降至 82%，低於目標 85%',
    value: 82,
    threshold: 85,
    unit: '%',
    status: STATUS.PENDING,
    chartId: 'production-chart1',
    relatedData: {
      period: '2025-10',
      process: '3nm',
      metric: '良率'
    }
  });

  alerts.push({
    id: `ALT-${String(alertId++).padStart(4, '0')}`,
    timestamp: new Date(now - 1 * 60 * 60 * 1000).toISOString(), // 1小時前
    module: MODULES.PRODUCTION,
    type: 'OEE異常',
    severity: SEVERITY.WARNING,
    title: '整體設備效率下降',
    description: 'OEE從 88% 降至 82%，需檢查設備狀況',
    value: 82,
    threshold: 85,
    unit: '%',
    status: STATUS.PENDING,
    chartId: 'production-chart2',
    relatedData: {
      period: '2025-10',
      metric: 'OEE'
    }
  });

  alerts.push({
    id: `ALT-${String(alertId++).padStart(4, '0')}`,
    timestamp: new Date(now - 4 * 60 * 60 * 1000).toISOString(), // 4小時前
    module: MODULES.PRODUCTION,
    type: '交貨延遲',
    severity: SEVERITY.WARNING,
    title: '準時交貨率下降',
    description: '準時交貨率降至 91%，低於目標 95%',
    value: 91,
    threshold: 95,
    unit: '%',
    status: STATUS.ACKNOWLEDGED,
    chartId: 'production-chart3',
    acknowledgedBy: '生產部-李主管',
    acknowledgedAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
    relatedData: {
      period: '2025-10',
      metric: '準時交貨率'
    }
  });

  // 市場模組警報
  alerts.push({
    id: `ALT-${String(alertId++).padStart(4, '0')}`,
    timestamp: new Date(now - 20 * 60 * 1000).toISOString(), // 20分鐘前
    module: MODULES.MARKET,
    type: '市佔率下降',
    severity: SEVERITY.WARNING,
    title: '北美市場佔有率下滑',
    description: '北美市場佔有率從 28% 降至 25%',
    value: 25,
    threshold: 27,
    unit: '%',
    status: STATUS.PENDING,
    chartId: 'market-chart1',
    relatedData: {
      period: '2025-10',
      region: '北美',
      metric: '市佔率'
    }
  });

  alerts.push({
    id: `ALT-${String(alertId++).padStart(4, '0')}`,
    timestamp: new Date(now - 3 * 60 * 60 * 1000).toISOString(), // 3小時前
    module: MODULES.MARKET,
    type: '客戶滿意度',
    severity: SEVERITY.INFO,
    title: '客戶滿意度略降',
    description: '整體客戶滿意度從 4.5 降至 4.3',
    value: 4.3,
    threshold: 4.4,
    unit: '分',
    status: STATUS.ACKNOWLEDGED,
    chartId: 'market-chart3',
    acknowledgedBy: '市場部-王經理',
    acknowledgedAt: new Date(now - 2.5 * 60 * 60 * 1000).toISOString(),
    relatedData: {
      period: '2025-10',
      metric: '客戶滿意度'
    }
  });

  // 供應鏈模組警報
  alerts.push({
    id: `ALT-${String(alertId++).padStart(4, '0')}`,
    timestamp: new Date(now - 10 * 60 * 1000).toISOString(), // 10分鐘前
    module: MODULES.SUPPLY_CHAIN,
    type: '庫存不足',
    severity: SEVERITY.CRITICAL,
    title: '矽晶圓庫存低於安全水位',
    description: '矽晶圓庫存僅剩 15 天，低於安全庫存 30 天',
    value: 15,
    threshold: 30,
    unit: '天',
    status: STATUS.PENDING,
    chartId: 'supply-chart1',
    relatedData: {
      period: '2025-10',
      material: '矽晶圓',
      metric: '庫存天數'
    }
  });

  alerts.push({
    id: `ALT-${String(alertId++).padStart(4, '0')}`,
    timestamp: new Date(now - 5 * 60 * 60 * 1000).toISOString(), // 5小時前
    module: MODULES.SUPPLY_CHAIN,
    type: '供應商延遲',
    severity: SEVERITY.WARNING,
    title: '供應商 B 交貨準時率下降',
    description: '供應商 B 準時交貨率降至 88%，低於標準 95%',
    value: 88,
    threshold: 95,
    unit: '%',
    status: STATUS.RESOLVED,
    chartId: 'supply-chart2',
    acknowledgedBy: '採購部-陳主管',
    acknowledgedAt: new Date(now - 4.5 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(now - 1 * 60 * 60 * 1000).toISOString(),
    relatedData: {
      period: '2025-10',
      supplier: '供應商B',
      metric: '準時交貨率'
    }
  });

  // 研發模組警報
  alerts.push({
    id: `ALT-${String(alertId++).padStart(4, '0')}`,
    timestamp: new Date(now - 6 * 60 * 60 * 1000).toISOString(), // 6小時前
    module: MODULES.RD,
    type: '研發進度延遲',
    severity: SEVERITY.WARNING,
    title: '2nm研究進度落後',
    description: '2nm研究進度為 65%，落後計劃進度 75%',
    value: 65,
    threshold: 75,
    unit: '%',
    status: STATUS.ACKNOWLEDGED,
    chartId: 'rd-chart1',
    acknowledgedBy: '研發部-劉博士',
    acknowledgedAt: new Date(now - 5 * 60 * 60 * 1000).toISOString(),
    relatedData: {
      period: '2025-10',
      project: '2nm研究',
      metric: '進度'
    }
  });

  // 人力資源模組警報
  alerts.push({
    id: `ALT-${String(alertId++).padStart(4, '0')}`,
    timestamp: new Date(now - 8 * 60 * 60 * 1000).toISOString(), // 8小時前
    module: MODULES.HR,
    type: '離職率上升',
    severity: SEVERITY.WARNING,
    title: '研發工程師保留率下降',
    description: '研發工程師保留率降至 92%，低於目標 95%',
    value: 92,
    threshold: 95,
    unit: '%',
    status: STATUS.ACKNOWLEDGED,
    chartId: 'hr-chart1',
    acknowledgedBy: '人資部-黃經理',
    acknowledgedAt: new Date(now - 7 * 60 * 60 * 1000).toISOString(),
    relatedData: {
      period: '2025-10',
      position: '研發工程師',
      metric: '保留率'
    }
  });

  // 風險管理模組警報
  alerts.push({
    id: `ALT-${String(alertId++).padStart(4, '0')}`,
    timestamp: new Date(now - 25 * 60 * 1000).toISOString(), // 25分鐘前
    module: MODULES.RISK,
    type: 'EHS異常',
    severity: SEVERITY.CRITICAL,
    title: '安全事件數超標',
    description: '本月安全事件數達 5 件，超過目標 2 件',
    value: 5,
    threshold: 2,
    unit: '件',
    status: STATUS.PENDING,
    chartId: 'risk-chart2',
    relatedData: {
      period: '2025-10',
      metric: '安全事件數'
    }
  });

  // 產品客戶模組警報
  alerts.push({
    id: `ALT-${String(alertId++).padStart(4, '0')}`,
    timestamp: new Date(now - 1.5 * 60 * 60 * 1000).toISOString(), // 1.5小時前
    module: MODULES.PRODUCT_CUSTOMER,
    type: '客戶流失',
    severity: SEVERITY.WARNING,
    title: 'A級客戶營收下降',
    description: 'A級客戶總營收環比下降 8%',
    value: -8,
    threshold: -5,
    unit: '%',
    status: STATUS.PENDING,
    chartId: 'product-customer-chart4',
    relatedData: {
      period: '2025-10',
      customerGrade: 'A',
      metric: '營收變化'
    }
  });

  // Book to Bill 警報
  alerts.push({
    id: `ALT-${String(alertId++).padStart(4, '0')}`,
    timestamp: new Date(now - 40 * 60 * 1000).toISOString(), // 40分鐘前
    module: MODULES.BOOK_TO_BILL,
    type: '訂單下滑',
    severity: SEVERITY.WARNING,
    title: 'Book to Bill 比值偏低',
    description: '未來3個月 Book to Bill 比值為 0.92，低於健康值 1.0',
    value: 0.92,
    threshold: 1.0,
    unit: '',
    status: STATUS.PENDING,
    chartId: 'book-to-bill-heatmap',
    relatedData: {
      period: '2025-10',
      offset: '+3月',
      metric: 'Book to Bill'
    }
  });

  return alerts;
}

// 將警報數據寫入 JSON 文件
function saveAlertsToJSON() {
  const alerts = generateAlerts();

  // 保存完整數據
  fs.writeFileSync(
    'dashboard/public/alerts.json',
    JSON.stringify({ alerts, lastUpdate: new Date().toISOString() }, null, 2),
    'utf-8'
  );

  console.log(`✅ 已生成 ${alerts.length} 條警報數據`);
  console.log('📁 文件位置: dashboard/public/alerts.json');

  // 統計各嚴重程度的數量
  const stats = {
    critical: alerts.filter(a => a.severity === SEVERITY.CRITICAL).length,
    warning: alerts.filter(a => a.severity === SEVERITY.WARNING).length,
    info: alerts.filter(a => a.severity === SEVERITY.INFO).length,
    pending: alerts.filter(a => a.status === STATUS.PENDING).length,
    acknowledged: alerts.filter(a => a.status === STATUS.ACKNOWLEDGED).length,
    resolved: alerts.filter(a => a.status === STATUS.RESOLVED).length
  };

  console.log('\n📊 警報統計:');
  console.log(`   緊急 (Critical): ${stats.critical}`);
  console.log(`   警告 (Warning): ${stats.warning}`);
  console.log(`   資訊 (Info): ${stats.info}`);
  console.log(`\n📋 狀態統計:`);
  console.log(`   待處理: ${stats.pending}`);
  console.log(`   已確認: ${stats.acknowledged}`);
  console.log(`   已解決: ${stats.resolved}`);
}

// 執行生成
saveAlertsToJSON();
