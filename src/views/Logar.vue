<template>
  <h1>Logar</h1>
  <h2>Email</h2>
  <p><input type="text" placeholder="Email" v-model="email" /></p>
  <h2>Senha</h2>
  <p><input type="password" placeholder="Senha" v-model="password" /></p>
  <p><button @click="Logar">Logar</button></p>
  <p><button @click="signInWithGoogle">Logar com Google</button></p>
  <p v-if="errMsg" style="color: red;">{{ errMsg }}</p>
</template>

<script>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from 'vue-router';

export default {
  name: "Logar",
  setup() {
    const email = ref("");
    const password = ref("");
    const errMsg = ref("");
    const router = useRouter();
    const auth = getAuth();

    const Logar = () => {
      signInWithEmailAndPassword(auth, email.value, password.value)
        .then((data) => {
          console.log("Login com email e senha bem-sucedido!");
          console.log(auth.currentUser);
          router.push('/feed');
        })
        .catch((error) => {
          console.error("Erro no login:", error.code);
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
              break;
          }
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
          errMsg.value = "Erro ao logar com Google: " + error.message;
        });
    };

    return {
      email,
      password,
      Logar,
      signInWithGoogle,
      errMsg
    };
  }
};
</script>

<style></style>
