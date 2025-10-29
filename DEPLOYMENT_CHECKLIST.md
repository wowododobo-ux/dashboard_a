# 🚀 部署檢查清單

## 📋 部署前檢查

### 1. 代碼準備
- [ ] 所有功能已測試完成
- [ ] 已生成最新數據（`node generate-book-to-bill.js`）
- [ ] 本地開發環境運行正常（`npm run dev`）
- [ ] 已清理不必要的 console.log
- [ ] 已更新版本號（如適用）

### 2. 構建測試
- [ ] 執行 `cd dashboard && npm run build` 成功
- [ ] 檢查構建大小合理（< 5MB）
- [ ] 預覽構建結果（`npm run preview`）
- [ ] 所有圖表正常顯示
- [ ] 數據正確載入

### 3. 文件檢查
- [ ] `package.json` 包含正確的腳本
- [ ] `public/訂單出貨比.xlsx` 文件存在
- [ ] `.gitignore` 配置正確
- [ ] README.md 已更新

### 4. 配置文件
- [ ] `vercel.json` 配置正確（如使用 Vercel）
- [ ] `netlify.toml` 配置正確（如使用 Netlify）
- [ ] 環境變量已設置（如有需要）

## 🌐 選擇部署平台

### 推薦順序：

#### ⭐ 方案 1: Vercel（最推薦）
**優點**：
- ✅ 完全免費
- ✅ 零配置
- ✅ 全球 CDN
- ✅ 自動 HTTPS
- ✅ 秒級部署

**部署命令**：
```bash
./deploy.sh vercel
```

**適合場景**：
- 個人項目
- 快速原型
- 中小型企業

---

#### 🌟 方案 2: Netlify
**優點**：
- ✅ 免費額度充足
- ✅ 易於使用
- ✅ 表單處理功能
- ✅ 拖放部署

**部署命令**：
```bash
./deploy.sh netlify
```

**適合場景**：
- 靜態網站
- JAMstack 應用
- 需要表單功能

---

#### ☁️ 方案 3: Cloudflare Pages
**優點**：
- ✅ 完全免費（無限流量）
- ✅ 全球最快 CDN
- ✅ Workers 集成

**部署步驟**：
1. 推送代碼到 Git
2. 在 Cloudflare Pages 連接倉庫
3. 自動部署

**適合場景**：
- 高流量網站
- 需要極致性能
- 全球訪問

---

#### 💼 方案 4: AWS（企業級）
**優點**：
- ✅ 完全控制
- ✅ 企業級安全
- ✅ 高度可定制

**適合場景**：
- 大型企業
- 需要與 AWS 其他服務集成
- 有專業運維團隊

## 📝 第一次部署步驟

### 使用 Vercel（最快 5 分鐘）

```bash
# 1. 安裝 Vercel CLI
npm install -g vercel

# 2. 登入（會打開瀏覽器）
vercel login

# 3. 部署
cd dashboard
vercel

# 首次部署會詢問：
# ? Set up and deploy "~/dashboard"? [Y/n] Y
# ? Which scope do you want to deploy to? Your Name
# ? Link to existing project? [y/N] N
# ? What's your project's name? dashboard
# ? In which directory is your code located? ./

# 4. 生產環境部署
vercel --prod
```

**完成！** 您會得到一個 URL，例如 `https://dashboard-xxx.vercel.app`

### 使用 GitHub + Vercel（推薦生產環境）

```bash
# 1. 初始化 Git（如果還沒有）
git init
git add .
git commit -m "Initial commit"

# 2. 推送到 GitHub
git remote add origin https://github.com/yourusername/dashboard.git
git branch -M main
git push -u origin main

# 3. 在 Vercel 網站：
# - 登入 vercel.com
# - 點擊 "New Project"
# - 導入 GitHub 倉庫
# - 確認設置後點擊 "Deploy"

# 完成！每次 git push 都會自動部署
```

## 🔄 數據更新流程

### 方法 1: 手動更新

```bash
# 1. 生成新數據
node generate-book-to-bill.js

# 2. 提交更改
git add dashboard/public/訂單出貨比.xlsx
git commit -m "Update data"
git push

# 自動觸發重新部署（如果設置了 Git 集成）
```

### 方法 2: 自動更新（推薦）

創建 `.github/workflows/update-data.yml`：

