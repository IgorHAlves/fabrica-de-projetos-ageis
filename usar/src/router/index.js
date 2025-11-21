import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Rota raiz: redireciona para /home
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('../views/HomeView.vue'),
      meta: {
        title: 'Home - Moda Minimalista',
        description: 'Descubra peças atemporais com design limpo e qualidade excepcional. Loja online de moda minimalista com as melhores marcas.'
      }
    },
    {
      path: '/sobre',
      name: 'sobre',
      component: () => import('../views/SobreView.vue'),
      meta: {
        title: 'Sobre Nós - Moda Minimalista',
        description: 'Conheça a equipe por trás deste projeto incrível e nossa missão.'
      }
    },
    {
      path: '/produtos',
      name: 'produtos',
      component: () => import('../views/ProductView.vue'),
      meta: {
        title: 'Produtos - Moda Minimalista',
        description: 'Explore nosso catálogo completo de produtos de alta qualidade.'
      }
    },
    {
      path: '/carrinho',
      name: 'carrinho',
      component: () => import('../views/CarrinhoView.vue'),
      meta: {
        title: 'Carrinho - Moda Minimalista',
        description: 'Revise seus itens antes de finalizar a compra.'
      }
    },
    {
      path: '/productDetail/:id',
      name: 'ProductDetail',
      component: () => import('../views/ProductDetailView.vue'),
      props: true,
      meta: {
        title: 'Detalhes do Produto - Moda Minimalista',
        description: 'Veja todos os detalhes e informações do produto.'
      }
    },
    {
      path: '/admin/produtos/novo',
      name: 'produtoNovo',
      component: () => import('../views/ProductCreateView.vue'),
      meta: {
        title: 'Cadastrar Produto - Moda Minimalista',
        description: 'Adicione um novo produto ao catálogo da loja.'
      }
    },
    // Rota catch-all para 404 - DEVE SER A ÚLTIMA
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue'),
      meta: {
        title: '404 - Página Não Encontrada',
        description: 'A página que você procura não foi encontrada.'
      }
    }
  ]
})

// Guard para atualizar meta tags
router.beforeEach((to, from, next) => {
  // Atualiza título da página
  document.title = to.meta.title || 'Moda Minimalista'

  // Atualiza meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription && to.meta.description) {
    metaDescription.setAttribute('content', to.meta.description)
  }

  next()
})

// Scroll to top ao mudar de rota
router.afterEach(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

export default router
