<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <RecipeCard v-for="recipe in recipes" :key="recipe.recipeId" :recipe="recipe" />
  </div>
</template>

<script>
import RecipeCard from "@/views/recipe/RecipeCard.vue";

export default {
  name: "RecipeList",
  props: {
    recipes: {
      type: Array,
      required: true,
    },
  },
  components: {
    RecipeCard,
  },
};
</script>
