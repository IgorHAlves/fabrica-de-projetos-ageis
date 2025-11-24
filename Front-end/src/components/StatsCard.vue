<template>
  <!-- Card de estatística -->
  <div
    class="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-l-4"
    :class="borderColor">
    <div class="flex items-center justify-between">
      <!-- Ícone e informações -->
      <div class="flex-1">
        <div class="flex items-center gap-4 mb-3">
          <!-- Ícone -->
          <div class="p-3 rounded-full" :class="iconBgColor">
            <i :class="icon" class="text-2xl" :style="{ color: iconColor }"></i>
          </div>
          <!-- Título -->
          <h3 class="text-gray-600 text-sm font-semibold uppercase">{{ title }}</h3>
        </div>
        
        <!-- Valor principal -->
        <p class="text-3xl font-bold text-gray-900 mb-2">{{ formattedValue }}</p>
        
        <!-- Variação (opcional) -->
        <div v-if="change !== null" class="flex items-center gap-2">
          <span
            class="text-sm font-semibold flex items-center gap-1"
            :class="change >= 0 ? 'text-green-600' : 'text-red-600'">
            <i :class="change >= 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'"></i>
            {{ Math.abs(change) }}%
          </span>
          <span class="text-sm text-gray-500">vs. mês anterior</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  iconColor: {
    type: String,
    default: '#3B82F6' // blue-500
  },
  iconBgColor: {
    type: String,
    default: 'bg-blue-100'
  },
  borderColor: {
    type: String,
    default: 'border-blue-500'
  },
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  },
  change: {
    type: Number,
    default: null
  }
})

// Formata o valor com prefixo e sufixo
const formattedValue = computed(() => {
  return `${props.prefix}${props.value}${props.suffix}`
})
</script>
