<template>
  <div class="flex justify-center min-h-screen px-2 bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
    <div class="max-w-lg w-full flex flex-col items-center">
      <h1 class="text-4xl font-bold text-indigo-700 my-6 text-center">Perfil</h1>

      <!-- Foto de Perfil com botão sobreposto -->
      <div class="relative flex justify-center items-center w-64 h-64 mb-6">
        <!-- Imagem de Perfil -->
        <img v-if="fotoPerfil" :src="fotoPerfil" class="w-64 h-64 rounded-full border-4 object-cover shadow-md">

        <!-- Botão sobreposto -->
        <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full 
                 opacity-0 hover:opacity-100 transition duration-300 cursor-pointer" @click="selecionarArquivo">
          <span class="text-white text-lg font-semibold">📷 Trocar</span>
        </div>
      </div>

      <!-- Input de Upload escondido -->
      <input ref="fileInput" type="file" @change="handleFileUpload" class="hidden">

      <!-- Nome -->
      <div class="text-center mt-4">
        <p class="text-2xl font-semibold text-gray-800">{{ nome || "Seu Nome" }}</p>
      </div>

      <!-- Biografia -->
      <div class="mt-6 p-6 bg-white rounded-lg shadow-md text-center">
        <p class="text-gray-600">{{ bio || "Adicione uma biografia..." }}</p>
        <button @click="abrirDialog('bio')" class="text-indigo-500 hover:underline text-sm">Editar</button>
      </div>
    </div>

    <!-- Dialog de Edição -->
    <div v-if="showDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Editar {{ campoAtual }}</h2>
        <input v-if="campoAtual === 'nome'" v-model="editValor" placeholder="Digite seu nome"
          class="w-full p-2 border rounded mb-2">
        <textarea v-if="campoAtual === 'bio'" v-model="editValor" placeholder="Digite sua biografia"
          class="w-full p-2 border rounded mb-2"></textarea>
        <input v-if="campoAtual === 'foto'" v-model="editValor" placeholder="URL da foto"
          class="w-full p-2 border rounded mb-2">

        <div class="flex justify-between">
          <button @click="showDialog = false"
            class="py-2 px-4 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400 transition">
            Cancelar
          </button>
          <button @click="salvarEdicao"
            class="py-2 px-6 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
            Salvar
          </button>
        </div>
      </div>


    </div>
  </div>
</template>


<script>
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { supabase } from "../supabase"; // Importando Supabase corretamente

export default {
  data() {
    return {
      nome: "",
      fotoPerfil: "",
      bio: "",
      user: null,
      showDialog: false,
      campoAtual: "",
      editValor: "",
    };
  },

  async mounted() {
    const auth = getAuth();
    this.user = auth.currentUser;
    if (this.user) {
      await this.carregarPerfil();
    }
  },

  methods: {
    async carregarPerfil() {
      const db = getFirestore();
      const userDoc = doc(db, "users", this.user.uid);
      const userSnap = await getDoc(userDoc);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        this.nome = userData.nome || "";
        this.bio = userData.bio || "";
        if (userData.fotoPerfil) {
          // Obtendo URL pública da imagem e forçando atualização para evitar cache
          const { data } = supabase.storage.from("users").getPublicUrl(userData.fotoPerfil);
          if (data) {
            this.fotoPerfil = `${data.publicUrl}?t=${new Date().getTime()}`;
            console.log("URL da Imagem carregada:", this.fotoPerfil);
          }
        }
      }
    },

    abrirDialog(campo) {
      this.campoAtual = campo;
      this.editValor = this[campo] || "";
      this.showDialog = true;
    },
    async salvarEdicao() {
      if (!this.user) return;
      this[this.campoAtual] = this.editValor;

      const db = getFirestore();
      await setDoc(doc(db, "users", this.user.uid), {
        nome: this.nome,
        bio: this.bio,
        fotoPerfil: this.fotoPerfil,
        email: this.user.email,
      });

      this.showDialog = false;
    },

    selecionarArquivo() {
      this.$refs.fileInput.click();
    },

    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file || !this.user) return;

      const filePath = `perfil_${this.user.uid}.jpg`;

      // Fazendo upload da imagem no Supabase
      const { error } = await supabase.storage.from("users").upload(filePath, file, {
        cacheControl: "3600",
        upsert: true, // Substitui a imagem antiga
      });

      if (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        return;
      }

      // Obtendo a URL pública corretamente e adicionando um timestamp
      const { data } = supabase.storage.from("users").getPublicUrl(filePath);
      if (data) {
        this.fotoPerfil = `${data.publicUrl}?t=${new Date().getTime()}`;
        console.log("URL da Imagem após upload:", this.fotoPerfil);
      }

      // Atualizando o Firestore com o caminho da imagem
      const db = getFirestore();
      await setDoc(doc(db, "users", this.user.uid), { fotoPerfil: filePath }, { merge: true });
    }
  }
};
</script>
