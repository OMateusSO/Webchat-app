<template>
  <div class="flex flex-col bg-gradient-to-br from-gray-100 via-white to-gray-50">
    <div class="p-2">
      <h1 class="text-4xl font-bold text-indigo-600 text-center cursor-pointer" @click="irParaConfiguracoesSala">
        {{ nomeSala }}
      </h1>
    </div>

    
    <div class="flex flex-col flex-1 max-w-3xl w-full mx-auto">
      <div
        id="mensagens-container"
        class="flex-1 overflow-y-auto p-4"
      >
        <MensagemView :mensagens="mensagens" :usuarioLogado="usuarioLogado" />
      </div>

      
      <form @submit.prevent="enviarMensagem" class="flex py-4 bg-white">
        <input
          v-model="novaMensagem"
          type="text"
          placeholder="Digite sua mensagem..."
          class="flex-1 py-3 px-4 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
        />
        <button
          type="submit"
          class="py-3 px-6 bg-indigo-600 text-white font-medium rounded-r-lg hover:bg-indigo-700 transition"
        >
          Enviar
        </button>
      </form>
    </div>
  </div>
</template>


<script>
import MensagemView from './MensagemView.vue';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, doc, addDoc, onSnapshot, serverTimestamp, getDoc } from "firebase/firestore";

export default {
  components: {
    MensagemView,
  },
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
/* Garantir que o conteúdo não tenha overflow */
html, body {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

#app {
  height: 100%;
}


#mensagens-container {
  height: calc(100vh - 160px); 
  overflow-y: auto; 
  padding: 10px;
}

#mensagens-container::-webkit-scrollbar {
  width: 8px;
}

#mensagens-container::-webkit-scrollbar-thumb {
  background-color: #b3c2f2;
  border-radius: 4px;
}

#mensagens-container::-webkit-scrollbar-track {
  background-color: #e8eaf6;
}
</style>
