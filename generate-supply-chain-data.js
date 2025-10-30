import XLSX from 'xlsx';

/**
 * 生成供應鏈與原材料指標資料
 * 包含：材料庫存水平、供應商績效
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

// 1. 生成材料庫存水平資料
function generateMaterialInventoryData() {
  const months = generateMonths();
  const materials = [
    '矽晶圓',
    '光阻劑',
    '特殊氣體',
    '化學品',
    '靶材',
    '封裝材料'
  ];

  // 各材料的基準庫存天數（理想值約30-45天）
  const baseDays = {
    '矽晶圓': 35,
    '光阻劑': 40,
    '特殊氣體': 30,
    '化學品': 45,
    '靶材': 38,
    '封裝材料': 42
  };

  const data = [];

  months.forEach((month, index) => {
    materials.forEach(material => {
      // 庫存天數有小幅優化趨勢（降低庫存成本）
      const inventoryDays = generateTrendValue(
        baseDays[material],
        index,
        -0.02,  // 年降 2%（優化庫存）
        0.05,   // 季節性波動
        0.08    // 8% 變異
      );

      data.push({
        '月份': month,
        '材料名稱': material,
        '庫存天數': Math.max(20, Math.min(60, inventoryDays)) // 限制在 20-60 天
      });
    });
  });

  return data;
}

// 2. 生成供應商績效資料
function generateSupplierPerformanceData() {
  const months = generateMonths();
  const suppliers = [
    '供應商A',
    '供應商B',
    '供應商C',
    '供應商D',
    '供應商E'
  ];

  // 基準分數
  const baseScores = {
    '供應商A': { 綜合評分: 88, 準時交貨率: 92, 質量合格率: 96 },
    '供應商B': { 綜合評分: 85, 準時交貨率: 90, 質量合格率: 94 },
    '供應商C': { 綜合評分: 90, 準時交貨率: 95, 質量合格率: 97 },
    '供應商D': { 綜合評分: 82, 準時交貨率: 88, 質量合格率: 92 },
    '供應商E': { 綜合評分: 86, 準時交貨率: 91, 質量合格率: 95 }
  };

  const data = [];

  months.forEach((month, index) => {
    suppliers.forEach(supplier => {
      // 各供應商都有小幅提升
      const 綜合評分 = generateTrendValue(
        baseScores[supplier].綜合評分,
        index,
        0.025,  // 年成長 2.5%
        0.02,   // 小幅季節性
        0.03    // 3% 變異
      );

      const 準時交貨率 = generateTrendValue(
        baseScores[supplier].準時交貨率,
        index,
        0.02,   // 年成長 2%
        0.03,   // 季節性
        0.04    // 4% 變異
      );

      const 質量合格率 = generateTrendValue(
        baseScores[supplier].質量合格率,
        index,
        0.015,  // 年成長 1.5%
        0.015,  // 小幅季節性
        0.025   // 2.5% 變異
      );

      data.push({
        '月份': month,
        '供應商': supplier,
        '綜合評分': Math.max(70, Math.min(100, 綜合評分)),
        '準時交貨率(%)': Math.max(75, Math.min(100, 準時交貨率)),
        '質量合格率(%)': Math.max(85, Math.min(100, 質量合格率))
      });
    });
  });

  return data;
}

// 主函數
function generateSupplyChainExcel() {
  console.log('開始生成供應鏈與原材料指標資料...');

  // 生成兩個工作表的資料
  const materialData = generateMaterialInventoryData();
  const supplierData = generateSupplierPerformanceData();

  console.log(`✓ 材料庫存水平: ${materialData.length} 筆記錄`);
  console.log(`✓ 供應商績效: ${supplierData.length} 筆記錄`);

  // 創建工作簿
  const workbook = XLSX.utils.book_new();

  // 添加工作表1: 材料庫存水平
  const ws1 = XLSX.utils.json_to_sheet(materialData);
  XLSX.utils.book_append_sheet(workbook, ws1, '材料庫存水平');

  // 添加工作表2: 供應商績效
  const ws2 = XLSX.utils.json_to_sheet(supplierData);
  XLSX.utils.book_append_sheet(workbook, ws2, '供應商績效');

  // 寫入檔案
  XLSX.writeFile(workbook, './dashboard/public/供應鏈與原材料.xlsx');

  console.log('\n✅ Excel 檔案已生成：./dashboard/public/供應鏈與原材料.xlsx');
  console.log('\n資料摘要：');
  console.log('  - 時間範圍：2022-01 到 2025-12 (48個月)');
  console.log('  - 關鍵材料：6種（矽晶圓、光阻劑、特殊氣體、化學品、靶材、封裝材料）');
  console.log('  - 供應商：5家主要供應商');
  console.log('  - 績效指標：綜合評分、準時交貨率、質量合格率');
}

// 執行
generateSupplyChainExcel();
