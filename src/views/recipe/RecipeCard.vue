<template>
  <div
    class="border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
  >
    <div class="flex justify-center mb-6">
      <img
        v-if="photoUrl"
        class="w-2/3 h-auto max-w-xl max-h-96 object-contain shadow-md"
        :src="photoUrl"
        alt="Recipe Image"
      />
    </div>
    <div class="p-4">
      <h2 class="text-lg font-bold mb-2">{{ recipe.title }}</h2>
      <!-- <p class="text-gray-500">Created by: {{ recipe.user.email }}</p> -->
      <button
        class="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        @click="$router.push(`/recipe/${recipe.recipeId}`)"
      >
        View Details
      </button>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "RecipeCard",
  props: {
    recipe: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      photoUrl: "", // Base64 image data
    };
  },
  methods: {
    async fetchPhoto(recipeId) {
      try {
        // Make a request to the backend
        const response = await api.get(`/recipes/${recipeId}/photo`, {
          responseType: 'text', // Get the Base64 string directly
        });

        // Set the retrieved data directly to photoUrl
        this.photoUrl = response.data; 

        console.log(`Generated Photo URL: ${this.photoUrl}`);
      } catch (error) {
        console.error("Error fetching photo for recipe ID:", recipeId, error);
      }
    },
  },
  mounted() {
    if (this.recipe && this.recipe.recipeId) {
      this.fetchPhoto(this.recipe.recipeId);
    } else {
      console.error("Recipe ID is missing.");
    }
  },
};
</script>
