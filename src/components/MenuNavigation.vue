<template>
  <div class="menu-container">
    <nav class="navbar">
      <div class="logo">
        <img :src="AceSolutionsLogo" alt="Ace Solutions" />
      </div>

      <div class="menu-desktop">
        <RouterLink
          v-for="(item, index) in menu"
          :key="index"
          :to="item.path"
          :class="{ 'btn-primary': index === menu.length - 1 }"
        >
          {{ item.name }}
        </RouterLink>
      </div>

      <button class="hamburger" @click="toggleMenu" aria-label="Toggle menu">
        <span :class="{ open: isMenuOpen }"></span>
        <span :class="{ open: isMenuOpen }"></span>
        <span :class="{ open: isMenuOpen }"></span>
      </button>
    </nav>

    <div class="menu-mobile" :class="{ open: isMenuOpen }">
      <RouterLink
        v-for="(item, index) in menu"
        :key="index"
        :to="item.path"
        :class="{ 'btn-primary': index === menu.length - 1 }"
        @click="closeMenu"
      >
        {{ item.name }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AceSolutionsLogo from '@/assets/AceSolutionsLogo.png'

const menu = ref([
  { name: 'Home', path: '/' },
  { name: 'Tools', path: '/tools' },
  { name: 'Developer', path: '/tools' },
  { name: 'Get started', path: '/' },
])

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<style scoped>
.menu-container {
  background-color: rgba(var(--bg-rgb), 0.8);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  --bg-rgb: 15, 23, 42;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.logo img {
  height: 50px;
  display: block;
}

.menu-desktop {
  display: flex;
  gap: 24px;
  align-items: center;
}

.menu-desktop a {
  text-decoration: none;
  color: #ffffff;
  font-weight: 500;
  transition: all 0.3s ease;
}

.menu-desktop a:hover {
  opacity: 0.8;
  color: #2196f3;
}

.menu-desktop a.btn-primary {
  color: #000000;
  background-color: #2196f3;
  padding: 10px 24px;
  border-radius: 12px;
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1001;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background-color: #000000;
  transition: all 0.3s ease;
  border-radius: 3px;
}

.hamburger span.open:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.hamburger span.open:nth-child(2) {
  opacity: 0;
}

.hamburger span.open:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

.menu-mobile {
  display: none;
  flex-direction: column;
  background-color: white;
  max-height: 0;
  align-items: center;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.menu-mobile.open {
  max-height: 400px;
}

.menu-mobile a {
  text-decoration: none;
  color: #000000;
  font-weight: 500;
  padding: 12px 0;
  transition: all 0.3s ease;
}

.menu-mobile a:hover {
  opacity: 0.8;
}

.menu-mobile a.btn-primary {
  color: #ffffff;
  background-color: #2196f3;
  padding: 12px 24px;
  border-radius: 4px;
  text-align: center;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .menu-desktop {
    display: none;
  }

  .hamburger {
    display: flex;
  }

  .menu-mobile {
    display: flex;
  }
}
</style>
