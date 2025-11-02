<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import NavBar from './components/NavBarComponent.vue'
import Footer from './components/FooterComponent.vue'

const route = useRoute()
const transitionName = computed(() => {
  // Transição baseada na rota
  return 'fade'
})
</script>

<template>
  <NavBar />

  <div class="min-h-screen flex flex-col justify-between bg-gray-100">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </div>

  <Footer />
</template>

<style>
/* Transições entre páginas */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Garante que o conteúdo não "pule" durante a transição */
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
