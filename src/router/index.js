import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Index.vue'
import PasswordGenerator from '@/views/PasswordGenerator.vue'
import QrCodeGenerator from '@/views/QrCodeGenerator.vue'
import ShorterUrlGenerator from '@/views/ShorterUrlGenerator.vue'
import InstagramVideoDownloader from '@/views/InstagramVideoDownloader.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/password-generator',
      name: 'password-generator',
      component: PasswordGenerator,
    },
    {
      path: '/qr-code-generator',
      name: 'qr-code-generator',
      component: QrCodeGenerator,
    },
    {
      path: '/shorten-url',
      name: 'shorter-url',
      component: ShorterUrlGenerator,
    },
    {
      path: '/instagram-video-downloader',
      name: 'instagram-video-downloader',
      component: InstagramVideoDownloader,
    },
  ],
})

export default router
