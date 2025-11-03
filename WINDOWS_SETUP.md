# 🪟 Windows 電腦設置指南

此指南說明如何在 Windows 電腦上下載並執行 dashboard-local 專案。

## 📋 前置需求

### 1. 安裝 Node.js

**下載並安裝 Node.js LTS 版本**：
1. 訪問 https://nodejs.org/
2. 下載 "LTS" 版本（建議 18.x 或更新）
3. 執行安裝程式，全部使用預設選項
4. 安裝完成後，重新啟動電腦

**驗證安裝**：
```cmd
node --version
npm --version
```

### 2. 安裝 Git

**下載並安裝 Git**：
1. 訪問 https://git-scm.com/download/win
2. 下載並執行安裝程式
3. 安裝時全部使用預設選項

**驗證安裝**：
```cmd
git --version
```

## 📥 從 GitHub 下載專案

### 方法 1：使用 Git Clone（推薦）

```cmd
# 1. 開啟命令提示字元（CMD）或 PowerShell

# 2. 切換到你想存放專案的目錄，例如：
cd C:\Users\你的使用者名稱\Documents

# 3. Clone 專案
git clone https://github.com/你的帳號/專案名稱.git

# 4. 進入專案目錄
cd 專案名稱
```

### 方法 2：下載 ZIP 檔案

1. 訪問 GitHub 專案頁面
2. 點擊綠色 "Code" 按鈕
3. 選擇 "Download ZIP"
4. 解壓縮到你想要的位置
5. 用命令提示字元進入該目錄

## 🚀 啟動開發服務器

### 步驟 1：進入 dashboard-local 資料夾

```cmd
cd dashboard-local
```

### 步驟 2：安裝依賴

```cmd
npm install
```

這個步驟會：
- 下載所有需要的套件（約 209 個）
- 需要幾分鐘時間
- 需要網路連線

### 步驟 3：啟動開發服務器

```cmd
npm run dev
```

你會看到類似這樣的輸出：
```
VITE v7.1.12  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 步驟 4：開啟瀏覽器

在瀏覽器輸入：
```
http://localhost:5173/
```

或按住 `Ctrl` 鍵並點擊終端機中的連結。

## 🛑 停止服務器

在命令提示字元視窗中按 `Ctrl + C`，然後輸入 `Y` 確認。

## 🔄 下次啟動

以後要再次啟動，只需要：

```cmd
# 1. 進入專案資料夾
cd C:\Users\你的使用者名稱\Documents\專案名稱\dashboard-local

# 2. 啟動服務器（不需要再次 npm install）
npm run dev

# 3. 開啟 http://localhost:5173/
```

## 📝 常見問題

### Q: 出現 "npm 不是內部或外部命令"

**解決方法**：
1. 確認 Node.js 已正確安裝
2. 重新啟動電腦
3. 重新開啟命令提示字元

### Q: npm install 失敗

**解決方法**：
```cmd
# 清除快取並重試
npm cache clean --force
npm install
```

### Q: 無法訪問 localhost:5173

**解決方法**：
1. 確認服務器有正常啟動
2. 檢查防火牆設定
3. 嘗試使用 127.0.0.1:5173

### Q: 修改代碼後沒有更新

**解決方法**：
- Vite 支援熱重載，修改會自動更新
- 如果沒有更新，重新整理瀏覽器（F5）

### Q: 如何更新到最新版本

```cmd
# 在專案根目錄執行
git pull origin main

# 重新安裝依賴（如果有更新）
cd dashboard-local
npm install

# 啟動
npm run dev
```

## 🔧 開發工具建議

### 推薦的程式碼編輯器

**Visual Studio Code**（免費）：
1. 下載：https://code.visualstudio.com/
2. 安裝推薦的擴充套件：
   - ESLint
   - Prettier - Code formatter
   - Vite

**使用 VS Code 開啟專案**：
```cmd
# 在專案目錄執行
code .
```

### 推薦的終端機

**Windows Terminal**（免費）：
1. 從 Microsoft Store 下載
2. 比傳統 CMD 更好用
3. 支援多標籤、分割視窗

## 📊 系統需求

### 最低需求
- Windows 10 或更新版本
- 4GB RAM
- 2GB 可用硬碟空間

### 建議需求
- Windows 11
- 8GB RAM 或更多
- SSD 硬碟
- 穩定的網路連線

## 🎯 快速參考

```cmd
# 安裝依賴
npm install

# 啟動開發服務器
npm run dev

# 構建生產版本
npm run build

# 預覽生產版本
npm run preview

# 檢查程式碼
npm run lint
```

## 📱 訪問網址

- **本機**: http://localhost:5173/
- **區域網路**: 需要執行 `npm run dev -- --host`

## 💡 提示

1. **保持終端機開啟**：開發服務器運行時，不要關閉命令提示字元視窗
2. **自動儲存**：修改代碼後，Vite 會自動重新載入頁面
3. **使用 Git**：定期使用 `git pull` 獲取最新更新
4. **備份數據**：修改數據檔案前先備份

## 🆘 獲取幫助

如遇到問題：
1. 檢查本文件的「常見問題」章節
2. 查看終端機的錯誤訊息
3. 聯繫開發團隊

---

**最後更新**: 2025-11-03
**適用版本**: Windows 10/11
