<template>
  <div class="flex justify-center min-h-screen px-4 bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
    <div class="max-w-lg w-full flex flex-col items-center">
      <h1 class="text-4xl font-bold text-indigo-700 my-6 text-center">Perfil Público</h1>

      <!-- Foto de Perfil -->
      <div class="relative flex justify-center items-center w-64 h-64 mb-6">
        <img v-if="fotoPerfil" :src="fotoPerfil" class="w-64 h-64 rounded-full border-4 object-cover shadow-md">
        <div v-else class="w-64 h-64 rounded-full border-4 flex items-center justify-center bg-gray-200 shadow-md">
          <span class="text-gray-500">Sem foto</span>
        </div>
      </div>

      <!-- Nome -->
      <div class="text-center">
        <p class="text-2xl font-semibold text-gray-800">{{ nome || "Usuário desconhecido" }}</p>
      </div>

      <!-- Biografia -->
      <div class="mt-6 p-6 bg-white rounded-lg shadow-md text-center w-full">
        <p class="text-gray-600">{{ bio || "Este usuário ainda não adicionou uma biografia." }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { supabase } from "../supabase";
import { ref, onMounted, watch } from "vue";

export default {
  setup() {
    const route = useRoute();
    const nome = ref("");
    const fotoPerfil = ref("");
    const bio = ref("");

    const carregarPerfilPublico = async (userId) => {
      console.log("🟡 ID do usuário recebido:", userId);

      if (!userId) return;

      const db = getFirestore();
      const userDoc = doc(db, "users", userId);
      const userSnap = await getDoc(userDoc);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        console.log("🟢 Dados do usuário encontrados:", userData);
        
        nome.value = userData.nome || "Usuário sem nome";
        bio.value = userData.bio || "Este usuário ainda não adicionou uma biografia.";

        if (userData.fotoPerfil) {
          const { data } = supabase.storage.from("users").getPublicUrl(userData.fotoPerfil);
          console.log("🟠 Caminho da foto no Supabase:", userData.fotoPerfil);

          if (data) {
            fotoPerfil.value = `${data.publicUrl}?t=${new Date().getTime()}`;
            console.log("🟢 URL da foto de perfil gerada:", fotoPerfil.value);
          }
        }
      } else {
        console.log("❌ Usuário não encontrado no Firestore.");
      }
    };

    // Chamando no primeiro carregamento
    onMounted(() => {
      console.log("🔄 onMounted executado!");
      carregarPerfilPublico(route.params.id);
    });

    // Atualizando caso a URL mude
    watch(() => route.params.id, (newId) => {
      console.log("🔄 ID atualizado:", newId);
      carregarPerfilPublico(newId);
    });

    return {
      nome,
      fotoPerfil,
      bio,
    };
  },
};
</script>
