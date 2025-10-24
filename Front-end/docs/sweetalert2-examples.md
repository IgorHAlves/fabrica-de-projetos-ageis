# SweetAlert2 - Exemplos de Uso

## Como usar os alerts no projeto

### 1. Importar o composable

```javascript
import { useAlerts } from '@/composables/useAlerts'

const { 
  showSuccess, 
  showError, 
  showWarning, 
  showInfo, 
  showConfirm, 
  showSuccessToast, 
  showErrorToast,
  showLoading,
  closeLoading 
} = useAlerts()
```

### 2. Exemplos de uso

#### Alert de Sucesso
```javascript
await showSuccess('Produto cadastrado!', 'O produto foi cadastrado com sucesso.')
```

#### Alert de Erro
```javascript
await showError('Erro ao salvar', 'Não foi possível salvar o produto.')
```

#### Alert de Aviso
```javascript
await showWarning('Atenção!', 'Esta ação não pode ser desfeita.')
```

#### Alert de Informação
```javascript
await showInfo('Informação', 'Sua sessão expirará em 5 minutos.')
```

#### Confirmação
```javascript
const result = await showConfirm(
  'Deletar Produto',
  'Tem certeza que deseja deletar este produto?',
  'Sim, deletar',
  'Cancelar'
)

if (result.isConfirmed) {
  // Usuário confirmou
  console.log('Usuário confirmou a ação')
} else {
  // Usuário cancelou
  console.log('Usuário cancelou a ação')
}
```

#### Toast de Sucesso
```javascript
showSuccessToast('Produto adicionado ao carrinho!')
```

#### Toast de Erro
```javascript
showErrorToast('Erro ao carregar dados')
```

#### Loading
```javascript
// Mostrar loading
showLoading('Carregando produtos...')

// Fazer alguma operação assíncrona
await fetchData()

// Fechar loading
closeLoading()
```

### 3. Exemplo completo em um componente Vue

```vue
<template>
  <div>
    <button @click="testarAlerts">Testar Alerts</button>
  </div>
</template>

<script setup>
import { useAlerts } from '@/composables/useAlerts'

const { showSuccess, showError, showConfirm, showSuccessToast } = useAlerts()

async function testarAlerts() {
  // Toast de sucesso
  showSuccessToast('Teste iniciado!')
  
  // Confirmação
  const result = await showConfirm(
    'Teste de Confirmação',
    'Deseja continuar com o teste?',
    'Sim, continuar',
    'Cancelar'
  )
  
  if (result.isConfirmed) {
    // Alert de sucesso
    await showSuccess('Teste Concluído!', 'Todos os alerts funcionaram perfeitamente.')
  } else {
    // Alert de erro
    await showError('Teste Cancelado', 'O teste foi cancelado pelo usuário.')
  }
}
</script>
```

### 4. Características dos Alerts

- **Design moderno** e responsivo
- **Cores personalizadas** para cada tipo
- **Timers automáticos** para toasts (3-4 segundos)
- **Confirmações elegantes** para ações destrutivas
- **Loading spinners** para operações assíncronas
- **Mensagens em português** e contextualizadas
- **Fallback automático** para alerts nativos se SweetAlert2 não carregar

### 5. Troubleshooting

Se os alerts não funcionarem:

1. Verifique se o SweetAlert2 está carregado no console do navegador
2. Verifique se há erros de rede no carregamento do CDN
3. O composable tem fallback para alerts nativos do navegador
4. Verifique se o import está correto: `import { useAlerts } from '@/composables/useAlerts'`