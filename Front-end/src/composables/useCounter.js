import {ref}from 'vue';

export function useCounter(stock, initial = 1) {
    const quantidade = ref(initial);

    function incrementar()
    {
        if(quantidade.value < stock){
            quantidade.value++;
        }
    }

    function decrementar(){
        if(quantidade.value > 1){
            quantidade.value--;
        }
    }

    return{
    quantidade,
    incrementar,
    decrementar
    }


}

