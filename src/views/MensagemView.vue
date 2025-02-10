<template>
  <div class="flex-1 max-h-[630px] overflow-y-auto bg-white p-6 rounded-lg shadow-md" id="mensagens-container">
    <div
      v-for="mensagem in mensagens"
      :key="mensagem.id"
      class="mb-3 flex flex-col"
      :class="{
        'items-end': mensagem.user === usuarioLogado,
        'items-start': mensagem.user !== usuarioLogado,
      }"
    >
      <div
        :class="{
          'text-indigo-700': mensagem.user === usuarioLogado,
          'text-gray-700': mensagem.user !== usuarioLogado,
        }"
      >
        <p class="text-sm font-semibold">{{ mensagem.user }}</p>
        <div
          class="max-w-xs md:max-w-md p-3 rounded-lg shadow-md"
          :class="{
            'bg-indigo-100': mensagem.user === usuarioLogado,
            'bg-gray-200': mensagem.user !== usuarioLogado,
          }"
        >
          <p class="mt-1">{{ mensagem.text }}</p>
        </div>
        <p class="text-xs text-gray-500 mt-1">
          {{ mensagem.timestamp?.toDate().toLocaleString() || "Enviando..." }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    mensagens: Array,
    usuarioLogado: String,
  },
};
</script>

<style scoped>
#mensagens-container {
  scrollbar-width: thin;
  scrollbar-color: #b3c2f2 #e8eaf6;
}

#mensagens-container::-webkit-scrollbar {
  width: 8px;
}

#mensagens-container::-webkit-scrollbar-thumb {
  background-color: #b3c2f2;
  border-radius: 4px;
}
</style>
