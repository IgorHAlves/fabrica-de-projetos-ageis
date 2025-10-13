<template>
  <nav class="flex justify-between items-center p-4 bg-white shadow border-b mt-2 hover:shadow-lg transition">
    <!-- Logo -->
    <div class="flex items-center gap-4">
      <h1 class="text-4xl md:text-2xl font-extrabold tracking-wide text-gray-900">
        CLOTHING <span class="text-indigo-600">E-COMMERCE</span>
      </h1>
    </div>

    <!-- Barra de pesquisa -->
    <form class="flex-1 max-w-md mx-4">
      <div class="relative text-gray-600 focus-within:text-gray-400">
        <input
          type="text"
          placeholder="Buscar produtos..."
          class="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>
    </form>

    <!-- Carrinho -->
    <router-link to="/carrinho" class="ml-6 flex items-center gap-2 p-2 rounded-full border border-gray-300 bg-black hover:bg-gray-400 shadow">
      <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 64 64" fill="none">
        <path d="M16 16h4l6 24h20l4-16H26" stroke="white" stroke-width="2" fill="none" />
        <circle cx="26" cy="48" r="4" fill="white" />
        <circle cx="44" cy="48" r="4" fill="white" />
      </svg>
    </router-link>
  </nav>

  <!-- Barra de rotas -->
  <nav class="flex justify-center gap-8 items-center p-4 bg-white shadow font-semibold border-b mt-2 hover:shadow-lg transition">
    <ul class="flex gap-14 items-center">
      <li><router-link to="/" class="hover:text-blue-500">Home</router-link></li>
      <li><router-link to="/produtos" class="hover:text-blue-500">Produtos</router-link></li>
      <li><router-link to="/sobre" class="hover:text-blue-500">Sobre</router-link></li>
    </ul>
  </nav>
</template>
