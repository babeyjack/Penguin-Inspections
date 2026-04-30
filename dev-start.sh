#!/bin/sh
echo "Starting development server..."

echo "Stopping any running Docker Compose services..."
docker compose down

echo "Cleaning up MySQL data directory..."
# rm -rf /mySQL/data

# Check if .env exists and has NODE_ENV set to DEV
if [ ! -f ".env" ]; then
    echo "Error: .env file not found"
    exit 1
fi

if ! grep -q "^NODE_ENV=DEV" .env; then
    echo "Error: NODE_ENV must be set to 'DEV' in .env file"
    exit 1
fi

echo "Starting Docker Compose services..."
docker compose up --build -d

echo "Servers are starting up. Please wait a moment..."
sleep 10

docker ps | grep "penguin-inspections"
echo "Servers are up and running!"

echo "Accessing logs"
docker compose logs -f

PAUSE