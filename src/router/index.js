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
      path: "/perfil",
      component: () => import("../views/Perfil.vue"),
    },
    {
      path: "/Configuracao",
      component: () => import("../views/Configuracao.vue"),
    },
    {
      path: "/perfil/:id",
      name: "PerfilPublico",
      component: () => import("../views/PerfilPublico.vue"),
      props: true 
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
    
        
        const isValidId = /^[a-zA-Z0-9_-]+$/.test(id); 
    
        if (isValidId) {
          next();
        } else {
          next("/erro"); 
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
      path: "/:catchAll(.*)", 
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
      next("/"); 
    }
  } else if (["/", "/logar", "/registrar"].includes(to.path) && isAuthenticated) {
    next("/feed"); 
  } else {
    next(); 
  }
});


export default router;
