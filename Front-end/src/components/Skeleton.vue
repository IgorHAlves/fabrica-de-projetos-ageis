<template>
  <div 
    class="animate-pulse bg-gray-200 rounded"
    :class="[className]"
    :style="{ width: width, height: height }"
  ></div>
</template>

<script setup>
defineProps({
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '1rem'
  },
  className: {
    type: String,
    default: ''
  }
})
</script>
