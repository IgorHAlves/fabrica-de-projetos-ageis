<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import BreadcrumbComponent from './components/BreadcrumbComponent.vue'
import Footer from './components/FooterComponent.vue'
import NavBar from './components/NavBarComponent.vue'

const route = useRoute()

// Verifica se está em uma rota de admin
const isAdminRoute = computed(() => {
  return route.path.startsWith('/admin')
})
</script>

<template>
  <!-- Navbar e Breadcrumb apenas para rotas não-admin -->
  <NavBar v-if="!isAdminRoute" />
  <BreadcrumbComponent v-if="!isAdminRoute"></BreadcrumbComponent>

  <div class="min-h-screen flex flex-col justify-between bg-gray-100">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>

  <!-- Footer apenas para rotas não-admin -->
  <Footer v-if="!isAdminRoute" />
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
