<template>
  <div v-if="recipe && recipe.user" class="container mx-auto py-8">
    <h1 class="text-3xl font-bold text-center mb-6">{{ recipe.title }}</h1>
    <!-- レシピ画像 -->
    <div class="flex justify-center mb-6">
      <img
        v-if="photoUrl"
        class="w-1/2 h-auto object-contain rounded-lg shadow-md"
        :src="photoUrl"
        alt="Recipe Image"
      />
    </div>
    <p class="text-center text-gray-500 mb-8">Created by: {{ recipe.user.email }}</p>
    <StepList v-if="steps.length > 0" :steps="steps" />
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
      recipe: null, // 初期値を null に設定
      steps: [],
      photoUrl: "",
    };
  },
  methods: {
    
    async fetchPhoto(recipeId) {
      try {
        // バックエンドからのリクエストを実行
        const recipeId = this.$route.params.id;
        const response = await api.get(`http://localhost:8080/recipes/${recipeId}/photo`, {
          responseType: 'text', // Base64文字列をそのまま取得する
        });

        // 取得したデータを直接photoUrlにセット
        this.photoUrl = response.data; 

        console.log(`Generated Photo URL: ${this.photoUrl}`);
      } catch (error) {
        console.error("Error fetching photo for recipe ID:", recipeId, error);
      }
    },
  },
  async mounted() {
    const recipeId = this.$route.params.id;
    try {
      const recipeResponse = await api.get(`/recipes/${recipeId}`);
      this.recipe = recipeResponse.data;

      const stepsResponse = await api.get(`/recipes/${recipeId}/descriptions`);
      this.steps = stepsResponse.data;
      // レシピ画像を取得
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
