import { exec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(exec)

export const getVideo = async (url) => {
  try {
    console.log('Running yt-dlp for URL:', url)

    const { stdout, stderr } = await execPromise(
      `python -m yt_dlp --get-url --no-warnings --format "best[ext=mp4]/best" "${url}"`,
      {
        timeout: 30000,
        maxBuffer: 1024 * 1024 * 10,
      }
    )

    if (stderr && !stderr.includes('Downloading') && !stderr.includes('Extracting')) {
      console.error('yt-dlp stderr:', stderr)
    }

    const videoUrl = stdout.trim()
    console.log('Extracted video URL length:', videoUrl.length)

    if (!videoUrl || videoUrl.includes('ERROR')) {
      throw new Error('Could not extract video URL from yt-dlp output')
    }

    // Validate URL format
    if (!videoUrl.startsWith('http')) {
      throw new Error('Invalid video URL format: ' + videoUrl.substring(0, 100))
    }

    return videoUrl
  } catch (error) {
    console.error('getVideo error details:', {
      message: error.message,
      code: error.code,
      killed: error.killed,
      signal: error.signal
    })
    throw new Error(`Video extraction failed: ${error.message}`)
  }
}

export const getAudio = async (url, outputPath) => {
  try {
    // Use template without extension, yt-dlp will add .mp3
    const outputTemplate = outputPath.replace('.mp3', '')

    const { stdout, stderr } = await execPromise(
      `python -m yt_dlp -x --audio-format mp3 --audio-quality 0 -o "${outputTemplate}.%(ext)s" "${url}"`,
      {
        timeout: 60000,
        maxBuffer: 1024 * 1024 * 10,
      },
    )

    console.log('Audio extraction stdout:', stdout)

    if (stderr && !stderr.includes('Downloading') && !stderr.includes('Extracting')) {
      console.error('yt-dlp stderr:', stderr)
    }

    // Return the path with .mp3 extension
    return `${outputTemplate}.mp3`
  } catch (error) {
    console.error('getAudio error:', error.message)
    throw error
  }
}
