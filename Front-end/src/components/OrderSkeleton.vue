<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div class="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <Skeleton width="2.5rem" height="2.5rem" className="rounded-lg" />
        <div class="space-y-1">
          <Skeleton width="3rem" height="0.75rem" />
          <Skeleton width="6rem" height="1rem" />
        </div>
      </div>
      <div class="text-right space-y-1">
        <Skeleton width="3rem" height="0.75rem" className="ml-auto" />
        <Skeleton width="5rem" height="1.25rem" />
      </div>
    </div>

    <!-- Corpo -->
    <div class="p-6 space-y-4">
      <Skeleton width="8rem" height="1rem" />

      <!-- Grid de Produtos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/30">
          <Skeleton width="4rem" height="4rem" className="rounded-lg flex-shrink-0" />
          <div class="flex-1 space-y-2">
            <Skeleton width="90%" height="0.875rem" />
            <Skeleton width="40%" height="0.75rem" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Skeleton from './Skeleton.vue';
</script>
