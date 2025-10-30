import XLSX from 'xlsx';

/**
 * 生成市場與客戶指標資料
 * 包含：市場佔有率、客戶訂單狀態、客戶滿意度
 */

// 生成月份列表（2022-01 到 2025-12）
function generateMonths() {
  const months = [];
  for (let year = 2022; year <= 2025; year++) {
    for (let month = 1; month <= 12; month++) {
      months.push(`${year}-${String(month).padStart(2, '0')}`);
    }
  }
  return months;
}

// 生成帶趨勢的隨機數據
function generateTrendValue(baseValue, monthIndex, growthRate, seasonality, variance) {
  const trend = baseValue * (1 + growthRate * monthIndex / 48);
  const seasonal = 1 + seasonality * Math.sin((monthIndex % 12) * Math.PI / 6);
  const random = 1 + (Math.random() - 0.5) * variance;
  return parseFloat((trend * seasonal * random).toFixed(2));
}

// 1. 生成市場佔有率資料
function generateMarketShareData() {
  const months = generateMonths();
  const regions = ['北美', '歐洲', '亞太', '中國'];
  const baseShares = {
    '北美': 35,
    '歐洲': 25,
    '亞太': 20,
    '中國': 20
  };

  const data = [];

  months.forEach((month, index) => {
    regions.forEach(region => {
      // 不同地區有不同的成長率
      const growthRates = {
        '北美': 0.02,
        '歐洲': 0.01,
        '亞太': 0.08,
        '中國': 0.05
      };

      const marketShare = generateTrendValue(
        baseShares[region],
        index,
        growthRates[region],
        0.03,
        0.05
      );

      data.push({
        '月份': month,
        '地區': region,
        '市場佔有率(%)': marketShare
      });
    });
  });

  return data;
}

// 2. 生成客戶訂單狀態資料
function generateCustomerOrdersData() {
  const months = generateMonths();
  const customers = ['客戶A', '客戶B', '客戶C', '客戶D', '客戶E'];
  const baseOrders = {
    '客戶A': 150,
    '客戶B': 120,
    '客戶C': 100,
    '客戶D': 80,
    '客戶E': 60
  };

  const data = [];

  months.forEach((month, index) => {
    customers.forEach(customer => {
      // 不同客戶有不同成長率
      const growthRates = {
        '客戶A': 0.08,
        '客戶B': 0.06,
        '客戶C': 0.10,
        '客戶D': 0.04,
        '客戶E': 0.12
      };

      const orderAmount = generateTrendValue(
        baseOrders[customer],
        index,
        growthRates[customer],
        0.05,
        0.08
      );

      data.push({
        '月份': month,
        '客戶': customer,
        '訂單金額(M USD)': orderAmount
      });
    });
  });

  return data;
}

// 3. 生成客戶滿意度資料
function generateCustomerSatisfactionData() {
  const months = generateMonths();
  const customers = ['客戶A', '客戶B', '客戶C', '客戶D', '客戶E'];

  // 基準分數
  const baseScores = {
    整體滿意度: 85,
    產品質量: 88,
    交貨準時: 82,
    技術支持: 84,
    價格競爭力: 80
  };

  const data = [];

  months.forEach((month, index) => {
    customers.forEach(customer => {
      // 各項指標有小幅上升趨勢
      const scores = {};
      Object.keys(baseScores).forEach(metric => {
        scores[metric] = generateTrendValue(
          baseScores[metric],
          index,
          0.03,  // 3% 年成長
          0.02,  // 小幅季節性
          0.03   // 3% 變異
        );
        // 限制在 70-100 範圍
        scores[metric] = Math.max(70, Math.min(100, scores[metric]));
      });

      data.push({
        '月份': month,
        '客戶': customer,
        '整體滿意度': scores['整體滿意度'],
        '產品質量': scores['產品質量'],
        '交貨準時': scores['交貨準時'],
        '技術支持': scores['技術支持'],
        '價格競爭力': scores['價格競爭力']
      });
    });
  });

  return data;
}

// 主函數
function generateMarketExcel() {
  console.log('開始生成市場與客戶指標資料...');

  // 生成三個工作表的資料
  const marketShareData = generateMarketShareData();
  const customerOrdersData = generateCustomerOrdersData();
  const satisfactionData = generateCustomerSatisfactionData();

  console.log(`✓ 市場佔有率: ${marketShareData.length} 筆記錄`);
  console.log(`✓ 客戶訂單狀態: ${customerOrdersData.length} 筆記錄`);
  console.log(`✓ 客戶滿意度: ${satisfactionData.length} 筆記錄`);

  // 創建工作簿
  const workbook = XLSX.utils.book_new();

  // 添加工作表1: 市場佔有率
  const ws1 = XLSX.utils.json_to_sheet(marketShareData);
  XLSX.utils.book_append_sheet(workbook, ws1, '市場佔有率');

  // 添加工作表2: 客戶訂單狀態
  const ws2 = XLSX.utils.json_to_sheet(customerOrdersData);
  XLSX.utils.book_append_sheet(workbook, ws2, '客戶訂單狀態');

  // 添加工作表3: 客戶滿意度
  const ws3 = XLSX.utils.json_to_sheet(satisfactionData);
  XLSX.utils.book_append_sheet(workbook, ws3, '客戶滿意度');

  // 寫入檔案
  XLSX.writeFile(workbook, './dashboard/public/市場客戶指標.xlsx');

  console.log('\n✅ Excel 檔案已生成：./dashboard/public/市場客戶指標.xlsx');
  console.log('\n資料摘要：');
  console.log('  - 時間範圍：2022-01 到 2025-12 (48個月)');
  console.log('  - 市場佔有率：4個地區（北美、歐洲、亞太、中國）');
  console.log('  - 客戶訂單：5個主要客戶');
  console.log('  - 客戶滿意度：5個指標維度');
}

// 執行
generateMarketExcel();
