#!/bin/bash

# Function to display colorful logs
function color_log {
    echo -e "\n\e[1;34m >> $1\e[0m"  # Blue color for log messages
}

# Function to stop and remove Docker containers
function docker_compose_down {
    color_log "Stopping and removing Docker containers..."
    docker compose down
    color_log "Docker containers stopped and removed successfully."
}

# Function to remove Docker volumes
function remove_volumes {
    color_log "Removing Docker volumes..."
    docker volume rm nadin-soft_mysql-data nadin-soft_redis-data
    color_log "Docker volumes removed successfully."
}

# Check if .env file exists, if not, copy .env.sample
if [ ! -f .env ]; then
    color_log ".env file does not exist, copying .env.sample..."
    cp .env.sample .env
fi

# Call the function to stop and remove containers
docker_compose_down

# Call the function to remove MySQL data volume
remove_volumes
