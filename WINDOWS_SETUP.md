# 🪟 OpenQuiz - Windows Setup Guide

A complete step-by-step guide to run OpenQuiz on any Windows computer (Windows 10 or 11).

---

## Prerequisites (One-Time Setup)

### Step 1: Install Node.js

Node.js is required to run OpenQuiz. It's free and safe.

1. **Download Node.js:**
   - Go to: https://nodejs.org/
   - Click the **"LTS"** (Long Term Support) button - usually the left green button
   - Version should be 18.x or higher

2. **Install Node.js:**
   - Run the downloaded `.msi` file
   - Click "Next" through the installer
   - **Important:** Make sure "Add to PATH" is checked ✅
   - Click "Install" (may ask for admin permission)
   - Wait for installation to complete
   - Click "Finish"

3. **Verify Installation:**
   - Press `Windows Key + R`
   - Type `cmd` and press Enter
   - In the black window (Command Prompt), type:
     ```
     node --version
     ```
   - Should show something like: `v18.19.0` or higher
   - Then type:
     ```
     npm --version
     ```
   - Should show something like: `10.2.3` or higher

✅ If you see version numbers, you're ready!

---

## Getting the Code

### Option 1: Download ZIP (Easiest)

1. Go to: https://github.com/nwrussi/openQuiz
2. Click the green **"Code"** button
3. Click **"Download ZIP"**
4. Extract the ZIP file to a folder (right-click → "Extract All")
5. Remember where you extracted it (e.g., `C:\Users\YourName\Downloads\openQuiz`)

### Option 2: Using Git (For Developers)

1. **Install Git for Windows:**
   - Download from: https://git-scm.com/download/win
   - Run installer, click "Next" through everything

2. **Clone the repository:**
   - Open Command Prompt (`Windows Key + R`, type `cmd`)
   - Navigate to where you want the project:
     ```
     cd C:\Users\YourName\Documents
     ```
   - Clone the repository:
     ```
     git clone https://github.com/nwrussi/openQuiz.git
     cd openQuiz
     ```

---

## Running OpenQuiz

### Step 1: Open Command Prompt in Project Folder

**Method A - Using Explorer:**
1. Open File Explorer (Windows Key + E)
2. Navigate to the openQuiz folder
3. Click on the address bar at the top
4. Type `cmd` and press Enter
5. A black Command Prompt window opens in that folder

**Method B - Manual Navigation:**
1. Press `Windows Key + R`
2. Type `cmd` and press Enter
3. Navigate to your project folder:
   ```
   cd C:\Users\YourName\Downloads\openQuiz
   ```

### Step 2: Install Dependencies (First Time Only)

In the Command Prompt window, type:

```bash
npm install
```

**What happens:**
- Downloads all required packages (React, Vite, Tailwind, etc.)
- Takes 30 seconds to 2 minutes depending on your internet
- Creates a `node_modules` folder (this is normal, it will be large)

✅ Wait until you see "added XXX packages" and the prompt returns.

### Step 3: Start the Application

In the same Command Prompt window, type:

```bash
npm run dev
```

**What happens:**
- Starts a local web server
- You'll see:
  ```
  VITE v6.4.1  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ```

✅ **Success!** The app is now running.

### Step 4: Open in Your Browser

1. Open your web browser (Chrome, Edge, Firefox, etc.)
2. Go to: **http://localhost:3000**
3. You should see the OpenQuiz landing page! 🎉

---

## Using OpenQuiz

Once the browser opens:

1. **Home Page:** See 4 colorful game mode cards
2. **Click any card** to try that mode:
   - 🎴 **Flashcards** - Study with flip cards
   - 🎯 **Matching** - Match terms to definitions
   - 🏆 **Leaderboard** - See rankings
   - 📊 **Session Summary** - View your progress

3. **Navigate:** Use your browser's back button to return home

---

## Stopping the Application

When you're done:

1. Go back to the Command Prompt window (the black window)
2. Press **`Ctrl + C`**
3. It may ask "Terminate batch job (Y/N)?" - type `Y` and press Enter
4. The server stops
5. You can close the Command Prompt window

**Note:** Closing the browser does NOT stop the server. You must press `Ctrl + C` in Command Prompt.

---

## Troubleshooting

### ❌ "npm is not recognized"

**Problem:** Node.js not installed or not in PATH

**Solution:**
1. Reinstall Node.js from https://nodejs.org/
2. Make sure to check "Add to PATH" during installation
3. Restart your computer
4. Try again

### ❌ Port 3000 already in use

**Problem:** Another app is using port 3000

