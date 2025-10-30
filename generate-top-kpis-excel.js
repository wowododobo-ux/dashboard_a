import XLSX from 'xlsx';
import fs from 'fs';

/**
 * 生成 Top KPI Excel 檔案
 * 包含三個工作表：
 * 1. KPI基本資訊
 * 2. 趨勢數據
 * 3. 驅動因素
 */

// 讀取現有的 JSON 數據
const jsonData = JSON.parse(fs.readFileSync('./dashboard/public/top-kpis.json', 'utf8'));

// 準備工作表1：KPI 基本資訊
const kpiBasicInfo = jsonData.map(kpi => ({
  'KPI代碼': kpi.id,
  'KPI名稱': kpi.名稱,
  'KPI英文': kpi.名稱英文,
  '單位': kpi.單位,
  '當前值': kpi.當前值,
  '目標值': kpi.目標值,
  '差異百分比': kpi.差異百分比,
  '狀態': kpi.狀態,
  '結論': kpi.結論
}));

// 準備工作表2：趨勢數據（所有 KPI 的 12 個月數據）
const trendData = [];
jsonData.forEach(kpi => {
  kpi.趨勢數據.forEach(trend => {
    trendData.push({
      'KPI代碼': kpi.id,
      'KPI名稱': kpi.名稱,
      '年份': trend.年份,
      '月份編號': trend.月,
      '年月': trend.月份,
      '數值': trend.數值,
      '單位': kpi.單位
    });
  });
});

// 準備工作表3：關鍵驅動因素
const driversData = [];
jsonData.forEach(kpi => {
  kpi.關鍵驅動因素.forEach((driver, index) => {
    driversData.push({
      'KPI代碼': kpi.id,
      'KPI名稱': kpi.名稱,
      '驅動因素序號': index + 1,
      '驅動因素': driver.因素,
      '影響': driver.影響,
      '說明': driver.說明
    });
  });
});

// 創建工作簿
const workbook = XLSX.utils.book_new();

// 添加工作表1：KPI基本資訊
const ws1 = XLSX.utils.json_to_sheet(kpiBasicInfo);
XLSX.utils.book_append_sheet(workbook, ws1, 'KPI基本資訊');

// 添加工作表2：趨勢數據
const ws2 = XLSX.utils.json_to_sheet(trendData);
XLSX.utils.book_append_sheet(workbook, ws2, '趨勢數據');

// 添加工作表3：關鍵驅動因素
const ws3 = XLSX.utils.json_to_sheet(driversData);
XLSX.utils.book_append_sheet(workbook, ws3, '關鍵驅動因素');

// 寫入檔案
XLSX.writeFile(workbook, './dashboard/public/top-kpis.xlsx');

console.log('✓ Top KPI Excel 檔案已生成');
console.log('  - KPI 基本資訊:', kpiBasicInfo.length, '筆');
console.log('  - 趨勢數據:', trendData.length, '筆');
console.log('  - 關鍵驅動因素:', driversData.length, '筆');
console.log('  - 檔案位置: ./dashboard/public/top-kpis.xlsx');
