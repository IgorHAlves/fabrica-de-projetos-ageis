<template>
  <div class="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
    <!-- Imagem -->
    <div class="relative bg-gray-100 h-64 w-full animate-pulse"></div>

    <!-- Conteúdo -->
    <div class="p-5 space-y-4">
      <!-- Título -->
      <div class="space-y-2">
        <Skeleton height="1.5rem" width="90%" />
        <Skeleton height="1.5rem" width="60%" />
      </div>

      <!-- Descrição -->
      <div class="space-y-2">
        <Skeleton height="0.875rem" width="100%" />
        <Skeleton height="0.875rem" width="80%" />
      </div>

      <!-- Preço -->
      <div class="pt-2">
        <Skeleton height="0.75rem" width="30%" className="mb-1" />
        <Skeleton height="2rem" width="50%" />
      </div>
    </div>

    <!-- Botão -->
    <div class="px-5 pb-5">
      <Skeleton height="3rem" className="rounded-xl" />
    </div>
  </div>
</template>

<script setup>
import Skeleton from './Skeleton.vue';
</script>
