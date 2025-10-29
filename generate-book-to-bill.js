const XLSX = require('xlsx');
const path = require('path');

// 生成月份列表 (2022/01 - 2025/12)
function generateMonths() {
  const months = [];
  for (let year = 2022; year <= 2025; year++) {
    for (let month = 1; month <= 12; month++) {
      months.push(`${year}-${String(month).padStart(2, '0')}`);
    }
  }
  return months;
}

// 生成更新日期列表 (每月1、10、20日)
function generateUpdateDates() {
  const dates = [];
  for (let year = 2022; year <= 2025; year++) {
    for (let month = 1; month <= 12; month++) {
      const monthStr = `${year}-${String(month).padStart(2, '0')}`;
      dates.push(`${monthStr}-01`);
      dates.push(`${monthStr}-10`);
      dates.push(`${monthStr}-20`);
    }
  }
  return dates;
}

// 從更新日期獲取月份
function getMonthFromDate(date) {
  return date.substring(0, 7); // '2022-01-01' -> '2022-01'
}

// 從更新日期獲取日期部分
function getDayFromDate(date) {
  return date.substring(8, 10); // '2022-01-01' -> '01'
}

// 生成每月的基礎訂單數據
function generateMonthlyOrders() {
  const months = generateMonths();
  const orders = {};

  months.forEach((month, index) => {
    // 基礎訂單金額，隨時間成長且有隨機波動
    const baseOrder = 800 + index * 5 + (Math.random() - 0.5) * 100;
    orders[month] = Math.round(baseOrder);
  });

  return orders;
}

// 生成每月的基礎出貨數據
function generateMonthlyShipments() {
  const months = generateMonths();
  const shipments = {};

  months.forEach((month, index) => {
    // 基礎出貨金額，比訂單略低，且隨時間成長
    const baseShipment = 750 + index * 4 + (Math.random() - 0.5) * 80;
    shipments[month] = Math.round(baseShipment);
  });

  return shipments;
}

// 計算未來六個月訂單總和（保留舊版功能）
function calculateFutureSixMonthOrders(currentMonth, monthlyOrders) {
  const months = generateMonths();
  const currentIndex = months.indexOf(currentMonth);

  if (currentIndex === -1 || currentIndex + 6 >= months.length) {
    return null;
  }

  let total = 0;
  for (let i = 1; i <= 6; i++) {
    const futureMonth = months[currentIndex + i];
    if (futureMonth && monthlyOrders[futureMonth]) {
      total += monthlyOrders[futureMonth];
    }
  }

  return total;
}

// 計算未來六個月的各月比值（新版矩陣數據）
// 模擬每月1、10、20日更新，預測會隨時間調整
function calculateFutureSixMonthRatios(baseMonth, monthlyOrders, monthlyShipments) {
  const months = generateMonths();
  const baseIndex = months.indexOf(baseMonth);

  if (baseIndex === -1 || baseIndex + 6 >= months.length) {
    return null;
  }

  const avgShipment = calculatePreviousYearAvgShipment(baseMonth, monthlyShipments);
  const ratios = [];

  for (let i = 1; i <= 6; i++) {
    const targetMonth = months[baseIndex + i];
    let orderAmount = monthlyOrders[targetMonth];

    // 模擬預測隨時間調整：距離越遠，波動越大
    // 每個基準月份會有不同的預測調整
    const distanceFactor = i / 6; // 0.17 到 1.0
    const baseAdjustment = (Math.sin(baseIndex * 0.8) * 0.15); // 基於基準月的週期性調整（增加幅度）
    const randomAdjustment = (Math.random() - 0.5) * 0.25 * distanceFactor; // 隨機波動（增加幅度）

    // 額外的趨勢因子：讓不同偏移有不同的趨勢
    const trendFactor = Math.sin((baseIndex + i) * 0.3) * 0.1 * distanceFactor;

    // 調整訂單金額（模擬預測更新）
    orderAmount = orderAmount * (1 + baseAdjustment + randomAdjustment + trendFactor);

    const ratio = avgShipment > 0 ? orderAmount / avgShipment : 0;

    // 判斷目標月份是否為預測
    const [year, monthNum] = targetMonth.split('-');
    const isForecast = (parseInt(year) === 2025 && parseInt(monthNum) >= 10) ? 'Y' : 'N';

    // 生成註解
    let note = '';
    if (isForecast === 'Y') {
      note = '預測';
    }
    if (ratio > 1.2) {
      note += (note ? '；' : '') + '訂單強勁';
    } else if (ratio < 0.9) {
      note += (note ? '；' : '') + '訂單趨緩';
    }

    ratios.push({
      targetMonth,
      orderAmount: Math.round(orderAmount),
      shipmentAmount: avgShipment,
      ratio: parseFloat(ratio.toFixed(2)),
      isForecast,
      note
    });
  }

  return ratios;
}

