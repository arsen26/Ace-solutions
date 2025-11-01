<script setup>
import MenuNavigation from './components/MenuNavigation.vue'
</script>

<template>
  <header>
    <MenuNavigation msg="You did it!" />
  </header>

  <RouterView />
</template>

<style scoped></style>
