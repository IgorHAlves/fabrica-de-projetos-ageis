<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <NavBar />

<div class="min-h-screen flex flex-col justify-between bg-gray-100">
  <RouterView />
  <RouterLink to="/"></RouterLink>
</div>

  <Footer />
</template>





<script>
import NavBar from './components/NavBarComponent.vue'
import Footer from './components/FooterComponent.vue'

export default {
  components: {
    NavBar,
    Footer
  }
}
</script>
