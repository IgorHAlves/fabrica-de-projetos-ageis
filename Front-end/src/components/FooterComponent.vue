<script setup>
const anoAtual = new Date().getFullYear();
</script>

<template>
  <footer class="bottom-0 w-full bg-gray-800 text-gray-400 py-4 text-center">
    <p class="text-xs">
      {{ anoAtual }} Desenvolvido por Alunos - UNIMAR
    </p>
    <p class="text-xs mt-1 opacity-75">Igor, Rafael, Cesar, Luiz, André</p>
  </footer>
</template>
