<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 p-4">
    <!-- Título da Sala -->
    <div class="bg-white p-4 rounded-lg shadow-md mb-4">
      <h1 class="text-3xl font-bold text-indigo-600 text-center cursor-pointer"
        @click="irParaConfiguracoesSala">
        {{ nomeSala }}
      </h1>
    </div>

    <!-- Mensagens -->
    <div class="flex-1 overflow-y-auto bg-white p-6 rounded-lg shadow-md" id="mensagens-container">
      <div v-for="mensagem in mensagens" :key="mensagem.id" class="mb-3 flex flex-col" :class="{
        'items-end': mensagem.user === usuarioLogado,
        'items-start': mensagem.user !== usuarioLogado,
      }">
        <div :class="{
          ' text-indigo-700': mensagem.user === usuarioLogado,
          ' text-gray-700': mensagem.user !== usuarioLogado,
        }">
          <p class="text-sm font-semibold">{{ mensagem.user }}</p>
          <div class="max-w-xs md:max-w-md p-3 rounded-lg shadow-md" :class="{
            'bg-indigo-100': mensagem.user === usuarioLogado,
            'bg-gray-200 ': mensagem.user !== usuarioLogado,
          }">
            <p class="mt-1">{{ mensagem.text }}</p>
          </div>
          <p class="text-xs text-gray-500 mt-1">
            {{ mensagem.timestamp?.toDate().toLocaleString() || 'Enviando...' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Campo de Texto -->
    <form @submit.prevent="enviarMensagem" class="flex mt-4">
      <input v-model="novaMensagem" type="text" placeholder="Digite sua mensagem..."
        class="flex-1 py-3 px-4 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition" />
      <button type="submit"
        class="py-3 px-6 bg-indigo-600 text-white font-medium rounded-r-lg hover:bg-indigo-700 transition">
        Enviar
      </button>
    </form>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  onSnapshot,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

export default {
  data() {
    return {
      salaId: "",
      nomeSala: "",
      mensagens: [],
      novaMensagem: "",
      usuarioLogado: "",
    };
  },
  mounted() {
    this.salaId = this.$route.params.id;
    this.carregarUsuarioLogado();
    this.carregarSala();
    this.carregarMensagens();
  },
  methods: {
    carregarUsuarioLogado() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        this.usuarioLogado = user.email;
      } else {
        console.error("Usuário não está logado");
      }
    },
    async carregarSala() {
      const db = getFirestore();
      const salaDocRef = doc(db, `salas/${this.salaId}`);
      try {
        const docSnap = await getDoc(salaDocRef);
        if (docSnap.exists()) {
          this.nomeSala = docSnap.data().sala;
        } else {
          console.log("Sala não encontrada");
        }
      } catch (error) {
        console.error("Erro ao carregar sala:", error);
      }
    },
    carregarMensagens() {
      const db = getFirestore();
      const salaRef = collection(db, `salas/${this.salaId}/mensagens`);
      onSnapshot(salaRef, (snapshot) => {
        this.mensagens = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => (a.timestamp?.toMillis?.() || 0) - (b.timestamp?.toMillis?.() || 0));

        this.scrollToBottom();
      });
    },
    async enviarMensagem() {
      if (!this.novaMensagem.trim()) return;

      const db = getFirestore();
      const salaRef = collection(db, `salas/${this.salaId}/mensagens`);

      const novaMensagem = {
        text: this.novaMensagem,
        user: this.usuarioLogado,
        timestamp: serverTimestamp(),
      };

      try {
        await addDoc(salaRef, novaMensagem);
        this.novaMensagem = "";
        this.scrollToBottom();
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
      }
    },
    scrollToBottom() {
      const container = document.getElementById("mensagens-container");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    irParaConfiguracoesSala() {
      this.$router.push(`/sala/${this.salaId}/configuracoes`);
    },
  },
};
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
</style>
