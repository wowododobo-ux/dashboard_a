import XLSX from 'xlsx';

/**
 * 生成風險管理指標資料
 * 包含：營運風險指標、EHS績效
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

// 1. 生成營運風險指標資料
function generateOperationalRiskData() {
  const months = generateMonths();
  const riskCategories = [
    { 類別: '設備故障', 基準數量: 8, 高風險比例: 0.15 },
    { 類別: '供應鏈中斷', 基準數量: 5, 高風險比例: 0.20 },
    { 類別: '資訊安全', 基準數量: 6, 高風險比例: 0.12 },
    { 類別: '品質異常', 基準數量: 10, 高風險比例: 0.10 },
    { 類別: '環境合規', 基準數量: 4, 高風險比例: 0.08 }
  ];

  const riskLevels = ['低', '中', '高', '極高'];
  const data = [];

  months.forEach((month, index) => {
    riskCategories.forEach(category => {
      // 風險數量隨時間逐漸減少（風險管理改善）
      const 總數量 = Math.round(
        generateTrendValue(
          category.基準數量,
          index,
          -0.15,  // 年降 15%（風險管理改善）
          0.1,    // 季節性波動
          0.2     // 變異
        )
      );

      // 分配到各風險等級
      const 極高數量 = Math.max(0, Math.round(總數量 * category.高風險比例 * 0.3));
      const 高數量 = Math.max(0, Math.round(總數量 * category.高風險比例 * 0.7));
      const 中數量 = Math.round(總數量 * 0.3);
      const 低數量 = Math.max(0, 總數量 - 極高數量 - 高數量 - 中數量);

      // 為每個風險等級創建記錄
      const riskCounts = { 低: 低數量, 中: 中數量, 高: 高數量, 極高: 極高數量 };

      Object.entries(riskCounts).forEach(([level, count]) => {
        for (let i = 0; i < count; i++) {
          data.push({
            '月份': month,
            '風險類別': category.類別,
            '風險等級': level,
            '風險描述': `${category.類別} - ${level}風險事件`,
            '影響程度': level === '極高' ? '嚴重' : level === '高' ? '高' : level === '中' ? '中等' : '輕微',
            '處理狀態': Math.random() > 0.2 ? '已處理' : '處理中'
          });
        }
      });
    });
  });

  return data;
}

// 2. 生成EHS績效資料
function generateEHSPerformanceData() {
  const months = generateMonths();
  const categories = [
    { 指標: '環境管理', 基準達成率: 96, 基準事故: 0.5 },
    { 指標: '職業健康', 基準達成率: 97, 基準事故: 0.3 },
    { 指標: '安全管理', 基準達成率: 95, 基準事故: 1.2 }
  ];

  const data = [];

  months.forEach((month, index) => {
    categories.forEach(category => {
      // 達成率逐步提升
      const 達成率 = generateTrendValue(
        category.基準達成率,
        index,
        0.015,  // 年成長 1.5%
        0.01,   // 小幅季節性
        0.015   // 1.5% 變異
      );

      // 事故數逐步降低
      const 事故數 = Math.max(0, Math.round(
        generateTrendValue(
          category.基準事故,
          index,
          -0.20,  // 年降 20%
          0.15,   // 季節性波動
          0.4     // 較大變異
        )
      ));

      // 培訓完成率
      const 培訓完成率 = generateTrendValue(
        92,
        index,
        0.02,   // 年成長 2%
        0.03,   // 季節性
        0.03    // 變異
      );

      // 稽核得分
      const 稽核得分 = generateTrendValue(
        88,
        index,
        0.015,  // 年成長 1.5%
        0.02,   // 季節性
        0.025   // 變異
      );

      data.push({
        '月份': month,
        'EHS指標': category.指標,
        '達成率(%)': Math.max(85, Math.min(105, 達成率)),
        '事故數': 事故數,
        '培訓完成率(%)': Math.max(80, Math.min(100, 培訓完成率)),
        '稽核得分': Math.max(75, Math.min(100, 稽核得分))
      });
    });
  });

  return data;
}

// 3. 生成風險事件統計（額外工作表）
function generateRiskStatistics() {
  const months = generateMonths();
  const data = [];

  months.forEach((month, index) => {
    // 風險事件總數逐步下降
    const 總風險數 = Math.round(
      generateTrendValue(35, index, -0.15, 0.1, 0.15)
    );

    const 極高風險數 = Math.max(0, Math.round(總風險數 * 0.05));
    const 高風險數 = Math.round(總風險數 * 0.15);
    const 中風險數 = Math.round(總風險數 * 0.30);
    const 低風險數 = 總風險數 - 極高風險數 - 高風險數 - 中風險數;

    // 處理率逐步提升
    const 處理率 = generateTrendValue(82, index, 0.03, 0.02, 0.03);

    // 平均處理天數逐步降低
    const 平均處理天數 = generateTrendValue(15, index, -0.10, 0.05, 0.1);

    data.push({
      '月份': month,
      '總風險數': 總風險數,
      '極高風險數': 極高風險數,
      '高風險數': 高風險數,
      '中風險數': 中風險數,
      '低風險數': 低風險數,
      '處理率(%)': Math.max(75, Math.min(100, 處理率)),
      '平均處理天數': Math.max(5, Math.round(平均處理天數))
    });
  });

  return data;
}

// 主函數
function generateRiskExcel() {
  console.log('開始生成風險管理指標資料...');

  // 生成三個工作表的資料
  const riskData = generateOperationalRiskData();
  const ehsData = generateEHSPerformanceData();
  const statsData = generateRiskStatistics();

  console.log(`✓ 營運風險指標: ${riskData.length} 筆記錄`);
  console.log(`✓ EHS績效: ${ehsData.length} 筆記錄`);
  console.log(`✓ 風險事件統計: ${statsData.length} 筆記錄`);

  // 創建工作簿
  const workbook = XLSX.utils.book_new();

  // 添加工作表1: 營運風險指標
  const ws1 = XLSX.utils.json_to_sheet(riskData);
  XLSX.utils.book_append_sheet(workbook, ws1, '營運風險指標');

  // 添加工作表2: EHS績效
  const ws2 = XLSX.utils.json_to_sheet(ehsData);
  XLSX.utils.book_append_sheet(workbook, ws2, 'EHS績效');

  // 添加工作表3: 風險事件統計
  const ws3 = XLSX.utils.json_to_sheet(statsData);
  XLSX.utils.book_append_sheet(workbook, ws3, '風險事件統計');

  // 寫入檔案
  XLSX.writeFile(workbook, './dashboard/public/風險管理.xlsx');

  console.log('\n✅ Excel 檔案已生成：./dashboard/public/風險管理.xlsx');
  console.log('\n資料摘要：');
  console.log('  - 時間範圍：2022-01 到 2025-12 (48個月)');
  console.log('  - 風險類別：設備故障、供應鏈中斷、資訊安全、品質異常、環境合規');
  console.log('  - 風險等級：低、中、高、極高');
  console.log('  - EHS指標：環境管理、職業健康、安全管理');
  console.log('  - 績效指標：達成率、事故數、培訓完成率、稽核得分');
}

// 執行
generateRiskExcel();
