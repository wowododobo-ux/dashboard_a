import * as XLSX from 'xlsx';
import { getPublicPath } from './pathHelper';

export async function loadBookToBillData() {
  try {
    const response = await fetch(encodeURI(getPublicPath('訂單出貨比.xlsx')));
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    const data = {};

    // 解析每個工作表
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      data[sheetName] = parseSheetData(jsonData);
    });

    return data;
  } catch (error) {
    console.error('Error loading Book to Bill data:', error);
    return null;
  }
}

function parseSheetData(rawData) {
  if (!rawData || rawData.length < 2) return [];

  const headers = rawData[0];
  const rows = rawData.slice(1);

  return rows.map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

// 從月份字串中提取年份
export function extractYearFromMonth(monthStr) {
  if (!monthStr) return '';
  return monthStr.split('-')[0];
}

// 檢查是否為預測資料
export function isForecastData(forecastFlag) {
  return forecastFlag === 'Y';
}

// 篩選特定年度的資料
export function filterByYear(data, year) {
  if (!data) return data;
  if (year === 'all') {
    return data;
  }
  return data.filter(item => {
    // 支持三種格式：'月份'（舊圖表）、'基準月份'（熱力圖）、'更新日期'（新版更新日期）
    const dateField = item['月份'] || item['基準月份'] || item['更新日期'];
    const itemYear = extractYearFromMonth(dateField);
    return itemYear === year;
  });
}

// 從更新日期中提取月份（如 '2022-01-10' -> '2022-01'）
export function extractMonthFromDate(dateStr) {
  if (!dateStr) return '';
  return dateStr.substring(0, 7);
}

// 從更新日期中提取日期部分（如 '2022-01-10' -> '10'）
export function extractDayFromDate(dateStr) {
  if (!dateStr) return '';
  return dateStr.substring(8, 10);
}
