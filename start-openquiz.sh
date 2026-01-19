#!/bin/bash

# OpenQuiz Launcher for macOS/Linux
# Run this script to start OpenQuiz

echo ""
echo "========================================"
echo "   Starting OpenQuiz"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    echo "This may take a few minutes on first run."
    echo ""
    npm install
    echo ""
fi

# Start the launcher
echo "Starting server..."
node launcher.js
