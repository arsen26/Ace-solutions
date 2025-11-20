import express from 'express'
import cors from 'cors'
import downloadAudioRoute from './routers/downloadAudio.js'
import downloadVideoRoute from './routers/downloadVideo.js'
import getLinkRoute from './routers/getLink.js'
import videoProxyRoute from './routers/videoProxy.js'
import shareServiceRoute from './routers/shareService.js'

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api', downloadAudioRoute)
app.use('/api', getLinkRoute)
app.use('/api', videoProxyRoute)
app.use('/api', downloadVideoRoute)
app.use('/api', shareServiceRoute)

app.get('/api', (req, res) => res.send('Hello API!'))

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

export default app
