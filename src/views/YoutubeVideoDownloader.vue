<template>
  <div class="text-center mt-10 pt-10 pb-10 container-style fluid">
    <div v-if="isLoading" class="loading-container">
      <fingerprint-spinner :animation-duration="1500" :size="64" color="#bc36e0" />
      <div class="progress-info mt-6">
        <h3 class="text-h5 mb-4">{{ progressStatus }}</h3>
        <div v-if="progressData.percent" class="progress-details">
          <v-progress-linear
            :model-value="parseProgress(progressData.percent)"
            color="primary"
            height="8"
            rounded
            class="mb-4"
          ></v-progress-linear>
          <div class="d-flex justify-space-between text-body-2">
            <span>{{ progressData.percent }}</span>
            <span v-if="progressData.speed">{{ progressData.speed }}</span>
            <span v-if="progressData.eta">ETA: {{ progressData.eta }}</span>
          </div>
        </div>
      </div>
    </div>

    <v-row class="mt-10 mb-10 justify-center">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">YouTube to MP3 Converter</h1>
        <p class="text-subtitle-1 text-grey-darken-1">
          Extract audio from YouTube videos in seconds
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="8" class="rounded-lg pa-6" color="#020c23">
          <v-row>
            <v-col cols="12" md="6" class="d-flex flex-column justify-center">
              <div class="input-section">
                <v-text-field
                  v-model="videoUrl"
                  label="Enter YouTube URL here"
                  density="comfortable"
                  variant="outlined"
                  prepend-inner-icon="mdi-youtube"
                  color="primary"
                  class="mb-4"
                  placeholder="https://www.youtube.com/watch?v=..."
                  :error-messages="errorMessage"
                  @keyup.enter="downloadAudio"
                ></v-text-field>
                <v-btn
                  class="generate-button-style"
                  size="large"
                  block
                  elevation="2"
                  @click="downloadAudio"
                  :disabled="!videoUrl || isLoading"
                >
                  <v-icon left class="mr-2">mdi-music-note</v-icon>
                  {{ isLoading ? 'Converting...' : 'Convert to MP3' }}
                </v-btn>
              </div>
            </v-col>

            <v-divider vertical class="d-none d-md-flex"></v-divider>
            <v-divider class="d-flex d-md-none my-4"></v-divider>

            <v-col cols="12" md="6" class="d-flex align-center justify-center">
              <div v-if="downloadSuccess" class="qr-display">
                <v-card elevation="4" class="pa-4 success-card">
                  <v-icon size="80" color="success" class="mb-4">mdi-check-circle</v-icon>
                  <h3 class="text-h5 mb-2">Download Complete!</h3>
                  <p class="text-body-2 text-grey mb-2">{{ successMessage }}</p>
                  <p class="text-caption text-grey-lighten-1 mb-4">
                    Saved to: {{ downloadFolder }}
                  </p>
                  <v-chip color="success" variant="outlined">
                    <v-icon left small>mdi-music</v-icon>
                    Audio Ready
                  </v-chip>
                </v-card>
              </div>
              <div v-else class="placeholder-section">
                <v-icon size="100" color="grey-lighten-2">mdi-music-note-outline</v-icon>
                <p class="text-grey mt-4">Enter YouTube URL to extract audio</p>
                <p class="text-caption text-grey-darken-1 mt-2">
                  Files will be saved to Downloads/YouTube Audio folder
                </p>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Features Section -->
    <v-row justify="center" class="mt-10">
      <v-col cols="12" md="10" lg="8">
        <v-row>
          <v-col cols="12" sm="4">
            <v-card class="feature-card pa-4" color="#020c23">
              <v-icon size="48" color="primary" class="mb-3">mdi-flash</v-icon>
              <h3 class="text-h6 mb-2">Fast Conversion</h3>
              <p class="text-body-2 text-grey">Quick MP3 extraction from any YouTube video</p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card class="feature-card pa-4" color="#020c23">
              <v-icon size="48" color="success" class="mb-3">mdi-quality-high</v-icon>
              <h3 class="text-h6 mb-2">High Quality</h3>
              <p class="text-body-2 text-grey">192kbps audio quality preservation</p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card class="feature-card pa-4" color="#020c23">
              <v-icon size="48" color="warning" class="mb-3">mdi-folder-download</v-icon>
              <h3 class="text-h6 mb-2">Auto Save</h3>
              <p class="text-body-2 text-grey">Files saved to Downloads folder automatically</p>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { FingerprintSpinner } from 'epic-spinners'
