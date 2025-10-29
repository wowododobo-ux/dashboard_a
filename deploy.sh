#!/bin/bash

# Dashboard 快速部署腳本
# 使用方法：./deploy.sh [platform]
# 支持的平台：vercel, netlify, build

set -e

PLATFORM=${1:-vercel}

echo "🚀 Dashboard 部署腳本"
echo "===================="

# 檢查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 錯誤：未安裝 Node.js"
    echo "請先安裝 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node -v)"

# 進入 dashboard 目錄
cd dashboard

# 安裝依賴
echo ""
echo "📦 安裝依賴..."
npm install

# 生成最新數據
echo ""
echo "📊 生成最新數據..."
cd ..
node generate-book-to-bill.js
cd dashboard

# 測試構建
echo ""
echo "🔨 測試構建..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 構建成功！"
else
    echo "❌ 構建失敗，請檢查錯誤信息"
    exit 1
fi

# 根據平台部署
case $PLATFORM in
    vercel)
        echo ""
        echo "🌐 部署到 Vercel..."
        if ! command -v vercel &> /dev/null; then
            echo "⚠️  未安裝 Vercel CLI，正在安裝..."
            npm install -g vercel
        fi
        vercel --prod
        ;;

    netlify)
        echo ""
        echo "🌐 部署到 Netlify..."
        if ! command -v netlify &> /dev/null; then
            echo "⚠️  未安裝 Netlify CLI，正在安裝..."
            npm install -g netlify-cli
        fi
        netlify deploy --prod
        ;;

    build)
        echo ""
        echo "✅ 只構建，不部署"
        echo "📁 構建文件位於: dashboard/dist/"
        echo ""
        echo "您可以手動上傳 dist 文件夾到任何靜態托管服務"
        ;;

    *)
        echo ""
        echo "❌ 不支持的平台: $PLATFORM"
        echo "支持的平台: vercel, netlify, build"
        exit 1
        ;;
esac

echo ""
echo "🎉 完成！"
