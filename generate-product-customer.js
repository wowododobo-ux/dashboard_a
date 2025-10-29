const XLSX = require('xlsx');
const path = require('path');

// 產品列表
const products = ['產品A', '產品B', '產品C', '產品D', '產品E'];
const customers = ['客戶甲', '客戶乙', '客戶丙', '客戶丁', '客戶戊'];

// 生成月份列表 (2022-01 到 2025-12)
function generateMonths() {
  const months = [];
  for (let year = 2022; year <= 2025; year++) {
    for (let month = 1; month <= 12; month++) {
      months.push(`${year}-${month.toString().padStart(2, '0')}`);
    }
  }
  return months;
}

const months = generateMonths();

// 檢查是否為預測月份（2025年10-12月）
function isForecastMonth(monthStr) {
  return monthStr === '2025-10' || monthStr === '2025-11' || monthStr === '2025-12';
}

// 生成產品別銷售分析
function generateProductSales() {
  const data = [['月份', '產品', '營收(M NTD)', '銷貨成本(M NTD)', '毛利(M NTD)', '毛利率(%)', '註解']];

  months.forEach((month, mIndex) => {
    const isForecast = isForecastMonth(month);
    products.forEach((product, pIndex) => {
      const baseRevenue = (pIndex + 1) * 50 + Math.random() * 20;
      // 添加季節性波動
      const seasonalFactor = Math.sin((mIndex * Math.PI) / 6) * 0.15;
      const revenue = baseRevenue * (1 + mIndex * 0.005 + seasonalFactor);
      const grossMarginRate = 25 + Math.random() * 15;
      const grossProfit = revenue * (grossMarginRate / 100);
      const cogs = revenue - grossProfit;

      let note = '';
      if (month === '2024-12') {
        note = '年末促銷，銷量增加';
      } else if (month === '2025-01') {
        note = '新年度開始，市場穩定';
      } else if (isForecast) {
        note = '預測：預期需求持續成長';
      }

      data.push([
        month,
        product,
        Math.round(revenue),
        Math.round(cogs),
        Math.round(grossProfit),
        parseFloat(grossMarginRate.toFixed(1)),
        note
      ]);
    });
  });

  return data;
}

// 生成客戶別銷售分析
function generateCustomerSales() {
  const data = [['月份', '客戶', '營收(M NTD)', '銷貨成本(M NTD)', '毛利(M NTD)', '毛利率(%)', '營收佔比(%)', '註解']];

  months.forEach((month, mIndex) => {
    const isForecast = isForecastMonth(month);
    let totalRevenue = 0;
    const monthData = [];

    customers.forEach((customer, cIndex) => {
      const baseRevenue = (cIndex + 1) * 70 + Math.random() * 30;
      const seasonalFactor = Math.sin((mIndex * Math.PI) / 6) * 0.12;
      const revenue = baseRevenue * (1 + mIndex * 0.006 + seasonalFactor);
      totalRevenue += revenue;

      const grossMarginRate = 22 + Math.random() * 18;
      const grossProfit = revenue * (grossMarginRate / 100);
      const cogs = revenue - grossProfit;

      monthData.push({
        customer,
        revenue,
        cogs,
        grossProfit,
        grossMarginRate
      });
    });

    monthData.forEach((item) => {
      const revenueShare = (item.revenue / totalRevenue) * 100;

      let note = '';
      if (month === '2024-08' && item.customer === '客戶甲') {
        note = '大單成交，營收顯著提升';
      } else if (isForecast) {
        note = '預測：維持穩定訂單';
      }

      data.push([
        month,
        item.customer,
        Math.round(item.revenue),
        Math.round(item.cogs),
        Math.round(item.grossProfit),
        parseFloat(item.grossMarginRate.toFixed(1)),
        parseFloat(revenueShare.toFixed(1)),
        note
      ]);
    });
  });

  return data;
}

