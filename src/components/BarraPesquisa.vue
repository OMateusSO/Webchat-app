<!-- BarraPesquisa.vue -->
<template>
  <div class="mb-6">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Pesquisar salas..."
      class="w-full py-3 px-4 border rounded-lg text-gray-700 focus:outline-none"
    />
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      searchQuery: this.modelValue,
    };
  },
  watch: {
    searchQuery(newValue) {
      console.log("Search Query:", newValue); // Verifique se o valor está sendo atualizado
      this.$emit('update:modelValue', newValue); // Emite o valor atualizado para o componente pai
    },
  },
};
</script>


<style scoped>
/* Estilos para a Barra de Pesquisa */
</style>
