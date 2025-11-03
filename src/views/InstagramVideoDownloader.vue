<template>
  <div class="text-center mt-10 pt-10 pb-10 container-style fluid">
    <div v-if="isLoading" class="loading-container">
      <fingerprint-spinner :animation-duration="1500" :size="64" color="#bc36e0" />
    </div>
    <v-row class="mt-10 mb-10 justify-center">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">Instagram Video Downloader</h1>
        <p class="text-subtitle-1 text-grey-darken-1">Download Instagram videos in seconds</p>
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
                  label="Enter Instagram URL here"
                  density="comfortable"
                  variant="outlined"
                  prepend-inner-icon="mdi-instagram"
                  color="primary"
                  class="mb-4"
                  placeholder="https://www.instagram.com/p/..."
                ></v-text-field>
                <v-btn
                  class="generate-button-style mb-2"
                  size="large"
                  block
                  elevation="2"
                  @click="getVideoLink"
                  :disabled="!videoUrl"
                >
                  <v-icon left class="mr-2">mdi-link-variant</v-icon>
                  Get Download Link
                </v-btn>
                <v-btn
                  v-if="videoExportPreviewLink"
                  class="download-button-style"
                  size="large"
                  block
                  elevation="2"
                  @click="downloadVideo"
                >
                  <v-icon left class="mr-2">mdi-download</v-icon>
                  Download Video
                </v-btn>
              </div>
            </v-col>
            <v-divider vertical class="d-none d-md-flex"></v-divider>
            <v-divider class="d-flex d-md-none my-4"></v-divider>
            <v-col cols="12" md="6" class="d-flex align-center justify-center">
              <div v-if="videoExportPreviewLink" class="qr-display">
                <v-card elevation="4" class="pa-4 success-card">
                  <v-icon size="80" color="success" class="mb-4">mdi-check-circle</v-icon>
                  <h3 class="text-h5 mb-2">Video Ready!</h3>
                  <p class="text-body-2 text-grey mb-4">Click the download button to save the video</p>
                  <v-chip color="success" variant="outlined">
                    <v-icon left small>mdi-video</v-icon>
                    Video Available
                  </v-chip>
                </v-card>
              </div>
              <div v-else class="placeholder-section">
                <v-icon size="100" color="grey-lighten-2">mdi-video-outline</v-icon>
                <p class="text-grey mt-4">Enter Instagram URL to get started</p>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { FingerprintSpinner } from 'epic-spinners'
import { ref } from 'vue'
import axios from 'axios'

const videoUrl = ref('')
const videoExportPreviewLink = ref('')
const isLoading = ref(false)

const getVideoLink = async () => {
  if (!videoUrl.value) {
    return
  }

  isLoading.value = true
  try {
    const body = {
      url: videoUrl.value,
    }
    const response = await axios.post('http://localhost:3000/api/get-link', body)
    console.log('Video Data:', response.data)
    videoExportPreviewLink.value = response.data.downloadLink
  } catch (error) {
    console.error('Error fetching video data:', error)
    alert('Failed to get video link. Please check the URL and try again.')
  } finally {
    isLoading.value = false
  }
}

const downloadVideo = async () => {
  try {
    const link = document.createElement('a')
    link.href = videoExportPreviewLink.value
    link.download = 'instagram-video.mp4'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Download error:', error)
    window.open(videoExportPreviewLink.value, '_blank')
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
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.generate-button-style:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.4);
}

.download-button-style {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.download-button-style:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
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
