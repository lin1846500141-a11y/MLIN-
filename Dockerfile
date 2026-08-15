# ============ 阶段 1:构建前端 ============
FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci || npm install
COPY frontend/ ./
RUN npm run build

# ============ 阶段 2:运行后端 ============
FROM python:3.11-slim
WORKDIR /app/backend
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./
# 前端打包产物拷到 backend 的兄弟目录(frontend/dist),与 main.py 里的路径对应
COPY --from=frontend /app/frontend/dist /app/frontend/dist
EXPOSE 8000
# 用 $PORT 适配 Render 注入的端口;本地默认 8000
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
