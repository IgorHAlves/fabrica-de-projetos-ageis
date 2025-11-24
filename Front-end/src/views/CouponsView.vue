<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
    <div class="max-w-6xl mx-auto px-4">
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">
            <i class="fa-solid fa-ticket mr-3 text-purple-600"></i>
            Gerenciar Cupons
          </h1>
          <p class="text-gray-600">Crie e gerencie cupons de desconto para seus clientes</p>
        </div>

        <CouponManagementComponent />
      </div>
    </div>
  </div>
</template>

<script setup>
import CouponManagementComponent from '../components/CouponManagementComponent.vue'
</script>


