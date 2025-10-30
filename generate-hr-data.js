import XLSX from 'xlsx';

/**
 * 生成人力資源指標資料
 * 包含：員工保留率、員工績效指標
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

// 1. 生成員工保留率資料
function generateEmployeeRetentionData() {
  const months = generateMonths();
  const departments = [
    '研發部門',
    '製造部門',
    '品質部門',
    '業務部門',
    '管理部門'
  ];

  // 各部門的基準保留率
  const baseRetention = {
    '研發部門': 92,
    '製造部門': 89,
    '品質部門': 90,
    '業務部門': 88,
    '管理部門': 94
  };

  // 關鍵人才保留率通常高於一般員工
  const keyTalentBonus = {
    '研發部門': 3,
    '製造部門': 2,
    '品質部門': 2.5,
    '業務部門': 2,
    '管理部門': 2
  };

  const data = [];

  months.forEach((month, index) => {
    departments.forEach(department => {
      // 保留率有小幅提升趨勢
      const 保留率 = generateTrendValue(
        baseRetention[department],
        index,
        0.01,   // 年成長 1%
        0.015,  // 季節性波動
        0.02    // 2% 變異
      );

      const 關鍵人才保留率 = Math.min(100, 保留率 + keyTalentBonus[department]);

      data.push({
        '月份': month,
        '部門': department,
        '保留率(%)': Math.max(85, Math.min(100, 保留率)),
        '關鍵人才保留率(%)': Math.max(90, Math.min(100, 關鍵人才保留率))
      });
    });
  });

  return data;
}

// 2. 生成員工績效指標資料
function generateEmployeePerformanceData() {
  const months = generateMonths();
  const departments = [
    '研發部門',
    '製造部門',
    '品質部門',
    '業務部門',
    '管理部門'
  ];

  // 各部門的基準績效分數
  const basePerformance = {
    '研發部門': 82,
    '製造部門': 80,
    '品質部門': 83,
    '業務部門': 81,
    '管理部門': 84
  };

  const data = [];

  months.forEach((month, index) => {
    departments.forEach(department => {
      // 績效分數有小幅提升
      const 平均績效分數 = generateTrendValue(
        basePerformance[department],
        index,
        0.015,  // 年成長 1.5%
        0.02,   // 季節性
        0.03    // 3% 變異
      );

      // 培訓完成率
      const 培訓完成率 = generateTrendValue(
        85,
        index,
        0.03,   // 年成長 3%
        0.04,   // 季節性（年底較高）
        0.05    // 5% 變異
      );

      // 招聘完成率
      const 招聘完成率 = generateTrendValue(
        82,
        index,
        0.02,   // 年成長 2%
        0.06,   // 較大季節性（某些季度招聘較多）
        0.08    // 8% 變異
      );

      data.push({
        '月份': month,
        '部門': department,
        '平均績效分數': Math.max(70, Math.min(95, 平均績效分數)),
        '培訓完成率(%)': Math.max(75, Math.min(100, 培訓完成率)),
        '招聘完成率(%)': Math.max(70, Math.min(100, 招聘完成率))
      });
    });
  });

  return data;
}

// 3. 生成員工統計資料（額外工作表）
function generateEmployeeStatisticsData() {
  const months = generateMonths();
  const data = [];

  months.forEach((month, index) => {
    // 員工總數逐步增長
    const 員工總數 = Math.round(5000 * (1 + index * 0.008) + Math.random() * 100);

    // 各類別人員
    const 研發人員 = Math.round(員工總數 * 0.25);
    const 製造人員 = Math.round(員工總數 * 0.45);
    const 管理人員 = Math.round(員工總數 * 0.10);
    const 其他人員 = 員工總數 - 研發人員 - 製造人員 - 管理人員;

    // 新進與離職
    const 當月新進 = Math.round(員工總數 * (0.02 + Math.random() * 0.01));
    const 當月離職 = Math.round(員工總數 * (0.015 + Math.random() * 0.008));

    data.push({
      '月份': month,
      '員工總數': 員工總數,
      '研發人員': 研發人員,
      '製造人員': 製造人員,
      '管理人員': 管理人員,
      '其他人員': 其他人員,
      '當月新進': 當月新進,
      '當月離職': 當月離職,
      '淨增加': 當月新進 - 當月離職
    });
  });

  return data;
}

// 主函數
function generateHRExcel() {
  console.log('開始生成人力資源指標資料...');

  // 生成三個工作表的資料
  const retentionData = generateEmployeeRetentionData();
  const performanceData = generateEmployeePerformanceData();
  const statisticsData = generateEmployeeStatisticsData();

  console.log(`✓ 員工保留率: ${retentionData.length} 筆記錄`);
  console.log(`✓ 員工績效指標: ${performanceData.length} 筆記錄`);
  console.log(`✓ 員工統計: ${statisticsData.length} 筆記錄`);

  // 創建工作簿
  const workbook = XLSX.utils.book_new();

  // 添加工作表1: 員工保留率
  const ws1 = XLSX.utils.json_to_sheet(retentionData);
  XLSX.utils.book_append_sheet(workbook, ws1, '員工保留率');

  // 添加工作表2: 員工績效指標
  const ws2 = XLSX.utils.json_to_sheet(performanceData);
  XLSX.utils.book_append_sheet(workbook, ws2, '員工績效指標');

  // 添加工作表3: 員工統計
  const ws3 = XLSX.utils.json_to_sheet(statisticsData);
  XLSX.utils.book_append_sheet(workbook, ws3, '員工統計');

  // 寫入檔案
  XLSX.writeFile(workbook, './dashboard/public/人力資源.xlsx');

  console.log('\n✅ Excel 檔案已生成：./dashboard/public/人力資源.xlsx');
  console.log('\n資料摘要：');
  console.log('  - 時間範圍：2022-01 到 2025-12 (48個月)');
  console.log('  - 部門：研發、製造、品質、業務、管理（5個部門）');
  console.log('  - 保留率指標：一般保留率、關鍵人才保留率');
  console.log('  - 績效指標：績效分數、培訓完成率、招聘完成率');
  console.log('  - 員工統計：總數、分類、新進/離職動態');
}

// 執行
generateHRExcel();
