# Dashboard 雲端部署指南

## 📋 目錄
1. [快速部署（推薦）](#快速部署推薦)
2. [傳統雲端主機部署](#傳統雲端主機部署)
3. [數據更新策略](#數據更新策略)
4. [性能優化](#性能優化)
5. [安全性建議](#安全性建議)
6. [監控與維護](#監控與維護)

---

## 🚀 快速部署（推薦）

### 方案 A：Vercel（最推薦）

**優點：**
- ✅ 完全免費（個人/小型項目）
- ✅ 自動 CI/CD
- ✅ 全球 CDN
- ✅ 自動 HTTPS
- ✅ 零配置部署

**部署步驟：**

1. **安裝 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **在 dashboard 目錄執行部署**
   ```bash
   cd dashboard
   vercel
   ```

3. **跟隨提示操作**
   - 登入 Vercel 帳號
   - 選擇項目設置
   - 確認部署

4. **自動部署設置（可選）**
   - 將代碼推送到 GitHub
   - 在 Vercel 網站導入 GitHub 倉庫
   - 每次 push 自動部署

**自定義域名：**
```bash
vercel --prod
vercel domains add your-domain.com
```

---

### 方案 B：Netlify

**部署步驟：**

1. **安裝 Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **登入並部署**
   ```bash
   cd dashboard
   netlify login
   netlify init
   netlify deploy --prod
   ```

3. **或使用拖放部署**
   - 執行 `npm run build`
   - 將 `dist` 文件夾拖放到 Netlify 網站

---

### 方案 C：Cloudflare Pages

**部署步驟：**

1. **推送代碼到 Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **在 Cloudflare Pages 創建項目**
   - 登入 Cloudflare Dashboard
   - Pages → Create a project
   - 連接 Git 倉庫
   - 設置構建命令：`npm run build`
   - 設置輸出目錄：`dist`

---

## 🖥️ 傳統雲端主機部署

### 適用場景：
- 需要完全控制
- 企業級部署
- 有特殊安全需求

### 推薦主機：

#### 1. **AWS EC2 + S3 + CloudFront**

**部署步驟：**

```bash
# 1. 構建項目
cd dashboard
npm run build

# 2. 安裝 AWS CLI
# (需先安裝 AWS CLI 並配置憑證)

# 3. 創建 S3 Bucket
aws s3 mb s3://your-dashboard-bucket

# 4. 配置靜態網站托管
aws s3 website s3://your-dashboard-bucket \
  --index-document index.html \
  --error-document index.html

# 5. 上傳文件
aws s3 sync dist/ s3://your-dashboard-bucket --delete

# 6. 設置公開訪問
aws s3api put-bucket-policy \
  --bucket your-dashboard-bucket \
  --policy file://s3-policy.json
```

**s3-policy.json：**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-dashboard-bucket/*"
    }
  ]
}
```

#### 2. **Google Cloud Platform (GCP)**

```bash
# 使用 Google Cloud Storage
gsutil mb gs://your-dashboard-bucket
gsutil rsync -R dist/ gs://your-dashboard-bucket
gsutil web set -m index.html -e index.html gs://your-dashboard-bucket
```

#### 3. **Azure Static Web Apps**

```bash
# 使用 Azure CLI
az storage blob upload-batch \
  -s dist \
  -d '$web' \
  --account-name yourstorageaccount
```

#### 4. **一般 Linux 主機 (Ubuntu/CentOS)**

```bash
# 1. 安裝 Nginx
sudo apt update
sudo apt install nginx

# 2. 構建並上傳
npm run build
scp -r dist/* user@your-server:/var/www/dashboard/

# 3. 配置 Nginx
sudo nano /etc/nginx/sites-available/dashboard
```

**Nginx 配置：**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/dashboard;
    index index.html;

    # 支持 React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 緩存靜態資源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 壓縮
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

```bash
# 4. 啟用配置
sudo ln -s /etc/nginx/sites-available/dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 5. 安裝 SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 📊 數據更新策略

### 問題：Excel 數據如何更新？

您的 dashboard 依賴 `public/訂單出貨比.xlsx` 文件。以下是幾種更新策略：

#### 策略 1：手動更新（簡單）

```bash
# 1. 本地重新生成數據
node generate-book-to-bill.js

# 2. 重新部署
vercel --prod
# 或
netlify deploy --prod
```

#### 策略 2：定時自動更新（推薦）

**使用 GitHub Actions：**

創建 `.github/workflows/update-data.yml`：

```yaml
name: Update Dashboard Data

on:
  schedule:
    # 每天 UTC 0:00 執行（台灣時間早上 8:00）
    - cron: '0 0 * * *'
  workflow_dispatch: # 允許手動觸發

jobs:
  update-data:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Generate new data
        run: node generate-book-to-bill.js

      - name: Commit and push if changed
        run: |
          git config --global user.name 'GitHub Actions'
          git config --global user.email 'actions@github.com'
          git add dashboard/public/訂單出貨比.xlsx
          git diff --quiet && git diff --staged --quiet || (git commit -m "Auto update data" && git push)
```

#### 策略 3：API 動態數據（最靈活）

**改造建議：**
1. 將數據生成邏輯移到後端 API
2. 前端通過 API 獲取數據
3. 可以使用 Vercel Serverless Functions 或 AWS Lambda

**示例：Vercel Serverless Function**

創建 `api/data.js`：
```javascript
const XLSX = require('xlsx');

export default function handler(req, res) {
  // 生成數據邏輯
  const data = generateBookToBillData();

  res.status(200).json(data);
}
```

前端修改：
```javascript
// 原本：讀取本地 Excel
const response = await fetch('/訂單出貨比.xlsx');

// 改為：調用 API
const response = await fetch('/api/data');
const data = await response.json();
```

---

## ⚡ 性能優化

### 1. **構建優化**

在 `vite.config.js` 添加：

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'charts': ['recharts'],
          'xlsx': ['xlsx']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### 2. **圖片和靜態資源優化**

```bash
# 壓縮圖片（如有）
npm install -D vite-plugin-imagemin
```

### 3. **Excel 文件優化**

當前 Excel 可能較大，考慮：
- 壓縮 Excel 文件
- 或轉換為 JSON（更小）
- 使用 CDN 托管 Excel 文件

**轉換為 JSON：**

```javascript
// convert-to-json.js
const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('dashboard/public/訂單出貨比.xlsx');
const data = {};

workbook.SheetNames.forEach(sheetName => {
  const worksheet = workbook.Sheets[sheetName];
  data[sheetName] = XLSX.utils.sheet_to_json(worksheet);
});

fs.writeFileSync(
  'dashboard/public/data.json',
  JSON.stringify(data, null, 2)
);

console.log('✅ 已轉換為 JSON');
```

前端讀取：
```javascript
// 修改 bookToBillParser.js
export async function loadBookToBillData() {
  const response = await fetch('/data.json');
  return await response.json();
}
```

### 4. **啟用壓縮**

確保服務器啟用 Gzip 或 Brotli 壓縮（Vercel/Netlify 自動啟用）

---

## 🔒 安全性建議

### 1. **環境變量管理**

如果有敏感數據（API keys 等）：

```bash
# .env.production
VITE_API_URL=https://api.your-domain.com
```

**.gitignore** 添加：
```
.env
.env.local
.env.production
```

### 2. **HTTPS 強制**

所有推薦的平台都自動提供 HTTPS。

如使用自己的服務器，確保配置 SSL 證書（見上面 Nginx 配置）。

### 3. **CORS 設置**

如果連接外部 API：

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://your-api.com',
        changeOrigin: true
      }
    }
  }
})
```

### 4. **內容安全策略 (CSP)**

在 `public/index.html` 添加：

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

---

## 📈 監控與維護

### 1. **性能監控**

**Google Analytics（免費）：**

```html
<!-- public/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

**Vercel Analytics（免費）：**

```bash
npm install @vercel/analytics
```

```javascript
// main.jsx
import { Analytics } from '@vercel/analytics/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
)
```

### 2. **錯誤追蹤**

**Sentry（免費額度）：**

```bash
npm install @sentry/react
```

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### 3. **正常運行時間監控**

**UptimeRobot（免費）：**
- 註冊 uptimerobot.com
- 添加網站監控
- 設置郵件/SMS 警報

### 4. **備份策略**

```bash
# 定期備份代碼到 GitHub
git push origin main

# 定期備份數據文件
cp dashboard/public/訂單出貨比.xlsx backups/訂單出貨比_$(date +%Y%m%d).xlsx
```

---

## 💰 成本估算

### 免費方案（推薦給您）
- **Vercel/Netlify/Cloudflare Pages**：$0/月
- **GitHub**：$0/月（公開倉庫）
- **Google Analytics**：$0/月
- **UptimeRobot**：$0/月（50個監控）

**總計：完全免費！**

### 付費方案（企業級）
- **AWS（S3 + CloudFront）**：約 $5-20/月
- **Vercel Pro**：$20/月
- **Netlify Pro**：$19/月
- **自有 VPS**：$5-50/月

---

## 🎯 推薦部署流程

**對於您的專案，我推薦以下流程：**

1. **初期（最快）**
   ```bash
   cd dashboard
   npm install -g vercel
   vercel
   ```
   - 立即部署
   - 獲得免費域名（xxx.vercel.app）
   - 全球 CDN 加速

2. **中期（穩定）**
   - 連接 GitHub 倉庫
   - 設置自動部署
   - 配置自定義域名（如有）

3. **長期（自動化）**
   - 設置 GitHub Actions 自動更新數據
   - 添加監控和警報
   - 考慮將 Excel 轉為 JSON 提升性能

---

## 📞 需要幫助？

如果在部署過程中遇到問題，可以：
1. 查看平台官方文檔
2. 檢查構建日誌
3. 確認 package.json 中的腳本正確

**常見問題：**

**Q: 部署後數據顯示不出來？**
A: 確認 `public/訂單出貨比.xlsx` 已包含在構建中

**Q: 路由不工作？**
A: 使用 vercel.json 或 netlify.toml 中的重定向配置

**Q: 如何更新數據？**
A: 重新運行 `node generate-book-to-bill.js` 並重新部署

---

## ✅ 檢查清單

部署前確認：
- [ ] `npm run build` 可以成功構建
- [ ] `dist` 文件夾包含所有必要文件
- [ ] Excel 數據文件在 `public` 目錄
- [ ] package.json 包含正確的構建腳本
- [ ] 已測試所有功能正常
- [ ] 已準備好部署平台帳號

部署後確認：
- [ ] 網站可以正常訪問
- [ ] 所有圖表正常顯示
- [ ] 數據載入正確
- [ ] 年度篩選功能正常
- [ ] 圖表交互功能正常
- [ ] 移動端顯示正常（響應式）

---

**祝部署順利！🎉**