// 生成產品毛利貢獻分析
function generateProductProfitContribution() {
  const data = [['月份', '產品', '毛利貢獻(M NTD)', '毛利貢獻比(%)', '累計貢獻比(%)', '註解']];

  months.forEach((month) => {
    const isForecast = isForecastMonth(month);
    let totalGrossProfit = 0;
    const monthData = [];

    products.forEach((product, pIndex) => {
      const baseProfit = (pIndex + 1) * 15 + Math.random() * 10;
      const grossProfit = baseProfit;
      totalGrossProfit += grossProfit;

      monthData.push({
        product,
        grossProfit
      });
    });

    // 按毛利由高到低排序
    monthData.sort((a, b) => b.grossProfit - a.grossProfit);

    let cumulativeShare = 0;
    monthData.forEach((item, index) => {
      const contribution = (item.grossProfit / totalGrossProfit) * 100;
      cumulativeShare += contribution;

      let note = '';
      if (index === 0 && month === '2024-12') {
        note = '主要獲利產品';
      } else if (isForecast && index === 0) {
        note = '預測：持續為主要獲利產品';
      } else if (cumulativeShare > 80 && cumulativeShare - contribution <= 80) {
        note = '累計貢獻達80%';
      }

      data.push([
        month,
        item.product,
        Math.round(item.grossProfit),
        parseFloat(contribution.toFixed(1)),
        parseFloat(cumulativeShare.toFixed(1)),
        note
      ]);
    });
  });

  return data;
}

// 生成客戶分級分析 (ABC分析)
function generateCustomerABC() {
  const data = [['月份', '客戶', '營收(M NTD)', '營收佔比(%)', '累計佔比(%)', '分級', '註解']];

  months.forEach((month) => {
    let totalRevenue = 0;
    const monthData = [];

    customers.forEach((customer, cIndex) => {
      const baseRevenue = (5 - cIndex) * 70 + Math.random() * 30;
      const revenue = baseRevenue;
      totalRevenue += revenue;

      monthData.push({
        customer,
        revenue
      });
    });

    // 按營收由高到低排序
    monthData.sort((a, b) => b.revenue - a.revenue);

    let cumulativeShare = 0;
    monthData.forEach((item) => {
      const revenueShare = (item.revenue / totalRevenue) * 100;
      cumulativeShare += revenueShare;

      let grade = '';
      let note = '';
      if (cumulativeShare <= 60) {
        grade = 'A';
        note = '重點客戶，營收貢獻高';
      } else if (cumulativeShare <= 85) {
        grade = 'B';
        note = '一般客戶，穩定貢獻';
      } else {
        grade = 'C';
        note = '小型客戶，營收貢獻較低';
      }

      data.push([
        month,
        item.customer,
        Math.round(item.revenue),
        parseFloat(revenueShare.toFixed(1)),
        parseFloat(cumulativeShare.toFixed(1)),
        grade,
        note
      ]);
    });
  });

  return data;
}

// 生成產品組合分析
function generateProductMix() {
  const data = [['月份', '高毛利產品營收(M NTD)', '高毛利產品佔比(%)', '中毛利產品營收(M NTD)', '中毛利產品佔比(%)', '低毛利產品營收(M NTD)', '低毛利產品佔比(%)', '平均毛利率(%)', '註解']];

  months.forEach((month) => {
    const isForecast = isForecastMonth(month);

    const highMarginRevenue = 100 + Math.random() * 30;
    const midMarginRevenue = 130 + Math.random() * 50;
    const lowMarginRevenue = 80 + Math.random() * 25;
    const totalRevenue = highMarginRevenue + midMarginRevenue + lowMarginRevenue;

    const highShare = (highMarginRevenue / totalRevenue) * 100;
    const midShare = (midMarginRevenue / totalRevenue) * 100;
    const lowShare = (lowMarginRevenue / totalRevenue) * 100;

    const avgMargin = (highMarginRevenue * 35 + midMarginRevenue * 25 + lowMarginRevenue * 15) / totalRevenue;

    let note = '';
    if (month === '2024-12') {
      note = '年末高毛利產品比重增加';
    } else if (isForecast) {
      note = '預測：持續優化產品組合';
    }

    data.push([
      month,
      Math.round(highMarginRevenue),
      parseFloat(highShare.toFixed(1)),
      Math.round(midMarginRevenue),
      parseFloat(midShare.toFixed(1)),
      Math.round(lowMarginRevenue),
      parseFloat(lowShare.toFixed(1)),
      parseFloat(avgMargin.toFixed(1)),
      note
    ]);
  });

  return data;
}

