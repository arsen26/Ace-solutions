<template>
  <div class="text-center mt-10 pt-10 pb-10 container-style fluid">
    <v-row class="mt-10 mb-10 justify-center">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">Shorter Url</h1>
        <p class="text-subtitle-1 text-grey-darken-1">Make Url shorter in seconds</p>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="8" class="rounded-lg pa-6" color="#020c23">
          <v-row>
            <v-col cols="12" md="6" class="d-flex flex-column justify-center">
              <div class="input-section">
                <v-text-field
                  v-model="longUrl"
                  label="Enter URL here"
                  density="comfortable"
                  variant="outlined"
                  prepend-inner-icon="mdi-link"
                  color="primary"
                  class="mb-4"
                  :error-messages="errorMessage"
                  @keyup.enter="shortenUrl"
                ></v-text-field>

                <v-btn
                  class="generate-button-style mb-2"
                  size="large"
                  block
                  elevation="2"
                  @click="shortenUrl"
                  :disabled="!longUrl || loading"
                  :loading="loading"
                >
                  <v-icon left class="mr-2">mdi-link-variant</v-icon>
                  Shorten URL
                </v-btn>
              </div>
            </v-col>

            <v-divider vertical class="d-none d-md-flex"></v-divider>
            <v-divider class="d-flex d-md-none my-4"></v-divider>

            <v-col cols="12" md="6" class="d-flex align-center justify-center">
              <div v-if="!shortUrl" class="placeholder-section">
                <v-icon size="80" color="grey-darken-2" class="mb-4">
                  mdi-link-variant-plus
                </v-icon>
                <p class="text-grey-darken-1">Your shortened URL will appear here</p>
              </div>

              <div v-else class="qr-display w-100">
                <v-card class="qr-card pa-4" elevation="2">
                  <v-card-text class="text-center">
                    <p class="text-caption text-grey mb-2">Shortened URL:</p>
                    <div class="d-flex align-center justify-center mb-3">
                      <a
                        :href="shortUrl"
                        target="_blank"
                        class="text-primary text-decoration-none text-h6"
                      >
                        {{ shortUrl }}
                      </a>
                    </div>

                    <div class="d-flex gap-2 justify-center">
                      <v-btn
                        class="copy-button-style mr-2"
                        variant="flat"
                        @click="copyToClipboard"
                        prepend-icon="mdi-content-copy"
                      >
                        {{ copied ? 'Copied!' : 'Copy' }}
                      </v-btn>
                      <v-btn
                        class="visit-button-style"
                        variant="flat"
                        :href="shortUrl"
                        target="_blank"
                        prepend-icon="mdi-open-in-new"
                      >
                        Visit
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" location="top">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const longUrl = ref('')
const shortUrl = ref('')
const loading = ref(false)
const errorMessage = ref('')
const copied = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

const shortenUrl = async () => {
  if (!longUrl.value.trim()) {
    errorMessage.value = 'Please enter a URL'
    return
  }

  if (!isValidUrl(longUrl.value)) {
    errorMessage.value = 'Please enter a valid URL (must include http:// or https://)'
    return
  }

  loading.value = true
  errorMessage.value = ''
  shortUrl.value = ''

  try {
    const response = await axios.get(
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl.value)}`,
    )
    shortUrl.value = response.data

    snackbarText.value = 'URL shortened successfully!'
    snackbarColor.value = 'success'
    snackbar.value = true
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Failed to shorten URL. Please try again.'

    snackbarText.value = 'Failed to shorten URL'
    snackbarColor.value = 'error'
    snackbar.value = true
  } finally {
    loading.value = false
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(shortUrl.value)
    copied.value = true

    snackbarText.value = 'Copied to clipboard!'
    snackbarColor.value = 'success'
    snackbar.value = true

    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
    snackbarText.value = 'Failed to copy'
    snackbarColor.value = 'error'
    snackbar.value = true
  }
}
</script>

<style scoped>
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

.copy-button-style {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.copy-button-style:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.visit-button-style {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
  color: white;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.visit-button-style:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);
}

.qr-display {
  animation: fadeIn 0.5s ease-in;
  width: 100%;
}

.qr-card {
  background: white;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.qr-card:hover {
  transform: scale(1.02);
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
