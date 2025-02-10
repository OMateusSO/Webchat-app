<template>
  <div class="flex justify-center items-center min-h-screen px-4 bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
    <div class="text-center max-w-lg p-6 bg-white rounded-lg shadow-2xl">
      <h1 class="text-3xl font-bold text-indigo-700 mb-4">Página Não Encontrada</h1>
      <p class="text-gray-600 mb-6">
        A página que você está tentando acessar não existe ou foi removida.
      </p>

      <button
        @click="voltarParaHome"
        class="py-3 px-6 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
      >
        Voltar para a Página Inicial
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    voltarParaHome() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>

</style>