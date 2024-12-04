<template>
  <div class="flex justify-end mb-6">
    <button
      @click="$emit('open-dialog')"
      class="flex items-center gap-2 py-2 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
    >
      <span>+</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "ButtonDialog",
};
</script>

<style scoped>
/* Adicione estilos específicos do botão, se necessário */
</style>
