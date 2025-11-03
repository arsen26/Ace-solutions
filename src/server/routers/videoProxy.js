import express from 'express'
import axios from 'axios'
import { getVideo } from '../utils/video.js'

const router = express.Router()

// Store temporary video URLs (in production, use Redis)
const videoCache = new Map()

// Generate proxy link
router.post('/generate-proxy', async (req, res) => {
  if (!req.body.url) {
    return res.status(400).json({ error: 'URL is required' })
  }

  try {
    const videoId = Buffer.from(req.body.url).toString('base64').slice(0, 32)
    videoCache.set(videoId, req.body.url)

    // Clean up after 5 minutes
    setTimeout(() => videoCache.delete(videoId), 5 * 60 * 1000)

    const proxyUrl = `${req.protocol}://${req.get('host')}/api/video-proxy/${videoId}`
    res.json({ downloadLink: proxyUrl })
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({
      error: 'Failed to generate proxy link.',
    })
  }
})

// Serve video through proxy
router.get('/video-proxy/:id', async (req, res) => {
  const originalUrl = videoCache.get(req.params.id)

  if (!originalUrl) {
    return res.status(404).json({ error: 'Video not found or expired' })
  }

  try {
    const videoLink = await getVideo(originalUrl)

    const response = await axios({
      method: 'GET',
      url: videoLink,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Range': req.headers.range || 'bytes=0-',
      },
    })

    // Forward response headers
    res.setHeader('Content-Type', 'video/mp4')
    res.setHeader('Accept-Ranges', 'bytes')
    if (response.headers['content-length']) {
      res.setHeader('Content-Length', response.headers['content-length'])
    }
    if (response.headers['content-range']) {
      res.setHeader('Content-Range', response.headers['content-range'])
      res.status(206)
    }

    response.data.pipe(res)
  } catch (error) {
    console.error('Proxy error:', error.message)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to stream video.' })
    }
  }
})

export default router
