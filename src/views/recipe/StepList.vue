<template>
  <div class="space-y-4">
    <StepCard v-for="step in steps" :key="step.descriptionId" :step="step"  :recipeId="recipeId" />
  </div>
</template>

<script>
import StepCard from "@/views/recipe/StepCard.vue";

export default {
  name: "StepList",
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
    StepCard,
  },
};
</script>
