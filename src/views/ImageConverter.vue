<template>
  <div class="text-center mt-10 pt-10 pb-10 container-style fluid">
    <div v-if="isLoading" class="loading-container">
      <fingerprint-spinner :animation-duration="1500" :size="64" color="#bc36e0" />
    </div>
    <v-row class="mt-10 mb-10 justify-center">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">Image Format Converter</h1>
        <p class="text-subtitle-1 text-grey-darken-1">
          Convert images between different formats instantly
        </p>
      </v-col>
    </v-row>
    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="8" class="rounded-lg pa-6" color="#020c23">
          <v-row>
            <v-col cols="12" md="6" class="d-flex flex-column justify-center">
              <div class="input-section">
                <v-file-input
                  v-model="selectedFile"
                  label="Select Image"
                  density="comfortable"
                  variant="outlined"
                  prepend-icon="mdi-image"
                  color="primary"
                  class="mb-4"
                  accept="image/*"
                  placeholder="Choose an image file"
                  @update:model-value="handleFileSelect"
                ></v-file-input>

                <v-select
                  v-model="targetFormat"
                  :items="formatOptions"
                  label="Convert to Format"
                  density="comfortable"
                  variant="outlined"
                  prepend-icon="mdi-file-swap"
                  color="primary"
                  class="mb-4"
                ></v-select>

                <v-btn
                  class="generate-button-style mb-2"
                  size="large"
                  block
                  elevation="2"
                  @click="convertImage"
                  :disabled="!selectedFile || !targetFormat"
                >
                  <v-icon left class="mr-2">mdi-sync</v-icon>
                  Convert Image
                </v-btn>
                <v-btn
                  v-if="convertedImageUrl"
                  class="download-button-style"
                  size="large"
                  block
                  elevation="2"
                  @click="downloadImage"
                >
                  <v-icon left class="mr-2">mdi-download</v-icon>
                  Download Converted Image
                </v-btn>
              </div>
            </v-col>
            <v-divider vertical class="d-none d-md-flex"></v-divider>
            <v-divider class="d-flex d-md-none my-4"></v-divider>
            <v-col cols="12" md="6" class="d-flex align-center justify-center">
              <div v-if="convertedImageUrl" class="preview-display">
                <v-card elevation="4" class="pa-4 success-card">
                  <img :src="convertedImageUrl" alt="Converted Image" class="preview-image mb-4" />
                  <h3 class="text-h5 mb-2">Conversion Complete!</h3>
                  <p class="text-body-2 text-grey mb-4">
                    Your image has been converted to {{ targetFormat.toUpperCase() }}
                  </p>
                  <v-chip color="success" variant="outlined">
                    <v-icon left small>mdi-check-circle</v-icon>
                    Ready to Download
                  </v-chip>
                </v-card>
              </div>
              <div v-else-if="previewUrl" class="preview-display">
                <v-card elevation="4" class="pa-4 preview-card">
                  <img :src="previewUrl" alt="Original Image" class="preview-image mb-4" />
                  <h3 class="text-h6 mb-2">Original Image</h3>
                  <p class="text-body-2 text-grey">
                    {{ originalFormat ? originalFormat.toUpperCase() : 'Unknown' }} format
                  </p>
                </v-card>
              </div>
              <div v-else class="placeholder-section">
                <v-icon size="100" color="grey-lighten-2">mdi-image-outline</v-icon>
                <p class="text-grey mt-4">Upload an image to get started</p>
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

const selectedFile = ref(null)
const targetFormat = ref('png')
const previewUrl = ref('')
const convertedImageUrl = ref('')
const originalFormat = ref('')
const isLoading = ref(false)

const formatOptions = [
  { title: 'PNG', value: 'png' },
  { title: 'JPEG', value: 'jpeg' },
  { title: 'WebP', value: 'webp' },
  { title: 'BMP', value: 'bmp' },
  { title: 'ICO', value: 'ico' },
]

const handleFileSelect = () => {
  const file = Array.isArray(selectedFile.value) ? selectedFile.value[0] : selectedFile.value

  //nese eshte e llojit file
  if (file && file instanceof File) {
    //marr emrin e files qe po behet upload
    const fileExtension = file.name.split('.').pop().toLowerCase()
    originalFormat.value = fileExtension

    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target.result
    }
    reader.readAsDataURL(file)

    convertedImageUrl.value = ''
  }
}

const convertImage = async () => {
  if (!selectedFile.value) return

  isLoading.value = true
  try {
    const file = Array.isArray(selectedFile.value) ? selectedFile.value[0] : selectedFile.value
    if (!file || !(file instanceof File || file instanceof Blob)) {
      throw new Error('Invalid file selected')
    }

    const reader = new FileReader()

    reader.onload = async (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')

        ctx.drawImage(img, 0, 0)

        const mimeType = `image/${targetFormat.value === 'jpg' ? 'jpeg' : targetFormat.value}`
        const quality =
          targetFormat.value === 'jpeg' || targetFormat.value === 'webp' ? 0.95 : undefined

        convertedImageUrl.value = canvas.toDataURL(mimeType, quality)
        isLoading.value = false
      }

      img.onerror = () => {
        alert('Failed to load image. Please try another file.')
        isLoading.value = false
      }

      img.src = e.target.result
    }

    reader.onerror = () => {
      alert('Failed to read file. Please try again.')
      isLoading.value = false
    }

    reader.readAsDataURL(file)
  } catch (error) {
    console.error('Conversion error:', error)
    alert('Failed to convert image. Please try again.')
    isLoading.value = false
  }
}

const downloadImage = () => {
  if (!convertedImageUrl.value) return

  const link = document.createElement('a')
  const file = Array.isArray(selectedFile.value) ? selectedFile.value[0] : selectedFile.value
  const fileName = file?.name ? file.name.split('.')[0] : 'converted_image'
  link.href = convertedImageUrl.value
  link.download = `${fileName}_converted.${targetFormat.value}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
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
  min-height: 100vh;
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

.preview-display {
  animation: fadeIn 0.5s ease-in;
  width: 100%;
  text-align: center;
}

.success-card,
.preview-card {
  background: transparent;
  border-radius: 12px;
  text-align: center;
  padding: 30px;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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

  .preview-image {
    max-height: 200px;
  }
}
</style>
