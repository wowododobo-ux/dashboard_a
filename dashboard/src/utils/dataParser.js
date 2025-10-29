import * as XLSX from 'xlsx';

export async function loadExcelData() {
  try {
    const response = await fetch('/財務趨勢模擬資料.xlsx');
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
    console.error('Error loading Excel data:', error);
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

// 提取月份（移除預測標記）
export function extractMonth(monthStr) {
  if (!monthStr) return '';
  return monthStr.replace(' (預測)', '');
}

// 檢查是否為預測資料（基於"是否為預測"欄位）
export function isForecast(forecastFlag) {
  return forecastFlag === 'Y';
}

// 從年月字串中提取年份
export function extractYear(monthStr) {
  if (!monthStr) return '';
  return monthStr.split('-')[0];
}

// 篩選特定年度的資料
export function filterByYear(data, year) {
  if (!data) return data;
  if (year === 'all') {
    // 當選擇全部年份時，轉換為季度資料
    return aggregateToQuarters(data);
  }
  return data.filter(item => {
    const itemYear = extractYear(item['月份']);
    return itemYear === year;
  });
}

// 將月度資料聚合為季度資料
export function aggregateToQuarters(data) {
  if (!data || data.length === 0) return [];

  const quarterMap = new Map();

  data.forEach(item => {
    const monthStr = item['月份'];
    if (!monthStr) return;

    const [year, month] = monthStr.split('-');
    const monthNum = parseInt(month);
    const quarter = Math.ceil(monthNum / 3);
    const quarterKey = `${year}-Q${quarter}`;

    if (!quarterMap.has(quarterKey)) {
      quarterMap.set(quarterKey, {
        items: [],
        isForecast: false
      });
    }

    const quarterData = quarterMap.get(quarterKey);
    quarterData.items.push(item);
    // 如果任何一個月是預測，整個季度標記為預測
    if (isForecast(item['是否為預測'])) {
      quarterData.isForecast = true;
    }
  });

  // 聚合每個季度的資料
  const result = [];
  quarterMap.forEach((quarterData, quarterKey) => {
    const items = quarterData.items;
    if (items.length === 0) return;

    const aggregated = {
      '月份': quarterKey,
      '是否為預測': quarterData.isForecast ? 'Y' : 'N'
    };

    // 收集季度內的所有註解
    const notes = items
      .map(item => item['註解'])
      .filter(note => note && note.trim() !== '');

    if (notes.length > 0) {
      aggregated['註解'] = notes.join('; ');
    } else {
      aggregated['註解'] = null;
    }

    // 取得所有數值欄位並計算平均值
    const firstItem = items[0];
    Object.keys(firstItem).forEach(key => {
      if (key === '月份' || key === '是否為預測' || key === '註解') return;

      const values = items
        .map(item => item[key])
        .filter(val => val !== null && val !== undefined && !isNaN(val));

      if (values.length > 0) {
        // 對於金額和百分比都使用平均值
        const sum = values.reduce((acc, val) => acc + Number(val), 0);
        aggregated[key] = sum / values.length;
      } else {
        aggregated[key] = null;
      }
    });

    result.push(aggregated);
  });

  // 按季度排序
  result.sort((a, b) => {
    const [yearA, quarterA] = a['月份'].split('-Q');
    const [yearB, quarterB] = b['月份'].split('-Q');
    if (yearA !== yearB) return yearA - yearB;
    return quarterA - quarterB;
  });

  return result;
}
