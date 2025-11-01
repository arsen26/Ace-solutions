<template>
  <v-app>
    <MenuNavigation />
    <v-main>
      <router-view></router-view>
    </v-main>
    <!-- <whatssAppContact /> -->
    <!-- <siteFooter v-if="!isAnnaLinksPage" /> -->
  </v-app>
</template>

<script setup>
import MenuNavigation from './components/MenuNavigation.vue'
</script>

<style scoped></style>
