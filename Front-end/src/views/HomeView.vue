<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-gray-900 mb-8">Bem-vindo ao Sistema de Produtos</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Produtos</h2>
          <p class="text-gray-600 mb-4">Gerencie seu catálogo de produtos</p>
          <router-link to="/produtos" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Ver Produtos
          </router-link>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Cadastrar</h2>
          <p class="text-gray-600 mb-4">Adicione novos produtos ao sistema</p>
          <router-link to="/admin/produtos/novo" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Cadastrar Produto
          </router-link>
        </div>
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Carrinho</h2>
          <p class="text-gray-600 mb-4">Gerencie seus itens de compra</p>
          <router-link to="/carrinho" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            Ver Carrinho
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>