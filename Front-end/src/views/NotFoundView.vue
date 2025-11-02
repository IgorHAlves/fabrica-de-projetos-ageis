<template>
    <div
        class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center py-12 px-4">
        <div class="max-w-2xl w-full text-center">
            <!-- Ícone 404 -->
            <div class="mb-8">
                <i class="fa-solid fa-triangle-exclamation text-9xl text-gray-300"></i>
            </div>

            <!-- Título e mensagem -->
            <h1 class="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
            <h2 class="text-3xl font-bold text-gray-800 mb-4">Página Não Encontrada</h2>
            <p class="text-lg text-gray-600 mb-8">
                Desculpe, a página que você está procurando não existe ou foi movida.
            </p>

            <!-- Botões de ação -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <router-link to="/home"
                    class="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
                    <i class="fa-solid fa-home mr-2"></i>
                    Voltar para Home
                </router-link>
                <router-link to="/produtos"
                    class="inline-flex items-center justify-center bg-white border-2 border-gray-300 text-gray-800 px-8 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-bold text-lg shadow-md hover:shadow-lg">
                    <i class="fa-solid fa-store mr-2"></i>
                    Ver Produtos
                </router-link>
            </div>

            <!-- Informações adicionais -->
            <div class="mt-12 bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-4">O que você pode fazer?</h3>
                <ul class="text-left text-gray-600 space-y-2">
                    <li class="flex items-start">
                        <i class="fa-solid fa-check-circle text-green-500 mr-2 mt-1"></i>
                        <span>Verificar se a URL está correta</span>
                    </li>
                    <li class="flex items-start">
                        <i class="fa-solid fa-check-circle text-green-500 mr-2 mt-1"></i>
                        <span>Usar a barra de navegação para encontrar o que precisa</span>
                    </li>
                    <li class="flex items-start">
                        <i class="fa-solid fa-check-circle text-green-500 mr-2 mt-1"></i>
                        <span>Voltar para a página anterior ou início</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
// Meta tags serão adicionadas via composable ou router meta
</script>


