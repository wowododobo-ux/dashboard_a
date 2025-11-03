import * as XLSX from 'xlsx';
import { getPublicPath } from './pathHelper';

/**
 * 載入 Top KPI 數據
 * @returns {Promise<Array>} KPI 數據陣列
 */
export async function loadTopKPIData() {
  try {
    const response = await fetch(encodeURI(getPublicPath('top-kpis.xlsx')));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // 讀取三個工作表
    const kpiBasicSheet = workbook.Sheets['KPI基本資訊'];
    const trendSheet = workbook.Sheets['趨勢數據'];
    const driversSheet = workbook.Sheets['關鍵驅動因素'];

    const kpiBasicData = XLSX.utils.sheet_to_json(kpiBasicSheet);
    const trendData = XLSX.utils.sheet_to_json(trendSheet);
    const driversData = XLSX.utils.sheet_to_json(driversSheet);

    // 重組數據結構
    const kpis = kpiBasicData.map(kpi => {
      // 獲取該 KPI 的趨勢數據
      const kpiTrends = trendData
        .filter(t => t['KPI代碼'] === kpi['KPI代碼'])
        .map(t => ({
          月份: t['年月'],
          年份: t['年份'],
          月: t['月份編號'],
          數值: t['數值']
        }));

      // 獲取該 KPI 的驅動因素
      const kpiDrivers = driversData
        .filter(d => d['KPI代碼'] === kpi['KPI代碼'])
        .map(d => ({
          因素: d['驅動因素'],
          影響: d['影響'],
          說明: d['說明']
        }));

      return {
        id: kpi['KPI代碼'],
        名稱: kpi['KPI名稱'],
        名稱英文: kpi['KPI英文'],
        單位: kpi['單位'],
        當前值: kpi['當前值'],
        目標值: kpi['目標值'],
        差異百分比: kpi['差異百分比'],
        狀態: kpi['狀態'],
        趨勢數據: kpiTrends,
        關鍵驅動因素: kpiDrivers,
        結論: kpi['結論']
      };
    });

    console.log('✓ Top KPI 數據已載入', {
      KPI數量: kpis.length,
      趨勢數據點: trendData.length,
      驅動因素: driversData.length
    });

    return kpis;
  } catch (error) {
    console.error('❌ 載入 Top KPI 數據失敗:', error);
    return [];
  }
}

/**
 * 依狀態篩選 KPI
 * @param {Array} kpis - KPI 數據陣列
 * @param {string} status - 狀態 (green/amber/red)
 * @returns {Array} 篩選後的 KPI
 */
export function filterKPIsByStatus(kpis, status) {
  if (!kpis || !Array.isArray(kpis)) return [];
  return kpis.filter(kpi => kpi.狀態 === status);
}

/**
 * 獲取所有需要關注的 KPI（amber + red）
 * @param {Array} kpis - KPI 數據陣列
 * @returns {Array} 需要關注的 KPI
 */
export function getAttentionKPIs(kpis) {
  if (!kpis || !Array.isArray(kpis)) return [];
  return kpis.filter(kpi => kpi.狀態 === 'amber' || kpi.狀態 === 'red');
}

/**
 * 依 ID 查找特定 KPI
 * @param {Array} kpis - KPI 數據陣列
 * @param {string} kpiId - KPI ID
 * @returns {Object|null} KPI 物件
 */
export function findKPIById(kpis, kpiId) {
  if (!kpis || !Array.isArray(kpis)) return null;
  return kpis.find(kpi => kpi.id === kpiId) || null;
}

export default {
  loadTopKPIData,
  filterKPIsByStatus,
  getAttentionKPIs,
  findKPIById
};
