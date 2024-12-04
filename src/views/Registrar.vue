<template>
  <div class="flex flex-1 items-center justify-center p-4 min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center mb-4">Registrar</h1>

      <!-- Campos de Registro -->
      <div class="space-y-4">
        <!-- Campo de Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="text"
            placeholder="Digite seu email"
            v-model="email"
            class="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <!-- Campo de Senha -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            id="password"
            type="password"
            placeholder="Digite sua senha"
            v-model="password"
            class="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <!-- Botão de Registrar -->
        <div>
          <button
            @click="Registrar"
            class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            Registrar
          </button>
        </div>

        <!-- Botão de Registro com Google -->
        <div>
          <button
            @click="registerWithGoogle"
            class="w-full flex items-center justify-center gap-2 border border-gray-300 p-2 rounded-md hover:bg-gray-100 transition"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
              alt="Google Logo"
              class="w-5 h-5"
            />
            <span class="text-gray-700 font-medium">Registrar com Google</span>
          </button>
        </div>

        <!-- Mensagem de Erro -->
        <div v-if="errMsg" class="text-sm text-red-500 text-center">
          {{ errMsg }}
        </div>

        <!-- Link para Login -->
        <div class="text-xs text-gray-500 text-center mt-4">
          Já possui conta?
          <router-link to="/logar" class="text-blue-600 font-bold ml-1">
            Faça login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "vue-router";

export default {
  name: "Registrar",
  setup() {
    const email = ref("");
    const password = ref("");
    const errMsg = ref("");
    const router = useRouter();
    const auth = getAuth();

    const Registrar = () => {
      createUserWithEmailAndPassword(auth, email.value, password.value)
        .then(() => {
          console.log("Registro bem-sucedido!");
          router.push("/feed");
        })
        .catch((error) => {
          console.error("Erro no registro:", error.code);
          switch (error.code) {
            case "auth/email-already-in-use":
              errMsg.value = "Este email já está sendo usado";
              break;
            case "auth/invalid-email":
              errMsg.value = "O email é inválido";
              break;
            case "auth/weak-password":
              errMsg.value = "A senha é muito fraca";
              break;
            default:
              errMsg.value = "Erro no registro: tente novamente mais tarde";
          }
        });
    };

    const registerWithGoogle = () => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          console.log("Registro com Google bem-sucedido:", result.user);
          router.push("/feed");
        })
        .catch((error) => {
          console.error("Erro no registro com Google:", error.message);
          errMsg.value = "Erro ao registrar com Google: " + error.message;
        });
    };

    return {
      email,
      password,
      Registrar,
      registerWithGoogle,
      errMsg,
    };
  },
};
</script>
