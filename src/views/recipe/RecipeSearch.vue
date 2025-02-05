<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">Search results for "{{ keyword }}" </h1>
    <!-- If no search results are found -->
    <div v-if="recipes.length === 0" class="text-gray-500 text-center">
      Unfortunately, no recipes were found for "{{ keyword }}". <br />
      Try entering a different keyword or check out our recommended recipes.
    </div>
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      :key="renderKey"
    >
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";
import RecipeCard from "@/views/recipe/RecipeCard.vue";

export default {
  name: "RecipeSearch",
  components: {
    RecipeCard,
  },
  props: {
    keyword: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      recipes: [], // Search result recipes
      renderKey: 0, // Key for re-rendering
    };
  },
 async mounted() {
    this.fetchRecipes();
  },
  watch: {
    // Watch for changes in `keyword`
    keyword: "fetchRecipes",
  },
  methods: {
    async fetchRecipes() {
      if (this.keyword) {
        // Clear list and trigger re-rendering
        this.recipes = [];
        this.renderKey++; // Change `key` to re-render the list

        try {
          const response = await api.get(`/recipes/search`, {
            params: { keyword: this.keyword },
          });
          this.recipes = response.data; // Set search results
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      } else {
        this.recipes = []; // Clear results if keyword is empty
        this.renderKey++; // Update re-render key
      }
    },
  },
};
</script>

<style scoped>
/* Add styles as needed */
</style>
