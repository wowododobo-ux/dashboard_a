const fs = require('fs');
const path = require('path');

/**
 * 生成 Top KPI 卡片數據
 * 包含：營收、毛利率、營業利益、現金流、成本佔比、OPEX
 */

// 生成月份列表（最近12個月）
function generateLast12Months() {
  const months = [];
  const currentDate = new Date(2025, 9, 1); // 2025-10-01

  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - i);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    months.push({
      label: `${year}-${String(month).padStart(2, '0')}`,
      year,
      month
    });
  }

  return months;
}

// 生成趨勢數據（帶季節性和趨勢）
function generateTrendData(baseValue, growthRate, seasonality, variance) {
  const months = generateLast12Months();
  const data = [];

  months.forEach((monthInfo, index) => {
    // 線性增長
    const trendValue = baseValue * (1 + growthRate * index / 12);

    // 季節性波動
    const seasonalFactor = 1 + seasonality * Math.sin((monthInfo.month - 1) * Math.PI / 6);

    // 隨機波動
    const randomFactor = 1 + (Math.random() - 0.5) * variance;

    const value = trendValue * seasonalFactor * randomFactor;

    data.push({
      月份: monthInfo.label,
      年份: monthInfo.year,
      月: monthInfo.month,
      數值: parseFloat(value.toFixed(2))
    });
  });

  return data;
}

