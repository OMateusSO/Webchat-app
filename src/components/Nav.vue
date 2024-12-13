<template>
  <div class="flex flex-col">
    <!-- Navbar -->
    <nav class="flex items-center justify-between py-4 px-16 bg-white shadow-md">
      <!-- Esquerda: Logo -->
      <RouterLink
        to="/"
        class="text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition"
      >
        Projeto Z
      </RouterLink>

      <!-- Direita: Links e Botões -->
      <div class="flex items-center space-x-4">
        <RouterLink
          to="/registrar"
          v-if="!isLoggedIn"
          class="py-2 px-4 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition"
        >
          Registrar
        </RouterLink>
        <RouterLink
          to="/logar"
          v-if="!isLoggedIn"
          class="py-2 px-4 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition"
        >
          Logar
        </RouterLink>

        <!-- Avatar Dropdown -->
        <div v-if="isLoggedIn" class="relative">
          <button
            @click="toggleMenu"
            class="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200"
          >
            <!-- Avatar Image -->
            <img
              src="../assets/logo.png"
              alt="User Avatar"
              class="w-full h-full object-cover"
            />
          </button>

          <!-- Dropdown Menu -->
          <div
            v-if="isMenuOpen"
            class="absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
          >
            <div class="py-1">
              <button
                @click="perfil"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              >
                Perfil
              </button>
              <button
                @click="handleSignOut"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Divisão -->
    <div class="border-t border-gray-300"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const isLoggedIn = ref(false);
const isMenuOpen = ref(false); // Controle do dropdown

let auth;
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});

// Alterna a visibilidade do menu
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Função de deslogar
const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push("/");
  });
};

// Navegação para a página de perfil
const perfil = () => {
  router.push("/perfil");
};
</script>

<style scoped>
/* Ajuste da posição centralizada do dropdown */
.relative > .absolute {
  left: 50%; /* Centraliza horizontalmente */
  transform: translateX(-50%); /* Corrige deslocamento */
}
</style>