// 計算未來六個月的各月比值（新版：基於更新日期）
// 模擬每月1、10、20日更新，同一目標月的預測會隨更新日期變化
// 業務邏輯：
// 1. 每月累積效應：1日 < 10日 < 20日（訂單累積增加）
// 2. 時間衰減效應：+1月 > +2月 > ... > +6月（近期訂單多，遠期訂單少）
function calculateFutureSixMonthRatiosByDate(baseDate, monthlyOrders, monthlyShipments) {
  const updateDates = generateUpdateDates();
  const baseDateIndex = updateDates.indexOf(baseDate);

  if (baseDateIndex === -1) {
    return null;
  }

  const baseMonth = getMonthFromDate(baseDate);
  const baseDay = getDayFromDate(baseDate);
  const avgShipment = calculatePreviousYearAvgShipment(baseMonth, monthlyShipments);
  const ratios = [];

  // 找到基準月份後的6個月
  const months = generateMonths();
  const baseMonthIndex = months.indexOf(baseMonth);

  if (baseMonthIndex === -1 || baseMonthIndex + 6 >= months.length) {
    return null;
  }

  // 每月累積係數：1日=0.6, 10日=0.8, 20日=1.0（20日訂單最多）
  let monthProgressFactor = 0.6;
  if (baseDay === '10') monthProgressFactor = 0.8;
  if (baseDay === '20') monthProgressFactor = 1.0;

  for (let i = 1; i <= 6; i++) {
    const targetMonth = months[baseMonthIndex + i];
    let orderAmount = monthlyOrders[targetMonth];

    // 時間衰減效應：+1月訂單最多，+6月訂單最少
    // +1月: 100%, +2月: 85%, +3月: 70%, +4月: 55%, +5月: 40%, +6月: 25%
    const timeDecayFactor = Math.max(0.25, 1.15 - (i * 0.15));

    // 應用時間衰減和月內累積效應
    orderAmount = orderAmount * timeDecayFactor * monthProgressFactor;

    // 添加一些隨機波動（越遠期波動越大）
    const volatility = (Math.random() - 0.5) * 0.1 * (i / 6);
    orderAmount = orderAmount * (1 + volatility);

    // 基於基準月的季節性調整
    const seasonalAdjustment = Math.sin(baseMonthIndex * 0.5) * 0.08;
    orderAmount = orderAmount * (1 + seasonalAdjustment);

    const ratio = avgShipment > 0 ? orderAmount / avgShipment : 0;

    // 判斷目標月份是否為預測
    const [year, monthNum] = targetMonth.split('-');
    const isForecast = (parseInt(year) === 2025 && parseInt(monthNum) >= 10) ? 'Y' : 'N';

    // 生成註解
    let note = '';
    if (isForecast === 'Y') {
      note = '預測';
    }
    if (ratio > 1.2) {
      note += (note ? '；' : '') + '訂單強勁';
    } else if (ratio < 0.9) {
      note += (note ? '；' : '') + '訂單趨緩';
    }

    ratios.push({
      targetMonth,
      orderAmount: Math.round(orderAmount),
      shipmentAmount: avgShipment,
      ratio: parseFloat(ratio.toFixed(2)),
      isForecast,
      note
    });
  }

  return ratios;
}

// 計算上一年度月平均出貨金額
function calculatePreviousYearAvgShipment(currentMonth, monthlyShipments) {
  const [year, month] = currentMonth.split('-');
  const previousYear = parseInt(year) - 1;

  // 如果是2022年，使用假設的基準值
  if (previousYear < 2022) {
    return 700; // 假設2021年的平均出貨金額
  }

  let total = 0;
  let count = 0;

  for (let m = 1; m <= 12; m++) {
    const prevYearMonth = `${previousYear}-${String(m).padStart(2, '0')}`;
    if (monthlyShipments[prevYearMonth]) {
      total += monthlyShipments[prevYearMonth];
      count++;
    }
  }

  return count > 0 ? Math.round(total / count) : 700;
}

