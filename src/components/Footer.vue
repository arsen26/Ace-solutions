<template>
  <footer class="site-footer">
    <div class="footer-content">
      <v-row class="footer-row">
        <!-- Brand Section -->
        <v-col cols="12" md="4" class="footer-col">
          <div class="brand-section">
            <v-img
              :src="AceSolutionsLogo"
              alt="Ace Solutions"
              max-width="150"
              class="footer-logo"
            />
            <p class="brand-description">
              Your all-in-one platform for digital transformation and content optimization.
            </p>
            <div class="social-links">
              <a href="#" class="social-link" aria-label="Twitter">
                <v-icon>mdi-twitter</v-icon>
              </a>
              <a href="#" class="social-link" aria-label="GitHub">
                <v-icon>mdi-github</v-icon>
              </a>
              <a href="#" class="social-link" aria-label="LinkedIn">
                <v-icon>mdi-linkedin</v-icon>
              </a>
            </div>
          </div>
        </v-col>

        <!-- Tools Section -->
        <v-col cols="12" sm="6" md="4" class="footer-col">
          <div class="footer-section">
            <h4 class="footer-heading">Tools</h4>
            <v-list dense class="footer-list">
              <v-list-item
                v-for="(tool, index) in tools"
                :key="index"
                :to="tool.link"
                class="footer-tool-link"
              >
                <v-list-item-title>{{ tool.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
        </v-col>

        <v-col cols="12" sm="6" md="4" class="footer-col">
          <div class="footer-section">
            <h4 class="footer-heading">Developer</h4>
            <p class="developer-text">
              Built with passion by<br />
              <strong>Arsen Cenollari</strong>
            </p>
            <a @click="sendToBuyMeACoffe" class="coffee-button">
              <v-icon size="20">mdi-coffee</v-icon>
              <span>Buy me a coffee</span>
            </a>
          </div>
        </v-col>
      </v-row>

      <div class="footer-bottom">
        <v-divider class="footer-divider"></v-divider>
        <div class="footer-copyright">
          <span>© 2025 Ace Solutions. All rights reserved.</span>
          <div class="footer-links">
            <a href="#" class="footer-link">Privacy Policy</a>
            <span class="separator">•</span>
            <a href="#" class="footer-link">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import AceSolutionsLogo from '@/assets/AceSolutionsLogo.png'

const tools = ref([
  {
    name: 'URL Shortener',
    link: '/shorten-url',
  },
  {
    name: 'QR Code Generator',
    link: '/qr-code-generator',
  },
  {
    name: 'Instagram Downloader',
    link: '/instagram-video-downloader',
  },
  {
    name: 'YouTube Downloader',
    link: '/youtube-video-downloader',
  },
])

const sendToBuyMeACoffe = () => {
  window.open('https://buymeacoffee.com/arsencenoln', '_blank')
}
</script>

<style scoped>
.site-footer {
  background: linear-gradient(180deg, rgba(0, 8, 24, 0.95) 0%, rgba(0, 13, 43, 1) 100%);
  border-top: 1px solid rgba(33, 150, 243, 0.15);
  padding: 64px 0 0;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-row {
  margin-bottom: 48px;
}

.footer-col {
  display: flex;
  flex-direction: column;
}

.brand-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.footer-logo {
  margin-bottom: 8px;
  filter: drop-shadow(0 4px 12px rgba(33, 150, 243, 0.2));
}

.brand-description {
  color: #90a4ae;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin: 0;
  max-width: 300px;
}

.social-links {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: rgba(33, 150, 243, 0.1);
  border: 1px solid rgba(33, 150, 243, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2196f3;
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-link:hover {
  background: rgba(33, 150, 243, 0.2);
  border-color: rgba(33, 150, 243, 0.4);
  transform: translateY(-2px);
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-heading {
  color: #ffffff;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  margin-left: 10px;
  letter-spacing: -0.01em;
}

.footer-list {
  background: transparent !important;
  justify-content: center;
  padding: 0 !important;
}

.developer-text {
  color: #90a4ae;
  font-size: 0.9375rem;
  line-height: 1.6;
  margin: 0;
}

.developer-text strong {
  color: #ffffff;
  font-weight: 600;
}

.coffee-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 12px 24px;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.15) 0%, rgba(255, 152, 0, 0.15) 100%);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 8px;
  color: #ffc107;
  font-size: 0.9375rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  width: fit-content;
  margin-top: 8px;
}

.coffee-button:hover {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.25) 0%, rgba(255, 152, 0, 0.25) 100%);
  border-color: rgba(255, 193, 7, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(255, 193, 7, 0.2);
}

.footer-bottom {
  padding: 24px 0;
}

.footer-divider {
  background-color: rgba(33, 150, 243, 0.1) !important;
  margin-bottom: 24px;
}

.footer-copyright {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  color: #78909c;
  font-size: 0.875rem;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-link {
  color: #90a4ae;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #2196f3;
}

.separator {
  color: rgba(144, 164, 174, 0.5);
}

@media (max-width: 960px) {
  .site-footer {
    padding: 48px 0 0;
    margin-top: 60px;
  }

  .footer-content {
    padding: 0 20px;
  }

  .footer-row {
    margin-bottom: 32px;
  }

  .footer-col {
    margin-bottom: 32px;
  }

  .footer-col:last-child {
    margin-bottom: 0;
  }
}

@media (max-width: 600px) {
  .site-footer {
    padding: 40px 0 0;
    margin-top: 48px;
  }

  .footer-content {
    padding: 0 16px;
  }

  .footer-copyright {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .social-links {
    justify-content: center;
  }

  .coffee-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
