import express from 'express'
import axios from 'axios'
import { getVideo } from '../utils/video.js'

const router = express.Router()

router.post('/download', async (req, res) => {
  if (!req.body.url) {
    return res.status(400).json({ error: 'URL is required' })
  }

  try {
    const videoLink = await getVideo(req.body.url)
    console.log('Video link found:', videoLink)

    // Fetch the video with axios and stream it
    const response = await axios({
      method: 'GET',
      url: videoLink,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    // Set headers for download
    res.setHeader('Content-Type', 'video/mp4')
    res.setHeader('Content-Disposition', 'attachment; filename="instagram_video.mp4"')

    // Pipe the video stream to response
    response.data.pipe(res)
  } catch (error) {
    console.error('Download error:', error.message)
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to download video.',
      })
    }
  }
})

export default router
