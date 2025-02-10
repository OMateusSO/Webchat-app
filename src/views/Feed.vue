<template>
  <div class="flex justify-center min-h-screen px-2 bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
    <div class="m-8">
      <!-- Barra de Pesquisa e Botão Criar lado a lado -->
      <div class="flex justify-center items-center">
        <div class="mx-2 w-2/4"> <!-- Aqui aumentei a largura da barra de pesquisa -->
          <BarraPesquisa v-model="searchQuery" />
        </div>
        <div class="mx-2">
          <ButtonDialog @open-dialog="showDialog = true" />
        </div>
      </div>

      <div class="w-full max-w-5xl bg-white p-8 rounded-lg shadow-2xl">
        <!-- Título -->
        <h1 class="text-4xl font-bold text-indigo-700 mb-6 text-center">Feed de Salas</h1>

        <!-- Grade de Salas -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="sala in filteredSalas" :key="sala.id" @click="goToSala(sala.id)"
            class="cursor-pointer bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
            <h3 class="text-xl font-semibold text-indigo-600 mb-2">{{ sala.sala }}</h3>
            <p class="text-sm text-gray-600">Criada por: <span class="font-medium">{{ sala.user }}</span></p>
          </div>
        </div>

        <!-- Modal para Criar Nova Sala -->
        <div v-if="showDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 m-4 rounded-lg shadow-lg w-full max-w-md">
            <h2 class="text-2xl font-semibold text-gray-700 mb-4">Criar Nova Sala</h2>
            <form @submit.prevent="createSala" class="space-y-4">
              <div>
                <input type="text" v-model="newSala" placeholder="Nome da Sala" required
                  class="w-full py-3 px-4 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition" />
              </div>
              <div class="flex justify-between">
                <button type="button" @click="showDialog = false"
                  class="py-2 px-4 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400 transition">
                  Cancelar
                </button>
                <button type="submit"
                  class="py-2 px-6 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { getFirestore, collection, onSnapshot, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import ButtonDialog from "@/components/ButtonDialog.vue"; 
import BarraPesquisa from "@/components/BarraPesquisa.vue"; 

export default {
  components: {
    ButtonDialog,
    BarraPesquisa, 
  },
  data() {
    return {
      salas: [],
      newSala: "",
      userEmail: "",
      showDialog: false, 
      searchQuery: "", 
    };
  },
  computed: {
    filteredSalas() {
      return this.salas.filter(sala =>
        sala.sala.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  mounted() {
    this.fetchSalas();
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      this.userEmail = user.email;
    } else {
      console.error("Nenhum usuário logado.");
    }
  },
  methods: {
    fetchSalas() {
      const db = getFirestore();
      const salasRef = collection(db, "salas");

      onSnapshot(salasRef, (snapshot) => {
        this.salas = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      });
    },
    async createSala() {
      const db = getFirestore();
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error("Usuário não está autenticado!");
        return;
      }

      const salasRef = collection(db, "salas");

      const newSala = {
        sala: this.newSala,
        user: this.userEmail,
        creatorId: currentUser.uid, // Adiciona o ID do criador
        createdAt: new Date(), // Adiciona timestamp (opcional)
      };

      try {
        await addDoc(salasRef, newSala);
        this.newSala = "";
        this.showDialog = false; // Fecha o modal após criar a sala
      } catch (error) {
        console.error("Erro ao criar sala:", error);
      }
    },
    goToSala(salaId) {
      this.$router.push(`/sala/${salaId}`);
    },
  },
};
</script>