// 生成 Top KPIs 數據
function generateTopKPIs() {
  const kpis = [];

  // 1. 營收 (Revenue)
  const revenueTrend = generateTrendData(8500, 0.08, 0.05, 0.04);
  const revenueCurrentValue = revenueTrend[revenueTrend.length - 1].數值;
  const revenueTarget = 9200;
  const revenueDelta = ((revenueCurrentValue - revenueTarget) / revenueTarget * 100);

  kpis.push({
    id: 'revenue',
    名稱: '合併營收',
    名稱英文: 'Revenue',
    單位: 'M NTD',
    當前值: revenueCurrentValue,
    目標值: revenueTarget,
    差異百分比: parseFloat(revenueDelta.toFixed(2)),
    狀態: revenueDelta >= 0 ? 'green' : revenueDelta >= -5 ? 'amber' : 'red',
    趨勢數據: revenueTrend,
    關鍵驅動因素: [
      { 因素: '新客戶訂單增加', 影響: '+8.5%', 說明: 'A客戶新增5nm訂單' },
      { 因素: '產品組合優化', 影響: '+3.2%', 說明: '高毛利產品佔比提升' },
      { 因素: '匯率影響', 影響: '-2.1%', 說明: '美元貶值影響出口營收' }
    ],
    結論: '營收成長穩健，受惠於高階製程需求增加，但需注意匯率風險。'
  });

  // 2. 毛利率 (Gross Margin)
  const marginTrend = generateTrendData(42, 0.05, 0.02, 0.03);
  const marginCurrentValue = marginTrend[marginTrend.length - 1].數值;
  const marginTarget = 45;
  const marginDelta = marginCurrentValue - marginTarget;

  kpis.push({
    id: 'gross_margin',
    名稱: '銷貨毛利率',
    名稱英文: 'Gross Margin',
    單位: '%',
    當前值: marginCurrentValue,
    目標值: marginTarget,
    差異百分比: parseFloat(marginDelta.toFixed(2)),
    狀態: marginDelta >= 0 ? 'green' : marginDelta >= -2 ? 'amber' : 'red',
    趨勢數據: marginTrend,
    關鍵驅動因素: [
      { 因素: '良率提升', 影響: '+2.8%', 說明: '5nm製程良率達95%' },
      { 因素: '原材料成本上漲', 影響: '-3.5%', 說明: '矽晶圓價格上漲15%' },
      { 因素: '產能利用率', 影響: '+1.2%', 說明: 'OEE提升至88%' }
    ],
    結論: '毛利率受原材料成本壓力，但良率改善有助於緩解影響。'
  });

  // 3. 營業利益 (Operating Income)
  const opIncomeTrend = generateTrendData(1850, 0.12, 0.06, 0.05);
  const opIncomeCurrentValue = opIncomeTrend[opIncomeTrend.length - 1].數值;
  const opIncomeTarget = 2100;
  const opIncomeDelta = ((opIncomeCurrentValue - opIncomeTarget) / opIncomeTarget * 100);

  kpis.push({
    id: 'operating_income',
    名稱: '營業利益',
    名稱英文: 'Operating Income',
    單位: 'M NTD',
    當前值: opIncomeCurrentValue,
    目標值: opIncomeTarget,
    差異百分比: parseFloat(opIncomeDelta.toFixed(2)),
    狀態: opIncomeDelta >= 0 ? 'green' : opIncomeDelta >= -8 ? 'amber' : 'red',
    趨勢數據: opIncomeTrend,
    關鍵驅動因素: [
      { 因素: '營收成長', 影響: '+12%', 說明: '高階製程營收增加' },
      { 因素: '研發費用增加', 影響: '-6%', 說明: '3nm製程研發投入' },
      { 因素: '營運效率提升', 影響: '+4%', 說明: '自動化降低人力成本' }
    ],
    結論: '營業利益穩定成長，研發投資為長期競爭力關鍵。'
  });

  // 4. 現金流 (Cash Flow)
  const cashFlowTrend = generateTrendData(2200, 0.06, 0.08, 0.06);
  const cashFlowCurrentValue = cashFlowTrend[cashFlowTrend.length - 1].數值;
  const cashFlowTarget = 2400;
  const cashFlowDelta = ((cashFlowCurrentValue - cashFlowTarget) / cashFlowTarget * 100);

  kpis.push({
    id: 'cash_flow',
    名稱: '營運現金流',
    名稱英文: 'Operating Cash Flow',
    單位: 'M NTD',
    當前值: cashFlowCurrentValue,
    目標值: cashFlowTarget,
    差異百分比: parseFloat(cashFlowDelta.toFixed(2)),
    狀態: cashFlowDelta >= 0 ? 'green' : cashFlowDelta >= -5 ? 'amber' : 'red',
    趨勢數據: cashFlowTrend,
    關鍵驅動因素: [
      { 因素: '應收帳款回收改善', 影響: '+8%', 說明: '平均收款天數降至45天' },
      { 因素: '資本支出增加', 影響: '-12%', 說明: '新產線設備投資' },
      { 因素: '存貨管理優化', 影響: '+5%', 說明: 'JIT降低庫存水平' }
    ],
    結論: '現金流健康，但需平衡成長投資與現金保留。'
  });

  // 5. 成本佔比 (Cost Ratio)
  const costRatioTrend = generateTrendData(58, -0.03, 0.02, 0.02);
  const costRatioCurrentValue = costRatioTrend[costRatioTrend.length - 1].數值;
  const costRatioTarget = 55;
  const costRatioDelta = costRatioCurrentValue - costRatioTarget;

  kpis.push({
    id: 'cost_ratio',
    名稱: '總成本佔比',
    名稱英文: 'Cost Ratio',
    單位: '%',
    當前值: costRatioCurrentValue,
    目標值: costRatioTarget,
    差異百分比: parseFloat(costRatioDelta.toFixed(2)),
    狀態: costRatioDelta <= 0 ? 'green' : costRatioDelta <= 2 ? 'amber' : 'red',
    趨勢數據: costRatioTrend,
    關鍵驅動因素: [
      { 因素: '規模經濟效應', 影響: '-2.5%', 說明: '產量提升攤薄固定成本' },
      { 因素: '能源成本上漲', 影響: '+1.8%', 說明: '電費調漲影響' },
      { 因素: '製程優化', 影響: '-1.2%', 說明: '良率提升降低報廢成本' }
    ],
    結論: '成本控制良好，持續優化製程提升效率。'
  });

  // 6. OPEX (Operating Expenses)
  const opexTrend = generateTrendData(1580, 0.04, 0.03, 0.04);
  const opexCurrentValue = opexTrend[opexTrend.length - 1].數值;
  const opexTarget = 1650;
  const opexDelta = ((opexCurrentValue - opexTarget) / opexTarget * 100);

  kpis.push({
    id: 'opex',
    名稱: '營業費用',
    名稱英文: 'Operating Expenses',
    單位: 'M NTD',
    當前值: opexCurrentValue,
    目標值: opexTarget,
    差異百分比: parseFloat(opexDelta.toFixed(2)),
    狀態: opexDelta <= 0 ? 'green' : opexDelta <= 3 ? 'amber' : 'red',
    趨勢數據: opexTrend,
    關鍵驅動因素: [
      { 因素: '研發費用', 影響: '+52%', 說明: 'R&D佔OPEX比重增加' },
      { 因素: '銷售費用', 影響: '+28%', 說明: '市場開拓與客戶服務' },
      { 因素: '管理費用', 影響: '+20%', 說明: '營運管理與行政支出' }
    ],
    結論: 'OPEX控制得當，研發投入比重符合科技業特性。'
  });

  return kpis;
}

// 主函數：生成並寫入JSON文件
function generateAndSaveTopKPIs() {
  console.log('開始生成 Top KPI 數據...');

  const kpis = generateTopKPIs();
  const outputPath = path.join(__dirname, 'dashboard', 'public', 'top-kpis.json');

  fs.writeFileSync(outputPath, JSON.stringify(kpis, null, 2), 'utf-8');

  console.log(`\n✅ JSON文件已生成：${outputPath}`);
  console.log(`\n生成了 ${kpis.length} 個 Top KPI：`);

  kpis.forEach((kpi, index) => {
    console.log(`\n${index + 1}. ${kpi.名稱} (${kpi.名稱英文})`);
    console.log(`   當前值: ${kpi.當前值} ${kpi.單位}`);
    console.log(`   目標值: ${kpi.目標值} ${kpi.單位}`);
    console.log(`   差異: ${kpi.差異百分比 > 0 ? '+' : ''}${kpi.差異百分比}%`);
    console.log(`   狀態: ${kpi.狀態}`);
    console.log(`   趨勢數據點: ${kpi.趨勢數據.length} 個月`);
  });
}

// 執行
generateAndSaveTopKPIs();
