<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 p-4">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-3xl font-bold text-indigo-600 text-center">Configurações da Sala</h1>
      <p v-if="nomeSala" class="mt-4 text-gray-700 text-center">
        Configurações para a sala: <span class="font-semibold">{{ nomeSala }}</span>
      </p>
      <p v-else class="mt-4 text-gray-500 text-center">Carregando informações da sala...</p>

      <!-- Botão de exclusão -->
      <div class="mt-6 flex justify-center">
        <button
          @click="excluirSala"
          class="py-3 px-6 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
        >
          Excluir Sala
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, doc, deleteDoc, getDoc, getDocs } from "firebase/firestore"; // Corrigido getDoc

export default {
  data() {
    return {
      salaId: this.$route.params.id, // Obtém o parâmetro "id" da rota
      nomeSala: "", // Nome da sala será carregado do Firestore
    };
  },
  mounted() {
    this.carregarNomeSala(); // Chama a função ao montar o componente
  },
  methods: {
    // Função para carregar o nome da sala
    async carregarNomeSala() {
      const db = getFirestore();
      const salaDocRef = doc(db, `salas/${this.salaId}`);
      try {
        const docSnap = await getDoc(salaDocRef);
        if (docSnap.exists()) {
          this.nomeSala = docSnap.data().sala; // Define o nome da sala
        } else {
          console.error("Sala não encontrada");
          this.nomeSala = "Sala não encontrada";
        }
      } catch (error) {
        console.error("Erro ao carregar o nome da sala:", error);
        this.nomeSala = "Erro ao carregar dados";
      }
    },
    // Função para excluir a sala e suas mensagens
    async excluirSala() {
      const db = getFirestore();
      
      // Referência à subcoleção de mensagens
      const mensagensRef = collection(db, `salas/${this.salaId}/mensagens`);
      
      try {
        // Deletando todas as mensagens da sala de forma assíncrona
        const mensagensSnapshot = await getDocs(mensagensRef);
        const deletePromises = mensagensSnapshot.docs.map(doc => deleteDoc(doc.ref)); // Cria uma lista de promessas
        await Promise.all(deletePromises); // Aguarda todas as exclusões de mensagens

        // Agora deletando o documento da sala
        const salaDocRef = doc(db, `salas/${this.salaId}`);
        await deleteDoc(salaDocRef);

        this.$router.push("/feed"); // Redireciona para o feed após a exclusão
      } catch (error) {
        console.error("Erro ao excluir a sala:", error);
        alert("Erro ao excluir a sala. Tente novamente.");
      }
    }
  },
};
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
}
</style>
