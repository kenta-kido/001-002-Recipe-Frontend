<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-2xl font-semibold text-gray-800 mb-6">Suchergebnisse für "{{ keyword }}" </h1>
    <!-- 検索結果が見つからなかった場合 -->
    <div v-if="recipes.length === 0" class="text-gray-500 text-center">
      Leider wurden keine Rezepte für "{{ keyword }}" gefunden. <br />
      Versuchen Sie, ein anderes Stichwort einzugeben oder schauen Sie sich unsere empfohlenen Rezepte an.
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
      recipes: [], // 検索結果のレシピ
      renderKey: 0, // 再描画用のキー
    };
  },
 async mounted() {
    this.fetchRecipes();
  },
  watch: {
    // `keyword`の変更を監視
    keyword: "fetchRecipes",
  },
  methods: {
    async fetchRecipes() {
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
