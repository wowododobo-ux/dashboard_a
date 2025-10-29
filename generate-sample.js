const XLSX = require('xlsx');

// 生成月份標籤（從2022年1月到2025年12月，共48個月）
function generateMonths() {
  const months = [];
  for (let year = 2022; year <= 2025; year++) {
    const endMonth = year === 2025 ? 12 : 12;
    for (let month = 1; month <= endMonth; month++) {
      months.push(`${year}-${month.toString().padStart(2, '0')}`);
    }
  }
  return months;
}

// 檢查是否為預測月份（2025年10月-12月）
function isForecastMonth(monthStr) {
  return monthStr === '2025-10' || monthStr === '2025-11' || monthStr === '2025-12';
}

// 生成隨機數據（帶有趨勢和季節性）
function generateTrendData(base, variance, trend = 0, count = 48) {
  const data = [];
  for (let i = 0; i < count; i++) {
    // 添加季節性波動（每12個月一個週期）
    const seasonalFactor = Math.sin((i * Math.PI) / 6) * 0.1;
    const trendValue = base + (trend * i) + (base * seasonalFactor);
    const randomValue = trendValue + (Math.random() - 0.5) * variance;
    data.push(Math.round(randomValue * 100) / 100);
  }
  return data;
}

// 圖一：合併營收淨額與銷貨毛利率
function generateChart1Data() {
  const months = generateMonths();
  const data = [
    ['月份', '事業處A營收(M NTD)', '事業處B營收(M NTD)', '事業處C營收(M NTD)', '銷貨毛利率(%)', '是否為預測'],
  ];

  const businessA = generateTrendData(700, 100, 2.5);
  const businessB = generateTrendData(500, 80, 2);
  const businessC = generateTrendData(350, 60, 1.5);
  const grossMargin = generateTrendData(32, 3, 0.08);

  months.forEach((month, i) => {
    const isForecast = isForecastMonth(month);
    data.push([
      month,
      businessA[i],
      businessB[i],
      businessC[i],
      grossMargin[i],
      isForecast ? 'Y' : 'N'
    ]);
  });

  return data;
}

// 圖二：銷貨退回與折讓
function generateChart2Data() {
  const months = generateMonths();
  const data = [
    ['月份', '銷貨退回與折讓(M NTD)', '佔合併營收總額比重(%)', '是否為預測'],
  ];

  const returns = generateTrendData(55, 10, -0.2);
  const returnRatio = generateTrendData(3, 0.5, -0.01);

  months.forEach((month, i) => {
    const isForecast = isForecastMonth(month);
    data.push([
      month,
      returns[i],
      returnRatio[i],
      isForecast ? 'Y' : 'N'
    ]);
  });

  return data;
}

// 圖三：營業毛利與營業毛利率
function generateChart3Data() {
  const months = generateMonths();
  const data = [
    ['月份', '營業毛利(M NTD)', '營業毛利率(%)', '是否為預測'],
  ];

  const operatingGrossProfit = generateTrendData(500, 80, 2.5);
  const operatingGrossMargin = generateTrendData(30, 3, 0.08);

  months.forEach((month, i) => {
    const isForecast = isForecastMonth(month);
    data.push([
      month,
      operatingGrossProfit[i],
      operatingGrossMargin[i],
      isForecast ? 'Y' : 'N'
    ]);
  });

  return data;
}

// 圖四：存貨與跌價損失
function generateChart4Data() {
  const months = generateMonths();
  const data = [
    ['月份', '存貨與跌價損失(M NTD)', '庫存損失率(%)', '是否為預測'],
  ];

  const inventoryLoss = generateTrendData(35, 8, -0.15);
  const lossRatio = generateTrendData(2, 0.3, -0.01);

  months.forEach((month, i) => {
    const isForecast = isForecastMonth(month);
    data.push([
      month,
      inventoryLoss[i],
      lossRatio[i],
      isForecast ? 'Y' : 'N'
    ]);
  });

  return data;
}

// 圖五：閒置產能損失
function generateChart5Data() {
  const months = generateMonths();
  const data = [
    ['月份', '閒置產能損失(M NTD)', '是否為預測'],
  ];

  const idleCapacityLoss = generateTrendData(30, 6, -0.2);

  months.forEach((month, i) => {
    const isForecast = isForecastMonth(month);
    data.push([
      month,
      idleCapacityLoss[i],
      isForecast ? 'Y' : 'N'
    ]);
  });

  return data;
}

