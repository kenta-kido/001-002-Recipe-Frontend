<template>
  <div class="space-y-4">
    <StepCardEdit
      v-for="step in steps"
      :key="step.descriptionId"
      :step="step"
      :recipeId="recipeId"
      @updateStep="updateStep"
      @deleteStep="deleteStep"
    />
    <!-- Add Step Button -->
    <button
      @click="addStep"
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
    >
      Add Step
    </button>
  </div>
</template>

<script>
import StepCardEdit from "@/views/recipe/StepCardEdit.vue";

export default {
  name: "StepListEdit",
  props: {
    steps: {
      type: Array,
      required: true,
    },
    recipeId: {
      type: Number,
      required: true,
    },
  },
  components: {
    StepCardEdit,
  },
  methods: {
    addStep() {
      const newStep = {
        descriptionId: Date.now(), // Temporary unique ID
        sequence: this.steps.length + 1,
        description: "",
      };
      this.$emit("updateSteps", [...this.steps, newStep]);
    },
    updateStep(updatedStep) {
      const updatedSteps = this.steps.map((step) =>
        step.descriptionId === updatedStep.descriptionId ? updatedStep : step
      );
      this.$emit("updateSteps", updatedSteps);
    },
    deleteStep(descriptionId) {
      const updatedSteps = this.steps.filter(
        (step) => step.descriptionId !== descriptionId
      );
      this.$emit("updateSteps", updatedSteps);
    },
  },
};
</script>
