# 🚀 OpenQuiz Desktop Launcher

Launch OpenQuiz like a desktop app with automatic browser opening!

## Quick Start

### Windows
**Double-click:** `start-openquiz.bat`

### macOS / Linux
**Run:** `./start-openquiz.sh`

Or use Terminal:
```bash
npm start
```

## What It Does

1. ✅ Automatically installs dependencies (first run only)
2. ✅ Starts the Vite dev server
3. ✅ Opens your default browser to OpenQuiz
4. ✅ Shows server logs in the console
5. ✅ Handles graceful shutdown with Ctrl+C

## Requirements

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)

Check if you have them:
```bash
node --version
npm --version
```

If not installed, download from: https://nodejs.org/

## Alternative Launch Methods

### Method 1: NPM Script (Recommended)
```bash
npm start
```

### Method 2: Direct Node
```bash
node launcher.js
```

### Method 3: Platform Scripts
- Windows: Double-click `start-openquiz.bat`
- macOS/Linux: Run `./start-openquiz.sh`

### Method 4: Manual (Original)
```bash
npm run dev
```
Then open browser to http://localhost:3000

## Stopping the Server

Press **Ctrl+C** in the terminal/console window

## Troubleshooting

### "node is not recognized"
- Node.js is not installed or not in PATH
- Install from: https://nodejs.org/

### "Permission denied" (macOS/Linux)
```bash
chmod +x start-openquiz.sh launcher.js
```

### Browser doesn't open automatically
- The server still works! Just manually open: http://localhost:3000
- Your firewall might be blocking the browser launch

### Port 3000 already in use
- Another app is using port 3000
- Kill the other process or change the PORT in launcher.js

### Dependencies not installed
```bash
npm install
```

## Building a True Executable

For a standalone .exe (no Node.js required), use:

### Option 1: Electron (Full Desktop App)
```bash
npm install --save-dev electron electron-builder
```

### Option 2: Tauri (Lightweight Alternative)
```bash
npm install --save-dev @tauri-apps/cli
```

### Option 3: pkg (Executable from Node.js)
```bash
npm install -g pkg
pkg launcher.js --targets node18-win-x64
```

Would you like instructions for any of these? Let us know!

## Features

✅ Auto-installs dependencies
✅ Cross-platform (Windows, macOS, Linux)
✅ Auto-opens browser
✅ Clean shutdown
✅ No configuration needed

---

**Enjoy OpenQuiz! 🎓**
