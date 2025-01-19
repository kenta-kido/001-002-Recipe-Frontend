<template>
  <div class="border rounded-lg shadow-md p-4 bg-white flex items-center">
    <!-- 画像部分 -->
    <div
      class="flex-shrink-0 w-64 h-64 flex flex-col items-center justify-center bg-gray-100 mr-4"
    >
      <img
        v-if="photoUrl"
        class="h-auto max-w-full max-h-full object-contain mb-2"
        :src="photoUrl"
        alt="Step Image"
      />
      <button
        @click="deletePhoto"
        class="mt-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete Image
      </button>
      <input
        type="file"
        @change="uploadPhoto"
        class="mt-2 px-2 py-1 bg-gray-200 rounded"
      />
    </div>

    <!-- テキスト部分 -->
    <div>
      <h3 class="font-bold text-lg mb-2">Step {{ step.sequence }}</h3>
      <div v-if="isEditing">
        <textarea
          v-model="editableStep.description"
          class="w-full border rounded-lg p-2 mb-2"
          rows="3"
          placeholder="Enter step description"
        ></textarea>
        <button
          @click="submitEdit"
          class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Submit
        </button>
        <button
          @click="cancelEdit"
          class="ml-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
      <div v-else>
        <p class="text-gray-700 mb-2">{{ editableStep.description }}</p>
        <button
          @click="isEditing = true"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          @click="deleteStep"
          class="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  name: "StepCardEdit",
  props: {
    step: {
      type: Object,
      required: true,
    },
    recipeId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      editableStep: { ...this.step },
      photoUrl: "",
      isEditing: false,
    };
  },
  methods: {
    async fetchPhoto(descriptionId) {
      try {
        const response = await api.get(
          `/recipes/${this.recipeId}/descriptions/${descriptionId}/photo`,
          {
            responseType: "text",
          }
        );
        this.photoUrl = response.data;
      } catch (error) {
        console.error(
          "Error fetching photo for description ID:",
          descriptionId,
          error
        );
      }
    },
    async uploadPhoto(event) {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("photo", file);

        await api.post(
          `/recipes/${this.recipeId}/descriptions/${this.step.descriptionId}/photo`,
          formData
        );
        alert("Photo uploaded successfully!");
        this.fetchPhoto(this.step.descriptionId);
      } catch (error) {
        console.error("Error uploading photo:", error);
      }
    },
    async deletePhoto() {
      try {
        await api.delete(
          `/recipes/${this.recipeId}/descriptions/${this.step.descriptionId}/photo`
        );
        this.photoUrl = "";
        alert("Photo deleted successfully!");
      } catch (error) {
        console.error("Error deleting photo:", error);
      }
    },
    submitEdit() {
      this.isEditing = false;
      this.saveStep();
    },
    cancelEdit() {
      this.isEditing = false;
      this.editableStep = { ...this.step };
    },
    saveStep() {
      this.$emit("updateStep", { ...this.editableStep });
    },
    deleteStep() {
      this.$emit("deleteStep", this.editableStep.descriptionId);
    },
  },
  mounted() {
    if (this.step.descriptionId) {
      this.fetchPhoto(this.step.descriptionId);
    }
  },
};
</script>
