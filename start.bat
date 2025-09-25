@echo off
echo 🚀 PulseHub 启动脚本
echo ====================

REM 检查 Node.js 是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 Node.js，请先安装 Node.js 16+
    pause
    exit /b 1
)

REM 检查 npm 是否安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未找到 npm，请先安装 npm
    pause
    exit /b 1
)

echo ✅ Node.js 和 npm 已安装

REM 安装依赖
echo 📦 正在安装依赖...
call npm run install:all

if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    pause
    exit /b 1
)

echo ✅ 依赖安装完成

REM 启动开发服务器
echo 🎯 启动开发服务器...
echo 前端: http://localhost:3000
echo 后端: http://localhost:3001
echo.
echo 按 Ctrl+C 停止服务器
echo.

call npm run dev