// 生成Book to Bill資料
function generateBookToBillData() {
  const data = [['月份', '訂單金額(M NTD)', '出貨金額(M NTD)', '訂單出貨比', '是否為預測', '註解']];

  const months = generateMonths();
  const monthlyOrders = generateMonthlyOrders();
  const monthlyShipments = generateMonthlyShipments();

  months.forEach((month, index) => {
    // 計算未來六個月訂單
    const futureOrders = calculateFutureSixMonthOrders(month, monthlyOrders);

    // 如果無法計算未來六個月（接近資料末端），跳過
    if (futureOrders === null) {
      return;
    }

    // 計算上一年度平均出貨
    const avgShipment = calculatePreviousYearAvgShipment(month, monthlyShipments);

    // 計算訂單出貨比
    const bookToBillRatio = avgShipment > 0 ? (futureOrders / avgShipment).toFixed(2) : 0;

    // 判斷是否為預測（2025年10月之後）
    const [year, monthNum] = month.split('-');
    const isForecast = (parseInt(year) === 2025 && parseInt(monthNum) >= 10) ? 'Y' : 'N';

    // 生成註解
    let note = '';
    const ratio = parseFloat(bookToBillRatio);

    if (isForecast === 'Y') {
      note = '預測資料：';
    }

    if (ratio > 1.2) {
      note += ratio > 1.5 ? '訂單強勁成長，產能需求大' : '訂單成長，營運樂觀';
    } else if (ratio >= 0.9 && ratio <= 1.1) {
      note += '訂單與出貨平衡';
    } else if (ratio < 0.9) {
      note += ratio < 0.7 ? '訂單下滑明顯，需關注' : '訂單趨緩';
    }

    // 特殊月份標註
    if (monthNum === '01') {
      note += note ? '；' : '';
      note += '年初訂單';
    } else if (monthNum === '12') {
      note += note ? '；' : '';
      note += '年末結算';
    }

    data.push([
      month,
      futureOrders,
      avgShipment,
      parseFloat(bookToBillRatio),
      isForecast,
      note
    ]);
  });

  return data;
}

// 生成訂單明細表（未來六個月）
function generateOrderDetails() {
  const data = [['當前月份', '未來月份', '訂單金額(M NTD)', '註解']];

  const months = generateMonths();
  const monthlyOrders = generateMonthlyOrders();

  // 只顯示部分月份的明細（避免資料過多）
  const sampleMonths = ['2022-01', '2022-06', '2023-01', '2023-06', '2024-01', '2024-06', '2025-01', '2025-06'];

  sampleMonths.forEach(currentMonth => {
    const currentIndex = months.indexOf(currentMonth);

    if (currentIndex !== -1 && currentIndex + 6 < months.length) {
      for (let i = 1; i <= 6; i++) {
        const futureMonth = months[currentIndex + i];
        const orderAmount = monthlyOrders[futureMonth];

        let note = `${currentMonth}的第${i}個月訂單`;

        data.push([
          currentMonth,
          futureMonth,
          orderAmount,
          note
        ]);
      }
    }
  });

  return data;
}

// 生成矩陣格式數據（熱力圖用）
function generateMatrixData() {
  const header = [
    '基準月份',
    '+1月比值', '+1月目標', '+1月訂單金額', '+1月出貨金額',
    '+2月比值', '+2月目標', '+2月訂單金額', '+2月出貨金額',
    '+3月比值', '+3月目標', '+3月訂單金額', '+3月出貨金額',
    '+4月比值', '+4月目標', '+4月訂單金額', '+4月出貨金額',
    '+5月比值', '+5月目標', '+5月訂單金額', '+5月出貨金額',
    '+6月比值', '+6月目標', '+6月訂單金額', '+6月出貨金額',
    '註解'
  ];
  const data = [header];

  const months = generateMonths();
  const monthlyOrders = generateMonthlyOrders();
  const monthlyShipments = generateMonthlyShipments();

  months.forEach(baseMonth => {
    const ratios = calculateFutureSixMonthRatios(baseMonth, monthlyOrders, monthlyShipments);

    if (ratios === null) {
      return;
    }

    const row = [baseMonth];
    let hasNote = false;
    let noteText = '';

    ratios.forEach((r, index) => {
      row.push(r.ratio);
      row.push(r.targetMonth);
      row.push(r.orderAmount);
      // 添加目標月份的實際出貨金額
      const targetShipment = monthlyShipments[r.targetMonth] || 0;
      row.push(targetShipment);
      if (r.note && !hasNote) {
        noteText = r.note;
        hasNote = true;
      }
    });

    row.push(noteText);
    data.push(row);
  });

  return data;
}

