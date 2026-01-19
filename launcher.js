#!/usr/bin/env node

/**
 * OpenQuiz Desktop Launcher
 * Starts the dev server and opens the app in your default browser
 */

import { spawn, exec } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const PORT = 3000
const URL = `http://localhost:${PORT}`

console.log('🚀 Starting OpenQuiz...\n')

// Start the Vite dev server
const server = spawn('npm', ['run', 'dev'], {
  stdio: 'pipe',
  shell: true,
  cwd: __dirname
})

let serverReady = false

// Listen to server output
server.stdout.on('data', (data) => {
  const output = data.toString()
  console.log(output)

  // Detect when server is ready
  if (output.includes('Local:') && !serverReady) {
    serverReady = true
    console.log('\n✅ Server ready! Opening browser...\n')

    // Wait a moment then open browser
    setTimeout(() => {
      openBrowser(URL)
    }, 1000)
  }
})

server.stderr.on('data', (data) => {
  const error = data.toString()
  // Ignore xdg-open errors (common in headless environments)
  if (!error.includes('xdg-open')) {
    console.error(error)
  }
})

server.on('close', (code) => {
  if (code !== 0) {
    console.error(`\n❌ Server exited with code ${code}`)
    process.exit(code)
  }
})

// Function to open browser
function openBrowser(url) {
  const platform = process.platform
  let command

  switch (platform) {
    case 'darwin': // macOS
      command = `open "${url}"`
      break
    case 'win32': // Windows
      command = `start "" "${url}"`
      break
    default: // Linux
      command = `xdg-open "${url}" || sensible-browser "${url}" || x-www-browser "${url}"`
      break
  }

  exec(command, (error) => {
    if (error) {
      console.log(`\n📋 Could not open browser automatically.`)
      console.log(`Please open this URL manually: ${url}\n`)
    } else {
      console.log(`✅ Browser opened to ${url}`)
      console.log('\n📝 Press Ctrl+C to stop the server\n')
    }
  })
}

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down OpenQuiz...')
  server.kill()
  process.exit(0)
})

process.on('SIGTERM', () => {
  server.kill()
  process.exit(0)
})
