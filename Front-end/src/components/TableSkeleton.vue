<template>
  <div class="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">
    <div class="p-6 border-b border-gray-100 flex justify-between items-center" v-if="showHeader">
      <Skeleton width="200px" height="24px" />
    </div>
    <div class="p-0">
      <table class="min-w-full">
        <thead class="bg-gray-50">
          <tr>
            <th v-for="i in columns" :key="i" class="px-6 py-4">
              <Skeleton width="80%" height="16px" />
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="row in rows" :key="row">
            <td v-for="col in columns" :key="col" class="px-6 py-4">
              <Skeleton width="100%" height="20px" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import Skeleton from './Skeleton.vue';

defineProps({
  rows: {
    type: Number,
    default: 5
  },
  columns: {
    type: Number,
    default: 4
  },
  showHeader: {
    type: Boolean,
    default: false
  }
})
</script>
