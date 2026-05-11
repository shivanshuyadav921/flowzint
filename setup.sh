#!/bin/bash
set -e

echo "=== Flowzint AI Interview Assistant Setup ==="
echo ""

# Check Python version
echo "Checking Python version..."
python --version

# Setup backend
echo ""
echo "Setting up backend..."
cd backend

if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp ../.env.example .env
fi

echo "Installing backend dependencies..."
pip install -r requirements.txt

echo "Backend setup complete!"

# Setup frontend
cd ../frontend

if [ ! -f .env.local ]; then
    echo "Creating .env.local file from .env.example..."
    cp .env.example .env.local
fi

echo "Installing frontend dependencies..."
npm install

echo ""
echo "=== Setup Complete ==="
echo ""
echo "To start the application:"
echo ""
echo "Option 1 - Docker:"
echo "  docker-compose up --build"
echo ""
echo "Option 2 - Manual:"
echo "  Terminal 1 (Backend): cd backend && uvicorn app.main:app --reload"
echo "  Terminal 2 (Frontend): cd frontend && npm run dev"
echo ""
