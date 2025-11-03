import express from 'express'
import { getVideo } from '../utils/video.js'

const router = express.Router()

router.post('/get-link', async (req, res) => {
  console.log('Get link request...', req.body.url)

  if (!req.body.url) {
    return res.status(400).json({ error: 'URL is required' })
  }

  try {
    const videoLink = await getVideo(req.body.url)
    console.log('Video link found:', videoLink)
    res.json({ downloadLink: videoLink })
  } catch (error) {
    console.error('Error:', error.message)
    res.status(500).json({
      error: 'Failed to fetch video link.',
    })
  }
})

export default router
