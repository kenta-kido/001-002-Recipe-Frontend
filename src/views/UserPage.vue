<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
    <div class="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
      <h2 class="text-2xl font-bold text-gray-700 mb-6">This is a User Page</h2>
      <button
        class="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-red-700 transition duration-300"
        @click="$router.push('/recipe')"
      >
        Go to Recipe
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserPage",
};
</script>

<style scoped>
/* 必要に応じて追加のカスタムスタイルを記述 */
</style>