```yaml
name: Update Data Daily

on:
  schedule:
    - cron: '0 0 * * *'  # 每天 UTC 0:00
  workflow_dispatch:     # 允許手動觸發

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Generate data
        run: node generate-book-to-bill.js

      - name: Commit changes
        run: |
          git config user.name github-actions
          git config user.email github-actions@github.com
          git add dashboard/public/訂單出貨比.xlsx
          git diff --quiet && git diff --staged --quiet || \
            (git commit -m "Auto update data [skip ci]" && git push)
```

## ✅ 部署後驗證

### 功能測試清單

- [ ] 網站可以訪問
- [ ] 首頁正常載入
- [ ] 所有導航鏈接正常
- [ ] 數據正確顯示

### Book to Bill 頁面測試

- [ ] 熱力圖正常顯示
- [ ] 可以懸停查看詳細信息
- [ ] 顏色編碼正確
- [ ] 實際出貨金額圖表正常
- [ ] 3條折線清晰可見
- [ ] 可以切換+1到+6月
- [ ] 年度篩選功能正常
- [ ] 切換年度時數據正確更新

### 其他頁面測試

- [ ] 產品客戶分析頁面正常
- [ ] 財務趨勢頁面正常
- [ ] 所有圖表可以複製

### 性能測試

- [ ] 首次載入 < 3 秒
- [ ] 圖表切換流暢
- [ ] 移動端顯示正常
- [ ] 不同瀏覽器測試通過

### SEO 和分享

- [ ] 頁面標題正確
- [ ] Meta 描述適當（如需要）
- [ ] Favicon 顯示（如有）

## 📊 監控設置

### 1. 添加 Analytics（可選）

**Vercel Analytics**（免費）：
```bash
npm install @vercel/analytics
```

在 `main.jsx` 添加：
```javascript
import { Analytics } from '@vercel/analytics/react';

<App />
<Analytics />
```

### 2. 正常運行時間監控

註冊免費服務：
- UptimeRobot: https://uptimerobot.com
- StatusCake: https://www.statuscake.com

添加您的部署 URL 進行監控

### 3. 錯誤追蹤（可選）

**Sentry**（免費額度）：
```bash
npm install @sentry/react
```

## 🎯 完整部署時間線

### 第一次部署（約 10-15 分鐘）

```
0:00  ✓ 檢查代碼和數據
0:02  ✓ 測試構建
0:05  ✓ 註冊部署平台帳號
0:07  ✓ 安裝 CLI 工具
0:08  ✓ 執行部署命令
0:10  ✓ 部署完成
0:12  ✓ 驗證功能
0:15  ✓ 設置監控（可選）
```

### 後續更新（約 1-2 分鐘）

```
0:00  ✓ 更新數據/代碼
0:00  ✓ git push
0:01  ✓ 自動部署
0:02  ✓ 部署完成
```

## 🆘 常見問題解決

### 問題 1: 構建失敗

```bash
# 清除緩存
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 問題 2: 數據不顯示

檢查：
1. Excel 文件是否在 `public/` 目錄
2. 檔案名稱是否正確
3. 瀏覽器控制台是否有錯誤

### 問題 3: 路由 404 錯誤

確保 `vercel.json` 或 `netlify.toml` 配置了重定向

### 問題 4: 部署後數據舊的

```bash
# 清除部署緩存
vercel --force  # Vercel
netlify deploy --prod --clear-cache  # Netlify
```

## 📞 獲取幫助

如遇到問題：

1. **查看日誌**
   - Vercel: 部署頁面 → Deployment Logs
   - Netlify: Deploys → Build Logs

2. **查看文檔**
   - Vercel: https://vercel.com/docs
   - Netlify: https://docs.netlify.com

3. **社群支持**
   - Vercel Discord
   - Netlify Community

## 🎉 部署成功！

恭喜！您的 Dashboard 已成功部署。

**下一步：**
- [ ] 分享 URL 給團隊
- [ ] 設置自定義域名（如需要）
- [ ] 配置自動更新（如需要）
- [ ] 添加監控和警報
- [ ] 定期備份數據

---

**記住**：第一次可能需要 10-15 分鐘，但之後每次更新只需 1-2 分鐘！

**保持簡單**：使用 Vercel 或 Netlify，讓平台處理複雜的配置。

**享受成果**：您的 Dashboard 現在可以在全球任何地方訪問！🌍
