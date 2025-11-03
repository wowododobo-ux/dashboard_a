# 📊 企業級綜合分析儀表板

全方位企業營運數據分析平台，整合財務、生產、市場、供應鏈等多維度指標

## 🚀 快速開始

### 本地開發

```bash
# 1. 進入本機開發資料夾
cd dashboard-local

# 2. 安裝依賴
npm install

# 3. 啟動開發服務器
npm run dev
```

瀏覽器將自動開啟 http://localhost:5173

### Vercel 部署

```bash
# 1. 進入 Vercel 部署資料夾
cd dashboard-vercel

# 2. 安裝依賴
npm install

# 3. 構建專案
npm run build

# 4. 部署到 Vercel
vercel --prod
```

## 📦 專案結構

```
dashboard_a/
├── dashboard-local/               # 本機開發版本
│   ├── src/
│   │   ├── components/           # 可重用組件
│   │   ├── pages/                # 頁面組件（11個分析模組）
│   │   ├── utils/                # 工具函數與數據解析器
│   │   ├── config/               # 配置文件
│   │   ├── hooks/                # 自定義 React Hooks
│   │   └── App.jsx               # 主應用組件
│   ├── public/                   # 靜態資源與數據文件
│   ├── vite.config.js            # 本機開發配置
│   └── README.md                 # 本機開發說明
│
├── dashboard-vercel/              # Vercel 部署版本
│   ├── src/                      # （與 dashboard-local 同步）
│   ├── public/                   # （與 dashboard-local 同步）
│   ├── vite.config.js            # 生產環境配置
│   └── README.md                 # 部署說明
│
├── sync-to-vercel.sh             # 同步腳本（local → vercel）
├── LEGEND_CONFIG_GUIDE.md        # 圖例配置指南
├── TEXT_CONFIG_GUIDE.md          # 文字配置指南
├── vercel.json                   # Vercel 部署配置
└── README.md                     # 本文件
```

### 📁 資料夾說明

- **dashboard-local**: 用於本機開發，所有開發工作在此進行
- **dashboard-vercel**: 用於 Vercel 部署，從 dashboard-local 同步

### 🔄 開發流程

1. 在 `dashboard-local` 進行開發
2. 測試功能正常
3. 同步到 `dashboard-vercel`
4. 部署到 Vercel

### 同步命令

**方法 1：使用同步腳本（推薦）**

```bash
# 從專案根目錄執行
./sync-to-vercel.sh
```

**方法 2：手動同步**

```bash
# 從專案根目錄執行
rsync -av --delete dashboard-local/src/ dashboard-vercel/src/
rsync -av --delete dashboard-local/public/ dashboard-vercel/public/
cp dashboard-local/package.json dashboard-vercel/package.json
```

**注意**：不要同步 `vite.config.js`，兩個版本的配置不同！

## 📊 功能模組

### 1. 首頁儀表板
- Top KPIs 總覽
- 關鍵指標即時監控
- 快速導航至各分析模組

### 2. 財務趨勢分析
- 營收與成本趨勢
- 毛利率分析
- 獲利能力評估
- 年度對比功能

### 3. 產品與客戶分析
- 產品別銷售獲利分析
- 客戶別貢獻度分析
- ABC 分類管理
- 產品組合優化建議

### 4. Book-to-Bill 訂單出貨比
- 比值熱力圖（未來 6 個月預測）
- 實際出貨金額趨勢
- 1日/10日/20日預測比值
- 月內累積與時間衰減效應分析

### 5. 生產營運指標
- 產能利用率
- 良率分析
- 機台健康度監控
- 生產排程達成率

### 6. 市場與客戶指標
- 市場佔有率
- 客戶滿意度
- 新客戶開發進度
- 市場趨勢分析

### 7. 供應鏈管理
- 原材料庫存水位
- 供應商績效評估
- 交期達成率
- 供應鏈風險監控

### 8. 研發與技術
- 研發投入比例
- 專利申請進度
- 新產品開發時程
- 技術創新指標

### 9. 人力資源
- 人力配置分析
- 流動率統計
- 訓練發展進度
- 人力成本分析

### 10. 風險管理
- 風險地圖
- 關鍵風險指標
- 風險應對措施追蹤
- 合規性監控

### 11. 年度對比分析
- 跨年度數據比較
- 趨勢變化分析
- 成長率計算

## 🌐 雲端部署

### 方法 1：Vercel CLI 部署（推薦）

```bash
# 安裝 Vercel CLI
npm install -g vercel

# 進入 Vercel 部署資料夾
cd dashboard-vercel

# 部署到生產環境
vercel --prod
```

### 方法 2：Git + 自動部署（最簡單）

