<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Create a New Recipe</h1>
    <form @submit.prevent="submitRecipe" class="space-y-4">
      <!-- レシピのタイトル -->
      <div>
        <label for="title" class="block font-medium">Recipe Title:</label>
        <input
          type="text"
          id="title"
          v-model="recipe.title"
          class="block w-full border rounded px-3 py-2 mt-1"
          required
        />
      </div>

      <!-- メイン画像 -->
      <div>
        <label class="block font-medium">Main Image:</label>
        <input
          type="file"
          @change="onMainPhotoChange"
          class="block w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      <!-- 手順と写真 -->
      <div>
        <h2 class="text-xl font-bold mb-2">Steps</h2>
        <div v-for="(description, index) in descriptions" :key="index" class="space-y-2 border p-4 rounded">
          <div>
            <label :for="'description-' + index" class="block font-medium">Step {{ index + 1 }}:</label>
            <input
              type="text"
              :id="'description-' + index"
              v-model="description.text"
              class="block w-full border rounded px-3 py-2 mt-1"
              placeholder="Enter description"
              required
            />
          </div>

          <!-- 手順ごとの写真 -->
          <div>
            <label class="block font-medium">Step Photo:</label>
            <div>
              <input
                type="file"
                @change="onStepPhotoChange($event, index)"
                :disabled="!!description.photo"
                class="block mt-1"
              />
              <button
                v-if="description.photo"
                type="button"
                @click="removePhoto(index)"
                class="text-red-600 mt-2"
              >
                Remove Photo
              </button>
            </div>
          </div>

          <button type="button" @click="removeDescription(index)" class="text-red-600">Remove Step</button>
        </div>
        <button type="button" @click="addDescription" class="text-blue-600">Add Step</button>
      </div>

      <!-- 送信ボタン -->
      <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Submit Recipe</button>
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
      },
      descriptions: [
        { text: "", photo: null },
      ],
    };
  },
  methods: {
    addDescription() {
      this.descriptions.push({ text: "", photo: null });
    },
    removeDescription(index) {
      this.descriptions.splice(index, 1);
    },
    removePhoto(descriptionIndex) {
      this.descriptions[descriptionIndex].photo = null;
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
    onStepPhotoChange(event, descriptionIndex) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.descriptions[descriptionIndex].photo = e.target.result.split(",")[1];
        };
        reader.readAsDataURL(file);
      }
    },
    async submitRecipe() {
      try {
        // レシピを作成
        const recipeResponse = await api.post("/recipes", {
          title: this.recipe.title,
          photo: { binaryPhoto: this.recipe.mainPhoto },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const recipeId = recipeResponse.data.recipeId;

        // 手順と写真を登録
        for (let i = 0; i < this.descriptions.length; i++) {
          const description = this.descriptions[i];

          await api.post(`/recipes/${recipeId}/descriptions`, {
            description: description.text,
            sequence: i + 1,
            photo: description.photo ? { binaryPhoto: description.photo } : null,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });
        }

        alert("Recipe created successfully!");
        this.$router.push("/user");
      } catch (error) {
        console.error("Error submitting recipe:", error);
        alert("Failed to create recipe. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
/* Tailwind CSS を使うためカスタムスタイルは最小限に */
</style>
