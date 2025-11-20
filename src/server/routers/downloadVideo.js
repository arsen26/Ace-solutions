import express from 'express'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

router.get('/download-video', (req, res) => {
  const { url } = req.query

  if (!url) {
    return res.status(400).json({ error: 'Missing URL' })
  }

  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
  if (!youtubeRegex.test(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' })
  }

  // Set headers for Server-Sent Events
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no') // Disable buffering for Nginx if used
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', data: { message: 'Connected' } })}\n\n`)

  const pythonScript = path.join(__dirname, '..', 'utils', 'DownloadVideo.py')

  console.log(`Starting Python script with URL: ${url}`)

  // Use -u for unbuffered output
  const childProcess = spawn('python', ['-u', pythonScript, url])

  let outputData = ''
  let errorData = ''

  childProcess.stdout.on('data', (data) => {
    const lines = data.toString().split('\n')
    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine) continue

      if (trimmedLine.startsWith('PROGRESS:')) {
        try {
          const progressData = JSON.parse(trimmedLine.substring(9))
          res.write(`data: ${JSON.stringify({ type: 'progress', data: progressData })}\n\n`)
        } catch (e) {
          console.error('Error parsing progress data:', e)
        }
      } else if (trimmedLine.startsWith('SUCCESS:')) {
        try {
          const successData = JSON.parse(trimmedLine.substring(8))
          res.write(`data: ${JSON.stringify({ type: 'complete', data: successData })}\n\n`)
        } catch (e) {
          console.error('Error parsing success data:', e)
        }
      } else {
        outputData += trimmedLine + '\n'
      }
    }
  })

  childProcess.stderr.on('data', (data) => {
    const lines = data.toString().split('\n')
    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine) continue

      if (trimmedLine.startsWith('ERROR:')) {
        try {
          const errorJson = JSON.parse(trimmedLine.substring(6))
          res.write(
            `data: ${JSON.stringify({ type: 'error', data: { error: errorJson.message } })}\n\n`,
          )
        } catch (e) {
          console.error('Error parsing error data:', e)
          res.write(`data: ${JSON.stringify({ type: 'error', data: { error: trimmedLine } })}\n\n`)
        }
      } else {
        errorData += trimmedLine + '\n'
      }
    }
  })

  childProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`)
    if (code !== 0) {
      console.error('Python script error output:', errorData)
      // If we haven't sent an error yet, send one now
      if (!res.writableEnded) {
        res.write(
          `data: ${JSON.stringify({ type: 'error', data: { error: 'Download failed' } })}\n\n`,
        )
      }
    }
    res.end()
  })

  // Handle client disconnect
  const heartbeat = setInterval(() => {
    // Check if connection is still alive
    const clientDisconnected = res.writableEnded || res.socket.destroyed

    if (!clientDisconnected && !res.writableEnded) {
      try {
        res.write(`:heartbeat\n\n`)
      } catch (e) {
        console.log('Client disconnected during heartbeat')
        clearInterval(heartbeat)
      }
    } else {
      clearInterval(heartbeat)
    }
  }, 15000)

  req.on('close', () => {
    clearInterval(heartbeat)
    console.log('Client disconnected, cleaning up...')
    if (childProcess) {
      console.log('Killing child process...')
      childProcess.kill()
    }
  })
})

export default router
