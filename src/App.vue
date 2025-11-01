<template>
  <v-app>
    <MenuNavigation />
    <v-main>
      <router-view></router-view>
    </v-main>
    <!-- <whatssAppContact /> -->
    <Footer />
  </v-app>
</template>

<script setup>
import MenuNavigation from './components/MenuNavigation.vue'
import Footer from './components/Footer.vue'
</script>

<style scoped></style>
