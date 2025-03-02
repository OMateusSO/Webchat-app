<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
    <div class="flex flex-1 items-center justify-center px-4">
      <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl">
        <div class="flex flex-col items-center mb-6">
          <img src="https://github.com/radix-vue.png" alt="Logo Empresa" class="w-20 h-20 rounded-full shadow-md">
          <h1 class="text-2xl font-bold text-indigo-700 mt-4">Bem-vindo de volta</h1>
        </div>
        
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" type="text" placeholder="Digite seu email" v-model="email"
              class="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none">
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
            <input id="password" type="password" placeholder="Digite sua senha" v-model="password"
              class="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none">
          </div>

          <button @click="Logar"
            class="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50">
            Logar
          </button>

          <button @click="signInWithGoogle"
            class="w-full flex items-center justify-center gap-2 border border-gray-300 p-2 rounded-md hover:bg-gray-100 transition">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo" class="w-5 h-5">
            <span class="text-gray-700 font-medium">Logar com Google</span>
          </button>

          <div v-if="errMsg" class="text-sm text-red-500 text-center">
            {{ errMsg }}
          </div>

          <div class="text-xs text-gray-500 text-center mt-4">
            Não possui conta?
            <router-link to="/registrar" class="text-indigo-600 font-bold ml-1">Inscreva-se</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "vue-router";

export default {
  name: "Login",
  setup() {
    const email = ref("");
    const password = ref("");
    const errMsg = ref("");
    const router = useRouter();
    const auth = getAuth();

    const Logar = () => {
      signInWithEmailAndPassword(auth, email.value, password.value)
        .then(() => {
          router.push("/feed");
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/invalid-email":
              errMsg.value = "O email está incorreto";
              break;
            case "auth/user-not-found":
              errMsg.value = "Essa conta não existe";
              break;
            case "auth/wrong-password":
              errMsg.value = "A senha está incorreta";
              break;
            default:
              errMsg.value = "Erro no login: email ou senha incorretos";
          }
        });
    };

    const signInWithGoogle = () => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then(() => {
          router.push("/feed");
        })
        .catch((error) => {
          errMsg.value = "Erro ao logar com Google: " + error.message;
        });
    };

    return {
      email,
      password,
      Logar,
      signInWithGoogle,
      errMsg,
    };
  },
};
</script>
