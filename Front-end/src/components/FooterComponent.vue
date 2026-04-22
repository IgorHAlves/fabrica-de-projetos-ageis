<script setup>
const anoAtual = new Date().getFullYear();
</script>

<template>
  <footer class="bottom-0 w-full bg-gray-600 text-white py-6 text-center">
    <p class="text-sm">
      {{ anoAtual }} Desenvolvido por Alunos - UNIMAR
    </p>
    <p class="text-xs mt-2">Igor, Rafael, Cesar, Luiz, André</p>
  </footer>
</template>
