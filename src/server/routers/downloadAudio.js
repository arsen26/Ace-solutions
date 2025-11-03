import express from 'express'
import path from 'path'
import fs from 'fs'
import { getAudio } from '../utils/video.js'

const router = express.Router()

router.post('/download-audio', async (req, res) => {
  if (!req.body.url) {
    return res.status(400).json({ error: 'URL is required' })
  }

  const tempDir = path.join(process.cwd(), 'temp')
  const timestamp = Date.now()
  const outputPath = path.join(tempDir, `audio_${timestamp}.mp3`)

  try {
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    console.log('Extracting audio from:', req.body.url)
    const finalPath = await getAudio(req.body.url, outputPath)

    console.log('Checking for file at:', finalPath)

    // Wait a bit for file system to catch up
    await new Promise(resolve => setTimeout(resolve, 500))

    // Check if file exists
    if (!fs.existsSync(finalPath)) {
      // Try to find any mp3 file in temp directory with similar timestamp
      const files = fs.readdirSync(tempDir)
      const mp3File = files.find(f => f.startsWith(`audio_${timestamp}`) && f.endsWith('.mp3'))

      if (mp3File) {
        const foundPath = path.join(tempDir, mp3File)
        console.log('Found audio file at:', foundPath)

        // Set headers for download
        res.setHeader('Content-Type', 'audio/mpeg')
        res.setHeader('Content-Disposition', 'attachment; filename="youtube-audio.mp3"')

        // Stream the file to response
        const fileStream = fs.createReadStream(foundPath)
        fileStream.pipe(res)

        // Clean up the file after streaming
        fileStream.on('end', () => {
          fs.unlink(foundPath, (err) => {
            if (err) console.error('Error deleting temp file:', err)
            else console.log('Temp file deleted:', foundPath)
          })
        })

        return
      }

      throw new Error('Audio file was not created')
    }

    console.log('Audio file created:', finalPath)

    // Set headers for download
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Disposition', 'attachment; filename="youtube-audio.mp3"')

    // Stream the file to response
    const fileStream = fs.createReadStream(finalPath)
    fileStream.pipe(res)

    // Clean up the file after streaming
    fileStream.on('end', () => {
      fs.unlink(finalPath, (err) => {
        if (err) console.error('Error deleting temp file:', err)
        else console.log('Temp file deleted:', finalPath)
      })
    })
  } catch (error) {
    console.error('Audio download error:', error.message)

    // Clean up any temp files
    try {
      const files = fs.readdirSync(tempDir)
      const tempFiles = files.filter(f => f.startsWith(`audio_${timestamp}`))
      tempFiles.forEach(file => {
        const filePath = path.join(tempDir, file)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
          console.log('Cleaned up temp file:', filePath)
        }
      })
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError)
    }

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to download audio. Make sure FFmpeg is installed.',
      })
    }
  }
})

export default router
