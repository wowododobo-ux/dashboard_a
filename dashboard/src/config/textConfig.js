// 統一的文字配置文件
// 所有頁面和組件的顯示文字都集中在這裡管理

export const textConfig = {
  // ============================================
  // 共用文字
  // ============================================
  common: {
    loading: '載入中...',
    noData: '無數據',
    error: '無法載入資料',
    copy: '📋 複製',
    copying: '複製中...',
    copied: '✓ 已複製',
    copyChartTooltip: '複製圖表為圖片',
    copySuccess: '已複製',
    copyFailed: '複製失敗，請重試',
    generateImageFailed: '生成圖片失敗，請重試',
    noteLabel: '📝 註解',
  },

  // ============================================
  // 頁面標題
  // ============================================
  pageHeaders: {
    financialTrends: '財務趨勢分析',
    productCustomer: '產品與客戶分析',
    bookToBill: '訂單出貨比分析 (Book to Bill Ratio)',
    yearComparison: '年度比較分析',
  },

  // ============================================
  // 年度選擇器
  // ============================================
  yearSelector: {
    label: '選擇年度：',
    all: '全部 (2022-2025)',
    year2025: '2025',
    year2024: '2024',
    year2023: '2023',
    year2022: '2022',
  },

  // ============================================
  // 財務趨勢圖表標題
  // ============================================
  financialCharts: {
    chart1: '合併營收淨額與銷貨毛利率',
    chart2: '銷貨退回與折讓',
    chart3: '營業毛利與營業毛利率',
    chart4: '存貨與跌價損失',
    chart5: '閒置產能損失',
    chart6: '營業費用與營業費用率',
    chart7: '營業利益與營業利益率',
    chart8: 'EBITDA與EBITDA率',
    chart9: '稅後淨利與稅後淨利率',
  },

  // ============================================
  // 產品客戶分析圖表標題
  // ============================================
  productCustomerCharts: {
    productSales: '產品別銷售分析',
    customerSales: '客戶別銷售分析',
    productProfit: '產品毛利貢獻分析',
    customerABC: '客戶分級分析 (ABC分類)',
    productMix: '產品組合分析',
    productBCG: 'BCG產品矩陣分析',
  },

  // ============================================
  // Book to Bill 圖表標題
  // ============================================
  bookToBillCharts: {
    heatmap: 'Book to Bill 比值熱力圖（未來6個月）',
    shipmentWithRatios: '實際出貨金額 + +{offset}月比值（1日、10日、20日）',
    selectOffset: '選擇要顯示的偏移月份：',
  },

  // ============================================
  // 圖表軸標籤和單位
  // ============================================
  chartLabels: {
    // 財務相關
    revenue: '營收(M NTD)',
    revenueNet: '合併營收淨額(M NTD)',
    grossMargin: '銷貨毛利率(%)',
    grossMarginRate: '毛利率(%)',
    grossProfit: '營業毛利(M NTD)',
    grossProfitRate: '營業毛利率(%)',
    operatingProfit: '營業利益(M NTD)',
    operatingProfitRate: '營業利益率(%)',
    netIncome: '稅後淨利(M NTD)',
    netIncomeRate: '稅後淨利率(%)',
    ebitda: 'EBITDA(M NTD)',
    ebitdaRate: 'EBITDA率(%)',

    // 費用相關
    salesReturn: '銷貨退回與折讓(M NTD)',
    salesReturnRate: '佔合併營收總額比重(%)',
    inventory: '存貨與跌價損失(M NTD)',
    inventoryLossRate: '庫存損失率(%)',
    idleCapacity: '閒置產能損失(M NTD)',
    rdExpense: '研發費用(M NTD)',
    adminExpense: '管理費用(M NTD)',
    salesExpense: '銷售費用(M NTD)',
    operatingExpenseRate: '營業費用率(%)',

    // 產品客戶相關
    revenueShare: '營收佔比(%)',
    contribution: '毛利貢獻(M NTD)',
    contributionRate: '毛利貢獻比(%)',
    cumulativeShare: '累計佔比(%)',
    highMargin: '高毛利產品營收',
    midMargin: '中毛利產品營收',
    lowMargin: '低毛利產品營收',
    avgMargin: '平均毛利率(%)',

    // Book to Bill 相關
    shipmentAmount: '歷史出貨金額(M NTD)',
    targetMonth: '目標月份',
    ratio: '訂單出貨比',
    orderAmount: '訂單金額',

    // 軸標籤
    monthAxis: '月份',
    quarterAxis: '季度',
    revenueAxis: '營收 (M NTD)',
    grossMarginAxis: '毛利率 (%)',
    grossProfitAmountAxis: '毛利額(M NTD)',
  },

  // ============================================
  // 月份偏移標籤
  // ============================================
  monthOffset: {
    plus1: '+1月',
    plus2: '+2月',
    plus3: '+3月',
    plus4: '+4月',
    plus5: '+5月',
    plus6: '+6月',
  },

  // ============================================
  // Tooltip 顯示文字
  // ============================================
  tooltip: {
    baseMonth: '基準月份',
    targetMonth: '目標月份',
    orderAmount: '訂單金額',
    ratio: '訂單出貨比',
    grade: '分級',
    product: '產品',
    customer: '客戶',
    quarter: '季度',
  },

  // ============================================
  // 熱力圖圖例
  // ============================================
  heatmapLegend: {
    title: '圖例：',
    veryStrong: '≥1.3 極強',
    strong: '≥1.15 強勁',
    aboveAverage: '≥1.05 偏強',
    balanced: '0.95-1.05 平衡',
    belowAverage: '≥0.85 偏弱',
    weak: '≥0.7 較弱',
    veryWeak: '<0.7 很弱',
  },

  // ============================================
  // 頁尾註解
  // ============================================
  footer: {
    financialTrends: '註：2025年10月之後為預測資料 | 金額單位：百萬新台幣 (M NTD) | 資料範圍：2022/01-2025/12',
    bookToBill: '註：2025年10月之後為預測資料 | 金額單位：百萬新台幣 (M NTD) | 資料範圍：2022/01-2025/12',
  },

  // ============================================
  // BCG 矩陣相關
  // ============================================
  bcgMatrix: {
    revenueLabel: '營收',
    grossMarginLabel: '毛利率',
    grossProfitLabel: '毛利額',
    unit: {
      million: ' M',
      percent: '%',
      ntd: ' M NTD',
    },
  },

  // ============================================
  // 客戶分級
  // ============================================
  customerGrade: {
    A: 'A級客戶',
    B: 'B級客戶',
    C: 'C級客戶',
  },

  // ============================================
  // 更新日期選項
  // ============================================
  updateDate: {
    day1: '1日',
    day10: '10日',
    day20: '20日',
  },
};

// 導出便捷訪問函數
export const getText = (category, key, params = {}) => {
  const text = textConfig[category]?.[key];
  if (!text) return key;

  // 支持參數替換，例如：'實際出貨金額 + +{offset}月比值'
  return text.replace(/\{(\w+)\}/g, (match, param) => params[param] || match);
};

export default textConfig;
