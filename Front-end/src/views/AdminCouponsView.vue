<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Main Content -->
    <div class="flex-1">
      <!-- Header -->
      <div class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div class="px-4 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <i class="fa-solid fa-ticket text-purple-600"></i>
                Gerenciar Cupons
              </h1>
              <p class="text-gray-600 mt-1">Crie e gerencie cupons de desconto para seus clientes</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="px-4 py-4">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <CouponManagementComponent />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from '../components/AdminSidebar.vue';
import CouponManagementComponent from '../components/CouponManagementComponent.vue';
</script>
