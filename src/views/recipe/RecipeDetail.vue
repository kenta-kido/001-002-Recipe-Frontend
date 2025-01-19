<template>
  <div v-if="recipe && recipe.user" class="max-w-4xl mx-auto py-8">
    <!-- Rezept-Titel -->
    <h1 class="text-4xl font-extrabold text-center mb-6 text-red-500">{{ recipe.title }}</h1>

    <!-- Rezept-Bild -->
    <div class="flex justify-center mb-6">
      <img
        v-if="photoUrl"
        class="max-w-full h-auto object-cover rounded-lg shadow-lg"
        :style="{ maxHeight: '300px', width: 'auto' }"
        :src="photoUrl"
        alt="Rezeptbild"
      />
    </div>

    <!-- Zutatenliste -->
    <div class="mb-6 bg-red-50 p-6 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-semibold text-gray-700">Zutaten</h2>
        <!-- Portionen-Auswahl -->
        <div class="flex items-center">
          <label for="servings" class="mr-2 text-gray-700">Portionen:</label>
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

    <!-- Schritte-Liste -->
    <StepList v-if="steps.length > 0" :steps="steps" :recipeId="recipe.recipeId" />
  </div>

  <div v-else class="text-center py-8">
    <p class="text-gray-500">Lade Rezeptdetails...</p>
  </div>
</template>


<script>
import StepList from "@/views/recipe/StepList.vue";
import api from "@/api/axios";

export default {
  name: "RecipeDetail",
  data() {
    return {
      recipe: null, // レシピ詳細
      steps: [], // 手順データ
      ingredients: [], // 材料データ
      photoUrl: "", // レシピ画像URL
      selectedServings: 1, // 選択された人数
      baseServings: 1, // 基本の人数（サーバーから取得）
    };
  },
  methods: {
    async fetchPhoto(recipeId) {
      try {
        const response = await api.get(`/recipes/${recipeId}/photo`, {
          responseType: "text", // Base64形式のデータを取得
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

        // サーバーから取得した材料の基本人数を設定（最初の要素のservingsを基準にする）
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
      // レシピ情報を取得
      const recipeResponse = await api.get(`/recipes/${recipeId}`);
      this.recipe = recipeResponse.data;

      // 手順データを取得
      const stepsResponse = await api.get(`/recipes/${recipeId}/descriptions`);
      this.steps = stepsResponse.data;

      // 材料データを取得
      await this.fetchIngredients(recipeId);

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

<style scoped>
/* スタイルをサイトデザインに合わせて調整 */
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
