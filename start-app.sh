#!/bin/bash

echo "Starting Fencing Tracker App setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm v6 or higher."
    exit 1
fi

# Navigate to the app directory
cd "$(dirname "$0")/app"

echo "Installing dependencies... (this may take a few minutes)"
npm install

echo "Starting the development server..."
npm start

# The browser should open automatically, but if not, provide instructions
echo "If the browser doesn't open automatically, navigate to http://localhost:3000"