// 生成BCG產品矩陣分析
function generateProductBCG() {
  const data = [['月份', '產品', '營收(M NTD)', '毛利率(%)', '毛利額(M NTD)', '註解']];

  months.forEach((month) => {
    const isForecast = isForecastMonth(month);

    products.forEach((product, pIndex) => {
      // 生成不同產品的特性
      const baseRevenue = (pIndex + 1) * 60 + Math.random() * 30;
      const revenue = baseRevenue;

      // 不同產品有不同的毛利率分布
      let grossMarginRate;
      if (pIndex === 0) {
        // 產品A: 明星產品 - 高營收高毛利
        grossMarginRate = 35 + Math.random() * 5;
      } else if (pIndex === 1) {
        // 產品B: 金牛產品 - 中高營收中毛利
        grossMarginRate = 28 + Math.random() * 4;
      } else if (pIndex === 2) {
        // 產品C: 問題產品 - 中營收低毛利
        grossMarginRate = 18 + Math.random() * 5;
      } else if (pIndex === 3) {
        // 產品D: 潛力產品 - 低營收高毛利
        grossMarginRate = 32 + Math.random() * 4;
      } else {
        // 產品E: 瘦狗產品 - 低營收低毛利
        grossMarginRate = 15 + Math.random() * 5;
      }

      const grossProfit = revenue * (grossMarginRate / 100);

      let note = '';
      if (pIndex === 0) {
        note = '明星產品：高營收高毛利';
      } else if (pIndex === 1) {
        note = '金牛產品：穩定貢獻';
      } else if (pIndex === 2) {
        note = '問題產品：需改善毛利';
      } else if (pIndex === 3) {
        note = '潛力產品：可擴大規模';
      } else {
        note = '瘦狗產品：考慮策略調整';
      }

      if (isForecast) {
        note = note + '（預測）';
      }

      data.push([
        month,
        product,
        Math.round(revenue),
        parseFloat(grossMarginRate.toFixed(1)),
        Math.round(grossProfit),
        note
      ]);
    });
  });

  return data;
}

// 創建工作簿並保存
const workbook = XLSX.utils.book_new();

const productSalesData = generateProductSales();
const ws1 = XLSX.utils.aoa_to_sheet(productSalesData);
XLSX.utils.book_append_sheet(workbook, ws1, '產品別銷售分析');

const customerSalesData = generateCustomerSales();
const ws2 = XLSX.utils.aoa_to_sheet(customerSalesData);
XLSX.utils.book_append_sheet(workbook, ws2, '客戶別銷售分析');

const profitContributionData = generateProductProfitContribution();
const ws3 = XLSX.utils.aoa_to_sheet(profitContributionData);
XLSX.utils.book_append_sheet(workbook, ws3, '產品毛利貢獻');

const customerABCData = generateCustomerABC();
const ws4 = XLSX.utils.aoa_to_sheet(customerABCData);
XLSX.utils.book_append_sheet(workbook, ws4, '客戶分級分析');

const productMixData = generateProductMix();
const ws5 = XLSX.utils.aoa_to_sheet(productMixData);
XLSX.utils.book_append_sheet(workbook, ws5, '產品組合分析');

const productBCGData = generateProductBCG();
const ws6 = XLSX.utils.aoa_to_sheet(productBCGData);
XLSX.utils.book_append_sheet(workbook, ws6, 'BCG產品矩陣');

const filePath = path.join(__dirname, 'dashboard/public/產品與客戶銷售獲利分析.xlsx');
XLSX.writeFile(workbook, filePath);

console.log('✅ 產品與客戶銷售獲利分析檔案已生成！');
console.log(`檔案位置: ${filePath}`);
console.log('\n包含以下工作表:');
console.log('1. 產品別銷售分析 - 各產品的營收、成本、毛利表現');
console.log('2. 客戶別銷售分析 - 各客戶的營收佔比和獲利狀況');
console.log('3. 產品毛利貢獻 - 各產品對總毛利的貢獻分析');
console.log('4. 客戶分級分析 - ABC客戶分類及重要性分析');
console.log('5. 產品組合分析 - 高中低毛利產品組合趨勢');
console.log('6. BCG產品矩陣 - 產品營收與毛利率矩陣分析');
