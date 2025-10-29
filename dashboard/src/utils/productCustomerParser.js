import * as XLSX from 'xlsx';

export async function loadProductCustomerData() {
  try {
    const response = await fetch(encodeURI('/產品與客戶銷售獲利分析.xlsx'));
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
    console.error('Error loading product customer data:', error);
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

// 篩選特定年度的資料
export function filterByYear(data, year) {
  if (!data) return data;
  if (year === 'all') {
    return data;
  }
  return data.filter(item => {
    const itemYear = extractYearFromMonth(item['月份']);
    return itemYear === year;
  });
}

// 保留舊的函數名稱以兼容
export const filterByYearQuarter = filterByYear;
