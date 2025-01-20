<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4 text-red-500">Create a New Recipe</h1>
    <form @submit.prevent="submitRecipe" class="space-y-6 bg-red-50 p-6 rounded-lg shadow-lg">
      <!-- Recipe Title -->
      <div>
        <label for="title" class="block font-medium text-gray-700 mb-2">Recipe Title:</label>
        <input
          type="text"
          id="title"
          v-model="recipe.title"
          class="block w-full border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
          placeholder="Enter recipe title"
          required
        />
      </div>

      <!-- Main Image -->
      <div>
        <label for="mainPhoto" class="block font-medium text-gray-700 mb-2">Main Image:</label>
        <input
          type="file"
          id="mainPhoto"
          @change="onMainPhotoChange"
          class="block w-full border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        />
      </div>

      <!-- Servings -->
      <div>
        <label for="servings" class="block font-medium text-gray-700 mb-2">Servings:</label>
        <select
          id="servings"
          v-model="recipe.servings"
          class="block w-32 border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        >
          <option v-for="num in servingsOptions" :key="num" :value="num">
            {{ num }}
          </option>
        </select>
      </div>

      <!-- Tags -->
      <div>
        <label for="tags" class="block font-medium text-gray-700 mb-2">Tags:</label>
        <select
          id="tags"
          v-model="selectedTag"
          class="block w-48 border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
        >
          <option v-for="tag in tags" :key="tag.tagId" :value="tag">
            {{ tag.name }}
          </option>
        </select>
        <button
          type="button"
          @click="addTag"
          class="ml-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          :disabled="!selectedTag"
        >
          Add Tag
        </button>
        <!-- Selected Tags -->
        <div class="mt-4 flex flex-wrap gap-2">
          <div
            v-for="tag in selectedTags"
            :key="tag.tagId"
            class="flex items-center space-x-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg shadow-md"
          >
            <span>{{ tag.name }}</span>
            <button
              type="button"
              @click="removeTag(tag)"
              class="text-red-500 hover:underline"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- Ingredients Section -->
      <div>
        <h2 class="text-xl font-bold text-red-500 mb-2">Ingredients</h2>
        <div class="space-y-2">
          <div
            v-for="(ingredient, index) in ingredients"
            :key="index"
            class="flex items-center space-x-4 border border-red-200 bg-white p-4 rounded-lg shadow-md"
          >
            <!-- Ingredient Name -->
            <div class="flex-1">
              <label :for="'ingredient-' + index" class="block font-medium text-gray-700">Ingredient:</label>
              <input
                type="text"
                :id="'ingredient-' + index"
                v-model="ingredient.name"
                class="block w-full border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
                placeholder="Ingredient name"
                required
              />
            </div>

            <!-- Quantity -->
            <div class="w-32">
              <label :for="'quantity-' + index" class="block font-medium text-gray-700">Quantity:</label>
              <input
                type="number"
                :id="'quantity-' + index"
                v-model="ingredient.quantity"
                class="block w-full border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
                placeholder="0"
                required
                min="0"
              />
            </div>

            <!-- Unit -->
            <div class="w-48">
              <label :for="'unit-' + index" class="block font-medium text-gray-700">Unit:</label>
              <select
                :id="'unit-' + index"
                v-model="ingredient.unit"
                class="block w-full border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
                required
              >
                <option v-for="unit in units" :key="unit.unitId" :value="unit.unitId">
                  {{ unit.unitName }}
                </option>
              </select>
            </div>

            <!-- Remove Ingredient -->
            <button
              type="button"
              @click="removeIngredient(index)"
              class="text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
        <button
          type="button"
          @click="addIngredient"
          class="text-red-500 hover:underline"
        >
          Add Ingredient
        </button>
      </div>

      <!-- Steps Section -->
      <div>
        <h2 class="text-xl font-bold text-red-500 mb-2">Steps</h2>
        <div v-for="(description, index) in descriptions" :key="index" class="space-y-2 border border-red-200 bg-white p-4 rounded-lg shadow-md">
          <div>
            <label :for="'description-' + index" class="block font-medium text-gray-700">Step {{ index + 1 }}:</label>
            <input
              type="text"
              :id="'description-' + index"
              v-model="description.text"
              class="block w-full border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:outline-none"
              placeholder="Enter description"
              required
            />
          </div>
          <div>
            <label class="block font-medium text-gray-700">Step Photo:</label>
            <input
              type="file"
              @change="(e) => onStepPhotoChange(e, index)"
              class="block mt-1"
            />
          </div>
          <button type="button" @click="removeDescription(index)" class="text-red-500 hover:underline">
            Remove Step
          </button>
        </div>
        <button type="button" @click="addDescription" class="text-red-500 hover:underline">
          Add Step
        </button>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
        Submit Recipe
      </button>
    </form>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  data() {
    return {
      recipe: {
        title: "",
        mainPhoto: null,
        servings: 1,
      },
      servingsOptions: Array.from({ length: 100 }, (_, i) => i + 1),
      ingredients: [{ name: "", quantity: "", unit: null }],
      units: [],
      descriptions: [{ text: "", photo: null }],
      tags: [], // タグ一覧
      selectedTags: [], // 選択されたタグのリスト
      selectedTag: null, // 現在選択されたタグ
    };
  },
  async mounted() {
    await this.fetchUnits();
    await this.fetchTags();   
  },
  methods: {
    async fetchTags() {
      try {
        const response = await api.get("/tags");
        this.tags = response.data;
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    },
    addTag() {
      if (this.selectedTag && !this.selectedTags.includes(this.selectedTag)) {
        this.selectedTags.push(this.selectedTag);
      }
      this.selectedTag = null; // 選択をリセット
    },
    removeTag(tag) {
      this.selectedTags = this.selectedTags.filter((t) => t.tagId !== tag.tagId);
    },
    async fetchUnits() {
      try {
        const response = await api.get("/units");
        this.units = response.data;
      } catch (error) {
        console.error("Failed to fetch units:", error);
      }
    },
    onMainPhotoChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.recipe.mainPhoto = e.target.result.split(",")[1];
        };
        reader.readAsDataURL(file);
      }
    },
    onStepPhotoChange(event, index) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          // 適切な処理を追加する、例: this.descriptions[index].photo に画像データを保存
          this.descriptions[index].photo = e.target.result.split(",")[1];
        };
        reader.readAsDataURL(file);
      }
    },
    addIngredient() {
      this.ingredients.push({ name: "", quantity: "", unit: null });
    },
    removeIngredient(index) {
      this.ingredients.splice(index, 1);
    },
    addDescription() {
      this.descriptions.push({ text: "", photo: null });
    },
    removeDescription(index) {
      this.descriptions.splice(index, 1);
    },
    async registerIngredient(name) {
      try {
        // サーバーから既存の材料を取得
        const existingIngredients = await api.get("/ingredients");
        const existing = existingIngredients.data.find(
          (ingredient) => ingredient.name.toLowerCase() === name.toLowerCase()
        );

        // 既存の材料があればその ID を返す
        if (existing) {
          console.log(`Ingredient '${name}' already exists with ID: ${existing.ingredientId}`);
          return existing.ingredientId;
        }

        // 新しい材料を登録
        const response = await api.post("/ingredients", { name });
        return response.data.ingredientId;
      } catch (error) {
        console.error("Failed to register ingredient:", error.response || error.message);
        throw new Error("Failed to register ingredient");
      }
    },

    async submitRecipe() {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("You must be logged in to submit a recipe.");
          return;
        }

        // レシピを作成
        const recipeResponse = await api.post(
          "/recipes",
          {
            title: this.recipe.title,
            photo: { binaryPhoto: this.recipe.mainPhoto },
            servings: this.recipe.servings,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const recipeId = recipeResponse.data.recipeId;

        // 材料を登録
        for (const ingredient of this.ingredients) {
          try {
            const ingredientId = await this.registerIngredient(ingredient.name);
            await api.post(
              `/recipes/${recipeId}/ingredients`,
              {
                ingredient: { ingredientId },
                quantity: ingredient.quantity,
                unit: { unitId: ingredient.unit },
                servings: this.recipe.servings,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } catch (ingredientError) {
            console.error(`Error registering ingredient: ${ingredient.name}`, ingredientError);
            throw new Error(`Failed to register ingredient: ${ingredient.name}`);
          }
        }

        // タグを登録
        for (const tag of this.selectedTags) {
          await api.post(
            `/recipes/${recipeId}/tags/${tag.tagId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
        
        // 手順を追加
        for (let i = 0; i < this.descriptions.length; i++) {
          const description = this.descriptions[i];
          try {
            await api.post(
              `/recipes/${recipeId}/descriptions`,
              {
                description: description.text,
                sequence: i + 1,
                photo: description.photo ? { binaryPhoto: description.photo } : null,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } catch (stepError) {
            console.error(`Error adding step ${i + 1}`, stepError);
            throw new Error(`Failed to add step ${i + 1}`);
          }
        }

        alert("Recipe created successfully!");
        this.$router.push("/");
      } catch (error) {
        console.error("Error submitting recipe:", error);

        // エラーの詳細をアラートで表示
        if (error.response) {
          alert(`Error: ${error.response.status} - ${error.response.data.message || "Unknown error occurred"}`);
        } else {
          alert(`Unexpected error: ${error.message}`);
        }

        // セッション切れの場合の対応
        if (error.response && error.response.status === 403) {
          alert("Your session has expired. Please log in again.");
          this.$router.push("/login");
        }
      }
    },
  },
};
</script>

<style scoped>
/* Add custom styling if needed */
</style>
