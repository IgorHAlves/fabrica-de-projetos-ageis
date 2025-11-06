<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBarComponent.vue'
import Footer from './components/FooterComponent.vue'
</script>

<template>
  <NavBar />

  <div class="min-h-screen flex flex-col justify-between bg-gray-100">
    <RouterView />
  </div>

  <Footer />
</template>

