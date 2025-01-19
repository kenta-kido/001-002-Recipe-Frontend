<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">Recipes for Tag: "{{ tagName }}"</h1>
    <div v-if="recipes.length === 0" class="text-gray-500">No recipes found for this tag.</div>
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe.recipeId"
        :recipe="recipe"
      />
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";
import RecipeCard from "@/views/recipe/RecipeCard.vue";

export default {
  name: "TagRecipePage",
  components: {
    RecipeCard,
  },
  props: {
    tagId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      recipes: [],
      tagName: "Unknown Tag",
    };
  },
  async mounted() {
    await this.fetchTagName(); // タグ名を取得
    this.fetchRecipesByTag(); // レシピを取得
  },
  methods: {
    async fetchTagName() {
      try {
        const response = await api.get(`/tags/${this.tagId}`);
        this.tagName = response.data.name || "Unknown Tag";
      } catch (error) {
        console.error("Error fetching tag name:", error);
        this.tagName = "Unknown Tag";
      }
    },
    async fetchRecipesByTag() {
      try {
        const response = await api.get(`/recipes/tag/${this.tagId}`);
        this.recipes = response.data.map(tagRecipe => tagRecipe.recipe); // レシピのみ抽出
      } catch (error) {
        console.error("Error fetching recipes for tag:", error);
      }
    },
  },
};
</script>
