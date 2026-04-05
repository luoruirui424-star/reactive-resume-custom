#!/bin/bash

echo "=== 快速重启脚本 ==="
echo "停止容器..."
docker-compose down

echo "重新构建并启动..."
docker-compose up -d --build

echo "等待服务启动..."
sleep 10

echo "检查服务状态..."
docker-compose ps

echo "检查应用健康状态..."
curl -f http://localhost:3000/api/health || echo "健康检查失败，请等待更长时间"

echo "=== 重启完成 ==="