import { ref } from 'vue'

const videoUrl = ref('')
const downloadSuccess = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const downloadFolder = ref('')
const progressStatus = ref('Initializing...')
const progressData = ref({})

const parseProgress = (percentStr) => {
  const match = percentStr.match(/(\d+\.?\d*)/)
  return match ? parseFloat(match[1]) : 0
}

const downloadAudio = () => {
  if (!videoUrl.value) {
    return
  }

  // Validate YouTube URL
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
  if (!youtubeRegex.test(videoUrl.value)) {
    errorMessage.value = 'Please enter a valid YouTube URL'
    return
  }

  isLoading.value = true
  downloadSuccess.value = false
  errorMessage.value = ''
  progressStatus.value = 'Initializing...'
  progressData.value = {}

  const eventSource = new EventSource(
    `/api/download-audio?url=${encodeURIComponent(videoUrl.value)}`,
  )

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      console.log('Received data:', data)

      if (data.type === 'connected') {
        console.log('Connected to server')
        progressStatus.value = 'Preparing download...'
      } else if (data.type === 'progress') {
        progressData.value = data.data
        if (data.data.status === 'starting') {
          progressStatus.value = data.data.message
        } else if (data.data.status === 'downloading') {
          progressStatus.value = 'Downloading audio...'
        } else if (data.data.status === 'converting') {
          progressStatus.value = data.data.message
          progressData.value = {}
        } else if (data.data.status === 'finished') {
          progressStatus.value = data.data.message
        } else if (data.data.status === 'info') {
          progressStatus.value = data.data.message
        }
      } else if (data.type === 'complete') {
        downloadSuccess.value = true
        successMessage.value = data.data.filename
          ? `Saved as: ${data.data.filename}`
          : 'Audio downloaded successfully!'
        downloadFolder.value = data.data.folder || 'Downloads/YouTube Audio'
        isLoading.value = false
        eventSource.close()

        setTimeout(() => {
          downloadSuccess.value = false
          videoUrl.value = ''
          progressData.value = {}
        }, 10000)
      } else if (data.type === 'error') {
        errorMessage.value = data.data.error
        isLoading.value = false
        eventSource.close()

        setTimeout(() => {
          errorMessage.value = ''
        }, 8000)
      }
    } catch (e) {
      console.error('Error parsing SSE data:', e)
    }
  }

  eventSource.onerror = (error) => {
    console.error('EventSource error:', error)
    // Only show error if we haven't completed successfully
    if (!downloadSuccess.value) {
      errorMessage.value = 'Connection lost. Please try again.'
      isLoading.value = false
    }
    eventSource.close()
  }
}
</script>

<style scoped>
/* Your existing styles remain the same */
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 9999;
}

.progress-info {
  background: rgba(2, 12, 35, 0.95);
  padding: 30px;
  border-radius: 16px;
  min-width: 400px;
  border: 1px solid rgba(188, 54, 224, 0.3);
}

.progress-details {
  margin-top: 20px;
}

.container-style {
  background-color: #010a1b;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.generate-button-style {
  background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
  color: white;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.generate-button-style:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(233, 30, 99, 0.4);
}

.generate-button-style:disabled {
  opacity: 0.6;
  transform: none;
  background: linear-gradient(135deg, #757575 0%, #616161 100%);
}

.qr-display {
  animation: fadeIn 0.5s ease-in;
  width: 100%;
  text-align: center;
}

.success-card {
  background: linear-gradient(135deg, #1a1a1a 0%, #0d1117 100%);
  border-radius: 16px;
  text-align: center;
  padding: 30px;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.placeholder-section {
  text-align: center;
  padding: 40px;
}

.input-section {
  width: 100%;
}

.feature-card {
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(188, 54, 224, 0.3);
  border-color: rgba(188, 54, 224, 0.5);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 960px) {
  .text-h3 {
    font-size: 2rem !important;
  }

  .progress-info {
    min-width: 90vw;
    padding: 20px;
  }
}
</style>
