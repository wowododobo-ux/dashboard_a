# 📊 Dashboard 專案

企業級訂單出貨比分析儀表板

## 🚀 快速開始

### 本地開發

```bash
# 1. 生成數據
node generate-book-to-bill.js

# 2. 安裝依賴
cd dashboard
npm install

# 3. 啟動開發服務器
npm run dev
```

訪問 http://localhost:5173

### 生產構建

```bash
npm run build
```

構建文件將輸出到 `dist/` 目錄

## 📦 專案結構

```
dashboard_a/
├── dashboard/                  # React 前端應用
│   ├── src/
│   │   ├── components/        # React 組件
│   │   ├── pages/             # 頁面組件
│   │   ├── utils/             # 工具函數
│   │   └── App.jsx            # 主應用組件
│   ├── public/                # 靜態資源
│   │   └── 訂單出貨比.xlsx    # 數據文件
│   └── package.json
├── generate-book-to-bill.js   # 數據生成腳本
├── deploy.sh                  # 部署腳本
├── DEPLOYMENT_GUIDE.md        # 詳細部署指南
└── README.md                  # 本文件
```

## 📊 功能特性

### 1. Book to Bill 比值熱力圖
- 矩陣視圖顯示未來6個月比值
- 顏色編碼快速識別趨勢
- 支持年度篩選

### 2. 實際出貨金額 + 比值分析
- 長條圖顯示歷史出貨數據
- 3條折線展示1日、10日、20日的預測比值
- 可切換顯示+1到+6月的任意偏移
- 反映業務邏輯：
  - 月內累積效應（20日 > 10日 > 1日）
  - 時間衰減效應（+1月 > +6月）

### 3. 年度篩選
- 支持查看 2022-2025 任意年度數據
- 即時更新所有圖表

## 🌐 雲端部署

### 方法 1：使用部署腳本（推薦）

```bash
# 部署到 Vercel（推薦）
./deploy.sh vercel

# 部署到 Netlify
./deploy.sh netlify

# 只構建不部署
./deploy.sh build
```

### 方法 2：手動部署

**Vercel：**
```bash
npm install -g vercel
cd dashboard
vercel --prod
```

**Netlify：**
```bash
npm install -g netlify-cli
cd dashboard
netlify deploy --prod
```

### 方法 3：Git + 自動部署

1. 推送代碼到 GitHub
2. 在 Vercel/Netlify 網站導入倉庫
3. 自動部署（每次 push 都會觸發）

詳細部署指南請查看 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 🔄 數據更新

### 手動更新

```bash
# 重新生成數據
node generate-book-to-bill.js

# 重新部署
./deploy.sh vercel
```

### 自動更新（推薦）

使用 GitHub Actions 定時自動更新數據（見 DEPLOYMENT_GUIDE.md）

## 💡 技術棧

- **前端框架**: React 18
- **構建工具**: Vite
- **圖表庫**: Recharts
- **數據處理**: SheetJS (xlsx)
- **樣式**: CSS

## 📈 性能優化

- ✅ 代碼分割（Code Splitting）
- ✅ 懶加載（Lazy Loading）
- ✅ CDN 加速
- ✅ Gzip/Brotli 壓縮
- ✅ 靜態資源緩存

## 🔒 安全性

- ✅ HTTPS 加密
- ✅ 內容安全策略（CSP）
- ✅ 無敏感數據暴露
- ✅ 定期依賴更新

## 📝 開發指南

### 修改數據生成邏輯

編輯 `generate-book-to-bill.js` 文件，調整：
- 月份範圍
- 計算公式
- 業務邏輯參數

### 添加新圖表

1. 在 `src/components/` 創建新組件
2. 在對應頁面導入並使用
3. 確保遵循現有的樣式規範

### 修改樣式

全局樣式位於 `src/App.css`

## 🐛 常見問題

**Q: 構建失敗？**
```bash
# 清除緩存重新安裝
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Q: 圖表不顯示？**
- 確認 `public/訂單出貨比.xlsx` 文件存在
- 檢查瀏覽器控制台錯誤

**Q: 部署後數據不更新？**
- 重新生成數據並部署
- 清除瀏覽器緩存

## 📊 系統需求

- Node.js 18+
- npm 8+
- 現代瀏覽器（Chrome, Firefox, Safari, Edge）

## 📄 授權

All rights reserved.

## 👥 支持

如有問題或建議，請聯繫開發團隊。

---

**最後更新**: 2025-10-28
