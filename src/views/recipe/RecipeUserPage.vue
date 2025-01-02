<template>
  <v-container>
    <v-card>
      <v-card-title>Create a New Recipe</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitRecipe">
          <!-- レシピタイトル -->
          <v-text-field
            v-model="recipe.title"
            label="Recipe Title"
            required
            outlined
          ></v-text-field>

          <!-- 手順セクション -->
          <v-divider></v-divider>
          <h3>Descriptions</h3>
          <div v-for="(description, index) in descriptions" :key="index">
            <v-text-field
              v-model="description.text"
              :label="'Step ' + (index + 1)"
              placeholder="Enter description"
              required
              outlined
            ></v-text-field>

            <!-- 写真セクション -->
            <h4>Photos for Step {{ index + 1 }}</h4>
            <div v-for="(photo, photoIndex) in description.photos" :key="photoIndex">
              <v-file-input
                accept="image/*"
                @change="onPhotoChange($event, index, photoIndex)"
                outlined
                label="Upload Photo"
              ></v-file-input>
              <v-btn
                text
                color="error"
                @click="removePhoto(index, photoIndex)"
              >
                Remove Photo
              </v-btn>
            </div>
            <v-btn text @click="addPhoto(index)">Add Photo</v-btn>
            <v-btn
              text
              color="error"
              @click="removeDescription(index)"
            >
              Remove Step
            </v-btn>
            <v-divider></v-divider>
          </div>

          <!-- 手順追加 -->
          <v-btn text @click="addDescription">Add Step</v-btn>

          <!-- 送信ボタン -->
          <v-btn color="primary" type="submit">Submit Recipe</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "RecipeUserPage",
  data() {
    return {
      recipe: {
        title: "",
      },
      descriptions: [
        { text: "", photos: [] }, // 各手順ごとに写真の配列を持つ
      ],
    };
  },
  methods: {
    addDescription() {
      this.descriptions.push({ text: "", photos: [] });
    },
    removeDescription(index) {
      this.descriptions.splice(index, 1);
    },
    addPhoto(descriptionIndex) {
      this.descriptions[descriptionIndex].photos.push(null);
    },
    removePhoto(descriptionIndex, photoIndex) {
      this.descriptions[descriptionIndex].photos.splice(photoIndex, 1);
    },
    onPhotoChange(event, descriptionIndex, photoIndex) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.descriptions[descriptionIndex].photos.splice(photoIndex, 1, e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },
    async submitRecipe() {
      try {
        // レシピの登録
        const recipeResponse = await api.post(
          "/recipes",
          { title: this.recipe.title },
          { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
        );

        const recipeId = recipeResponse.data.recipeId;

        // 手順と写真を登録
        for (let i = 0; i < this.descriptions.length; i++) {
          const description = this.descriptions[i];

          // 手順の登録
          const descriptionResponse = await api.post(
            `/recipes/${recipeId}/descriptions`,
            { description: description.text, sequence: i + 1 },
            { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
          );

          const descriptionId = descriptionResponse.data.descriptionId;

          // 写真の登録
          for (let j = 0; j < description.photos.length; j++) {
            const photo = description.photos[j];
            if (photo) {
              await api.post(
                `/descriptions/${descriptionId}/photos`,
                { binaryPhoto: photo, sequence: j + 1 },
                { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` } }
              );
            }
          }
        }

        alert("Recipe successfully created!");
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
/* Vuetifyのデフォルトスタイルを活用するため追加のCSSは不要 */
</style>
