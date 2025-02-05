<template>
  <div v-if="recipe && recipe.user" class="max-w-4xl mx-auto py-8">
    <!-- Recipe Title -->
    <div class="text-center mb-6">
      <input
        type="text"
        v-model="recipe.title"
        class="text-4xl font-extrabold text-center text-red-500 w-full border-b-2 focus:outline-none"
        placeholder="Enter Recipe Title"
      />
    </div>

    <!-- Recipe Image -->
    <div class="flex justify-center items-center mb-6">
      <div class="relative">
        <img
          v-if="photoUrl"
          class="max-w-full h-auto object-cover rounded-lg shadow-lg"
          :style="{ maxHeight: '300px', width: 'auto' }"
          :src="photoUrl"
          alt="Recipe Image"
        />
        <div class="absolute top-2 right-2 flex gap-2">
          <button
            @click="deletePhoto"
            class="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600"
          >
            Delete
          </button>
          <input
            type="file"
            accept="image/*"
            @change="uploadPhoto"
            class="hidden"
            ref="photoInput"
          />
          <button
            @click="triggerUpload"
            class="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600"
          >
            Upload
          </button>
        </div>
      </div>
    </div>

    <!-- Ingredients List -->
    <div class="mb-6 bg-red-50 p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-gray-700">Ingredients</h2>
      </div>
      <ul class="space-y-4">
        <li
          v-for="(ingredient, index) in ingredients"
          :key="ingredient.recipeIngredientsId"
          class="flex items-center gap-4"
        >
          <input
            type="text"
            v-model="ingredient.ingredient.name"
            class="p-2 border border-gray-300 rounded-md flex-1"
            placeholder="Ingredient Name"
          />
          <input
            type="number"
            v-model.number="ingredient.quantity"
            class="p-2 border border-gray-300 rounded-md w-24"
            placeholder="Quantity"
          />
          <input
            type="text"
            v-model="ingredient.unit.unitName"
            class="p-2 border border-gray-300 rounded-md w-24"
            placeholder="Unit"
          />
          <button
            @click="deleteIngredient(index)"
            class="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600"
          >
            Delete
          </button>
        </li>
      </ul>
      <button
        @click="addIngredient"
        class="mt-4 bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600"
      >
        Add Ingredient
      </button>
    </div>

    <!-- Steps List -->
    <div class="mb-6">
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Steps</h2>
      <StepListEdit :steps="steps" :recipeId="recipe.recipeId" />
    </div>
  </div>

  <div v-else class="text-center py-8">
    <p class="text-gray-500">Loading recipe details...</p>
  </div>
</template>

<script>
import StepListEdit from "@/views/recipe/StepListEdit.vue";
import api from "@/api/axios";

export default {
  name: "RecipeUserEdit",
  data() {
    return {
      recipe: null, // Recipe details
      steps: [], // Step data
      ingredients: [], // Ingredient data
      photoUrl: "", // Recipe image URL
    };
  },
  methods: {
    async fetchRecipe() {
      const recipeId = this.$route.params.id;
      try {
        const recipeResponse = await api.get(`/recipes/${recipeId}`);
        this.recipe = recipeResponse.data;
        const ingredientsResponse = await api.get(`/recipes/${recipeId}/ingredients`);
        this.ingredients = ingredientsResponse.data;
        const stepsResponse = await api.get(`/recipes/${recipeId}/descriptions`);
        this.steps = stepsResponse.data;
        this.fetchPhoto(recipeId);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    },
    async fetchPhoto(recipeId) {
      try {
        const response = await api.get(`/recipes/${recipeId}/photo`, {
          responseType: "text",
        });
        this.photoUrl = response.data;
      } catch (error) {
        console.error("Error fetching photo:", error);
      }
    },
    triggerUpload() {
      this.$refs.photoInput.click();
    },
    async uploadPhoto(event) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("photo", file);
        try {
          await api.post(`/recipes/${this.recipe.recipeId}/photo`, formData);
          this.fetchPhoto(this.recipe.recipeId);
        } catch (error) {
          console.error("Error uploading photo:", error);
        }
      }
    },
    async deletePhoto() {
      try {
        await api.delete(`/recipes/${this.recipe.recipeId}/photo`);
        this.photoUrl = "";
      } catch (error) {
        console.error("Error deleting photo:", error);
      }
    },
    addIngredient() {
      this.ingredients.push({
        ingredient: { name: "" },
        quantity: 0,
        unit: { unitName: "" },
      });
    },
    deleteIngredient(index) {
      this.ingredients.splice(index, 1);
    },
  },
  async mounted() {
    await this.fetchRecipe();
  },
  components: {
    StepListEdit,
  },
};
</script>

<style scoped>
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