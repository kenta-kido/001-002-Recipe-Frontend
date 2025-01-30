<template>
  <div v-if="recipe && recipe.user" class="max-w-4xl mx-auto py-8">
    <!-- Recipe Title -->
    <h1 class="text-4xl font-extrabold text-center mb-6 text-red-500">{{ recipe.title }}</h1>

    <!-- Recipe Image -->
    <div class="flex justify-center mb-6">
      <img
        v-if="photoUrl"
        class="max-w-full h-auto object-cover rounded-lg shadow-lg"
        :style="{ maxHeight: '300px', width: 'auto' }"
        :src="photoUrl"
        alt="Recipe Image"
      />
    </div>

    <!-- Ingredient List -->
    <div class="mb-6 bg-red-50 p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-gray-700">Ingredients</h2>
        <!-- Serving Selection -->
        <div class="flex items-center">
          <label for="servings" class="mr-2 text-gray-700">Servings:</label>
          <select
            id="servings"
            class="p-2 border border-gray-300 rounded-md"
            v-model="selectedServings"
            @change="updateQuantities"
          >
            <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
      </div>
      <ul class="space-y-2">
        <li
          v-for="ingredient in ingredients"
          :key="ingredient.recipeIngredientsId"
          class="flex justify-between items-center border-b pb-2 last:border-b-0"
        >
          <span class="text-gray-800 font-medium">{{ ingredient.ingredient.name }}</span>
          <span class="text-gray-600">
            {{ (ingredient.quantity * selectedServings / baseServings).toFixed(2) }} {{ ingredient.unit.unitName }}
          </span>
        </li>
      </ul>
    </div>

    <!-- Step List -->
    <StepList v-if="steps.length > 0" :steps="steps" :recipeId="recipe.recipeId" />
  </div>

  <div v-else class="text-center py-8">
    <p class="text-gray-500">Loading recipe details...</p>
  </div>
</template>

<script>
import StepList from "@/views/recipe/StepList.vue";
import api from "@/api/axios";

export default {
  name: "RecipeDetail",
  data() {
    return {
      recipe: null, // Recipe details
      steps: [], // Steps data
      ingredients: [], // Ingredients data
      photoUrl: "", // Recipe image URL
      selectedServings: 1, // Selected servings
      baseServings: 1, // Base servings (fetched from server)
    };
  },
  methods: {
    async fetchPhoto(recipeId) {
      try {
        const response = await api.get(`/recipes/${recipeId}/photo`, {
          responseType: "text", // Get data in Base64 format
        });
        this.photoUrl = response.data;
        console.log(`Generated Photo URL: ${this.photoUrl}`);
      } catch (error) {
        console.error("Error fetching photo for recipe ID:", recipeId, error);
      }
    },
    async fetchIngredients(recipeId) {
      try {
        const response = await api.get(`/recipes/${recipeId}/ingredients`);
        this.ingredients = response.data;

        // Set the base servings (based on the first ingredient's servings)
        if (this.ingredients.length > 0) {
          this.baseServings = this.ingredients[0].servings;
          this.selectedServings = this.baseServings;
        }
      } catch (error) {
        console.error("Error fetching ingredients for recipe ID:", recipeId, error);
      }
    },
    updateQuantities() {
      console.log("Servings updated:", this.selectedServings);
    },
  },
  async mounted() {
    const recipeId = this.$route.params.id;
    try {
      // Fetch recipe info
      const recipeResponse = await api.get(`/recipes/${recipeId}`);
      this.recipe = recipeResponse.data;

      // Fetch steps data
      const stepsResponse = await api.get(`/recipes/${recipeId}/descriptions`);
      this.steps = stepsResponse.data;

      // Fetch ingredients data
      await this.fetchIngredients(recipeId);

      // Fetch recipe image
      await this.fetchPhoto(recipeId);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    }
  },
  components: {
    StepList,
  },
};
</script>

<style scoped>
/* Adjust styles to match the site design */
h1 {
  font-family: "Poppins", sans-serif;
}

img {
  transition: transform 0.3s ease-in-out;
}

img:hover {
  transform: scale(1.05);
}

ul li {
  font-family: "Roboto", sans-serif;
}
</style>
