import XLSX from 'xlsx';

/**
 * 生成研發與技術指標資料
 * 包含：新製程開發進度、專利申請與授權
 */

// 生成季度列表（2022-2025）
function generateQuarters() {
  const quarters = [];
  for (let year = 2022; year <= 2025; year++) {
    for (let quarter = 1; quarter <= 4; quarter++) {
      quarters.push({
        label: `${year}Q${quarter}`,
        year,
        quarter
      });
    }
  }
  return quarters;
}

// 生成年度列表（2022-2025）
function generateYears() {
  return [2022, 2023, 2024, 2025];
}

// 1. 生成新製程開發進度資料
function generateProcessDevelopmentData() {
  const quarters = generateQuarters();
  const processes = [
    { 名稱: '3nm製程', 類型: '先進製程', 初始進度: 20 },
    { 名稱: '2nm研究', 類型: '前瞻研究', 初始進度: 5 },
    { 名稱: 'GAA技術', 類型: '技術突破', 初始進度: 30 },
    { 名稱: '先進封裝', 類型: '封裝技術', 初始進度: 40 }
  ];

  const data = [];

  quarters.forEach((quarter, index) => {
    processes.forEach(process => {
      // 不同製程有不同的開發速度
      let progressIncrement = 0;
      if (process.名稱 === '3nm製程') {
        progressIncrement = 4.5; // 每季進展 4.5%
      } else if (process.名稱 === '2nm研究') {
        progressIncrement = 3.0; // 每季進展 3%
      } else if (process.名稱 === 'GAA技術') {
        progressIncrement = 3.5; // 每季進展 3.5%
      } else if (process.名稱 === '先進封裝') {
        progressIncrement = 3.2; // 每季進展 3.2%
      }

      const 進度 = Math.min(100, process.初始進度 + progressIncrement * index);

      // 根據進度判斷狀態
      let 狀態 = '';
      if (進度 < 30) {
        狀態 = '初期研究';
      } else if (進度 < 60) {
        狀態 = '開發中';
      } else if (進度 < 90) {
        狀態 = '測試驗證';
      } else {
        狀態 = '量產準備';
      }

      // 投入金額（百萬台幣）
      const 投入金額 = parseFloat((進度 * 8 + Math.random() * 100).toFixed(2));

      // 團隊人數
      const 團隊人數 = Math.round(30 + 進度 * 0.5 + Math.random() * 10);

      data.push({
        '季度': quarter.label,
        '年份': quarter.year,
        '季': quarter.quarter,
        '專案名稱': process.名稱,
        '技術類型': process.類型,
        '完成進度(%)': parseFloat(進度.toFixed(1)),
        '狀態': 狀態,
        '投入金額(M NTD)': 投入金額,
        '團隊人數': 團隊人數
      });
    });
  });

  return data;
}

// 2. 生成專利申請與授權資料
function generatePatentData() {
  const years = generateYears();
  const categories = [
    { 領域: '製程技術', 類型: ['先進製程', '蝕刻技術', '薄膜沉積'] },
    { 領域: '設備改進', 類型: ['光刻機', '檢測設備', '清洗設備'] },
    { 領域: '材料科學', 類型: ['新材料', '化學品', '光阻劑'] }
  ];

  const data = [];

  years.forEach((year, yearIndex) => {
    categories.forEach(category => {
      // 每年專利數量有成長趨勢
      const baseApplications = 50;
      const 申請數量 = Math.round(baseApplications * (1 + yearIndex * 0.15) + Math.random() * 20);

      // 授權數量約為申請數量的 60-70%（有延遲）
      const 授權率 = 0.60 + yearIndex * 0.025; // 授權率逐年提升
      const 授權數量 = Math.round(申請數量 * 授權率 * (0.9 + Math.random() * 0.2));

      // 維持中專利數量
      const 維持中數量 = Math.round(授權數量 * (8 + yearIndex) * (0.95 + Math.random() * 0.1));

      // 平均授權週期（月）
      const 平均授權週期 = parseFloat((18 - yearIndex * 0.5 + Math.random() * 3).toFixed(1));

      data.push({
        '年份': year,
        '技術領域': category.領域,
        '申請數量': 申請數量,
        '授權數量': 授權數量,
        '維持中數量': 維持中數量,
        '授權率(%)': parseFloat((授權率 * 100).toFixed(1)),
        '平均授權週期(月)': 平均授權週期
      });
    });
  });

  return data;
}

// 3. 生成研發投入統計資料（額外工作表）
function generateRDInvestmentData() {
  const years = generateYears();
  const data = [];

  years.forEach((year, index) => {
    // 研發投入逐年增加
    const 研發支出 = parseFloat((1500 * (1 + index * 0.12) + Math.random() * 200).toFixed(2));
    const 營收佔比 = parseFloat((15 + index * 0.5 + Math.random() * 1).toFixed(2));
    const 研發人員數 = Math.round(800 * (1 + index * 0.1) + Math.random() * 50);
    const 博士數量 = Math.round(研發人員數 * 0.25);
    const 碩士數量 = Math.round(研發人員數 * 0.55);

    data.push({
      '年份': year,
      '研發支出(M NTD)': 研發支出,
      '營收佔比(%)': 營收佔比,
      '研發人員總數': 研發人員數,
      '博士人數': 博士數量,
      '碩士人數': 碩士數量,
      '人均產值(M NTD)': parseFloat((研發支出 / 研發人員數).toFixed(2))
    });
  });

  return data;
}

// 主函數
function generateRDExcel() {
  console.log('開始生成研發與技術指標資料...');

  // 生成三個工作表的資料
  const processData = generateProcessDevelopmentData();
  const patentData = generatePatentData();
  const investmentData = generateRDInvestmentData();

  console.log(`✓ 新製程開發進度: ${processData.length} 筆記錄`);
  console.log(`✓ 專利申請與授權: ${patentData.length} 筆記錄`);
  console.log(`✓ 研發投入統計: ${investmentData.length} 筆記錄`);

  // 創建工作簿
  const workbook = XLSX.utils.book_new();

  // 添加工作表1: 新製程開發進度
  const ws1 = XLSX.utils.json_to_sheet(processData);
  XLSX.utils.book_append_sheet(workbook, ws1, '新製程開發進度');

  // 添加工作表2: 專利申請與授權
  const ws2 = XLSX.utils.json_to_sheet(patentData);
  XLSX.utils.book_append_sheet(workbook, ws2, '專利申請與授權');

  // 添加工作表3: 研發投入統計
  const ws3 = XLSX.utils.json_to_sheet(investmentData);
  XLSX.utils.book_append_sheet(workbook, ws3, '研發投入統計');

  // 寫入檔案
  XLSX.writeFile(workbook, './dashboard/public/研發與技術.xlsx');

  console.log('\n✅ Excel 檔案已生成：./dashboard/public/研發與技術.xlsx');
  console.log('\n資料摘要：');
  console.log('  - 製程開發：2022Q1 到 2025Q4 (16個季度)');
  console.log('  - 追蹤專案：3nm製程、2nm研究、GAA技術、先進封裝');
  console.log('  - 專利資料：2022-2025 (4年)');
  console.log('  - 技術領域：製程技術、設備改進、材料科學');
  console.log('  - 研發投入：年度統計，包含人力與財務數據');
}

// 執行
generateRDExcel();
