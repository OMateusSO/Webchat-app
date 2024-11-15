<template>
  <h1>Registrar</h1>
  <h2>Email</h2>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <h2>Senha</h2>
  <p><input type="password" placeholder="Senha" v-model="password" /></p>
  <p><button @click="registrar">Registrar</button></p>
  <p><button @click="signInWithGoogle">Google</button></p>
</template>

<script>
import { ref } from "vue";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { useRouter } from 'vue-router';

export default {
  name: "Registrar",
  setup() {
    const email = ref("");
    const password = ref("");
    const router = useRouter();
    const auth = getAuth();

    const registrar = () => {
      createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((data) => {
          console.log("Sucesso ao registrar!");
          console.log(auth.currentUser);
          router.push('/feed');
        })
        .catch((error) => {
          console.error("Erro ao registrar:", error.message);
        });
    };

    const signInWithGoogle = () => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          console.log("Login com Google bem-sucedido:", result.user);
          router.push("/feed");
        })
        .catch((error) => {
          console.error("Erro no login com Google:", error.message);
          alert("Erro no login com Google: " + error.message);
        });
    };

    return {
      email,
      password,
      registrar,
      signInWithGoogle // Certifique-se de retornar esta função para que esteja acessível no template
    };
  }
};
</script>

<style>
/* Adicione seu estilo aqui, se necessário */
</style>
