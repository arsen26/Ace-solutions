<template>
  <div class="text-center mt-10 pt-10 pb-10 container-style fluid">
    <v-row class="mt-10 mb-10 justify-center">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">Generate QR Code</h1>
        <p class="text-subtitle-1 text-grey-darken-1">Create QR Code in seconds</p>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="8" class="rounded-lg pa-6" color="#020c23">
          <v-row>
            <v-col cols="12" md="6" class="d-flex flex-column justify-center">
              <div class="input-section">
                <v-text-field
                  v-model="link"
                  label="Enter URL here"
                  density="comfortable"
                  variant="outlined"
                  prepend-inner-icon="mdi-link"
                  color="primary"
                  class="mb-4"
                  @keyup.enter="generateQR"
                ></v-text-field>

                <v-btn
                  class="generate-button-style mb-2"
                  size="large"
                  block
                  elevation="2"
                  @click="generateQR"
                  :disabled="!link"
                >
                  <v-icon left class="mr-2">mdi-qrcode</v-icon>
                  Generate QR Code
                </v-btn>

                <v-btn
                  v-if="qrCode"
                  class="download-button-style"
                  size="large"
                  block
                  elevation="2"
                  @click="downloadQR"
                >
                  <v-icon left class="mr-2">mdi-download</v-icon>
                  Download QR Code as image
                </v-btn>
              </div>
            </v-col>

            <v-divider vertical class="d-none d-md-flex"></v-divider>
            <v-divider class="d-flex d-md-none my-4"></v-divider>
            <v-col cols="12" md="6" class="d-flex align-center justify-center">
              <div v-if="qrCode" class="qr-display">
                <v-card elevation="4" class="pa-4 qr-card">
                  <img :src="qrCode" alt="QR Code" class="qr-image" />
                </v-card>
              </div>
              <div v-else class="placeholder-section">
                <v-icon size="100" color="grey-lighten-2">mdi-qrcode-scan</v-icon>
                <p class="text-grey mt-4">QR code will be displayed here</p>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import QRCode from 'qrcode'

const link = ref('')
const qrCode = ref('')

const generateQR = async () => {
  if (!link.value) return

  try {
    qrCode.value = await QRCode.toDataURL(link.value, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
  } catch (err) {
    console.error(err)
  }
}

const downloadQR = () => {
  if (!qrCode.value) return

  const downloadLink = document.createElement('a')
  downloadLink.href = qrCode.value
  downloadLink.download = 'qrcode.png'
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
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
}

.qr-card {
  background: white;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.qr-card:hover {
  transform: scale(1.05);
}

.qr-image {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
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