1. 將代碼推送到 GitHub
2. 登入 [Vercel Dashboard](https://vercel.com)
3. 點擊 "New Project" 導入 GitHub 倉庫
4. 配置構建設定：
   - **Root Directory**: `dashboard-vercel`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Framework Preset**: Vite
5. 點擊 "Deploy" 完成！

每次推送到 GitHub，Vercel 會自動構建並部署最新版本。

**配置文件**：
- 根目錄的 `vercel.json` - 用於根目錄部署
- `dashboard-vercel/vercel.json` - 用於子目錄部署

## 🔄 數據更新

### 更新數據文件

1. 將新的 Excel 文件放入 `dashboard/public/` 目錄
2. 確保文件名稱與現有文件一致
3. 重新構建並部署

```bash
cd dashboard
npm run build
vercel --prod  # 或使用 Git 推送觸發自動部署
```

### 支援的數據格式

所有數據文件使用 Excel (.xlsx) 格式，透過 SheetJS 解析並動態載入

## 💡 技術棧

- **前端框架**: React 19
- **路由管理**: React Router DOM v7
- **構建工具**: Vite 7
- **圖表庫**: Recharts 3
- **數據處理**: SheetJS (xlsx)
- **截圖功能**: html2canvas
- **樣式**: CSS3 (響應式設計)
- **開發工具**: ESLint, TypeScript 類型定義

## 📈 性能優化

- ✅ **頁面級代碼分割**：使用 React.lazy() 實現按需載入
- ✅ **路由懶加載**：每個頁面只在訪問時才載入
- ✅ **Chunk 分割優化**：配置 500KB chunk size 警告限制
- ✅ **動態數據載入**：Excel 文件按需解析
- ✅ **CDN 加速**：靜態資源透過 CDN 分發
- ✅ **Gzip/Brotli 壓縮**：自動壓縮傳輸
- ✅ **快取策略**：合理的瀏覽器快取設定
- ✅ **響應式圖片**：根據設備載入適當尺寸的 logo

## 🔒 安全性

- ✅ HTTPS 加密傳輸
- ✅ 內容安全策略（CSP）
- ✅ 無敏感數據暴露
- ✅ 定期依賴安全更新
- ✅ XSS 防護

## 📝 開發指南

### 添加新的分析模組

1. 在 `dashboard/public/` 放置數據文件（.xlsx）
2. 在 `src/utils/` 創建對應的解析器（參考現有 parser）
3. 在 `src/pages/` 創建新頁面組件
4. 在 `src/components/` 創建圖表組件
5. 在 `App.jsx` 添加路由
6. 更新導航選單

### 修改圖例與文字配置

- **圖例配置**：參考 `LEGEND_CONFIG_GUIDE.md`
- **文字配置**：參考 `TEXT_CONFIG_GUIDE.md`
- 配置文件位於 `src/config/`

### 自訂樣式

- **全局樣式**：`src/App.css`
- **組件樣式**：各組件內的 inline styles 或專屬 CSS
- **響應式設計**：使用 `useResponsive` hook

### 數據解析器開發

所有解析器位於 `src/utils/`，統一格式：
```javascript
export function parseXXXData(workbook) {
  // 讀取工作表
  // 解析數據
  // 返回標準化數據結構
}
```

## 🐛 常見問題

**Q: 構建失敗或出現依賴錯誤？**
```bash
# 清除快取並重新安裝
cd dashboard
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Q: 圖表不顯示或數據載入失敗？**
- 確認對應的 .xlsx 文件在 `dashboard/public/` 目錄中
- 檢查瀏覽器開發者工具的 Console 和 Network 標籤
- 確認文件名稱正確（含中文字符）
- 檢查文件格式是否為標準 Excel (.xlsx)

**Q: 部署後數據不更新？**
- 確認新數據文件已正確上傳到 `public/` 目錄
- 清除瀏覽器快取（Ctrl+Shift+R 或 Cmd+Shift+R）
- 確認 CDN 快取已更新（可能需要等待幾分鐘）

**Q: 某個頁面載入很慢？**
- 這是正常的，首次訪問時需要載入該頁面的代碼和數據
- 使用代碼分割技術，只有訪問時才載入該頁面
- 再次訪問會快很多（已快取）

**Q: 在行動裝置上顯示不正常？**
- 專案已支援響應式設計
- 確認使用最新版本的瀏覽器
- 某些複雜圖表在小螢幕上可能需要橫向顯示

**Q: 如何修改配置檔案？**
- 圖例配置：參考 `LEGEND_CONFIG_GUIDE.md`
- 文字配置：參考 `TEXT_CONFIG_GUIDE.md`
- 兩份詳細指南提供完整的配置說明

## 📊 系統需求

### 開發環境
- Node.js 18+ (建議使用 LTS 版本)
- npm 8+ 或 yarn 1.22+
- 支援 ES6+ 的代碼編輯器（推薦 VS Code）

### 生產環境
- 現代瀏覽器（建議版本）：
  - Chrome 90+
  - Firefox 88+
  - Safari 14+
  - Edge 90+
- 支援 JavaScript ES2015+
- 啟用 JavaScript

## 🎯 專案特色

✨ **模組化設計**：11 個獨立分析模組，易於擴展
⚡ **高效能載入**：頁面級代碼分割，初始載入快速
📱 **響應式介面**：完美支援桌面與行動裝置
🔄 **即時更新**：更換數據文件即可更新內容
🎨 **可配置化**：圖例和文字均可透過配置文件調整
📊 **豐富圖表**：整合 Recharts 提供多樣化視覺呈現

## 📄 授權

All rights reserved.

## 👥 技術支持

如有問題或建議，請聯繫開發團隊。

---

**最後更新**: 2025-11-03
**版本**: 2.0 - 綜合分析平台
