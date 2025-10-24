# Cadastro de Produtos – Documentação do Front e Integração com Backend

## 1) Visão geral
- O formulário de cadastro de produtos está implementado no front (Vue 3 + Pinia + Vue Router).
- A imagem do produto é enviada direto para o Cloudinary usando Upload UNSIGNED.
- Os dados do produto são persistidos localmente (mock) via `localStorage`, prontos para trocar para backend real.

Arquivos principais:
- Rota: `/admin/produtos/novo`
- View: `src/views/ProductCreateView.vue`
- Store: `src/stores/products.js`
- HTTP client (pré-backend): `src/services/http.js` (axios configurado por env)
- Upload Cloudinary: `src/services/cloudinary.js`

## 2) Como funciona hoje (sem backend)
- Usuário acessa `/admin/produtos/novo`.
- Preenche o formulário (nome, preço, descrição, categoria, quantidade em estoque, imagem).
- Seleciona um arquivo de imagem; o front faz upload para o Cloudinary (unsigned) e recebe `secure_url` e `public_id`.
- Ao enviar o formulário, o produto é salvo na store e persistido em `localStorage` (chave `mock_products`).

### 2.1) Campos do formulário
- `name` (obrigatório)
- `price` (≥ 0, obrigatório)
- `description` (opcional)
- `category` (obrigatório)
- `stock` (quantidade em estoque, obrigatório)
- `imageUrl` (obrigatório; preenchido após upload no Cloudinary)
- Metadados gerados: `sku` (UUID), `active` (true), `createdAt`

### 2.2) Validações no front
- Campos obrigatórios (nome, preço, categoria, estoque, imagem).
- Feedback visual de erro e sucesso.
- Progresso do upload de imagem.

### 2.3) Persistência mock
- Implementada em `src/stores/products.js`.
- Funções: `fetchAll()` e `create(productInput)`.
- Armazenamento: `localStorage` → chave `mock_products`.

## 3) Cloudinary – Upload UNSIGNED (100% no front)
- Serviço: `src/services/cloudinary.js`.
- Envio para: `https://api.cloudinary.com/v1_1/{cloud_name}/image/upload`.
- Requer variáveis de ambiente:
  - `VITE_CLOUDINARY_CLOUD_NAME`
  - `VITE_CLOUDINARY_UPLOAD_PRESET` (preset marcado como Unsigned)
- Retorno utilizado: `secure_url` (URL pública), `public_id` (identificador para gerência futura).

Exemplo de .env (Vite):
```bash
VITE_CLOUDINARY_CLOUD_NAME=seu_cloud
VITE_CLOUDINARY_UPLOAD_PRESET=ecommerce_unsigned
# Opcional: quando backend existir
VITE_API_URL=https://api.suaempresa.com
```

Boas práticas do preset:
- Definir pasta (ex.: `products/`).
- Limitar tamanho e formatos.
- Ativar moderação/transforms se necessário.

## 4) Navegação
- Link no menu para cadastro: `NavBarComponent.vue` → rota `/admin/produtos/novo` (via `RouterLink`).

## 5) O que muda quando conectar no backend
Front continua igual para o usuário, mas por baixo dos panos muda a fonte de dados:

- Em vez de salvar no `localStorage`, o `create()` da store passará a chamar uma API REST do backend.
- O `fetchAll()` buscará a lista no backend.
- O upload de imagem pode continuar UNSIGNED no front ou migrar para SIGNED via backend (ver opções abaixo).

### 5.1) Opção A – manter upload UNSIGNED no front
- Fluxo: Front envia para Cloudinary → recebe `secure_url/public_id` → envia para backend no payload do produto.
- Backend valida e persiste no banco.
- Prós: simples, sem bloqueio no upload. Contras: menos controle sobre a origem do upload.

### 5.2) Opção B – migrar para upload SIGNED (recomendado para produção)
- Fluxo:
  1. Front pede um signature/token ao backend.
  2. Backend gera assinatura com API secret (nunca exposta) e retorna ao front.
  3. Front faz upload assinado ao Cloudinary.
  4. Backend grava `secure_url/public_id` no banco.
- Prós: controle total e segurança. Contras: exige backend já disponível.

## 6) Contrato esperado com o backend

### 6.1) Endpoint de criação de produto (exemplo)
- `POST /api/products`
- Body JSON:
```json
{
  "name": "Camiseta Polo",
  "price": 129.90,
  "description": "Algodão premium",
  "category": "Roupa Masculina",
  "stock": 50,
  "image": {
    "secureUrl": "https://res.cloudinary.com/.../image/upload/v123/products/abc.jpg",
    "publicId": "products/abc",
    "width": 800,
    "height": 800,
    "format": "jpg",
    "bytes": 102400
  },
  "sku": "<uuid-gerado-no-front-ou-back>",
  "active": true,
  "stock": 0
}
```
- Respostas:
  - 201 Created → objeto do produto persistido (com `id`).
  - 400/422 → erros de validação.

### 6.2) Endpoint de listagem (para substituir o mock)
- `GET /api/products`
- Retorna lista com paginação opcional.

### 6.3) Endpoint de exclusão/atualização de imagem (opcional)
- Ao deletar um produto: backend remove o registro e chama Cloudinary para deletar `public_id`.
- Ao atualizar imagem: backend chama Cloudinary (delete + novo upload ou overwrite) e persiste o novo `public_id/secure_url`.

## 7) Responsabilidades do backend
- Autenticação/autorização de quem pode criar/editar.
- Validação de dados (produto e imagem: tipo/tamanho/formato).
- Persistência no banco dos campos do produto + `secure_url/public_id` (+ metadados úteis).
- Gestão do ciclo de vida da imagem (delete/replace) usando `public_id`.
- Regras de negócio (SKU único, estoque, categorias, variações).
- Observabilidade (logs, métricas, tratamento de erros Cloudinary).
- Segurança (rate limiting, payload limits, sanitização, CORS apropriado).

## 8) Plano de migração (checklist)
- [ ] Backend define contrato dos endpoints.
- [ ] Front troca `src/stores/products.js` para usar `http.post('/api/products', payload)` em `create()`.
- [ ] Front troca `fetchAll()` para `http.get('/api/products')`.
- [ ] Decidir entre Upload UNSIGNED (manter) ou SIGNED (migrar) e ajustar serviço.
- [ ] Mapear e salvar `public_id` no banco para permitir exclusões futuras.

## 9) Como demonstrar ao time
- Acessar `http://localhost:5173/admin/produtos/novo`.
- Selecionar uma imagem e observar o progresso; após upload, a preview aparece (URL do Cloudinary).
- Salvar o produto e confirmar no `localStorage` (DevTools → Application → Local Storage → `mock_products`).
- Conferir a imagem no Cloudinary (Dashboard → Assets → Media Library).

---
Qualquer mudança no contrato do backend será isolada na store/serviço, sem alterar a UI/UX do formulário.
