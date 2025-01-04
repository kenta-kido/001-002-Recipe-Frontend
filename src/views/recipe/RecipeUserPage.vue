<template>
  <div>
    <h2>Create a New Recipe</h2>
    <form @submit.prevent="submitRecipe">
      <div>
        <label for="title">Recipe Title:</label>
        <input type="text" id="title" v-model="recipe.title" required />
      </div>

      <div>
        <h3>Descriptions</h3>
        <div v-for="(description, index) in descriptions" :key="index">
          <label :for="'description-' + index">Step {{ index + 1 }}:</label>
          <input
            type="text"
            :id="'description-' + index"
            v-model="description.text"
            placeholder="Enter description"
            required
          />
          <div>
            <h4>Photos for Step {{ index + 1 }}</h4>
            <div v-for="(photo, photoIndex) in description.photos" :key="photoIndex">
              <input
                type="file"
                @change="onPhotoChange($event, index, photoIndex)"
              />
              <button type="button" @click="removePhoto(index, photoIndex)">Remove Photo</button>
            </div>
            <button type="button" @click="addPhoto(index)">Add Photo</button>
          </div>
          <button type="button" @click="removeDescription(index)">Remove Step</button>
        </div>
        <button type="button" @click="addDescription">Add Step</button>
      </div>

      <button type="submit">Submit Recipe</button>
    </form>
  </div>
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
/* 同じスタイルを適用 */
</style>