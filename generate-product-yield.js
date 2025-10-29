const XLSX = require('xlsx');
const path = require('path');

/**
 * 生成產品別良率分析數據
 * 按生產區域和產品線分組，顯示各月良率
 */

// 生成月份列表
function generateMonths(startYear = 2022, endYear = 2025) {
  const months = [];

  for (let year = startYear; year <= endYear; year++) {
    const maxMonth = year === 2025 ? 10 : 12; // 2025年只到10月

    for (let month = 1; month <= maxMonth; month++) {
      months.push({
        year,
        month,
        monthLabel: `${year}-${String(month).padStart(2, '0')}`
      });
    }
  }

  return months;
}

// 生成產品別良率數據
function generateProductYieldData() {
  const months = generateMonths();
  const areas = ['A區', 'B區', 'C區'];
  const productLines = ['5nm', '7nm', '12nm', '16nm'];

  // 各產品線的基礎良率和目標良率
  const baseYield = {
    '5nm': { base: 93.5, target: 95.0, variance: 3 },
    '7nm': { base: 95.2, target: 96.0, variance: 2.5 },
    '12nm': { base: 96.8, target: 97.5, variance: 2 },
    '16nm': { base: 97.5, target: 98.0, variance: 1.5 }
  };

  // 各區域的效率係數
  const areaEfficiency = {
    'A區': 1.02,  // A區稍好
    'B區': 1.0,   // B區標準
    'C區': 0.98   // C區稍差
  };

  const data = [];

  months.forEach((monthInfo, index) => {
    areas.forEach(area => {
      productLines.forEach(productLine => {
        const config = baseYield[productLine];

        // 計算良率：基礎良率 * 區域係數 + 時間趨勢 + 隨機波動
        const timeTrend = index * 0.02; // 隨時間緩慢提升
        const seasonalVariation = Math.sin(index / 6) * 0.5; // 季節性波動
        const randomVariation = (Math.random() - 0.5) * config.variance;

        const yield_value = Math.min(
          99.5, // 最高不超過99.5%
          Math.max(
            85, // 最低不低於85%
            config.base * areaEfficiency[area] + timeTrend + seasonalVariation + randomVariation
          )
        );

        // 計算良品數和總產出
        const baseOutput = {
          '5nm': 1800,
          '7nm': 2200,
          '12nm': 2800,
          '16nm': 2400
        }[productLine];

        const totalOutput = Math.round(baseOutput * (0.95 + Math.random() * 0.1));
        const goodOutput = Math.round(totalOutput * (yield_value / 100));

        // 添加註解（當良率異常時）
        let note = '';
        if (yield_value < config.target - 2) {
          const reasons = [
            '設備老化影響良率',
            '原材料批次問題',
            '環境溫濕度異常',
            '操作人員訓練需加強',
            '製程參數需要調整'
          ];
          note = reasons[Math.floor(Math.random() * reasons.length)];
        } else if (yield_value > config.target + 1) {
          const reasons = [
            '製程優化見效',
            '設備維護改善',
            '人員熟練度提升',
            '品質管控強化'
          ];
          note = reasons[Math.floor(Math.random() * reasons.length)];
        }

        data.push({
          月份: monthInfo.monthLabel,
          年份: monthInfo.year,
          月: monthInfo.month,
          生產區域: area,
          產品線: productLine,
          良率: parseFloat(yield_value.toFixed(2)),
          目標良率: config.target,
          差異: parseFloat((yield_value - config.target).toFixed(2)),
          良品數: goodOutput,
          總產出: totalOutput,
          不良品數: totalOutput - goodOutput,
          註解: note
        });
      });
    });
  });

  return data;
}

// 生成最新月份摘要數據（用於表格顯示）
function generateLatestMonthSummary(fullData) {
  // 找到最新月份
  const latestMonth = fullData.reduce((latest, item) => {
    return item.月份 > latest ? item.月份 : latest;
  }, '2022-01');

  // 篩選最新月份的數據
  const latestData = fullData.filter(item => item.月份 === latestMonth);

  // 按區域和產品線組織
  const summary = [];
  const areas = ['A區', 'B區', 'C區'];
  const productLines = ['5nm', '7nm', '12nm', '16nm'];

  productLines.forEach(productLine => {
    const row = {
      產品線: productLine,
      月份: latestMonth
    };

    areas.forEach(area => {
      const areaData = latestData.find(
        item => item.生產區域 === area && item.產品線 === productLine
      );

      if (areaData) {
        row[`${area}良率`] = areaData.良率;
        row[`${area}良品數`] = areaData.良品數;
        row[`${area}總產出`] = areaData.總產出;
      }
    });

    // 計算整體平均良率
    const productData = latestData.filter(item => item.產品線 === productLine);
    const avgYield = productData.reduce((sum, item) => sum + item.良率, 0) / productData.length;
    const totalGood = productData.reduce((sum, item) => sum + item.良品數, 0);
    const totalOutput = productData.reduce((sum, item) => sum + item.總產出, 0);

    row['平均良率'] = parseFloat(avgYield.toFixed(2));
    row['總良品數'] = totalGood;
    row['總產出'] = totalOutput;
    row['目標良率'] = productData[0]?.目標良率 || 95;

    summary.push(row);
  });

  return summary;
}

// 主函數：生成Excel文件
function generateExcelFile() {
  console.log('開始生成產品別良率分析數據...');

  const workbook = XLSX.utils.book_new();

  // 工作表1：完整數據（按月、區域、產品線）
  const fullData = generateProductYieldData();
  const ws1 = XLSX.utils.json_to_sheet(fullData);
  XLSX.utils.book_append_sheet(workbook, ws1, '產品別良率明細');
  console.log(`✓ 生成產品別良率明細：${fullData.length} 筆記錄`);

  // 工作表2：最新月份摘要
  const summary = generateLatestMonthSummary(fullData);
  const ws2 = XLSX.utils.json_to_sheet(summary);
  XLSX.utils.book_append_sheet(workbook, ws2, '最新月份摘要');
  console.log(`✓ 生成最新月份摘要：${summary.length} 筆記錄`);

  // 寫入文件
  const outputPath = path.join(__dirname, 'dashboard', 'public', '產品別良率分析.xlsx');
  XLSX.writeFile(workbook, outputPath);
  console.log(`\n✅ Excel文件已生成：${outputPath}`);

  console.log('\n數據範圍：');
  console.log(`  - 時間範圍：2022-01 ~ 2025-10`);
  console.log(`  - 生產區域：A區, B區, C區`);
  console.log(`  - 產品線：5nm, 7nm, 12nm, 16nm`);
  console.log(`  - 數據欄位：月份、生產區域、產品線、良率、目標良率、差異、良品數、總產出、不良品數、註解`);
}

// 執行
generateExcelFile();
