import express from 'express'
import cors from 'cors'
import downloadRoute from './routers/download.js'
import downloadAudioRoute from './routers/downloadAudio.js'
import getLinkRoute from './routers/getLink.js'
import videoProxyRoute from './routers/videoProxy.js'

const app = express()
app.use(express.json())
app.use(cors())

// Routes
app.use('/api', downloadRoute)
app.use('/api', downloadAudioRoute)
app.use('/api', getLinkRoute)
app.use('/api', videoProxyRoute)

app.get('/api', (req, res) => res.send('Hello API!'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

export default app
