<template>
  <div class="tools-section">
    <div class="tools-header">
      <h2 class="tools-title">Powerful Tools at Your Fingertips</h2>
      <p class="tools-subtitle">
        Choose from our collection of essential digital tools designed for simplicity and efficiency
      </p>
    </div>
    <v-row class="tools-grid">
      <v-col v-for="(tool, index) in tools" :key="index" cols="12" sm="6" md="4">
        <v-card class="tool-card" :to="tool.link" :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="icon-wrapper">
            <v-icon v-if="tool.icon.startsWith('mdi')" class="tool-icon">
              {{ tool.icon }}
            </v-icon>
            <img v-else :src="tool.icon" alt="" class="tool-icon-img" />
          </div>
          <v-card-title class="tool-title">
            {{ tool.name }}
          </v-card-title>
          <v-card-text class="tool-description">
            {{ tool.description }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import instagramIcon from '@/assets/instagram-icon.svg'
import youtubeIcon from '@/assets/youtube-icon.svg'

const tools = ref([
  {
    name: 'URL Shortener',
    icon: 'mdi-link-variant',
    description: 'Shorten long URLs into compact, shareable links instantly',
    link: '/shorten-url',
  },
  {
    name: 'QR Code Generator',
    icon: 'mdi-qrcode',
    description: 'Convert any link into a scannable QR code in seconds',
    link: '/qr-code-generator',
  },
  {
    name: 'Instagram Downloader',
    icon: instagramIcon,
    description: 'Download videos and photos from Instagram with ease',
    link: '/instagram-downloader',
  },
  {
    name: 'YouTube Downloader',
    icon: youtubeIcon,
    description: 'Save YouTube videos in various formats and qualities',
    link: '/youtube-downloader',
  },
  {
    name: 'Image Converter',
    icon: 'mdi-image-outline',
    description: 'Convert images between different formats (PNG, JPG, WEBP, etc.)',
    link: '/image-converter',
  },
  {
    name: 'File Transfer',
    icon: 'mdi-share-variant',
    description: 'Share files and folders securely via generated links',
    link: '/file-transfer',
  },
])
</script>

<style scoped>
.tools-section {
  padding: 80px 24px;
  width: 100%;
  margin: 0 auto;
  background: linear-gradient(180deg, rgba(0, 13, 43, 0.5) 0%, rgba(0, 8, 24, 0.8) 100%);
}

.tools-header {
  text-align: center;
  margin-bottom: 64px;
  animation: fadeIn 0.8s ease-out;
}

.tools-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.tools-subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: #90a4ae;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.tools-grid {
  gap: 24px;
  justify-content: center;
}

.tool-card {
  background: rgba(15, 23, 42, 0.6) !important;
  border: 1px solid rgba(33, 150, 243, 0.15) !important;
  border-radius: 16px !important;
  padding: 32px 24px;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  animation: slideUp 0.6s ease-out both;
}

.tool-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.5), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.tool-card:hover::before {
  transform: translateX(100%);
}

.tool-card:hover {
  background: rgba(15, 23, 42, 0.9) !important;
  border-color: rgba(33, 150, 243, 0.4) !important;
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(33, 150, 243, 0.15);
}

.icon-wrapper {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(102, 126, 234, 0.15) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.tool-card:hover .icon-wrapper {
  background: linear-gradient(135deg, rgba(33, 150, 243, 0.25) 0%, rgba(102, 126, 234, 0.25) 100%);
  transform: scale(1.05);
}

.tool-icon {
  font-size: 32px !important;
  color: #2196f3;
}

.tool-icon-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(186deg) brightness(118%) contrast(119%);
}

.tool-title {
  font-size: 1.375rem;
  font-weight: 600;
  color: #ffffff;
  padding: 0;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
}

.tool-description {
  font-size: 0.9375rem;
  color: #78909c;
  line-height: 1.6;
  padding: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 960px) {
  .tools-section {
    padding: 60px 20px;
  }

  .tools-header {
    margin-bottom: 48px;
  }

  .tools-grid {
    gap: 16px;
  }

  .tool-card {
    padding: 24px 20px;
  }

  .icon-wrapper {
    width: 56px;
    height: 56px;
  }

  .tool-icon {
    font-size: 28px !important;
  }

  .tool-icon-img {
    width: 28px;
    height: 28px;
  }
}

@media (max-width: 600px) {
  .tools-section {
    padding: 48px 16px;
  }

  .tool-card {
    padding: 20px 16px;
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
  }

  .tool-icon {
    font-size: 24px !important;
  }

  .tool-icon-img {
    width: 24px;
    height: 24px;
  }

  .tool-title {
    font-size: 1.25rem;
  }

  .tool-description {
    font-size: 0.875rem;
  }
}
</style>
