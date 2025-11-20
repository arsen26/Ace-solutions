<template>
  <div class="text-center mt-10 pt-10 pb-10 container-style fluid">
    <v-row class="mt-10 mb-10 justify-center">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">File Transfer</h1>
        <p class="text-subtitle-1 text-grey-darken-1">
          Share files and folders to your mobile device
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="8" class="rounded-lg pa-6" color="#020c23">
          <v-card-text>
            <v-alert
              type="info"
              variant="tonal"
              class="mb-6 text-left"
              border="start"
              border-color="primary"
            >
              <div class="text-body-1 font-weight-bold mb-1">How it works</div>
              <div class="text-body-2">
                1. Enter the <strong>absolute path</strong> of the file or folder you want to share
                (e.g., <code>C:\Users\Name\Documents\MyFolder</code>).<br />
                2. Click "Generate Link".<br />
                3. Scan the QR code with your phone (must be on the same Wi-Fi network).<br />
                4. The download will start automatically.
              </div>
            </v-alert>

            <v-text-field
              v-model="filePath"
              label="Absolute File or Folder Path"
              placeholder="C:\Users\..."
              variant="outlined"
              bg-color="#010a1b"
              color="primary"
              class="mb-4"
              :error-messages="errorMessage"
              :disabled="isLoading"
              @keyup.enter="generateLink"
            >
              <template v-slot:prepend-inner>
                <v-icon icon="mdi-folder-open" color="primary"></v-icon>
              </template>
            </v-text-field>

            <v-btn
              block
              size="x-large"
              class="generate-button-style text-white mb-6"
              :loading="isLoading"
              :disabled="!filePath || isLoading"
              @click="generateLink"
            >
              <v-icon start icon="mdi-link-variant"></v-icon>
              Generate Link
            </v-btn>

            <!-- Result Section -->
            <div v-show="shareUrl" class="text-center mt-6">
              <div class="d-flex justify-center mb-4 bg-white pa-4 rounded-lg d-inline-block">
                <canvas ref="qrCanvas"></canvas>
              </div>

              <div class="mt-4">
                <p class="text-subtitle-1 text-grey-lighten-1 mb-2">Or use this link:</p>
                <code class="pa-2 rounded bg-grey-darken-4 text-primary d-block text-truncate">{{
                  shareUrl
                }}</code>
              </div>

              <v-btn variant="text" color="primary" class="mt-2" @click="copyToClipboard">
                <v-icon start>mdi-content-copy</v-icon>
                Copy Link
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :timeout="2000" color="success">
      {{ snackbarText }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import QRCode from 'qrcode'

const filePath = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const shareUrl = ref('')
const snackbar = ref(false)
const snackbarText = ref('')
const qrCanvas = ref(null)

const generateLink = async () => {
  if (!filePath.value) return

  isLoading.value = true
  errorMessage.value = ''
  shareUrl.value = ''

  try {
    const response = await fetch('/api/share/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: filePath.value }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate link')
    }

    shareUrl.value = data.url

    // Wait for DOM update
    await nextTick()

    // Small delay to ensure v-show transition doesn't interfere (though v-show is just CSS)
    setTimeout(async () => {
      if (qrCanvas.value) {
        try {
          await QRCode.toCanvas(qrCanvas.value, shareUrl.value, {
            width: 250,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#ffffff',
            },
          })
        } catch (err) {
          console.error('Error rendering QR code:', err)
        }
      } else {
        console.error('Canvas ref not found')
      }
    }, 100)
  } catch (error) {
    console.error('Error generating link:', error)
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    snackbarText.value = 'Link copied to clipboard'
    snackbar.value = true
  } catch (err) {
    console.error('Failed to copy:', err)
    snackbarText.value = 'Failed to copy link'
    snackbar.value = true
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