**Solution 1 - Use different port:**
```bash
npm run dev -- --port 3001
```
Then open: http://localhost:3001

**Solution 2 - Find and close the other app:**
```bash
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### ❌ Permission errors during `npm install`

**Problem:** Windows security blocking installation

**Solution:**
1. Right-click Command Prompt
2. Choose "Run as administrator"
3. Navigate to project folder again
4. Run `npm install` again

### ❌ "Cannot find module" errors

**Problem:** Dependencies not installed properly

**Solution:**
1. Delete the `node_modules` folder
2. Delete `package-lock.json` file
3. Run `npm install` again

### ❌ Blank white page in browser

**Problem:** Build issue or React error

**Solution:**
1. Open browser DevTools (Press F12)
2. Look at the Console tab for errors
3. If you see errors, try:
   ```bash
   npm run build
   npm run preview
   ```

### ❌ Changes not showing up

**Problem:** Browser cache

**Solution:**
1. Press `Ctrl + Shift + R` to hard refresh
2. Or press `Ctrl + F5`
3. Or clear browser cache

---

## Project Commands Reference

Run these in Command Prompt (in the project folder):

| Command | What it does |
|---------|--------------|
| `npm install` | Install all dependencies (first time setup) |
| `npm run dev` | Start development server → http://localhost:3000 |
| `npm run build` | Create production build (dist folder) |
| `npm run preview` | Preview production build → http://localhost:4173 |
| `npm run lint` | Check code for errors |

---

## System Requirements

### Minimum:
- **OS:** Windows 10 or Windows 11
- **RAM:** 4GB (8GB recommended)
- **Storage:** 500MB free space
- **Internet:** Required for initial setup only
- **Browser:** Chrome, Edge, Firefox, or Safari

### Performance:
- Fast computers: App starts in 1-2 seconds
- Average computers: App starts in 3-5 seconds
- Slower computers: App starts in 5-10 seconds

Once running, the app is very fast regardless of computer speed.

---

## Offline Usage

**Can I use OpenQuiz without internet?**

Yes! After the first setup:
1. All code runs locally on your computer
2. No internet required to use the app
3. Your data stays on your computer (privacy!)

**When you need internet:**
- First-time setup (`npm install`)
- Downloading updates
- If AWS features are enabled (future feature)

---

## Sharing with Friends

### Option 1: Share on Local Network

Want classmates on the same WiFi to access your OpenQuiz?

1. Start the server with network access:
   ```bash
   npm run dev -- --host
   ```

2. Look for the "Network" line:
   ```
   ➜  Network: http://192.168.1.100:3000/
   ```

3. Share that URL with friends on the same WiFi
4. They can open it in their browser (no installation needed!)

### Option 2: Send the Code

1. Zip the entire `openQuiz` folder
2. Send to friends
3. They follow this guide to run it

---

## What Files NOT to Delete

⚠️ **Do NOT delete these:**
- `node_modules/` - Required packages (large folder ~300MB)
- `package.json` - Project configuration
- `package-lock.json` - Dependency versions
- `src/` - Source code

✅ **Safe to delete (will be recreated):**
- `dist/` - Build output (recreated with `npm run build`)
- `.vite/` - Cache folder

---

## Uninstalling

To completely remove OpenQuiz:

1. Close the Command Prompt window (Ctrl + C if server is running)
2. Delete the entire `openQuiz` folder
3. That's it! No registry entries, no hidden files

To remove Node.js (if you don't need it):
1. Go to Windows Settings → Apps
2. Find "Node.js"
3. Click "Uninstall"

---

## Getting Help

If something doesn't work:

1. **Check the error message** in Command Prompt
2. **Check browser console** (Press F12 → Console tab)
3. **Ask for help:**
   - GitHub Issues: https://github.com/nwrussi/openQuiz/issues
   - Include:
     - Error message (copy/paste)
     - Windows version
     - Node.js version (`node --version`)
     - What step you're on

---

## Quick Start Checklist

- [ ] Install Node.js from https://nodejs.org/
- [ ] Download/clone OpenQuiz code
- [ ] Open Command Prompt in project folder
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000 in browser
- [ ] Start learning! 🎉

---

## Next Steps

Once you have OpenQuiz running:

1. **Try all game modes** (Flashcards, Matching, Leaderboard, Summary)
2. **Check TESTING.md** for detailed feature testing
3. **Explore the code** in `src/` folder (if you're learning to code!)
4. **Create your own decks** (coming soon in next version)
5. **Share with friends** using network mode

---

**Enjoy learning with OpenQuiz! 🎓**

*Free • Open Source • No Ads • Privacy-First*
