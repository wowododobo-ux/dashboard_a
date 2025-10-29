const XLSX = require('xlsx');
const path = require('path');

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

// 技術節點
const techNodes = ['28nm', '16nm', '12nm', '7nm', '5nm'];
const productTypes = ['Logic', 'Memory', 'Mixed-Signal', 'RF', 'Power'];
const regions = ['北美', '歐洲', '亞洲', '其他'];

// 1. 生成晶圓良率數據（按技術節點與產品類型）
function generateWaferYield() {
  const data = [['月份', '技術節點', '產品類型', '良率(%)', '晶圓投入量', '合格晶圓量', '趨勢', '註解']];

  months.forEach((month, mIndex) => {
    const isForecast = isForecastMonth(month);

    techNodes.forEach((node, nIndex) => {
      productTypes.forEach((product, pIndex) => {
        // 先進製程良率較低，但隨時間提升
        const baseYield = 95 - (4 - nIndex) * 3 - Math.random() * 2;
        const trendFactor = mIndex * 0.08; // 隨時間改善
        const yield = Math.min(99, baseYield + trendFactor);

        const waferInput = Math.floor(1000 + Math.random() * 500 + mIndex * 10);
        const qualifiedWafers = Math.floor(waferInput * yield / 100);

        let trend = '';
        if (mIndex > 0) {
          const prevYield = Math.min(99, baseYield + (mIndex - 1) * 0.08);
          if (yield > prevYield + 0.5) trend = '↑ 改善';
          else if (yield < prevYield - 0.5) trend = '↓ 下降';
          else trend = '→ 持平';
        }

        let note = '';
        if (isForecast) {
          note = '預測：持續優化製程';
        } else if (node === '5nm' && month === '2024-06') {
          note = '新製程導入，良率提升顯著';
        } else if (yield > 96) {
          note = '良率優異';
        }

        data.push([
          month,
          node,
          product,
          parseFloat(yield.toFixed(2)),
          waferInput,
          qualifiedWafers,
          trend,
          note
        ]);
      });
    });
  });

  return data;
}

// 2. 生成產能利用率與設備效率(OEE)
function generateCapacityOEE() {
  const data = [['月份', '產線', '產能利用率(%)', '設備可用率(%)', '性能效率(%)', 'OEE(%)', '計劃產能', '實際產出', '註解']];

  const productionLines = ['Fab A', 'Fab B', 'Fab C', 'Fab D'];

  months.forEach((month, mIndex) => {
    const isForecast = isForecastMonth(month);

    productionLines.forEach((line, lIndex) => {
      // 產能利用率在80-95%之間波動
      const baseUtilization = 82 + Math.random() * 8 + mIndex * 0.05;
      const utilization = Math.min(95, baseUtilization);

      // 設備可用率
      const availability = 94 + Math.random() * 4;

      // 性能效率
      const performance = 90 + Math.random() * 7;

      // OEE = 可用率 × 性能效率 × 質量率(假設質量率98%)
      const qualityRate = 98;
      const oee = (availability * performance * qualityRate) / 10000;

      const plannedCapacity = Math.floor(8000 + Math.random() * 2000);
      const actualOutput = Math.floor(plannedCapacity * utilization / 100);

      let note = '';
      if (isForecast) {
        note = '預測：維持高產能利用率';
      } else if (utilization > 90) {
        note = '滿載運行';
      } else if (utilization < 85) {
        note = '需求較弱，可調整排程';
      }

      data.push([
        month,
        line,
        parseFloat(utilization.toFixed(1)),
        parseFloat(availability.toFixed(1)),
        parseFloat(performance.toFixed(1)),
        parseFloat(oee.toFixed(1)),
        plannedCapacity,
        actualOutput,
        note
      ]);
    });
  });

  return data;
}

// 3. 生成生產週期時間與交貨時間
function generateCycleTime() {
  const data = [['月份', '產品類型', '計劃週期(天)', '實際週期(天)', '達成率(%)', '交貨準時率(%)', '平均延遲天數', '註解']];

  months.forEach((month, mIndex) => {
    const isForecast = isForecastMonth(month);

    productTypes.forEach((product, pIndex) => {
      // 不同產品複雜度不同
      const baseCycle = 45 + pIndex * 5;
      const plannedCycle = baseCycle;

      // 實際週期隨著經驗改善
      const improvement = mIndex * 0.1;
      const actualCycle = plannedCycle + 2 - improvement + (Math.random() - 0.5) * 3;

      const achievement = (plannedCycle / actualCycle) * 100;
      const onTimeDelivery = 88 + Math.random() * 10 + mIndex * 0.05;
      const avgDelay = actualCycle > plannedCycle ? actualCycle - plannedCycle : 0;

      let note = '';
      if (isForecast) {
        note = '預測：週期時間持續優化';
      } else if (achievement > 100) {
        note = '提前完成，表現優異';
      } else if (achievement < 95) {
        note = '需關注製程瓶頸';
      }

      data.push([
        month,
        product,
        plannedCycle,
        parseFloat(actualCycle.toFixed(1)),
        parseFloat(achievement.toFixed(1)),
        parseFloat(onTimeDelivery.toFixed(1)),
        parseFloat(avgDelay.toFixed(1)),
        note
      ]);
    });
  });

  return data;
}

