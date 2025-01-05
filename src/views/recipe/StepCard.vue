<template>
  <div class="border rounded-lg shadow-md p-4 bg-white">
    <h3 class="font-bold text-lg mb-2">Step {{ step.sequence }}</h3>
    <p class="text-gray-600 mb-4">{{ step.description }}</p>
    <PhotoViewer v-if="step.photo" :photo="step.photo" />
  </div>
</template>

<script>
import PhotoViewer from "@/views/recipe/PhotoViewer.vue";

export default {
  name: "StepCard",
  props: {
    step: {
      type: Object,
      required: true,
    },
  },
  components: {
    PhotoViewer,
  },
};
</script>
