#!/bin/bash

set -e

# Function to display colorful logs
function color_log {
    echo -e "\n\e[1;34m >> $1\e[0m"  # Blue color for log messages
}

# Function to stop and remove Docker containers
function docker_compose_down {
    color_log "An error occurred. Stopping and removing Docker containers..."
    docker compose down
    docker volume rm nadin-soft_mysql-data nadin-soft_redis-data
    color_log "Docker containers stopped and removed successfully."
}

# Check if .env file exists, if not, copy .env.sample
if [ ! -f .env ]; then
    color_log ".env file does not exist, copying .env.sample..."
    cp .env.sample .env
fi

# Start Docker Compose
color_log "Starting Docker Compose..."
docker compose up -d || { docker_compose_down; exit 1; }

# Wait for MySQL to be ready
color_log "Waiting for MySQL to be ready..."
until docker exec mysql mysql -h localhost -u root -e 'SELECT 1;' &>/dev/null; do
    sleep 1
done
color_log "MySQL is ready."

# Check if pnpm is installed, if not, install it
if ! command -v pnpm &> /dev/null; then
    color_log "pnpm is not installed, installing..."
    npm install -g pnpm
fi

# Install dependencies
color_log "Installing dependencies..."
pnpm i || { docker_compose_down; exit 1; }

# Run migration
color_log "Running migration..."
while true; do
    pnpm migration:run && break || { color_log "Migration failed, waiting and retrying..."; sleep 1; }
done

color_log "All tasks completed successfully. Starting the server.."
pnpm start || { docker_compose_down; exit 1; }
