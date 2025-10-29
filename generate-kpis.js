// 生成 KPI 目標數據
// 為各模組生成關鍵績效指標的當前值、目標值和歷史數據

import fs from 'fs';

// 生成 KPI 數據
function generateKPIs() {
  const today = new Date('2025-10-30');
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const kpis = {
    // 財務模組 KPIs
    financial: [
      {
        id: 'gross-margin',
        title: '銷貨毛利率',
        icon: '💰',
        current: 38.2,
        target: 40.0,
        previousDay: 38.7,
        unit: '%',
        category: 'financial',
        reverseColor: false,
        description: '銷貨毛利率持續低於目標，需關注成本控制',
      },
      {
        id: 'operating-expense-ratio',
        title: '營業費用率',
        icon: '📉',
        current: 22.5,
        target: 20.0,
        previousDay: 22.3,
        unit: '%',
        category: 'financial',
        reverseColor: true, // 費用率越低越好
        description: '營業費用率超標，需檢討費用支出',
      },
      {
        id: 'net-profit-margin',
        title: '稅後淨利率',
        icon: '💵',
        current: 12.8,
        target: 15.0,
        previousDay: 13.1,
        unit: '%',
        category: 'financial',
        reverseColor: false,
        description: '淨利率下滑，需提升整體獲利能力',
      },
      {
        id: 'inventory-turnover',
        title: '存貨周轉天數',
        icon: '📦',
        current: 45.2,
        target: 40.0,
        previousDay: 44.8,
        unit: '天',
        category: 'financial',
        reverseColor: true, // 周轉天數越低越好
        description: '存貨周轉偏慢，可能影響現金流',
      },
    ],

    // 生產模組 KPIs
    production: [
      {
        id: 'overall-oee',
        title: 'Overall OEE',
        icon: '⚙️',
        current: 85.7,
        target: 90.0,
        previousDay: 86.2,
        unit: '%',
        category: 'production',
        reverseColor: false,
        description: '整體設備效率低於目標，需優化設備稼動率',
      },
      {
        id: 'wafer-yield',
        title: '晶圓良率',
        icon: '🔬',
        current: 82.3,
        target: 85.0,
        previousDay: 82.8,
        unit: '%',
        category: 'production',
        reverseColor: false,
        description: '3nm製程良率仍需提升',
      },
      {
        id: 'on-time-delivery',
        title: '準時交貨率',
        icon: '🚚',
        current: 91.2,
        target: 95.0,
        previousDay: 91.8,
        unit: '%',
        category: 'production',
        reverseColor: false,
        description: '準時交貨率未達標準，影響客戶滿意度',
      },
      {
        id: 'defect-density',
        title: '缺陷密度',
        icon: '🔍',
        current: 0.28,
        target: 0.20,
        previousDay: 0.26,
        unit: '/cm²',
        category: 'production',
        reverseColor: true, // 缺陷密度越低越好
        description: '缺陷密度偏高，需加強品質管控',
      },
    ],

    // 市場模組 KPIs
    market: [
      {
        id: 'market-share',
        title: '市場佔有率',
        icon: '🌍',
        current: 25.3,
        target: 27.0,
        previousDay: 25.5,
        unit: '%',
        category: 'market',
        reverseColor: false,
        description: '北美市場佔有率下滑',
      },
      {
        id: 'customer-satisfaction',
        title: '客戶滿意度',
        icon: '⭐',
        current: 4.3,
        target: 4.5,
        previousDay: 4.4,
        unit: '/5.0',
        category: 'market',
        reverseColor: false,
        description: '客戶滿意度略降，需改善服務品質',
      },
      {
        id: 'nps-score',
        title: 'NPS 淨推薦值',
        icon: '👍',
        current: 42,
        target: 50,
        previousDay: 43,
        unit: '',
        category: 'market',
        reverseColor: false,
        description: 'NPS 分數低於目標，需提升客戶忠誠度',
      },
    ],

    // 供應鏈模組 KPIs
    supplyChain: [
      {
        id: 'material-inventory',
        title: '關鍵原料庫存',
        icon: '📊',
        current: 15.2,
        target: 30.0,
        previousDay: 16.1,
        unit: '天',
        category: 'supplyChain',
        reverseColor: false,
        description: '矽晶圓庫存嚴重不足，存在斷料風險',
      },
      {
        id: 'supplier-otd',
        title: '供應商準時率',
        icon: '🏭',
        current: 88.5,
        target: 95.0,
        previousDay: 89.2,
        unit: '%',
        category: 'supplyChain',
        reverseColor: false,
        description: '供應商交貨延遲影響生產計劃',
      },
      {
        id: 'supply-cost',
        title: '採購成本指數',
        icon: '💳',
        current: 108.5,
        target: 100.0,
        previousDay: 107.8,
        unit: '',
        category: 'supplyChain',
        reverseColor: true, // 成本指數越低越好
        description: '原料成本上漲，壓縮利潤空間',
      },
    ],

    // 研發模組 KPIs
    rd: [
      {
        id: 'rd-progress',
        title: '2nm研發進度',
        icon: '🔬',
        current: 65.0,
        target: 75.0,
        previousDay: 64.5,
        unit: '%',
        category: 'rd',
        reverseColor: false,
        description: '2nm製程研發進度落後計劃',
      },
      {
        id: 'patent-count',
        title: '年度專利申請',
        icon: '📝',
        current: 28,
        target: 40,
        previousDay: 28,
        unit: '件',
        category: 'rd',
        reverseColor: false,
        description: '專利申請數量未達年度目標',
      },
      {
        id: 'rd-investment',
        title: '研發投入比例',
        icon: '💡',
        current: 18.5,
        target: 20.0,
        previousDay: 18.5,
        unit: '%',
        category: 'rd',
        reverseColor: false,
        description: '研發投入比例略低於目標',
      },
    ],

    // 人力資源模組 KPIs
    hr: [
      {
        id: 'employee-retention',
        title: '關鍵員工保留率',
        icon: '👥',
        current: 92.3,
        target: 95.0,
        previousDay: 92.5,
        unit: '%',
        category: 'hr',
        reverseColor: false,
        description: '研發工程師流失率偏高',
      },
      {
        id: 'training-hours',
        title: '人均培訓時數',
        icon: '📚',
        current: 38.5,
        target: 40.0,
        previousDay: 38.5,
        unit: '小時',
        category: 'hr',
        reverseColor: false,
        description: '員工培訓時數略低於目標',
      },
      {
        id: 'employee-satisfaction',
        title: '員工滿意度',
        icon: '😊',
        current: 4.2,
        target: 4.5,
        previousDay: 4.3,
        unit: '/5.0',
        category: 'hr',
        reverseColor: false,
        description: '員工滿意度需持續提升',
      },
    ],

    // 風險管理模組 KPIs
    risk: [
      {
        id: 'safety-incidents',
        title: '安全事件數',
        icon: '⚠️',
        current: 5,
        target: 2,
        previousDay: 4,
        unit: '件',
        category: 'risk',
        reverseColor: true, // 事件數越低越好
        description: '本月安全事件數超標，需加強安全管理',
      },
      {
        id: 'risk-score',
        title: '綜合風險指數',
        icon: '📊',
        current: 68,
        target: 50,
        previousDay: 65,
        unit: '',
        category: 'risk',
        reverseColor: true, // 風險指數越低越好
        description: '整體風險水平偏高，需制定應對措施',
      },
      {
        id: 'compliance-rate',
        title: '合規達成率',
        icon: '✅',
        current: 96.5,
        target: 100.0,
        previousDay: 96.8,
        unit: '%',
        category: 'risk',
        reverseColor: false,
        description: '仍有部分項目未完全合規',
      },
    ],

    // 產品客戶模組 KPIs
    productCustomer: [
      {
        id: 'a-customer-revenue',
        title: 'A級客戶營收佔比',
        icon: '⭐',
        current: 58.2,
        target: 60.0,
        previousDay: 59.1,
        unit: '%',
        category: 'productCustomer',
        reverseColor: false,
        description: 'A級客戶營收比例下降',
      },
      {
        id: 'product-mix',
        title: '高毛利產品佔比',
        icon: '📦',
        current: 42.5,
        target: 45.0,
        previousDay: 43.2,
        unit: '%',
        category: 'productCustomer',
        reverseColor: false,
        description: '需提升高毛利產品銷售佔比',
      },
      {
        id: 'customer-churn',
        title: '客戶流失率',
        icon: '🔄',
        current: 3.8,
        target: 2.0,
        previousDay: 3.5,
        unit: '%',
        category: 'productCustomer',
        reverseColor: true, // 流失率越低越好
        description: '客戶流失率偏高，需加強客戶關係維護',
      },
    ],

    // Book to Bill 模組 KPIs
    bookToBill: [
      {
        id: 'btb-ratio',
        title: 'Book to Bill 比值',
        icon: '📈',
        current: 0.92,
        target: 1.0,
        previousDay: 0.95,
        unit: '',
        category: 'bookToBill',
        reverseColor: false,
        description: '訂單入帳低於出貨，未來營收可能下滑',
      },
      {
        id: 'order-backlog',
        title: '在手訂單',
        icon: '📋',
        current: 2850,
        target: 3000,
        previousDay: 2920,
        unit: 'M',
        category: 'bookToBill',
        reverseColor: false,
        description: '在手訂單金額下降',
      },
      {
        id: 'forecast-accuracy',
        title: '預測準確度',
        icon: '🎯',
        current: 88.5,
        target: 95.0,
        previousDay: 89.2,
        unit: '%',
        category: 'bookToBill',
        reverseColor: false,
        description: '營收預測準確度需提升',
      },
    ],
  };

  return kpis;
}

