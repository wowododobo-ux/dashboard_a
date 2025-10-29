# 📝 文字配置系統使用指南

## 概述

為了方便管理和修改所有網頁上的文字，我們建立了統一的文字配置系統 `textConfig.js`。現在您可以在一個地方修改所有顯示的文字，而不需要到各個組件檔案中尋找和修改。

---

## 📁 檔案位置

```
dashboard/src/config/textConfig.js
```

---

## 🎯 功能特色

### ✅ 集中管理
- 所有用戶介面文字統一在 `textConfig.js` 管理
- 不需要修改組件代碼就能更改顯示文字
- 便於維護和國際化擴展

### ✅ 分類清晰
文字配置按類別組織：
- **common** - 共用文字（載入中、錯誤訊息等）
- **pageHeaders** - 頁面標題
- **yearSelector** - 年度選擇器
- **financialCharts** - 財務趨勢圖表標題
- **productCustomerCharts** - 產品客戶分析圖表標題
- **bookToBillCharts** - Book to Bill 圖表標題
- **chartLabels** - 圖表軸標籤和單位
- **monthOffset** - 月份偏移標籤
- **tooltip** - 提示框文字
- **heatmapLegend** - 熱力圖圖例
- **footer** - 頁尾註解
- **bcgMatrix** - BCG 矩陣相關
- **customerGrade** - 客戶分級
- **updateDate** - 更新日期選項

### ✅ 支持參數替換
可以在文字中使用 `{參數名}` 進行動態替換：
```javascript
// textConfig.js
bookToBillCharts: {
  shipmentWithRatios: '實際出貨金額 + +{offset}月比值（1日、10日、20日）',
}

// 使用時
getText('bookToBillCharts', 'shipmentWithRatios', { offset: 3 })
// 輸出: "實際出貨金額 + +3月比值（1日、10日、20日）"
```

---

## 📖 使用方法

### 方法 1：直接引用（推薦）

**步驟 1：引入配置**
```javascript
import { textConfig } from '../config/textConfig';
```

**步驟 2：使用文字**
```javascript
// 使用共用文字
<h2>{textConfig.common.loading}</h2>
<h2>{textConfig.common.error}</h2>

// 使用頁面標題
<h1>{textConfig.pageHeaders.bookToBill}</h1>

// 使用圖表標題
<ChartContainer title={textConfig.bookToBillCharts.heatmap}>

// 使用按鈕文字
<button title={textConfig.common.copyChartTooltip}>
  {copying ? textConfig.common.copying : textConfig.common.copy}
</button>
```

### 方法 2：使用 getText 函數（帶參數替換）

**步驟 1：引入函數**
```javascript
import { getText } from '../config/textConfig';
```

**步驟 2：使用函數**
```javascript
// 簡單使用
const title = getText('common', 'loading');

// 帶參數替換
const chartTitle = getText('bookToBillCharts', 'shipmentWithRatios', {
  offset: selectedOffset
});
```

---

## 🔧 修改文字

### 如何修改現有文字

**步驟 1：** 打開 `dashboard/src/config/textConfig.js`

**步驟 2：** 找到要修改的文字類別和鍵值

**步驟 3：** 直接修改文字內容

**範例：**

**修改前：**
```javascript
common: {
  loading: '載入中...',
  noData: '無數據',
}
```

**修改後：**
```javascript
common: {
  loading: '資料載入中，請稍候...',
  noData: '目前沒有可顯示的數據',
}
```

**步驟 4：** 保存檔案，熱模組更新會自動刷新頁面

### 如何添加新的文字配置

**步驟 1：** 在相應類別中添加新的鍵值

```javascript
common: {
  loading: '載入中...',
  noData: '無數據',
  // 新增：
  processing: '處理中...',
  success: '操作成功！',
}
```

**步驟 2：** 在組件中使用

```javascript
<div>{textConfig.common.processing}</div>
<div>{textConfig.common.success}</div>
```

---

## 📝 已應用的範例

### BookToBill.jsx（已更新）

