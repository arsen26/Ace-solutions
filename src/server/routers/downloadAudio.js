import express from 'express'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

router.get('/download-audio', (req, res) => {
  const { url } = req.query

  if (!url) {
    return res.status(400).json({ error: 'Missing URL' })
  }

  // Validate YouTube URL
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
  if (!youtubeRegex.test(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' })
  }

  // Set headers for Server-Sent Events (SSE)
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')
  res.setHeader('Access-Control-Allow-Origin', '*')

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', data: { message: 'Connected' } })}\n\n`)

  const pythonScript = path.join(__dirname, '..', 'utils', 'DownloadAudio.py')

  console.log(`Starting Python script with URL: ${url}`)

  const childProcess = spawn('python', ['-u', pythonScript, url])

  let outputData = ''
  let errorData = ''
  let clientDisconnected = false

  // Heartbeat to keep connection alive
  const heartbeat = setInterval(() => {
    if (!clientDisconnected && !res.writableEnded) {
      try {
        res.write(`:heartbeat\n\n`)
      } catch (e) {
        console.log('Client disconnected during heartbeat')
        clearInterval(heartbeat)
      }
    }
  }, 15000)

  // Listen to child process stdout
  childProcess.stdout.on('data', (data) => {
    if (clientDisconnected) return

    const output = data.toString()
    console.log(`Python stdout: ${output}`)
    outputData += output

    // Parse and send progress updates
    const lines = output.split('\n')
    lines.forEach((line) => {
      const trimmedLine = line.trim()
      if (trimmedLine.startsWith('PROGRESS:')) {
        const progressJson = trimmedLine.substring('PROGRESS:'.length)
        try {
          const progressData = JSON.parse(progressJson)
          if (!clientDisconnected && !res.writableEnded) {
            res.write(`data: ${JSON.stringify({ type: 'progress', data: progressData })}\n\n`)
          }
        } catch (e) {
          console.error('Error parsing progress:', e, 'Raw data:', progressJson)
        }
      } else if (trimmedLine.startsWith('SUCCESS:')) {
        const successJson = trimmedLine.substring('SUCCESS:'.length)
        try {
          const successData = JSON.parse(successJson)
          if (!clientDisconnected && !res.writableEnded) {
            res.write(
              `data: ${JSON.stringify({
                type: 'complete',
                data: {
                  success: true,
                  message: 'Audio downloaded successfully!',
                  filename: successData.filename,
                  folder: successData.folder,
                },
              })}\n\n`,
            )
          }
        } catch (e) {
          console.error('Error parsing success:', e)
        }
      }
    })
  })

  // Listen to child process stderr
  childProcess.stderr.on('data', (data) => {
    if (clientDisconnected) return

    const error = data.toString()
    console.error(`Python stderr: ${error}`)
    errorData += error

    // Check for ERROR: prefix in stderr
    const lines = error.split('\n')
    lines.forEach((line) => {
      const trimmedLine = line.trim()
      if (trimmedLine.startsWith('ERROR:')) {
        const errorJson = trimmedLine.substring('ERROR:'.length)
        try {
          const errorData = JSON.parse(errorJson)
          if (!clientDisconnected && !res.writableEnded) {
            res.write(
              `data: ${JSON.stringify({
                type: 'error',
                data: { error: errorData.message || 'Download failed' },
              })}\n\n`,
            )
          }
        } catch (e) {
          console.error('Error parsing error message:', e)
          if (!clientDisconnected && !res.writableEnded) {
            res.write(
              `data: ${JSON.stringify({
                type: 'error',
                data: { error: trimmedLine },
              })}\n\n`,
            )
          }
        }
      }
    })
  })

  childProcess.on('close', (code) => {
    console.log(`Python process exited with code: ${code}`)
    console.log(`Output data: ${outputData}`)
    console.log(`Error data: ${errorData}`)

    clearInterval(heartbeat)

    if (clientDisconnected || res.writableEnded) {
      return
    }

    // If we get here without any SUCCESS or ERROR messages, send a generic error
    if (code !== 0 && !outputData.includes('SUCCESS:') && !errorData.includes('ERROR:')) {
      res.write(
        `data: ${JSON.stringify({
          type: 'error',
          data: { error: `Python script exited with code ${code}. Check server logs for details.` },
        })}\n\n`,
      )
    }

    // End the response
    setTimeout(() => {
      if (!res.writableEnded) {
        res.end()
      }
    }, 100)
  })

  childProcess.on('error', (error) => {
    clearInterval(heartbeat)
    console.error(`Failed to start Python process: ${error}`)
    if (!clientDisconnected && !res.writableEnded) {
      res.write(
        `data: ${JSON.stringify({
          type: 'error',
          data: {
            error: 'Failed to start download process. Make sure Python and yt-dlp are installed.',
          },
        })}\n\n`,
      )
      res.end()
    }
  })

  // Handle client disconnect
  req.on('close', () => {
    console.log('Client disconnected, cleaning up...')
    clientDisconnected = true
    clearInterval(heartbeat)

    if (!childProcess.killed) {
      console.log('Killing child process...')
      childProcess.kill('SIGTERM')
    }

    if (!res.writableEnded) {
      res.end()
    }
  })
})

export default router
