<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">Search Results</h1>
    <div v-if="recipes.length === 0" class="text-gray-500">
      No recipes found for "{{ keyword }}".
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
  data() {
    return {
      recipes: [], // 検索結果のレシピ
      keyword: "", // 検索キーワード
      renderKey: 0, // 再描画用のキー
    };
  },
  async mounted() {
    this.fetchRecipes();
  },
  watch: {
    // クエリパラメータの変更を監視
    "$route.query.keyword": "fetchRecipes",
  },
  methods: {
    async fetchRecipes() {
      this.keyword = this.$route.query.keyword || ""; // URLからキーワードを取得
      if (this.keyword) {
        // リストを一度空にして再レンダリング
        this.recipes = [];
        this.renderKey++; // `key` を変更してリスト全体を再描画

        try {
          const response = await api.get(`/recipes/search`, {
            params: { keyword: this.keyword },
          });
          this.recipes = response.data; // 検索結果を設定
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      } else {
        this.recipes = []; // キーワードが空の場合は結果をクリア
        this.renderKey++; // 再描画用のキーを更新
      }
    },
  },
};
</script>

<style scoped>
/* 必要に応じてスタイルを追加 */
</style>
