import express from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import util from 'util';
import axios from 'axios';
import path from 'path';
import fs from 'fs';

const execPromise = util.promisify(exec);

const app = express();
app.use(express.json());
app.use(cors());

const getVideo = async (url) => {
  try {
    const { stdout, stderr } = await execPromise(`python -m yt_dlp --get-url "${url}"`, {
      timeout: 30000,
      maxBuffer: 1024 * 1024 * 10
    });

    if (stderr && !stderr.includes('Downloading') && !stderr.includes('Extracting')) {
      console.error('yt-dlp stderr:', stderr);
    }

    const videoUrl = stdout.trim();

    if (!videoUrl || videoUrl.includes('ERROR')) {
      throw new Error('Could not extract video URL');
    }

    return videoUrl;
  } catch (error) {
    console.error('getVideo error:', error.message);
    throw error;
  }
};

// Option 1: Stream the video directly to the user (recommended)
app.post('/api/download', async (req, res) => {
  console.log('Request incoming...', req.body.url);

  if (!req.body.url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const videoLink = await getVideo(req.body.url);
    console.log('Video link found:', videoLink);

    // Fetch the video with axios and stream it
    const response = await axios({
      method: 'GET',
      url: videoLink,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Set headers for download
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'attachment; filename="instagram_video.mp4"');

    // Pipe the video stream to response
    response.data.pipe(res);

  } catch (error) {
    console.error('Download error:', error.message);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to download video.'
      });
    }
  }
});

// Option 2: Return the download link (your current method)
app.post('/api/get-link', async (req, res) => {
  console.log('Get link request...', req.body.url);

  if (!req.body.url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const videoLink = await getVideo(req.body.url);
    console.log('Video link found:', videoLink);
    res.json({ downloadLink: videoLink });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      error: 'Failed to fetch video link.'
    });
  }
});

app.get('/api', (req, res) => res.send('Hello API!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
