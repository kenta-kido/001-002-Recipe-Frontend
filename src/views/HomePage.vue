<template>
  <div class="container mx-auto py-4">
    <h1 class="text-3xl font-bold text-center mb-6">Recipe List</h1>
    <RecipeList :recipes="recipes" />
  </div>
</template>

<script>
import RecipeList from "@/views/recipe/RecipeList.vue";
import api from "@/api/axios";

export default {
  name: "HomePage",
  data() {
    return {
      recipes: [],
    };
  },
  async mounted() {
    try {
      const response = await api.get("/recipes");
      this.recipes = response.data;
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  },
  components: {
    RecipeList,
  },
};
</script>
