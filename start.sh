#!/usr/bin/env bash
# 启动脚本 — 本地开发/构建入口
# 用法:
#   ./start.sh            开发模式 (next dev)
#   ./start.sh build      静态导出 (输出到 out/)
#   ./start.sh preview    构建静态导出后本地预览 (http://localhost:8000)
set -euo pipefail

cd "$(dirname "$0")"

MODE="${1:-dev}"

if ! command -v node >/dev/null 2>&1; then
  echo "[start] ✗ 未找到 Node.js，请先安装 Node.js 24+" >&2
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "[start] 首次运行，安装依赖 (npm ci) ..."
  npm ci
fi

echo "[start] 校验配置 ..."
npm run validate -- 'config/locales/*.json' 'config/legal/*.json'
npm run check:i18n

case "$MODE" in
  dev)
    exec npm run dev
    ;;
  build)
    exec npm run export
    ;;
  preview)
    npm run export
    echo "[start] 静态站点已导出到 out/，启动预览服务 (Ctrl+C 退出) ..."
    exec python3 -m http.server 8000 --directory out
    ;;
  *)
    echo "Usage: $0 [dev|build|preview]" >&2
    exit 1
    ;;
esac
