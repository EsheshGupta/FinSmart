#!/usr/bin/env bash
# FinSmart local development setup script
set -e

echo "=== FinSmart Setup ==="

# Check prerequisites
command -v docker &>/dev/null || { echo "Docker not found. Install Docker Desktop."; exit 1; }
command -v node &>/dev/null   || { echo "Node.js not found. Install Node 18+."; exit 1; }
command -v python3 &>/dev/null || { echo "Python 3 not found. Install Python 3.11+."; exit 1; }

# Copy env examples
for svc in user-service portfolio-service market-data-service signal-service \
           sentiment-service news-events-service watchlist-service \
           notification-service cohort-service api-gateway; do
  if [ ! -f "backend/$svc/.env" ]; then
    cp "backend/$svc/.env.example" "backend/$svc/.env"
    echo "Created backend/$svc/.env from example"
  fi
done

# Start infrastructure
echo "Starting Docker services (Kafka, Postgres, Redis)..."
docker-compose up -d zookeeper kafka postgres redis

# Install mobile dependencies
echo "Installing mobile dependencies..."
cd mobile && npm install && cd ..

echo ""
echo "Setup complete. Run 'docker-compose up' to start all services."
echo "Then 'cd mobile && npx react-native run-ios' to start the app."
