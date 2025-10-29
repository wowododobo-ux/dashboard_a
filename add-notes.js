const XLSX = require('xlsx');
const path = require('path');

// 示例註解數據 - 為不同月份添加有意義的註解
const sampleNotes = {
  '2022-03': '第一季度業績穩定',
  '2022-06': '市場需求增加，營收成長',
  '2022-09': '受全球供應鏈影響，成本上升',
  '2022-12': '年末促銷活動，業績達標',
  '2023-03': '新產品線推出',
  '2023-06': '第二季度市場競爭加劇',
  '2023-09': '原物料價格波動',
  '2023-12': '年度目標達成，獲利成長',
  '2024-03': '擴大產能投資',
  '2024-06': '匯率影響營收',
  '2024-09': '營運效率提升計畫啟動',
  '2024-12': '年終績效超越預期',
  '2025-01': '新年度策略調整',
  '2025-03': '春季市場回溫',
  '2025-06': '半年度檢討：表現良好',
  '2025-09': '第三季度成本控管優化',
  '2025-10': '開始預測期，根據市場趨勢預估',
  '2025-11': '預測：旺季備貨需求增加',
  '2025-12': '預測：年底促銷活動規劃'
};

// 讀取 Excel 檔案
const filePath = path.join(__dirname, 'dashboard/public/財務趨勢模擬資料.xlsx');
console.log('讀取檔案:', filePath);

const workbook = XLSX.readFile(filePath);

// 處理每個工作表
workbook.SheetNames.forEach(sheetName => {
  console.log(`\n處理工作表: ${sheetName}`);

  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  if (data.length < 2) {
    console.log(`  跳過: 資料不足`);
    return;
  }

  // 獲取標題行
  const headers = data[0];
  console.log(`  原始欄位: ${headers.join(', ')}`);

  // 檢查是否已經有"註解"欄位
  const noteIndex = headers.indexOf('註解');

  if (noteIndex === -1) {
    // 添加"註解"欄位到標題行
    headers.push('註解');
    console.log(`  添加"註解"欄位`);

    // 為每一行添加註解
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const monthValue = row[0]; // 假設第一欄是月份

      // 根據月份添加對應的註解
      if (monthValue && sampleNotes[monthValue]) {
        row.push(sampleNotes[monthValue]);
        console.log(`  ${monthValue}: ${sampleNotes[monthValue]}`);
      } else {
        row.push(''); // 沒有註解的月份留空
      }
    }
  } else {
    console.log(`  "註解"欄位已存在，更新內容`);

    // 更新現有的註解欄位
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const monthValue = row[0];

      if (monthValue && sampleNotes[monthValue]) {
        row[noteIndex] = sampleNotes[monthValue];
        console.log(`  ${monthValue}: ${sampleNotes[monthValue]}`);
      }
    }
  }

  // 將更新後的資料寫回工作表
  const newWorksheet = XLSX.utils.aoa_to_sheet(data);
  workbook.Sheets[sheetName] = newWorksheet;
});

// 保存更新後的檔案
XLSX.writeFile(workbook, filePath);
console.log('\n✅ 檔案已更新！');
console.log('已添加"註解"欄位並填入示例註解');
console.log('\n註解示例包含:');
console.log('- 季度業績說明');
console.log('- 市場變化');
console.log('- 成本因素');
console.log('- 策略調整');
console.log('- 預測期說明');