// 4. 生成缺陷密度分析
function generateDefectDensity() {
  const data = [['月份', '技術節點', '缺陷密度(個/cm²)', '關鍵缺陷數', '檢測晶圓數', '缺陷類型分佈', '改善措施', '註解']];

  const defectTypes = ['顆粒', '圖案', '薄膜', '蝕刻', '其他'];

  months.forEach((month, mIndex) => {
    const isForecast = isForecastMonth(month);

    techNodes.forEach((node, nIndex) => {
      // 先進製程缺陷密度通常較高，但隨時間改善
      const baseDefect = 0.5 + (4 - nIndex) * 0.15;
      const improvement = mIndex * 0.005;
      const defectDensity = Math.max(0.1, baseDefect - improvement + (Math.random() - 0.5) * 0.05);

      const inspectedWafers = Math.floor(100 + Math.random() * 50);
      const criticalDefects = Math.floor(defectDensity * inspectedWafers * 10);

      // 隨機選擇主要缺陷類型
      const mainDefect = defectTypes[Math.floor(Math.random() * defectTypes.length)];
      const defectDistribution = `${mainDefect} 40%, 其他 60%`;

      let improvement_action = '';
      if (defectDensity > 0.4) {
        improvement_action = '加強清潔程序，優化製程參數';
      } else if (defectDensity > 0.3) {
        improvement_action = '持續監控，定期維護設備';
      } else {
        improvement_action = '維持現有品質管制';
      }

      let note = '';
      if (isForecast) {
        note = '預測：持續降低缺陷密度';
      } else if (defectDensity < 0.2) {
        note = '缺陷密度優異';
      } else if (defectDensity > 0.5) {
        note = '需立即改善';
      }

      data.push([
        month,
        node,
        parseFloat(defectDensity.toFixed(3)),
        criticalDefects,
        inspectedWafers,
        defectDistribution,
        improvement_action,
        note
      ]);
    });
  });

  return data;
}

// 5. 生成WIP(在製品)庫存水平
function generateWIP() {
  const data = [['月份', '產線', 'WIP數量(片)', 'WIP天數', '目標天數', '達成狀況', '總價值(M NTD)', '週轉率', '註解']];

  const productionLines = ['Fab A', 'Fab B', 'Fab C', 'Fab D'];

  months.forEach((month, mIndex) => {
    const isForecast = isForecastMonth(month);

    productionLines.forEach((line, lIndex) => {
      // WIP數量隨產能調整
      const baseWIP = 5000 + lIndex * 1000 + Math.random() * 1000;
      const wipQuantity = Math.floor(baseWIP + mIndex * 20);

      // WIP天數目標是減少
      const targetDays = 12;
      const wipDays = targetDays + 2 - mIndex * 0.03 + (Math.random() - 0.5) * 2;

      let status = '';
      if (wipDays <= targetDays) {
        status = '✓ 達標';
      } else if (wipDays <= targetDays + 2) {
        status = '⚠ 接近目標';
      } else {
        status = '✗ 需改善';
      }

      // 總價值假設每片約1萬元
      const totalValue = Math.floor(wipQuantity * 0.01); // 轉換為M NTD

      // 週轉率 = 30天 / WIP天數
      const turnoverRate = 30 / wipDays;

      let note = '';
      if (isForecast) {
        note = '預測：優化WIP管理';
      } else if (wipDays < 11) {
        note = 'WIP控制優異';
      } else if (wipDays > 15) {
        note = '需加速生產流程';
      }

      data.push([
        month,
        line,
        wipQuantity,
        parseFloat(wipDays.toFixed(1)),
        targetDays,
        status,
        totalValue,
        parseFloat(turnoverRate.toFixed(2)),
        note
      ]);
    });
  });

  return data;
}

// 創建工作簿並保存
console.log('正在生成生產營運指標數據...\n');

const workbook = XLSX.utils.book_new();

console.log('1. 生成晶圓良率數據...');
const waferYieldData = generateWaferYield();
const ws1 = XLSX.utils.aoa_to_sheet(waferYieldData);
XLSX.utils.book_append_sheet(workbook, ws1, '晶圓良率分析');

console.log('2. 生成產能利用率與OEE數據...');
const capacityOEEData = generateCapacityOEE();
const ws2 = XLSX.utils.aoa_to_sheet(capacityOEEData);
XLSX.utils.book_append_sheet(workbook, ws2, '產能利用率與OEE');

console.log('3. 生成生產週期時間數據...');
const cycleTimeData = generateCycleTime();
const ws3 = XLSX.utils.aoa_to_sheet(cycleTimeData);
XLSX.utils.book_append_sheet(workbook, ws3, '生產週期與交貨');

console.log('4. 生成缺陷密度分析數據...');
const defectDensityData = generateDefectDensity();
const ws4 = XLSX.utils.aoa_to_sheet(defectDensityData);
XLSX.utils.book_append_sheet(workbook, ws4, '缺陷密度分析');

console.log('5. 生成WIP庫存數據...');
const wipData = generateWIP();
const ws5 = XLSX.utils.aoa_to_sheet(wipData);
XLSX.utils.book_append_sheet(workbook, ws5, 'WIP庫存水平');

const filePath = path.join(__dirname, 'dashboard/public/生產營運指標.xlsx');
XLSX.writeFile(workbook, filePath);

console.log('\n✅ 生產營運指標數據已生成！');
console.log(`📁 文件位置: ${filePath}`);
console.log('\n包含以下工作表:');
console.log('1. 晶圓良率分析 - 按技術節點與產品類型的良率數據');
console.log('2. 產能利用率與OEE - 各產線的產能利用率和設備效率');
console.log('3. 生產週期與交貨 - 週期時間和交貨準時率');
console.log('4. 缺陷密度分析 - 各技術節點的缺陷密度追蹤');
console.log('5. WIP庫存水平 - 在製品庫存管理指標');
console.log('\n數據範圍: 2022/01-2025/12 (2025/10-12為預測數據)');
