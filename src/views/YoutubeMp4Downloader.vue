<template>
  <div class="text-center mt-10 pt-10 pb-10 container-style fluid">
    <v-row class="mt-10 mb-10 justify-center">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">YouTube Video Downloader</h1>
        <p class="text-subtitle-1 text-grey-darken-1">Download YouTube videos as MP4</p>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="8" class="rounded-lg pa-6" color="#020c23">
          <v-card-text>
            <v-text-field
              v-model="videoUrl"
              label="Paste YouTube URL here"
              variant="outlined"
              bg-color="#010a1b"
              color="primary"
              class="mb-4"
              :error-messages="errorMessage"
              :disabled="isLoading"
              @keyup.enter="downloadVideo"
            >
              <template v-slot:prepend-inner>
                <v-icon icon="mdi-youtube" color="red"></v-icon>
              </template>
            </v-text-field>

            <v-btn
              block
              size="x-large"
              class="generate-button-style text-white mb-6"
              :loading="isLoading"
              :disabled="!videoUrl || isLoading"
              @click="downloadVideo"
            >
              <v-icon start icon="mdi-download"></v-icon>
              Download MP4
            </v-btn>

            <!-- Progress Section -->
            <div v-if="isLoading || progressStatus" class="mt-4">
              <div class="d-flex justify-space-between mb-2">
                <span class="text-body-2">{{ progressStatus }}</span>
                <span class="text-body-2" v-if="progressData.percent">{{
                  progressData.percent
                }}</span>
              </div>

              <v-progress-linear
                v-model="progressPercent"
                color="primary"
                height="20"
                striped
                rounded
              >
                <template v-slot:default="{ value }">
                  <span class="text-caption text-white">{{ Math.ceil(value) }}%</span>
                </template>
              </v-progress-linear>

              <div
                class="d-flex justify-space-between mt-2 text-caption text-grey"
                v-if="progressData.speed"
              >
                <span>Speed: {{ progressData.speed }}</span>
                <span>ETA: {{ progressData.eta }}</span>
              </div>
            </div>

            <!-- Success Message -->
            <v-alert v-if="downloadSuccess" type="success" variant="tonal" class="mt-4" closable>
              <div class="text-h6">Download Complete!</div>
              <div>{{ successMessage }}</div>
              <div class="text-caption mt-1">Saved to: {{ downloadFolder }}</div>
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const videoUrl = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const downloadSuccess = ref(false)
const successMessage = ref('')
const downloadFolder = ref('')
const progressStatus = ref('')
const progressData = ref({})

const progressPercent = computed(() => {
  if (!progressData.value.percent) return 0
  // Remove % sign and convert to number
  const match = progressData.value.percent.match(/(\d+\.?\d*)/)
  return match ? parseFloat(match[1]) : 0
})

const downloadVideo = () => {
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
    `/api/download-video?url=${encodeURIComponent(videoUrl.value)}`,
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
          progressStatus.value = 'Downloading video...'
        } else if (data.data.status === 'finished') {
          progressStatus.value = data.data.message
        }
      } else if (data.type === 'complete') {
        downloadSuccess.value = true
        successMessage.value = data.data.filename
          ? `Saved as: ${data.data.filename}`
          : 'Video downloaded successfully!'
        downloadFolder.value = data.data.folder || 'Downloads/YouTube Video'
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
.container-style {
  background-color: #010a1b;
  min-height: 100vh;
  color: white;
}

.generate-button-style {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.generate-button-style:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
}
</style>