// 圖六：營業費用
function generateChart6Data() {
  const months = generateMonths();
  const data = [
    ['月份', '研發費用(M NTD)', '管理費用(M NTD)', '銷售費用(M NTD)', '營業費用率(%)', '是否為預測'],
  ];

  const rdExpense = generateTrendData(120, 20, 0.8);
  const adminExpense = generateTrendData(80, 15, 0.5);
  const salesExpense = generateTrendData(70, 12, 0.3);
  const expenseRatio = generateTrendData(20, 2, -0.05);

  months.forEach((month, i) => {
    const isForecast = isForecastMonth(month);
    data.push([
      month,
      rdExpense[i],
      adminExpense[i],
      salesExpense[i],
      expenseRatio[i],
      isForecast ? 'Y' : 'N'
    ]);
  });

  return data;
}

// 圖七：營業利益
function generateChart7Data() {
  const months = generateMonths();
  const data = [
    ['月份', '營業利益(M NTD)', '營業利益率(%)', '是否為預測'],
  ];

  const operatingIncome = generateTrendData(220, 40, 1.8);
  const operatingMargin = generateTrendData(13, 2, 0.08);

  months.forEach((month, i) => {
    const isForecast = isForecastMonth(month);
    data.push([
      month,
      operatingIncome[i],
      operatingMargin[i],
      isForecast ? 'Y' : 'N'
    ]);
  });

  return data;
}

// 圖八：EBITDA
function generateChart8Data() {
  const months = generateMonths();
  const data = [
    ['月份', 'EBITDA(M NTD)', 'EBITDA率(%)', '是否為預測'],
  ];

  const ebitda = generateTrendData(280, 50, 2);
  const ebitdaRate = generateTrendData(17, 2, 0.1);

  months.forEach((month, i) => {
    const isForecast = isForecastMonth(month);
    data.push([
      month,
      ebitda[i],
      ebitdaRate[i],
      isForecast ? 'Y' : 'N'
    ]);
  });

  return data;
}

// 圖九：稅後淨利
function generateChart9Data() {
  const months = generateMonths();
  const data = [
    ['月份', '稅後淨利(M NTD)', '稅後淨利率(%)', '是否為預測'],
  ];

  const netIncome = generateTrendData(170, 35, 1.5);
  const netMargin = generateTrendData(10, 1.5, 0.06);

  months.forEach((month, i) => {
    const isForecast = isForecastMonth(month);
    data.push([
      month,
      netIncome[i],
      netMargin[i],
      isForecast ? 'Y' : 'N'
    ]);
  });

  return data;
}

// 創建 Excel 檔案
function createExcelFile() {
  const wb = XLSX.utils.book_new();

  // 添加各個圖表的工作表
  const sheets = [
    { name: '圖1_合併營收與毛利率', data: generateChart1Data() },
    { name: '圖2_銷貨退回與折讓', data: generateChart2Data() },
    { name: '圖3_營業毛利', data: generateChart3Data() },
    { name: '圖4_存貨跌價損失', data: generateChart4Data() },
    { name: '圖5_閒置產能損失', data: generateChart5Data() },
    { name: '圖6_營業費用', data: generateChart6Data() },
    { name: '圖7_營業利益', data: generateChart7Data() },
    { name: '圖8_EBITDA', data: generateChart8Data() },
    { name: '圖9_稅後淨利', data: generateChart9Data() }
  ];

  sheets.forEach(sheet => {
    const ws = XLSX.utils.aoa_to_sheet(sheet.data);
    XLSX.utils.book_append_sheet(wb, ws, sheet.name);
  });

  // 寫入檔案
  XLSX.writeFile(wb, '財務趨勢模擬資料.xlsx');
  console.log('✅ Excel 檔案已成功生成：財務趨勢模擬資料.xlsx');
  console.log('\n📊 資料範圍：2022年1月 - 2025年12月（共48個月）');
  console.log('📈 歷史資料：2022年1月 - 2025年9月（45個月）');
  console.log('🔮 預測資料：2025年10月 - 2025年12月（3個月）');
  console.log('\n📋 包含以下工作表：');
  sheets.forEach((sheet, i) => {
    console.log(`   ${i + 1}. ${sheet.name}`);
  });
}

// 執行
createExcelFile();
