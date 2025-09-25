#!/bin/bash

echo "🚀 PulseHub 启动脚本"
echo "===================="

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js 16+"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm，请先安装 npm"
    exit 1
fi

echo "✅ Node.js 和 npm 已安装"

# 安装依赖
echo "📦 正在安装依赖..."
npm run install:all

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"

# 启动开发服务器
echo "🎯 启动开发服务器..."
echo "前端: http://localhost:3000"
echo "后端: http://localhost:3001"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev
