<template>
  <div class="border rounded-lg shadow-md p-4 bg-white flex items-center">
    <!-- Image Section -->
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

    <!-- Text Section -->
    <div>
      <h3 class="font-bold text-lg mb-2">Schritt {{ step.sequence }}</h3>
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
    recipeId: {
      type: Number,
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
        // Log the entire `step` object
        console.log("Step object:", this.step);

        // Log the `recipeId`
        const recipeId = this.recipeId; // Use safe access operator
        console.log("Recipe ID:", recipeId);

        if (!recipeId) {
          console.error("Recipe ID is undefined. Check the `step` data.");
          return;
        }

        // Send API request
        const response = await api.get(
          `/recipes/${recipeId}/descriptions/${descriptionId}/photo`,
          {
            responseType: "text", // Get Base64 string as is
          }
        );
        this.photoUrl = response.data;

        // Log the fetched data
        console.log("Fetched photo URL:", response.data);
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
