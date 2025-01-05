<template>
  <div
    class="border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
  >
    <img
      class="w-full h-48 object-cover"
      :src="getPhotoUrl(recipe.recipeId)"
      alt="Recipe Image"
    />
    <div class="p-4">
      <h2 class="text-lg font-bold mb-2">{{ recipe.title }}</h2>
      <p class="text-gray-500">Created by: {{ recipe.user.email }}</p>
      <button
        class="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        @click="$router.push(`/recipes/${recipe.recipeId}`)"
      >
        View Details
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecipeCard",
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getPhotoUrl(recipeId) {
      return `/api/recipes/${recipeId}/photo`;
    },
  },
};
</script>
