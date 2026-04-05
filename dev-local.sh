#!/bin/bash

echo "=== 本地开发环境启动脚本 ==="

# 检查Node.js和pnpm
if ! command -v node &> /dev/null; then
    echo "请先安装Node.js"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "请先安装pnpm: npm install -g pnpm"
    exit 1
fi

# 安装依赖
echo "安装依赖..."
pnpm install

# 启动开发服务器
echo "启动开发服务器..."
pnpm dev