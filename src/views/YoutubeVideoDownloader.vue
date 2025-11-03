<template>
  <div class="text-center mt-10 pt-10 pb-10 container-style fluid">
    <div v-if="isLoading" class="loading-container">
      <fingerprint-spinner :animation-duration="1500" :size="64" color="#bc36e0" />
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
                  Convert to MP3
                </v-btn>
              </div>
            </v-col>
            <v-divider vertical class="d-none d-md-flex"></v-divider>
            <v-divider class="d-flex d-md-none my-4"></v-divider>
            <v-col cols="12" md="6" class="d-flex align-center justify-center">
              <div v-if="downloadSuccess" class="qr-display">
                <v-card elevation="4" class="pa-4 success-card">
                  <v-icon size="80" color="success" class="mb-4">mdi-check-circle</v-icon>
                  <h3 class="text-h5 mb-2">Download Started!</h3>
                  <p class="text-body-2 text-grey mb-4">Your MP3 file is being downloaded</p>
                  <v-chip color="success" variant="outlined">
                    <v-icon left small>mdi-music</v-icon>
                    Audio Ready
                  </v-chip>
                </v-card>
              </div>
              <div v-else class="placeholder-section">
                <v-icon size="100" color="grey-lighten-2">mdi-music-note-outline</v-icon>
                <p class="text-grey mt-4">Enter YouTube URL to extract audio</p>
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
              <p class="text-body-2 text-grey">MP3 extraction from any YouTube video</p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card class="feature-card pa-4" color="#020c23">
              <v-icon size="48" color="success" class="mb-3">mdi-quality-high</v-icon>
              <h3 class="text-h6 mb-2">High Quality</h3>
              <p class="text-body-2 text-grey">Best audio quality preservation</p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card class="feature-card pa-4" color="#020c23">
              <v-icon size="48" color="warning" class="mb-3">mdi-lock</v-icon>
              <h3 class="text-h6 mb-2">Private & Safe</h3>
              <p class="text-body-2 text-grey">Your data is never stored</p>
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
import axios from 'axios'

const videoUrl = ref('')
const downloadSuccess = ref(false)
const isLoading = ref(false)

const downloadAudio = async () => {
  if (!videoUrl.value) {
    return
  }

  isLoading.value = true
  downloadSuccess.value = false

  try {
    const response = await axios.post(
      'http://localhost:3000/api/download-audio',
      { url: videoUrl.value },
      {
        responseType: 'blob', // Important for binary data
      },
    )

    // Create a blob URL and trigger download
    const blob = new Blob([response.data], { type: 'audio/mpeg' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    // Extract video title from URL or use default name
    const filename = `youtube-audio-${Date.now()}.mp3`
    link.download = filename

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up the blob URL
    window.URL.revokeObjectURL(url)

    downloadSuccess.value = true

    // Reset success message after 5 seconds
    setTimeout(() => {
      downloadSuccess.value = false
    }, 5000)
  } catch (error) {
    console.error('Error downloading audio:', error)
    alert('Failed to download audio. Please check the URL and try again.')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.container-style {
  background-color: #010a1b;
  justify-content: center;
  align-items: center;
}

.generate-button-style {
  background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
  color: white;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.generate-button-style:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(233, 30, 99, 0.4);
}

.generate-button-style:disabled {
  opacity: 0.5;
  transform: none;
}

.qr-display {
  animation: fadeIn 0.5s ease-in;
  width: 100%;
  text-align: center;
}

.success-card {
  background: #1a1a1a;
  border-radius: 12px;
  text-align: center;
  padding: 30px;
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
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(188, 54, 224, 0.3);
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
}
</style>
