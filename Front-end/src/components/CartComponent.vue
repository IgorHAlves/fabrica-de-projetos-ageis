<script setup>
import { ref } from 'vue'

const cartItems = ref([])

function addToCart(product) {
  cartItems.value.push(product)
}
</script>
