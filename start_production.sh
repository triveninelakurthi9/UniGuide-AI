#!/bin/bash

echo "================================================="
echo "🚀 UniGuide AI — Production Launch Script"
echo "================================================="

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Step 1: Check Docker Installation
if command -v docker &> /dev/null && (command -v docker-compose &> /dev/null || docker compose version &> /dev/null); then
    echo "📦 Docker detected! Building and starting UniGuide AI containers..."
    if command -v docker-compose &> /dev/null; then
        docker-compose up -d --build
    else
        docker compose up -d --build
    fi
else
    echo "ℹ️ Launching UniGuide AI services directly..."
    export PATH=/Users/livesh/recommendation/node_bin/bin:$PATH

    # Kill existing processes on 8000 and 3000
    lsof -ti:8000 | xargs kill -9 2>/dev/null
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    lsof -ti:5173 | xargs kill -9 2>/dev/null

    echo "⚙️ Starting FastAPI backend server on http://localhost:8000..."
    cd "$ROOT_DIR/backend"
    PYTHONPATH=. ./venv/bin/python main.py &

    echo "💻 Starting React frontend server on http://localhost:3000..."
    cd "$ROOT_DIR/frontend"
    npm run dev -- --port 3000 &
fi

echo "================================================="
echo "✅ UniGuide AI Production Services Live!"
echo "💻 Frontend Web App:  http://localhost:3000"
echo "⚙️ FastAPI Backend:   http://localhost:8000"
echo "📖 OpenAPI Swagger:   http://localhost:8000/docs"
echo "================================================="
