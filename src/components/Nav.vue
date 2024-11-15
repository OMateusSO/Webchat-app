<template>
  <div class="flex flex-col">
    <!-- Navbar -->
    <nav class="flex items-center justify-between py-4 px-16 bg-white ">
      <!-- Esquerda: Logo -->
      <RouterLink to="/" class="text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition">
        Home
      </RouterLink>
      
      <!-- Direita: Links e Botões -->
      <div class="flex items-center space-x-4">
        <RouterLink
          to="/feed"
          class="py-2 px-4 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition">
          Feed
        </RouterLink>
        <RouterLink
          to="/registrar"
          v-if="!isLoggedIn"
          class="py-2 px-4 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition">
          Registrar
        </RouterLink>
        <RouterLink
          to="/logar"
          v-if="!isLoggedIn"
          class="py-2 px-4 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition">
          Logar
        </RouterLink>
        <button
          v-if="isLoggedIn"
          @click="handleSignOut"
          class="py-2 px-4 rounded-lg text-gray-600 hover:text-red-600 hover:bg-gray-100 transition">
          Sign Out
        </button>
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

let auth;
onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user;
  });
});

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push("/");
  });
};
</script>
