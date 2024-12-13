import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: () => import("../views/Logar.vue"),
    },
    {
      path: "/registrar",
      component: () => import("../views/Registrar.vue"),
    },
    {
      path: "/logar",
      component: () => import("../views/Logar.vue"),
    },
    {
      path: "/feed",
      component: () => import("../views/Feed.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/sala/:id",
      component: () => import("../views/Sala.vue"),
      meta: {
        requiresAuth: true,
      },
      beforeEnter: (to, from, next) => {
        const id = to.params.id;
    
        // Verifique se o ID é um UUID ou outro formato válido
        const isValidId = /^[a-zA-Z0-9_-]+$/.test(id); // Exemplo: apenas letras, números, underscores e traços
    
        if (isValidId) {
          next();
        } else {
          next("/erro"); // Redirecione para uma página de erro ou outra lógica
        }
      },
    },
    {
      path: "/sala/:id/configuracoes",
      name: "SalaConfiguracoes",
      component: () => import("../views/SalaConfiguracoes.vue"),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: "/:catchAll(.*)", // Captura todas as rotas não definidas
      component: () => import("../views/Erro.vue"),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await getCurrentUser();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isAuthenticated) {
      next();
    } else {
      next("/"); // Redireciona para a página de login
    }
  } else if (["/", "/logar", "/registrar"].includes(to.path) && isAuthenticated) {
    next("/feed"); // Redireciona para o feed se autenticado
  } else {
    next(); // Permite o acesso às rotas públicas
  }
});


export default router;
