const XLSX = require('xlsx');
const path = require('path');

/**
 * 生成機台健康度數據
 * 用於預測性維護分析
 */

// 機台類型和名稱
const machineTypes = {
  T: { name: 'Tester', count: 15, baseHealth: 88 },      // 測試機
  F: { name: 'Furnace', count: 12, baseHealth: 85 },     // 高溫爐
  E: { name: 'Etcher', count: 18, baseHealth: 90 },      // 蝕刻機
  C: { name: 'CVD', count: 10, baseHealth: 87 },         // 化學氣相沉積
  L: { name: 'Litho', count: 8, baseHealth: 92 }         // 光刻機
};

// 生成機台健康度數據
function generateMachineHealthData() {
  const data = [];
  let machineId = 1;

  Object.entries(machineTypes).forEach(([prefix, config]) => {
    for (let i = 1; i <= config.count; i++) {
      const id = `${prefix}-${String(machineId).padStart(3, '0')}`;
      machineId++;

      // 基礎健康度 + 隨機變化
      // 大部分機台健康度在 85-95%
      // 少數機台在 75-85% (高風險)
      // 極少數在 95%+ (優秀)
      const isHighRisk = Math.random() < 0.15; // 15% 概率高風險
      const isExcellent = Math.random() < 0.1;  // 10% 概率優秀

      let healthScore;
      if (isHighRisk) {
        healthScore = config.baseHealth - 10 + Math.random() * 8; // 75-83%
      } else if (isExcellent) {
        healthScore = config.baseHealth + 5 + Math.random() * 5; // 93-98%
      } else {
        healthScore = config.baseHealth + (Math.random() - 0.5) * 6; // 85-91%
      }

      // 運行時數 (小時)
      const runningHours = Math.floor(Math.random() * 50000) + 10000;

      // 上次維護時間 (天前)
      const daysSinceLastMaintenance = Math.floor(Math.random() * 90) + 1;

      // 預測剩餘壽命 (天)
      const predictedLifespan = healthScore > 90
        ? Math.floor(Math.random() * 180) + 120 // 120-300天
        : healthScore > 85
        ? Math.floor(Math.random() * 120) + 60  // 60-180天
        : Math.floor(Math.random() * 60) + 10;  // 10-70天

      // 故障風險等級
      let riskLevel;
      if (healthScore >= 90) {
        riskLevel = '低風險';
      } else if (healthScore >= 85) {
        riskLevel = '中風險';
      } else if (healthScore >= 80) {
        riskLevel = '高風險';
      } else {
        riskLevel = '極高風險';
      }

      // 維護建議
      let maintenanceSuggestion;
      if (healthScore < 80) {
        maintenanceSuggestion = '立即安排維護';
      } else if (healthScore < 85) {
        maintenanceSuggestion = '24小時內維護';
      } else if (daysSinceLastMaintenance > 60) {
        maintenanceSuggestion = '定期保養到期';
      } else {
        maintenanceSuggestion = '繼續監控';
      }

      // 主要問題（對於低健康度機台）
      const issues = [];
      if (healthScore < 85) {
        const possibleIssues = [
          '溫度控制異常',
          '壓力波動',
          '真空度下降',
          '校準偏移',
          '零件磨損',
          '感測器老化',
          '潤滑不足',
          '電氣異常'
        ];
        const issueCount = healthScore < 80 ? 2 : 1;
        for (let j = 0; j < issueCount; j++) {
          const issue = possibleIssues[Math.floor(Math.random() * possibleIssues.length)];
          if (!issues.includes(issue)) {
            issues.push(issue);
          }
        }
      }

      data.push({
        機台編號: id,
        機台類型: config.name,
        健康度: parseFloat(healthScore.toFixed(1)),
        風險等級: riskLevel,
        運行時數: runningHours,
        上次維護: `${daysSinceLastMaintenance}天前`,
        預測壽命: `${predictedLifespan}天`,
        維護建議: maintenanceSuggestion,
        主要問題: issues.join('; ') || '無',
        生產區域: ['A區', 'B區', 'C區'][Math.floor(Math.random() * 3)],
        負責人: ['張工程師', '李工程師', '王工程師', '陳工程師'][Math.floor(Math.random() * 4)]
      });
    }
  });

  // 按健康度排序（從低到高）
  data.sort((a, b) => a.健康度 - b.健康度);

  return data;
}

// 生成摘要統計
function generateSummaryStats(data) {
  const summary = {
    總機台數: data.length,
    極高風險: data.filter(d => d.健康度 < 80).length,
    高風險: data.filter(d => d.健康度 >= 80 && d.健康度 < 85).length,
    中風險: data.filter(d => d.健康度 >= 85 && d.健康度 < 90).length,
    低風險: data.filter(d => d.健康度 >= 90).length,
    平均健康度: parseFloat((data.reduce((sum, d) => sum + d.健康度, 0) / data.length).toFixed(1)),
    需要立即維護: data.filter(d => d.維護建議 === '立即安排維護').length,
    需要24小時內維護: data.filter(d => d.維護建議 === '24小時內維護').length,
    更新時間: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
  };

  return [summary];
}

// 主函數：生成Excel文件
function generateExcelFile() {
  console.log('開始生成機台健康度數據...');

  const workbook = XLSX.utils.book_new();

  // 工作表1：機台明細
  const machineData = generateMachineHealthData();
  const ws1 = XLSX.utils.json_to_sheet(machineData);
  XLSX.utils.book_append_sheet(workbook, ws1, '機台健康度明細');
  console.log(`✓ 生成機台健康度明細：${machineData.length} 台機台`);

  // 工作表2：摘要統計
  const summary = generateSummaryStats(machineData);
  const ws2 = XLSX.utils.json_to_sheet(summary);
  XLSX.utils.book_append_sheet(workbook, ws2, '摘要統計');
  console.log(`✓ 生成摘要統計`);

  // 寫入文件
  const outputPath = path.join(__dirname, 'dashboard', 'public', '機台健康度.xlsx');
  XLSX.writeFile(workbook, outputPath);
  console.log(`\n✅ Excel文件已生成：${outputPath}`);

  console.log('\n數據統計：');
  console.log(`  - 總機台數：${summary[0].總機台數}`);
  console.log(`  - 極高風險：${summary[0].極高風險} 台`);
  console.log(`  - 高風險：${summary[0].高風險} 台`);
  console.log(`  - 中風險：${summary[0].中風險} 台`);
  console.log(`  - 低風險：${summary[0].低風險} 台`);
  console.log(`  - 平均健康度：${summary[0].平均健康度}%`);
  console.log(`  - 需要立即維護：${summary[0].需要立即維護} 台`);
  console.log(`  - 需要24小時內維護：${summary[0].需要24小時內維護} 台`);
}

// 執行
generateExcelFile();
