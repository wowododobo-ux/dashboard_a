// 統一的文字配置文件
// 所有頁面和組件的顯示文字都集中在這裡管理

export const textConfig = {
  // ============================================
  // 網站標題和Logo
  // ============================================
  site: {
    name: '半導體智能分析平台',
    nameEn: 'Semiconductor Intelligence Dashboard',
    logoAlt: '半導體智能分析平台',
  },

  // ============================================
  // 首頁
  // ============================================
  homePage: {
    title: '半導體智能分析平台',
    subtitle: '一站式數據分析與決策支援系統',
    welcome: '歡迎使用',
    description: '整合財務、生產、市場等多維度數據，提供全面的經營分析與洞察',
    selectModule: '選擇分析模組',
    viewAll: '查看所有模組',
  },

  // ============================================
  // 模組卡片
  // ============================================
  moduleCards: {
    financial: {
      title: '財務趨勢分析',
      description: '追蹤營收、毛利、費用等財務指標趨勢',
      icon: '📊',
    },
    productCustomer: {
      title: '產品客戶分析',
      description: '分析產品銷售與客戶貢獻度',
      icon: '📦',
    },
    bookToBill: {
      title: '訂單出貨比',
      description: '監控訂單與出貨的比率關係',
      icon: '📈',
    },
    production: {
      title: '生產營運指標',
      description: '追蹤良率、產能、交期等生產指標',
      icon: '🏭',
    },
    market: {
      title: '市場客戶指標',
      description: '分析市場佔有率與客戶滿意度',
      icon: '🌍',
    },
    supplyChain: {
      title: '供應鏈管理',
      description: '監控庫存與供應商績效',
      icon: '🚚',
    },
    rd: {
      title: '研發技術',
      description: '追蹤技術開發進度與專利',
      icon: '🔬',
    },
    hr: {
      title: '人力資源',
      description: '分析員工保留率與績效',
      icon: '👥',
    },
    risk: {
      title: '風險管理',
      description: '監控營運風險與EHS指標',
      icon: '⚠️',
    },
  },

  // ============================================
  // 導航欄
  // ============================================
  navigation: {
    home: '首頁',
    financialTrends: '財務趨勢',
    productCustomer: '產品客戶',
    bookToBill: '訂單出貨',
    production: '生產營運',
    market: '市場客戶',
    supplyChain: '供應鏈',
    rd: '研發技術',
    hr: '人力資源',
    risk: '風險管理',
  },

  // ============================================
  // KPI 目標對比卡片
  // ============================================
  kpi: {
    target: '目標',
    gap: '差距',
    vsYesterday: '較昨日',
    onTarget: '達標',
    offTarget: '未達標',
    trend: '趨勢',
    current: '當前',
    change: '變化',
  },

  // ============================================
  // 實時警報系統
  // ============================================
  alerts: {
    title: '實時警報中心',
    noAlerts: '暫無警報',
    allAlerts: '全部警報',
    pendingAlerts: '待處理',
    criticalAlerts: '緊急',
    warningAlerts: '警告',
    infoAlerts: '資訊',
    acknowledgedAlerts: '已確認',
    resolvedAlerts: '已解決',
    acknowledge: '確認',
    resolve: '解決',
    viewDetails: '查看詳情',
    expand: '展開',
    collapse: '收起',
    filterAll: '全部',
    filterPending: '待處理',
    filterCritical: '緊急',
    filterWarning: '警告',
    severity: {
      critical: '緊急',
      warning: '警告',
      info: '資訊',
    },
    status: {
      pending: '待處理',
      acknowledged: '已確認',
      resolved: '已解決',
    },
    metrics: {
      currentValue: '當前值',
      threshold: '閾值',
      target: '目標值',
    },
    time: {
      justNow: '剛剛',
      minutesAgo: '分鐘前',
      hoursAgo: '小時前',
      daysAgo: '天前',
    },
  },

  // ============================================
  // 全局篩選器
  // ============================================
  globalFilter: {
    title: '全局篩選器',
    reset: '重置篩選',
    apply: '確認',
    cancel: '取消',
    all: '全部',
    currentFilters: '當前篩選條件',

    // 時間範圍
    timeRange: '時間範圍',
    today: '今天',
    thisWeek: '本週',
    thisMonth: '本月',
    last7Days: '最近7天',
    last30Days: '最近30天',
    custom: '自定義日期',
    startDate: '開始日期',
    endDate: '結束日期',

    // 生產區域
    area: '生產區域',
    areaA: 'A區',
    areaB: 'B區',
    areaC: 'C區',

    // 產品線
    productLine: '產品線',
    line5nm: '5nm製程',
    line7nm: '7nm製程',
    line12nm: '12nm製程',
    line16nm: '16nm製程',

    // 班別
    shift: '班別',
    shiftA: 'A班 (早班)',
    shiftB: 'B班 (中班)',
    shiftC: 'C班 (晚班)',
  },

  // ============================================
  // 共用文字
  // ============================================
  common: {
    loading: '載入中...',
    noData: '暫無資料',
    error: '無法載入資料',
    copy: '📋 複製',
    copying: '複製中...',
    copied: '✓ 已複製',
    copyChartTooltip: '複製圖表為圖片',
    copySuccess: '已複製',
    copyFailed: '複製失敗，請重試',
    generateImageFailed: '生成圖片失敗，請重試',
    noteLabel: '📝 註解',
    dataLoaded: '📊 資料已載入',
    recordsCount: '筆記錄',
  },

  // ============================================
  // 頁面標題和載入文字
  // ============================================
  pageHeaders: {
    // 頁面標題
    financialTrends: '財務趨勢儀表板',
    productCustomer: '產品與客戶分析儀表板',
    bookToBill: '訂單出貨比分析儀表板',
    production: '生產營運指標',
    market: '市場與客戶指標',
    supplyChain: '供應鏈與原材料指標',
    rd: '研發與技術指標',
    hr: '人力資源指標',
    risk: '風險管理指標',
    yearComparison: '年度比較分析',

    // 載入文字
    loadingFinancial: '載入財務資料中...',
    loadingProductCustomer: '載入產品客戶資料中...',
    loadingBookToBill: '載入訂單出貨比資料中...',
    loadingProduction: '載入生產營運指標資料中...',
    loadingMarket: '載入市場與客戶指標資料中...',
    loadingSupplyChain: '載入供應鏈與原材料資料中...',
    loadingRD: '載入研發與技術資料中...',
    loadingHR: '載入人力資源資料中...',
    loadingRisk: '載入風險管理資料中...',
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
  // 生產營運指標圖表標題
  // ============================================
  productionCharts: {
    waferYield: '晶圓良率分析（按製程節點）',
    capacityOEE: '產能利用率與整體設備效率（OEE）',
    cycleTime: '生產週期與準時交貨率',
    defectDensity: '缺陷密度分析（按產品類型）',
    wipInventory: 'WIP（在製品）庫存水平',
    productionSchedule: '生產排程達成率',
    productYieldByArea: '產品別良率分析（按區域與產品線）',
    productYieldTable: '產品別良率數據表',
  },

  // ============================================
  // 市場與客戶指標圖表標題
  // ============================================
  marketCharts: {
    marketShare: '市場佔有率趨勢（按地區）',
    customerOrders: '客戶訂單狀態分析',
    customerSatisfaction: '客戶滿意度指標',
  },

  // ============================================
  // 供應鏈與原材料圖表標題
  // ============================================
  supplyChainCharts: {
    materialInventory: '關鍵原材料庫存水平（天數）',
    supplierPerformance: '供應商交貨績效',
  },

  // ============================================
  // 研發與技術圖表標題
  // ============================================
  rdCharts: {
    newProcess: '新製程技術開發進度',
    patents: '專利申請與授權數量',
    processTracking: '追蹤項目：3nm製程、2nm研究、GAA技術、先進封裝',
    patentFields: '技術領域：製程技術、設備改進、材料科學',
  },

  // ============================================
  // 人力資源指標圖表標題
  // ============================================
  hrCharts: {
    employeeRetention: '關鍵崗位員工保留率',
    employeePerformance: '員工績效指標分布',
  },

  // ============================================
  // 風險管理指標圖表標題
  // ============================================
  riskCharts: {
    operationalRisk: '營運風險指標',
    ehsPerformance: 'EHS（環境、健康、安全）績效',
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
    financialTrends: '註：2025年10-12月為預測資料 | 金額單位：百萬新台幣 (M NTD) | 資料範圍：2022/01-2025/12',
    productCustomer: '註：2025年10月之後為預測資料 | 金額單位：百萬新台幣 (M NTD) | 資料範圍：2022/01-2025/12',
    bookToBill: '註：2025年10月之後為預測資料 | 金額單位：百萬新台幣 (M NTD) | 資料範圍：2022/01-2025/12',
    production: '註：2025年10月之後為預測資料 | 資料範圍：2022/01-2025/12',
    market: '註：2025年10月之後為預測資料 | 資料範圍：2022/01-2025/12',
    supplyChain: '註：2025年10月之後為預測資料 | 資料範圍：2022/01-2025/12',
    rd: '註：2025年10月之後為預測資料 | 資料範圍：2022-2025',
    hr: '註：2025年10月之後為預測資料 | 資料範圍：2022/01-2025/12',
    risk: '註：2025年10月之後為預測資料 | 資料範圍：2022/01-2025/12',
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
