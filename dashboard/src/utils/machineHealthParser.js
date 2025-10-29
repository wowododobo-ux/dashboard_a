import * as XLSX from 'xlsx';

/**
 * 載入機台健康度數據
 * @returns {Promise<Object>} 包含明細和摘要的數據對象
 */
export async function loadMachineHealthData() {
  try {
    const response = await fetch(encodeURI('/機台健康度.xlsx'));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const data = {};

    // 讀取所有工作表
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      data[sheetName] = jsonData;
    });

    console.log('✓ 機台健康度數據已載入', {
      機台健康度明細: data['機台健康度明細']?.length || 0,
      摘要統計: data['摘要統計']?.length || 0,
      工作表名稱: workbook.SheetNames
    });

    return data;
  } catch (error) {
    console.error('❌ 載入機台健康度數據失敗:', error);
    return {
      '機台健康度明細': [],
      '摘要統計': []
    };
  }
}

/**
 * 篩選高風險機台
 * @param {Array} data - 機台數據
 * @param {number} threshold - 健康度閾值，默認85
 * @returns {Array} 高風險機台列表
 */
export function getHighRiskMachines(data, threshold = 85) {
  if (!data || !Array.isArray(data)) return [];

  return data
    .filter(machine => machine.健康度 < threshold)
    .sort((a, b) => a.健康度 - b.健康度); // 按健康度從低到高排序
}

/**
 * 按風險等級分組
 * @param {Array} data - 機台數據
 * @returns {Object} 按風險等級分組的機台數據
 */
export function groupByRiskLevel(data) {
  if (!data || !Array.isArray(data)) return {};

  const groups = {
    '極高風險': [],
    '高風險': [],
    '中風險': [],
    '低風險': []
  };

  data.forEach(machine => {
    const level = machine.風險等級;
    if (groups[level]) {
      groups[level].push(machine);
    }
  });

  return groups;
}

/**
 * 按機台類型分組統計
 * @param {Array} data - 機台數據
 * @returns {Array} 按類型統計的數據
 */
export function groupByMachineType(data) {
  if (!data || !Array.isArray(data)) return [];

  const typeMap = new Map();

  data.forEach(machine => {
    const type = machine.機台類型;
    if (!typeMap.has(type)) {
      typeMap.set(type, {
        機台類型: type,
        數量: 0,
        平均健康度: 0,
        高風險數量: 0,
        _healthScores: []
      });
    }

    const typeData = typeMap.get(type);
    typeData.數量++;
    typeData._healthScores.push(machine.健康度);
    if (machine.健康度 < 85) {
      typeData.高風險數量++;
    }
  });

  // 計算平均健康度
  const result = Array.from(typeMap.values()).map(typeData => {
    const avgHealth = typeData._healthScores.reduce((sum, val) => sum + val, 0) / typeData._healthScores.length;
    return {
      機台類型: typeData.機台類型,
      數量: typeData.數量,
      平均健康度: parseFloat(avgHealth.toFixed(1)),
      高風險數量: typeData.高風險數量,
      高風險比例: parseFloat(((typeData.高風險數量 / typeData.數量) * 100).toFixed(1))
    };
  });

  return result;
}

/**
 * 獲取需要維護的機台
 * @param {Array} data - 機台數據
 * @returns {Object} 按維護緊急程度分類的機台
 */
export function getMachinesNeedingMaintenance(data) {
  if (!data || !Array.isArray(data)) return {};

  const maintenance = {
    '立即維護': [],
    '24小時內維護': [],
    '定期保養': [],
    '繼續監控': []
  };

  data.forEach(machine => {
    const suggestion = machine.維護建議;
    if (suggestion === '立即安排維護') {
      maintenance['立即維護'].push(machine);
    } else if (suggestion === '24小時內維護') {
      maintenance['24小時內維護'].push(machine);
    } else if (suggestion === '定期保養到期') {
      maintenance['定期保養'].push(machine);
    } else {
      maintenance['繼續監控'].push(machine);
    }
  });

  return maintenance;
}

/**
 * 轉換為卡片顯示格式
 * @param {Array} data - 機台數據
 * @returns {Array} 適合MachineHealthCard組件的數據格式
 */
export function formatForHealthCard(data) {
  if (!data || !Array.isArray(data)) return [];

  return data.map(machine => ({
    id: machine.機台編號,
    type: machine.機台類型,
    healthScore: machine.健康度,
    riskLevel: machine.風險等級,
    maintenanceSuggestion: machine.維護建議,
    issues: machine.主要問題,
    area: machine.生產區域
  }));
}
