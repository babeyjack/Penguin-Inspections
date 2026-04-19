#!/bin/sh
ECHO "Updating the application..."

ECHO "Pulling the latest changes from the repository..."
git pull origin main

ECHO "Restarting the application..."
sh start.sh

ECHO "Application has been updated and restarted successfully!"
