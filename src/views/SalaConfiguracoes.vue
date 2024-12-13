<template>
  <div class="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 p-4">
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-3xl font-bold text-indigo-600 text-center">Configurações da Sala</h1>
      <p v-if="nomeSala" class="mt-4 text-gray-700 text-center">
        Configurações para a sala: <span class="font-semibold">{{ nomeSala }}</span>
      </p>
      <p v-else class="mt-4 text-gray-500 text-center">Carregando informações da sala...</p>

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
import { getFirestore, collection, doc, deleteDoc, getDoc, getDocs } from "firebase/firestore"; 

export default {
  data() {
    return {
      salaId: this.$route.params.id, 
      nomeSala: "", 
    };
  },
  mounted() {
    this.carregarNomeSala();
  },
  methods: {
    async carregarNomeSala() {
      const db = getFirestore();
      const salaDocRef = doc(db, `salas/${this.salaId}`);
      try {
        const docSnap = await getDoc(salaDocRef);
        if (docSnap.exists()) {
          this.nomeSala = docSnap.data().sala; 
        } else {
          console.error("Sala não encontrada");
          this.nomeSala = "Sala não encontrada";
        }
      } catch (error) {
        console.error("Erro ao carregar o nome da sala:", error);
        this.nomeSala = "Erro ao carregar dados";
      }
    },

    async excluirSala() {
      const db = getFirestore();
      
      const mensagensRef = collection(db, `salas/${this.salaId}/mensagens`);
      
      try {
        const mensagensSnapshot = await getDocs(mensagensRef);
        const deletePromises = mensagensSnapshot.docs.map(doc => deleteDoc(doc.ref)); 
        await Promise.all(deletePromises); 

        
        const salaDocRef = doc(db, `salas/${this.salaId}`);
        await deleteDoc(salaDocRef);

        this.$router.push("/feed"); 
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
