import { ref } from 'vue'

/**
 * Composable para criar funções com debounce
 * Útil para busca e outras ações que não devem executar imediatamente
 * @param {Function} fn - Função a ser executada
 * @param {Number} delay - Tempo de espera em milissegundos
 * @returns {Function} Função com debounce aplicado
 */
export function useDebounce(fn, delay = 300) {
    let timeoutId = null

    return function (...args) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

/**
 * Composable para criar um valor reativo com debounce
 * Útil para inputs que precisam reagir após o usuário parar de digitar
 * @param {any} initialValue - Valor inicial
 * @param {Number} delay - Tempo de espera em milissegundos
 * @returns {Object} { value, debouncedValue }
 */
export function useDebouncedValue(initialValue = '', delay = 300) {
    const value = ref(initialValue)
    const debouncedValue = ref(initialValue)
    let timeoutId = null

    const updateDebouncedValue = () => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            debouncedValue.value = value.value
        }, delay)
    }

    return {
        value,
        debouncedValue,
        updateDebouncedValue
    }
}


