import * as XLSX from 'xlsx';
import { getPublicPath } from './pathHelper';

/**
 * 載入產品別良率分析數據
 * @returns {Promise<Object>} 包含明細和摘要的數據對象
 */
export async function loadProductYieldData() {
  try {
    const response = await fetch(encodeURI(getPublicPath('產品別良率分析.xlsx')));

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

    console.log('✓ 產品別良率分析數據已載入', {
      產品別良率明細: data['產品別良率明細']?.length || 0,
      最新月份摘要: data['最新月份摘要']?.length || 0,
      工作表名稱: workbook.SheetNames
    });

    return data;
  } catch (error) {
    console.error('❌ 載入產品別良率分析數據失敗:', error);
    return {
      '產品別良率明細': [],
      '最新月份摘要': []
    };
  }
}

/**
 * 根據年度篩選數據
 * @param {Array} data - 原始數據
 * @param {string} year - 年度 ('all', '2022', '2023', '2024', '2025')
 * @returns {Array} 篩選後的數據
 */
export function filterByYear(data, year) {
  if (!data || !Array.isArray(data)) return [];
  if (year === 'all') return data;

  const targetYear = parseInt(year);

  return data.filter(item => {
    if (item.年份) {
      return parseInt(item.年份) === targetYear;
    }
    if (item.月份) {
      const itemYear = parseInt(item.月份.split('-')[0]);
      return itemYear === targetYear;
    }
    return false;
  });
}

/**
 * 根據月份篩選數據
 * @param {Array} data - 原始數據
 * @param {string} month - 月份 ('2024-10')
 * @returns {Array} 篩選後的數據
 */
export function filterByMonth(data, month) {
  if (!data || !Array.isArray(data)) return [];
  if (!month) return data;

  return data.filter(item => item.月份 === month);
}

/**
 * 獲取最新月份
 * @param {Array} data - 原始數據
 * @returns {string} 最新月份 ('2025-10')
 */
export function getLatestMonth(data) {
  if (!data || data.length === 0) return null;

  return data.reduce((latest, item) => {
    return item.月份 > latest ? item.月份 : latest;
  }, '2022-01');
}

/**
 * 按生產區域和產品線分組（用於圖表）
 * @param {Array} data - 原始數據
 * @param {string} month - 指定月份，如果不指定則使用最新月份
 * @returns {Array} 分組後的數據，格式適用於Recharts
 */
export function groupByAreaAndProduct(data, month = null) {
  if (!data || data.length === 0) return [];

  // 如果沒有指定月份，使用最新月份
  const targetMonth = month || getLatestMonth(data);
  const monthData = filterByMonth(data, targetMonth);

  // 按生產區域分組
  const areaMap = new Map();

  monthData.forEach(item => {
    const area = item.生產區域;

    if (!areaMap.has(area)) {
      areaMap.set(area, {
        生產區域: area
      });
    }

    const areaData = areaMap.get(area);
    areaData[item.產品線] = item.良率;
    areaData[`${item.產品線}_目標`] = item.目標良率;
  });

  return Array.from(areaMap.values());
}

/**
 * 計算統計信息
 * @param {Array} data - 數據數組
 * @returns {Object} 統計信息
 */
export function calculateYieldStats(data) {
  if (!data || data.length === 0) {
    return {
      avgYield: 0,
      minYield: 0,
      maxYield: 0,
      targetAchievementRate: 0
    };
  }

  const yields = data.map(item => item.良率 || 0);
  const avgYield = yields.reduce((sum, val) => sum + val, 0) / yields.length;
  const minYield = Math.min(...yields);
  const maxYield = Math.max(...yields);

  // 計算達標率（良率 >= 目標良率的比例）
  const achievedCount = data.filter(item => item.良率 >= item.目標良率).length;
  const targetAchievementRate = (achievedCount / data.length) * 100;

  return {
    avgYield: avgYield.toFixed(2),
    minYield: minYield.toFixed(2),
    maxYield: maxYield.toFixed(2),
    targetAchievementRate: targetAchievementRate.toFixed(1)
  };
}

/**
 * 準備表格數據
 * @param {Array} data - 原始數據
 * @param {string} month - 指定月份
 * @returns {Array} 表格行數據
 */
export function prepareTableData(data, month = null) {
  if (!data || data.length === 0) return [];

  const targetMonth = month || getLatestMonth(data);
  const monthData = filterByMonth(data, targetMonth);

  const productLines = ['5nm', '7nm', '12nm', '16nm'];
  const areas = ['A區', 'B區', 'C區'];

  const tableData = productLines.map(productLine => {
    const row = {
      產品線: productLine
    };

    areas.forEach(area => {
      const item = monthData.find(
        d => d.產品線 === productLine && d.生產區域 === area
      );

      if (item) {
        row[area] = {
          良率: item.良率,
          目標良率: item.目標良率,
          良品數: item.良品數,
          總產出: item.總產出,
          達標: item.良率 >= item.目標良率
        };
      }
    });

    // 計算平均良率
    const productData = monthData.filter(d => d.產品線 === productLine);
    if (productData.length > 0) {
      const avgYield = productData.reduce((sum, item) => sum + item.良率, 0) / productData.length;
      const totalGood = productData.reduce((sum, item) => sum + item.良品數, 0);
      const totalOutput = productData.reduce((sum, item) => sum + item.總產出, 0);

      row['平均'] = {
        良率: parseFloat(avgYield.toFixed(2)),
        目標良率: productData[0].目標良率,
        良品數: totalGood,
        總產出: totalOutput,
        達標: avgYield >= productData[0].目標良率
      };
    }

    return row;
  });

  return tableData;
}
