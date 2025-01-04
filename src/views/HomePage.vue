<template>
  <div class="home flex items-center justify-center h-screen bg-blue-100">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-blue-500 mb-4">Home</h1>
      <p class="text-lg text-gray-700">This is a Tailwind CSS Test Page</p>
      <button
        class="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
        @click="onTestClick"
      >
        Test Button
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  methods: {
    onTestClick() {
      alert("Button Clicked!");
    },
  },
};
</script>

<style scoped>
/* 必要に応じて追加のスタイル */
</style>
