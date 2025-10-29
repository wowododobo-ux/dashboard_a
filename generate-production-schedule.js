const XLSX = require('xlsx');
const path = require('path');

/**
 * 生成生產排程達成率數據
 * 包含每週的計畫產量、實際產量、達成率
 * 按產品線和生產區域分組
 */

// 生成 2022-2025 年的週次數據
function generateWeeks(startYear = 2022, endYear = 2025) {
  const weeks = [];

  for (let year = startYear; year <= endYear; year++) {
    // 每年52週
    const weeksInYear = year === 2025 ? 43 : 52; // 2025年只到10月 (~43週)

    for (let week = 1; week <= weeksInYear; week++) {
      const weekLabel = `${year}-W${String(week).padStart(2, '0')}`;
      weeks.push({
        year,
        week,
        weekLabel
      });
    }
  }

  return weeks;
}

// 生成按產品線分組的數據
function generateProductLineData() {
  const weeks = generateWeeks();
  const productLines = ['5nm', '7nm', '12nm', '16nm'];
  const data = [];

  weeks.forEach((weekInfo, index) => {
    productLines.forEach(productLine => {
      // 基礎產量（根據製程節點不同而不同）
      const baseCapacity = {
        '5nm': 1200,
        '7nm': 1800,
        '12nm': 2400,
        '16nm': 2000
      }[productLine];

      // 計畫產量：基礎產量 + 趨勢增長 + 季節性波動
      const trend = index * 2; // 緩慢增長
      const seasonal = Math.sin(index / 4) * 100; // 季節性波動
      const planned = Math.round(baseCapacity + trend + seasonal);

      // 實際產量：計畫產量 * 達成率 (85%-105%)
      const achievementRate = 0.85 + Math.random() * 0.20; // 85% ~ 105%
      const actual = Math.round(planned * achievementRate);

      // 達成率百分比
      const achievementPercent = (actual / planned * 100).toFixed(1);

      // 偶爾添加註解（達成率異常時）
      let note = null;
      if (achievementRate < 0.90) {
        const reasons = [
          '設備故障導致產能下降',
          '原材料供應延遲',
          '良率異常，增加重工時間',
          '人員短缺影響產線效率'
        ];
        note = reasons[Math.floor(Math.random() * reasons.length)];
      } else if (achievementRate > 1.02) {
        const reasons = [
          '優化製程流程提升效率',
          '加班趕工超額完成',
          '設備維護後效能提升',
          '良率改善縮短週期時間'
        ];
        note = reasons[Math.floor(Math.random() * reasons.length)];
      }

      data.push({
        週次: weekInfo.weekLabel,
        年份: weekInfo.year,
        週數: weekInfo.week,
        產品線: productLine,
        計畫產量: planned,
        實際產量: actual,
        達成率: parseFloat(achievementPercent),
        差異: actual - planned,
        註解: note || ''
      });
    });
  });

  return data;
}

// 生成按生產區域分組的數據
function generateAreaData() {
  const weeks = generateWeeks();
  const areas = ['A區', 'B區', 'C區'];
  const data = [];

  weeks.forEach((weekInfo, index) => {
    areas.forEach(area => {
      // 基礎產量（根據區域不同而不同）
      const baseCapacity = {
        'A區': 2200,
        'B區': 2500,
        'C區': 1800
      }[area];

      // 計畫產量
      const trend = index * 3;
      const seasonal = Math.sin(index / 5) * 150;
      const planned = Math.round(baseCapacity + trend + seasonal);

      // 實際產量
      const achievementRate = 0.88 + Math.random() * 0.17; // 88% ~ 105%
      const actual = Math.round(planned * achievementRate);

      // 達成率百分比
      const achievementPercent = (actual / planned * 100).toFixed(1);

      // 偶爾添加註解
      let note = null;
      if (achievementRate < 0.92) {
        note = `${area}產線效率低於預期`;
      } else if (achievementRate > 1.01) {
        note = `${area}超額完成生產目標`;
      }

      data.push({
        週次: weekInfo.weekLabel,
        年份: weekInfo.year,
        週數: weekInfo.week,
        生產區域: area,
        計畫產量: planned,
        實際產量: actual,
        達成率: parseFloat(achievementPercent),
        差異: actual - planned,
        註解: note || ''
      });
    });
  });

  return data;
}

// 生成綜合數據（不分組）
function generateOverallData() {
  const weeks = generateWeeks();
  const data = [];

  weeks.forEach((weekInfo, index) => {
    const baseCapacity = 7500;
    const trend = index * 8;
    const seasonal = Math.sin(index / 4) * 400;
    const planned = Math.round(baseCapacity + trend + seasonal);

    const achievementRate = 0.90 + Math.random() * 0.15; // 90% ~ 105%
    const actual = Math.round(planned * achievementRate);

    const achievementPercent = (actual / planned * 100).toFixed(1);

    let note = null;
    if (achievementRate < 0.95) {
      note = '整體產能利用率偏低，需檢視各產線狀況';
    } else if (achievementRate > 1.02) {
      note = '整體產能表現優異';
    }

    data.push({
      週次: weekInfo.weekLabel,
      年份: weekInfo.year,
      週數: weekInfo.week,
      計畫產量: planned,
      實際產量: actual,
      達成率: parseFloat(achievementPercent),
      差異: actual - planned,
      註解: note || ''
    });
  });

  return data;
}

// 主函數：生成Excel文件
function generateExcelFile() {
  console.log('開始生成生產排程達成率數據...');

  const workbook = XLSX.utils.book_new();

  // 工作表1：按產品線分組
  const productLineData = generateProductLineData();
  const ws1 = XLSX.utils.json_to_sheet(productLineData);
  XLSX.utils.book_append_sheet(workbook, ws1, '按產品線');
  console.log(`✓ 生成按產品線數據：${productLineData.length} 筆記錄`);

  // 工作表2：按生產區域分組
  const areaData = generateAreaData();
  const ws2 = XLSX.utils.json_to_sheet(areaData);
  XLSX.utils.book_append_sheet(workbook, ws2, '按生產區域');
  console.log(`✓ 生成按生產區域數據：${areaData.length} 筆記錄`);

  // 工作表3：整體數據
  const overallData = generateOverallData();
  const ws3 = XLSX.utils.json_to_sheet(overallData);
  XLSX.utils.book_append_sheet(workbook, ws3, '整體數據');
  console.log(`✓ 生成整體數據：${overallData.length} 筆記錄`);

  // 寫入文件
  const outputPath = path.join(__dirname, 'dashboard', 'public', '生產排程達成率.xlsx');
  XLSX.writeFile(workbook, outputPath);
  console.log(`\n✅ Excel文件已生成：${outputPath}`);

  console.log('\n數據範圍：');
  console.log(`  - 時間範圍：2022-W01 ~ 2025-W43`);
  console.log(`  - 產品線：5nm, 7nm, 12nm, 16nm`);
  console.log(`  - 生產區域：A區, B區, C區`);
  console.log(`  - 數據欄位：週次、計畫產量、實際產量、達成率、差異、註解`);
}

// 執行
generateExcelFile();
