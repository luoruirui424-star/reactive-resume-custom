#!/bin/bash

echo "=== 服务器快速部署脚本 ==="

# 拉取最新代码
echo "拉取最新代码..."
git pull origin main

# 如果有依赖变化，重新安装
if [ -f "pnpm-lock.yaml" ]; then
    echo "检查依赖变化..."
    # 这里可以添加更智能的依赖检查
fi

# 重启服务
echo "重启服务..."
docker-compose down
docker-compose up -d --build

echo "等待服务启动..."
sleep 15

echo "检查服务状态..."
docker-compose ps

echo "=== 部署完成 ==="