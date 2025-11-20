import express from 'express'
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'
import ip from 'ip'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

// In-memory storage for shared paths (ID -> Path)
// In a production app, this should be a database or persistent store
const sharedPaths = new Map()

// Endpoint to generate a share link
router.post('/share/generate', (req, res) => {
  const { path: sharePath } = req.body
  console.log('Received share request for path:', sharePath)

  if (!sharePath) {
    return res.status(400).json({ error: 'Path is required' })
  }

  // Validate path exists
  const exists = fs.existsSync(sharePath)
  console.log('Path exists:', exists)

  if (!exists) {
    return res.status(400).json({ error: 'Path does not exist' })
  }

  const id = uuidv4()
  sharedPaths.set(id, sharePath)

  const localIp = ip.address()
  // Assuming server runs on port 3000. In prod, use config/env.
  const port = process.env.PORT || 3000
  const downloadUrl = `http://${localIp}:${port}/api/share/download/${id}`

  res.json({
    id,
    url: downloadUrl,
    path: sharePath,
  })
})

// Endpoint to download the shared file/folder
router.get('/share/download/:id', (req, res) => {
  const { id } = req.params
  const sharePath = sharedPaths.get(id)

  if (!sharePath || !fs.existsSync(sharePath)) {
    return res.status(404).send('Shared item not found or expired')
  }

  const stats = fs.statSync(sharePath)
  const fileName = path.basename(sharePath)

  if (stats.isFile()) {
    // Stream file directly
    res.download(sharePath, fileName)
  } else if (stats.isDirectory()) {
    // Stream folder as ZIP
    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}.zip"`)

    const archive = archiver('zip', {
      zlib: { level: 9 }, // Sets the compression level.
    })

    archive.on('error', (err) => {
      res.status(500).send({ error: err.message })
    })

    // Pipe archive data to the response
    archive.pipe(res)

    // Append files from the directory
    archive.directory(sharePath, false)

    // Finalize the archive (ie we are done appending files but streams have to finish yet)
    archive.finalize()
  } else {
    res.status(400).send('Unsupported file type')
  }
})

export default router