// 生成矩陣格式數據（基於更新日期：每月1、10、20日）
function generateMatrixDataWithDates() {
  const header = [
    '更新日期',
    '+1月比值', '+1月目標', '+1月訂單金額', '+1月出貨金額',
    '+2月比值', '+2月目標', '+2月訂單金額', '+2月出貨金額',
    '+3月比值', '+3月目標', '+3月訂單金額', '+3月出貨金額',
    '+4月比值', '+4月目標', '+4月訂單金額', '+4月出貨金額',
    '+5月比值', '+5月目標', '+5月訂單金額', '+5月出貨金額',
    '+6月比值', '+6月目標', '+6月訂單金額', '+6月出貨金額',
    '註解'
  ];
  const data = [header];

  const updateDates = generateUpdateDates();
  const monthlyOrders = generateMonthlyOrders();
  const monthlyShipments = generateMonthlyShipments();

  updateDates.forEach(baseDate => {
    const ratios = calculateFutureSixMonthRatiosByDate(baseDate, monthlyOrders, monthlyShipments);

    if (ratios === null) {
      return;
    }

    const row = [baseDate];
    let hasNote = false;
    let noteText = '';

    ratios.forEach((r, index) => {
      row.push(r.ratio);
      row.push(r.targetMonth);
      row.push(r.orderAmount);
      // 添加目標月份的實際出貨金額
      const targetShipment = monthlyShipments[r.targetMonth] || 0;
      row.push(targetShipment);
      if (r.note && !hasNote) {
        noteText = r.note;
        hasNote = true;
      }
    });

    row.push(noteText);
    data.push(row);
  });

  return data;
}

// 生成年度出貨平均表
function generateYearlyShipmentAvg() {
  const data = [['年度', '月平均出貨(M NTD)', '全年總出貨(M NTD)', '註解']];

  const monthlyShipments = generateMonthlyShipments();
  const years = [2021, 2022, 2023, 2024, 2025];

  years.forEach(year => {
    let total = 0;
    let count = 0;

    if (year === 2021) {
      // 2021年使用假設值
      data.push([
        year,
        700,
        8400,
        '假設值（用於2022年計算基準）'
      ]);
      return;
    }

    for (let month = 1; month <= 12; month++) {
      const monthKey = `${year}-${String(month).padStart(2, '0')}`;
      if (monthlyShipments[monthKey]) {
        total += monthlyShipments[monthKey];
        count++;
      }
    }

    const avg = count > 0 ? Math.round(total / count) : 0;

    let note = '';
    if (year === 2025) {
      note = '當年度出貨金額';
    } else {
      note = `供${year + 1}年計算使用`;
    }

    data.push([
      year,
      avg,
      total,
      note
    ]);
  });

  return data;
}

// 創建工作簿並保存
const workbook = XLSX.utils.book_new();

const bookToBillData = generateBookToBillData();
const ws1 = XLSX.utils.aoa_to_sheet(bookToBillData);
XLSX.utils.book_append_sheet(workbook, ws1, '訂單出貨比');

const orderDetailsData = generateOrderDetails();
const ws2 = XLSX.utils.aoa_to_sheet(orderDetailsData);
XLSX.utils.book_append_sheet(workbook, ws2, '訂單明細');

const yearlyAvgData = generateYearlyShipmentAvg();
const ws3 = XLSX.utils.aoa_to_sheet(yearlyAvgData);
XLSX.utils.book_append_sheet(workbook, ws3, '年度出貨平均');

const matrixData = generateMatrixData();
const ws4 = XLSX.utils.aoa_to_sheet(matrixData);
XLSX.utils.book_append_sheet(workbook, ws4, '矩陣比值');

const matrixDataWithDates = generateMatrixDataWithDates();
const ws5 = XLSX.utils.aoa_to_sheet(matrixDataWithDates);
XLSX.utils.book_append_sheet(workbook, ws5, '矩陣比值_更新日期');

const filePath = path.join(__dirname, 'dashboard/public/訂單出貨比.xlsx');
XLSX.writeFile(workbook, filePath);

console.log('✅ 訂單出貨比檔案已生成！');
console.log(`檔案位置: ${filePath}`);
console.log('\n包含以下工作表:');
console.log('1. 訂單出貨比 - 每月的訂單出貨比資料');
console.log('2. 訂單明細 - 未來六個月訂單明細');
console.log('3. 年度出貨平均 - 各年度平均出貨金額');
console.log('4. 矩陣比值 - 熱力圖用矩陣數據（月度）');
console.log('5. 矩陣比值_更新日期 - 包含每月1、10、20日的更新記錄');
console.log('\n資料說明:');
console.log('- 訂單金額：當月之後六個月的訂單總和');
console.log('- 出貨金額：上一年度全年的月平均出貨');
console.log('- 訂單出貨比：訂單金額 / 出貨金額');
console.log('- 比值 > 1 表示訂單大於出貨，業務成長');
console.log('- 比值 < 1 表示訂單小於出貨，訂單趨緩');
