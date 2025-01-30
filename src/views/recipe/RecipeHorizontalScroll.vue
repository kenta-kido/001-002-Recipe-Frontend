<template>
  <div class="relative overflow-hidden">
    <!-- Scroll Container -->
    <div
      ref="scrollContainer"
      class="flex whitespace-nowrap scroll-smooth"
      :style="{ transform: `translateX(${positionX}px)` }"
    >
      <!-- Display duplicated recipes in order -->
      <div
        v-for="(recipe, index) in loopedRecipes"
        :key="index"
        class="inline-block w-1/3 flex-shrink-0 px-2"
      >
        <RecipeCard :recipe="recipe" />
      </div>
    </div>
  </div>
</template>

<script>
import RecipeCard from "@/views/recipe/RecipeCard.vue";

export default {
  name: "RecipeHorizontalScroll",
  props: {
    recipes: {
      type: Array,
      required: true,
    },
    scrollSpeed: {
      type: Number,
      default: 1, // Auto scroll speed (smaller values result in slower scroll)
    },
  },
  data() {
    return {
      positionX: 0, // Current scroll position
      loopedRecipes: [], // Looped recipes array
    };
  },
  watch: {
    recipes: {
      immediate: true, // React on initial render
      handler(newRecipes) {
        if (newRecipes && newRecipes.length > 0) {
          this.loopedRecipes = [...newRecipes, ...newRecipes]; // Extend array for looping
          this.resetScroll(); // Reset scroll position
        }
      },
    },
  },
  mounted() {
    // Double the recipe array for looping
    this.loopedRecipes = [...this.recipes, ...this.recipes];

    // Start auto-scrolling
    this.startScrolling();
  },
  methods: {
    startScrolling() {
      const container = this.$refs.scrollContainer;

      const scroll = () => {
        this.positionX -= this.scrollSpeed; // Scroll to the left
        const containerWidth = container.scrollWidth / 2;

        // Reset when scrolling has passed half the container width
        if (Math.abs(this.positionX) >= containerWidth) {
          this.positionX = 0;
        }

        // Update scroll in the next frame
        requestAnimationFrame(scroll);
      };

      scroll();
    },
    resetScroll() {
      cancelAnimationFrame(this.animationFrame); // Stop the animation
      this.positionX = 0; // Reset the scroll position
      this.startScrolling(); // Resume scrolling
    },
  },
  components: {
    RecipeCard,
  },
};
</script>

<style scoped>
/* Hide the scrollbar */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
