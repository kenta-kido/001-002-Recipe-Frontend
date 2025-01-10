<template>
  <div class="border rounded-lg shadow-md p-4 bg-white flex items-center">
    <!-- 画像部分 -->
    <div
      class="flex-shrink-0 w-64 h-64 flex items-center justify-center bg-gray-100 mr-4"
    >
      <img
        v-if="photoUrl"
        class="h-auto max-w-full max-h-full object-contain"
        :src="photoUrl"
        alt="Recipe Image"
      />
    </div>

    <!-- テキスト部分 -->
    <div>
      <h3 class="font-bold text-lg mb-2">Step {{ step.sequence }}</h3>
      <p class="text-gray-600">{{ step.description }}</p>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios"; 

export default {
  name: "StepCard",
  props: {
    step: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      photoUrl: "",
    };
  },
  methods: {
    async fetchPhoto(descriptionId) {
      try {
        const recipeId = this.step.recipe.recipeId; // recipeオブジェクトからrecipeIdを取得
        const response = await api.get(
          `/recipes/${recipeId}/descriptions/${descriptionId}/photo`,
          {
            responseType: "text", // Base64文字列をそのまま取得
          }
        );
        this.photoUrl = response.data;
        console.log("Fetched photo URL:", response.data); // 取得したURLを確認
      } catch (error) {
        console.error(
          "Error fetching photo for description ID:",
          descriptionId,
          error
        );
      }
    },
  },
  mounted() {
    if (this.step.descriptionId) {
      this.fetchPhoto(this.step.descriptionId);
    }
  },
};
</script>
