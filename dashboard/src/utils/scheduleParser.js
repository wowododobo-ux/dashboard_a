import * as XLSX from 'xlsx';

/**
 * 載入生產排程達成率數據
 * @returns {Promise<Object>} 包含三個工作表的數據對象
 */
export async function loadScheduleData() {
  try {
    const response = await fetch(encodeURI('/生產排程達成率.xlsx'));

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

      // 顯示前3筆數據樣本以供調試
      if (jsonData.length > 0) {
        console.log(`📊 ${sheetName} 數據樣本:`, jsonData.slice(0, 3));
      }
    });

    console.log('✓ 生產排程達成率數據已載入', {
      按產品線: data['按產品線']?.length || 0,
      按生產區域: data['按生產區域']?.length || 0,
      整體數據: data['整體數據']?.length || 0,
      工作表名稱: workbook.SheetNames
    });

    return data;
  } catch (error) {
    console.error('❌ 載入生產排程達成率數據失敗:', error);
    return {
      '按產品線': [],
      '按生產區域': [],
      '整體數據': []
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
    // 嘗試從年份欄位獲取
    if (item.年份) {
      return parseInt(item.年份) === targetYear;
    }
    // 嘗試從週次欄位解析（格式：2024-W01）
    if (item.週次) {
      const weekYear = parseInt(item.週次.split('-')[0]);
      return weekYear === targetYear;
    }
    return false;
  });
}

/**
 * 根據產品線篩選數據
 * @param {Array} data - 原始數據
 * @param {string} productLine - 產品線 ('all', '5nm', '7nm', '12nm', '16nm')
 * @returns {Array} 篩選後的數據
 */
export function filterByProductLine(data, productLine) {
  if (!data || !Array.isArray(data)) return [];
  if (productLine === 'all') return data;

  return data.filter(item => item.產品線 === productLine);
}

/**
 * 根據生產區域篩選數據
 * @param {Array} data - 原始數據
 * @param {string} area - 生產區域 ('all', 'A區', 'B區', 'C區')
 * @returns {Array} 篩選後的數據
 */
export function filterByArea(data, area) {
  if (!data || !Array.isArray(data)) return [];
  if (area === 'all') return data;

  return data.filter(item => item.生產區域 === area);
}

/**
 * 計算達成率統計
 * @param {Array} data - 數據數組
 * @returns {Object} 統計信息
 */
export function calculateAchievementStats(data) {
  if (!data || data.length === 0) {
    return {
      avgAchievement: 0,
      minAchievement: 0,
      maxAchievement: 0,
      totalPlanned: 0,
      totalActual: 0,
      overallAchievement: 0
    };
  }

  const achievements = data.map(item => item.達成率 || 0);
  const avgAchievement = achievements.reduce((sum, val) => sum + val, 0) / achievements.length;
  const minAchievement = Math.min(...achievements);
  const maxAchievement = Math.max(...achievements);

  const totalPlanned = data.reduce((sum, item) => sum + (item.計畫產量 || 0), 0);
  const totalActual = data.reduce((sum, item) => sum + (item.實際產量 || 0), 0);
  const overallAchievement = totalPlanned > 0 ? (totalActual / totalPlanned * 100) : 0;

  return {
    avgAchievement: avgAchievement.toFixed(1),
    minAchievement: minAchievement.toFixed(1),
    maxAchievement: maxAchievement.toFixed(1),
    totalPlanned,
    totalActual,
    overallAchievement: overallAchievement.toFixed(1)
  };
}

/**
 * 聚合數據（用於按週顯示多個分組的總和）
 * @param {Array} data - 原始數據
 * @param {string} groupBy - 分組欄位 ('產品線' 或 '生產區域')
 * @returns {Array} 聚合後的數據
 */
export function aggregateByWeek(data, groupBy) {
  if (!data || data.length === 0) return [];

  const weekMap = new Map();

  data.forEach(item => {
    const week = item.週次;
    if (!weekMap.has(week)) {
      weekMap.set(week, {
        週次: week,
        年份: item.年份,
        週數: item.週數,
        計畫產量: 0,
        實際產量: 0,
        註解: ''
      });
    }

    const weekData = weekMap.get(week);
    weekData.計畫產量 += item.計畫產量 || 0;
    weekData.實際產量 += item.實際產量 || 0;

    // 保留第一個非空註解
    if (item.註解 && !weekData.註解) {
      weekData.註解 = item.註解;
    }
  });

  // 計算達成率
  const result = Array.from(weekMap.values()).map(item => ({
    ...item,
    達成率: item.計畫產量 > 0
      ? parseFloat((item.實際產量 / item.計畫產量 * 100).toFixed(1))
      : 0,
    差異: item.實際產量 - item.計畫產量
  }));

  // 按週次排序
  result.sort((a, b) => {
    if (a.年份 !== b.年份) return a.年份 - b.年份;
    return a.週數 - b.週數;
  });

  return result;
}
