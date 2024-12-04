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
      component: () => import("../views/Home.vue"),
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
    },
    {
      path: "/sala/:id/configuracoes",
      name: "SalaConfiguracoes",
      component: () => import("../views/SalaConfiguracoes.vue"),
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (await getCurrentUser()) {
      next();
    } else {
      next("/"); // Redireciona para a página inicial se não autenticado
    }
  } else {
    next(); // Continua a navegação para rotas públicas
  }
});

export default router;