```javascript
import { textConfig } from '../config/textConfig';

// 頁面標題
<h1>{textConfig.pageHeaders.bookToBill}</h1>

// 年度選擇器
<label>{textConfig.yearSelector.label}</label>
<option value="2025">{textConfig.yearSelector.year2025}</option>

// 錯誤訊息
<h2>{textConfig.common.error}</h2>

// 頁尾註解
<p>{textConfig.footer.bookToBill}</p>
```

### HeatmapChart.jsx（已更新）

```javascript
import { textConfig } from '../config/textConfig';

// 圖表標題
<ChartContainer title={textConfig.bookToBillCharts.heatmap}>

// 按鈕文字
<button title={textConfig.common.copyChartTooltip}>
  {copying ? textConfig.common.copying : textConfig.common.copied : textConfig.common.copy}
</button>

// X軸標籤
{[
  textConfig.monthOffset.plus1,
  textConfig.monthOffset.plus2,
  // ...
].map((label, i) => ...)}

// 圖例標題
<span>{textConfig.heatmapLegend.title}</span>

// 提示框
<span>{textConfig.tooltip.targetMonth}：</span>
<span>{textConfig.tooltip.orderAmount}：</span>
```

---

## 🚀 待更新的組件

以下組件尚未套用 textConfig，建議依相同方式更新：

### 優先更新：
1. ✅ **BookToBill.jsx** - 已完成
2. ✅ **HeatmapChart.jsx** - 已完成
3. ⏳ **BookToBillUpdateDateCharts.jsx** - 待更新
4. ⏳ **FinancialTrends.jsx** - 待更新
5. ⏳ **Charts.jsx** - 待更新（9個圖表）
6. ⏳ **ProductCustomerAnalysis.jsx** - 待更新
7. ⏳ **ProductCustomerCharts.jsx** - 待更新（6個圖表）
8. ⏳ **YearComparison.jsx** - 待更新

### 更新步驟模板：

```javascript
// 1. 引入配置
import { textConfig } from '../config/textConfig';

// 2. 替換硬編碼文字
// 之前：
<ChartContainer title="產品別銷售分析">

// 之後：
<ChartContainer title={textConfig.productCustomerCharts.productSales}>

// 3. 替換錯誤訊息
// 之前：
alert('複製失敗，請重試');

// 之後：
alert(textConfig.common.copyFailed);
```

---

## 🌐 國際化擴展

如果未來需要支持多語言，可以擴展為：

### 方案 1：多個配置檔案

```
config/
  ├── textConfig.zh-TW.js  (繁體中文)
  ├── textConfig.zh-CN.js  (簡體中文)
  ├── textConfig.en-US.js  (英文)
  └── textConfig.js        (當前語言)
```

### 方案 2：使用 i18n 庫

```bash
npm install react-i18next i18next
```

```javascript
// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import textConfig from './config/textConfig';

i18n.use(initReactI18next).init({
  resources: {
    'zh-TW': { translation: textConfig },
    // 添加其他語言...
  },
  lng: 'zh-TW',
  fallbackLng: 'zh-TW',
});
```

---

## ⚡ 性能考慮

### 優點：
- ✅ 文字配置在構建時就確定，無額外性能開銷
- ✅ 使用 ES6 import，支持樹搖優化（tree-shaking）
- ✅ 文字變更會觸發熱模組更新，開發體驗好

### 注意事項：
- 文字配置文件會被包含在打包文件中
- 如果未來支持多語言，考慮按需加載語言包
- 避免在 textConfig 中存放大量數據（如長文章）

---

## 📋 完整配置清單

### 當前可修改的所有文字項目：

#### 共用文字（common）
- `loading` - 載入中...
- `noData` - 無數據
- `error` - 無法載入資料
- `copy` - 📋 複製
- `copying` - 複製中...
- `copied` - ✓ 已複製
- `copyChartTooltip` - 複製圖表為圖片
- `copySuccess` - 已複製
- `copyFailed` - 複製失敗，請重試
- `generateImageFailed` - 生成圖片失敗，請重試
- `noteLabel` - 📝 註解

#### 頁面標題（pageHeaders）
- `financialTrends` - 財務趨勢分析
- `productCustomer` - 產品與客戶分析
- `bookToBill` - 訂單出貨比分析 (Book to Bill Ratio)
- `yearComparison` - 年度比較分析

