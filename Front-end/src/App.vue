<script setup>
import { RouterView, useRoute } from 'vue-router'
import Footer from './components/FooterComponent.vue'
import NavBar from './components/NavBarComponent.vue'

const route = useRoute()
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between bg-gray-100">
    <NavBar v-if="!route.path.startsWith('/admin')" />
    <RouterView />
    <Footer />
  </div>
</template>