// 將 KPI 數據寫入 JSON 文件
function saveKPIsToJSON() {
  const kpis = generateKPIs();

  // 計算統計數據
  let totalKPIs = 0;
  let onTargetCount = 0;
  let offTargetCount = 0;

  Object.values(kpis).forEach(moduleKPIs => {
    moduleKPIs.forEach(kpi => {
      totalKPIs++;
      const isOnTarget = kpi.reverseColor
        ? kpi.current <= kpi.target
        : kpi.current >= kpi.target;
      if (isOnTarget) {
        onTargetCount++;
      } else {
        offTargetCount++;
      }
    });
  });

  const result = {
    kpis,
    metadata: {
      lastUpdate: new Date().toISOString(),
      totalKPIs,
      onTargetCount,
      offTargetCount,
      achievementRate: ((onTargetCount / totalKPIs) * 100).toFixed(1),
    },
  };

  fs.writeFileSync(
    'dashboard/public/kpis.json',
    JSON.stringify(result, null, 2),
    'utf-8'
  );

  console.log(`✅ 已生成 ${totalKPIs} 個 KPI 指標`);
  console.log('📁 文件位置: dashboard/public/kpis.json');

  console.log('\n📊 KPI 統計:');
  console.log(`   總計: ${totalKPIs} 個`);
  console.log(`   達標: ${onTargetCount} 個 (${((onTargetCount / totalKPIs) * 100).toFixed(1)}%)`);
  console.log(`   未達標: ${offTargetCount} 個 (${((offTargetCount / totalKPIs) * 100).toFixed(1)}%)`);

  console.log('\n📋 各模組 KPI 數量:');
  Object.entries(kpis).forEach(([module, moduleKPIs]) => {
    const onTarget = moduleKPIs.filter(kpi =>
      kpi.reverseColor ? kpi.current <= kpi.target : kpi.current >= kpi.target
    ).length;
    console.log(`   ${module}: ${moduleKPIs.length} 個 (${onTarget} 達標)`);
  });
}

// 執行生成
saveKPIsToJSON();