#### 年度選擇器（yearSelector）
- `label` - 選擇年度：
- `all` - 全部 (2022-2025)
- `year2025` - 2025
- `year2024` - 2024
- `year2023` - 2023
- `year2022` - 2022

#### 財務趨勢圖表（financialCharts）
- `chart1` - 合併營收淨額與銷貨毛利率
- `chart2` - 銷貨退回與折讓
- `chart3` - 營業毛利與營業毛利率
- `chart4` - 存貨與跌價損失
- `chart5` - 閒置產能損失
- `chart6` - 營業費用與營業費用率
- `chart7` - 營業利益與營業利益率
- `chart8` - EBITDA與EBITDA率
- `chart9` - 稅後淨利與稅後淨利率

#### 產品客戶分析圖表（productCustomerCharts）
- `productSales` - 產品別銷售分析
- `customerSales` - 客戶別銷售分析
- `productProfit` - 產品毛利貢獻分析
- `customerABC` - 客戶分級分析 (ABC分類)
- `productMix` - 產品組合分析
- `productBCG` - BCG產品矩陣分析

#### Book to Bill 圖表（bookToBillCharts）
- `heatmap` - Book to Bill 比值熱力圖（未來6個月）
- `shipmentWithRatios` - 實際出貨金額 + +{offset}月比值（1日、10日、20日）
- `selectOffset` - 選擇要顯示的偏移月份：

#### 月份偏移（monthOffset）
- `plus1` - +1月
- `plus2` - +2月
- `plus3` - +3月
- `plus4` - +4月
- `plus5` - +5月
- `plus6` - +6月

#### 熱力圖圖例（heatmapLegend）
- `title` - 圖例：
- `veryStrong` - ≥1.3 極強
- `strong` - ≥1.15 強勁
- `aboveAverage` - ≥1.05 偏強
- `balanced` - 0.95-1.05 平衡
- `belowAverage` - ≥0.85 偏弱
- `weak` - ≥0.7 較弱
- `veryWeak` - <0.7 很弱

---

## 💡 最佳實踐

### ✅ 建議做法：
1. **統一修改** - 所有文字修改都在 textConfig.js 進行
2. **描述性命名** - 使用清晰的鍵名，如 `copyChartTooltip` 而非 `tooltip1`
3. **分類組織** - 將相關文字放在同一類別下
4. **註釋說明** - 對不明顯的鍵名添加註釋
5. **保持一致** - 同樣意思的文字使用同一配置項

### ❌ 避免做法：
1. **不要在組件中硬編碼文字** - 應該使用 textConfig
2. **不要重複定義** - 相同文字應該共用一個配置項
3. **不要過度細分** - 不必要的細分會增加維護成本
4. **不要直接修改組件** - 文字變更應在配置文件中進行

---

## 🔍 快速查找

需要修改某個文字但不知道在哪裡？

**方法 1：搜尋配置文件**
```bash
# 在 textConfig.js 中搜尋關鍵字
grep "載入中" dashboard/src/config/textConfig.js
```

**方法 2：使用編輯器的全局搜尋功能**
- VS Code: `Ctrl+Shift+F` (Windows) 或 `Cmd+Shift+F` (Mac)
- 搜尋 "textConfig" 可以找到所有使用位置

---

## 📞 需要協助？

如果在使用過程中遇到問題：

1. **檢查語法** - 確保 JavaScript 對象語法正確
2. **檢查引用** - 確保組件已正確 import textConfig
3. **查看控制台** - 檢查是否有錯誤訊息
4. **熱更新** - 保存文件後，開發服務器會自動更新

---

## 🎉 總結

透過 textConfig 系統，您現在可以：

- ✅ **集中管理** - 所有文字在一個文件中
- ✅ **快速修改** - 不需要尋找組件代碼
- ✅ **保持一致** - 統一的文字標準
- ✅ **便於維護** - 清晰的結構和分類
- ✅ **擴展性強** - 易於支持多語言

**開始使用：** 打開 `dashboard/src/config/textConfig.js`，直接修改您想要改變的文字！

---

**最後更新**: 2025-10-28
**維護人員**: Claude Code Assistant
