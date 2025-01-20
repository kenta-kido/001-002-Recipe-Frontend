<template>
  <div class="container mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Ingredient Management</h1>

    <!-- 材料とシノニム一覧 -->
    <div v-if="ingredients.length > 0">
      <div
        v-for="ingredient in ingredients"
        :key="ingredient.ingredientId"
        class="mb-8 p-4 bg-white shadow-md rounded-lg"
      >
        <!-- 材料名 -->
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-bold text-gray-700">
            {{ ingredient.name }}
          </h2>
          <!-- Toggle Button -->
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            @click="toggleSynonyms(ingredient.ingredientId)"
          >
            {{ isSynonymsVisible(ingredient.ingredientId) ? "Hide Synonyms" : "Show Synonyms" }}
          </button>
        </div>

        <!-- シノニム一覧 -->
        <div v-if="isSynonymsVisible(ingredient.ingredientId)" class="mt-4">
          <h3 class="text-sm font-semibold text-gray-600 mb-2">Synonyms:</h3>
          <ul class="mb-4 space-y-2">
            <li
              v-for="synonym in ingredient.synonyms"
              :key="synonym.synonymId"
              class="flex items-center justify-between"
            >
              <span class="text-gray-800">{{ synonym.synonym }}</span>
              <button
                class="px-3 py-1 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
                @click="deleteSynonym(synonym.synonymId, ingredient.ingredientId)"
              >
                Delete
              </button>
            </li>
          </ul>

          <!-- シノニム追加フォーム -->
          <div>
            <input
              type="text"
              v-model="newSynonyms[ingredient.ingredientId]"
              placeholder="Add new synonym"
              class="p-2 border border-gray-300 rounded-lg w-2/3"
            />
            <button
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ml-2"
              @click="addSynonym(ingredient.ingredientId)"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500">No ingredients available.</div>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  data() {
    return {
      ingredients: [], // 材料とシノニムのデータ
      newSynonyms: {}, // 新しいシノニムの入力
      visibleSynonyms: new Set(), // 開いている材料IDを管理
    };
  },
  async created() {
    await this.fetchIngredients();
  },
  methods: {
    // 材料とシノニムのデータを取得
    async fetchIngredients() {
      try {
        const ingredientResponse = await api.get("/ingredients");
        const ingredients = ingredientResponse.data;

        for (const ingredient of ingredients) {
          const synonymResponse = await api.get(
            `/ingredients/${ingredient.ingredientId}/synonyms`
          );
          ingredient.synonyms = synonymResponse.data;
        }

        this.ingredients = ingredients;
      } catch (error) {
        console.error("Error fetching ingredients or synonyms:", error);
      }
    },
    // シノニムを追加
    async addSynonym(ingredientId) {
      if (!this.newSynonyms[ingredientId]) return;

      try {
        const synonymRequest = { synonymName: this.newSynonyms[ingredientId] };
        const response = await api.post(
          `/ingredients/${ingredientId}/synonyms`,
          synonymRequest
        );
        const newSynonym = response.data;

        // シノニムを材料に追加
        const ingredient = this.ingredients.find(
          (ing) => ing.ingredientId === ingredientId
        );
        if (ingredient) ingredient.synonyms.push(newSynonym);

        this.newSynonyms[ingredientId] = ""; // 入力欄をリセット
      } catch (error) {
        console.error("Error adding synonym:", error);
      }
    },
    // シノニムを削除
    async deleteSynonym(synonymId, ingredientId) {
      try {
        await api.delete(`/ingredients/synonyms/${synonymId}`);

        // シノニムを削除
        const ingredient = this.ingredients.find(
          (ing) => ing.ingredientId === ingredientId
        );
        if (ingredient) {
          ingredient.synonyms = ingredient.synonyms.filter(
            (syn) => syn.synonymId !== synonymId
          );
        }
      } catch (error) {
        console.error("Error deleting synonym:", error);
      }
    },
    // シノニムの表示切り替え
    toggleSynonyms(ingredientId) {
      if (this.visibleSynonyms.has(ingredientId)) {
        this.visibleSynonyms.delete(ingredientId);
      } else {
        this.visibleSynonyms.add(ingredientId);
      }
    },
    // シノニムが表示されているか確認
    isSynonymsVisible(ingredientId) {
      return this.visibleSynonyms.has(ingredientId);
    },
  },
};
</script>

<style scoped>
.container {
  background-color: #f9fafa;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
}
</style>
